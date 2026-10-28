import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/jwt";
import prisma from "@/lib/db/prisma";
import crypto from "crypto";
import { z } from "zod";

const CreateInterviewSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  candidateName: z.string().min(2, "Candidate name is required"),
  candidateEmail: z.string().email("Valid candidate email required"),
  interviewerName: z.string().optional(),
  interviewerEmail: z.string().optional(),
  interviewType: z.enum(["LIVE_CODING", "TIMED_ASSESSMENT", "DSA"]).default("LIVE_CODING"),
  durationMinutes: z.number().min(15).max(180).default(60),
  questionIds: z.array(z.string()).min(1, "Select at least one question"),
  allowedLanguages: z.array(z.string()).default(["python", "javascript", "typescript", "cpp", "java"]),
  notes: z.string().optional(),
  inviteToken: z.string().optional(),
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const where: { status?: string } = {};
    if (status && status !== "ALL") {
      where.status = status;
    }

    const interviews = await prisma.interview.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        questions: {
          include: { question: true },
        },
        interviewer: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return NextResponse.json({ interviews });
  } catch (error) {
    console.error("GET Interviews Error:", error);
    return NextResponse.json({ error: "Failed to fetch interviews." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getCurrentSession();

    // Enforce RBAC: Candidates cannot create interviews
    if (session?.role === "CANDIDATE") {
      return NextResponse.json(
        { error: "Access Denied: Candidates are not authorized to schedule interviews. Only interviewers and administrators may schedule sessions." },
        { status: 403 }
      );
    }

    let interviewerId = session?.userId;

    if (!interviewerId) {
      // Find default interviewer for demonstration if unauthenticated
      const defaultUser = await prisma.user.findFirst({
        where: { role: { in: ["INTERVIEWER", "ADMIN"] } },
      });
      interviewerId = defaultUser?.id;
    }

    if (!interviewerId) {
      return NextResponse.json({ error: "Interviewer identity required." }, { status: 401 });
    }

    const body = await req.json();
    const parsed = CreateInterviewSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "Invalid input data." },
        { status: 400 }
      );
    }

    const {
      title,
      candidateName,
      candidateEmail,
      interviewerName,
      interviewerEmail,
      interviewType,
      durationMinutes,
      questionIds,
      allowedLanguages,
      notes,
      inviteToken: clientToken,
    } = parsed.data;

    // If custom interviewer specified, find or create interviewer user
    if (interviewerEmail) {
      let customInterviewer = await prisma.user.findUnique({
        where: { email: interviewerEmail.toLowerCase().trim() },
      });
      if (!customInterviewer) {
        customInterviewer = await prisma.user.create({
          data: {
            name: interviewerName || "Interviewer",
            email: interviewerEmail.toLowerCase().trim(),
            passwordHash: "Password123!",
            role: "INTERVIEWER",
          },
        });
      }
      interviewerId = customInterviewer.id;
    }

    // Generate random human-friendly high-entropy access code if not provided
    const cityHubs = ["BLR", "DEL", "HYD", "PUN", "MUM", "GGN"];
    const randHub = cityHubs[Math.floor(Math.random() * cityHubs.length)];
    const randNum = Math.floor(1000 + Math.random() * 9000);
    const randHex = crypto.randomBytes(2).toString("hex").toUpperCase();
    const inviteToken = clientToken?.trim() || `IVX-${randHub}-${randNum}-${randHex}`;

    const interview = await prisma.interview.create({
      data: {
        title,
        candidateName,
        candidateEmail,
        interviewerId,
        inviteToken,
        status: "SCHEDULED",
        interviewType,
        durationMinutes,
        allowedLanguages: JSON.stringify(allowedLanguages),
        notes: notes || null,
        scheduledAt: new Date(),
        questions: {
          create: questionIds.map((qid, idx) => ({
            questionId: qid,
            orderIndex: idx,
            pointsAvailable: 100,
          })),
        },
      },
      include: {
        questions: {
          include: { question: true },
        },
      },
    });

    // Create Audit Log
    await prisma.auditLog.create({
      data: {
        actorId: interviewerId,
        actorEmail: session?.email || "interviewer@interviewx.dev",
        action: "INTERVIEW_CREATED",
        resourceType: "INTERVIEW",
        resourceId: interview.id,
        metadata: JSON.stringify({ title, candidate: candidateName, token: inviteToken }),
      },
    });

    return NextResponse.json({ success: true, interview });
  } catch (error) {
    console.error("POST Interview Error:", error);
    return NextResponse.json({ error: "Failed to create interview." }, { status: 500 });
  }
}
