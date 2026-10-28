import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { getCurrentSession } from "@/lib/auth/jwt";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const interview = await prisma.interview.findUnique({
      where: { id: params.id },
      include: {
        interviewer: {
          select: { id: true, name: true, email: true },
        },
        questions: {
          include: {
            question: {
              include: {
                testCases: {
                  where: { isHidden: false }, // Only public test cases by default
                },
              },
            },
          },
          orderBy: { orderIndex: "asc" },
        },
        submissions: {
          orderBy: { submittedAt: "desc" },
        },
      },
    });

    if (!interview) {
      return NextResponse.json({ error: "Interview not found" }, { status: 404 });
    }

    return NextResponse.json({ interview });
  } catch (error) {
    console.error("GET Interview Error:", error);
    return NextResponse.json({ error: "Failed to fetch interview details" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getCurrentSession();
    const body = await req.json();

    const allowedTransitions: Record<string, string[]> = {
      DRAFT: ["SCHEDULED", "CANCELLED"],
      SCHEDULED: ["IN_PROGRESS", "CANCELLED"],
      IN_PROGRESS: ["SUBMITTED", "COMPLETED", "CANCELLED"],
      SUBMITTED: ["UNDER_REVIEW", "COMPLETED"],
      UNDER_REVIEW: ["COMPLETED"],
      COMPLETED: [],
      CANCELLED: [],
    };

    const current = await prisma.interview.findUnique({
      where: { id: params.id },
    });

    if (!current) {
      return NextResponse.json({ error: "Interview not found" }, { status: 404 });
    }

    const { status, notes } = body;
    const updateData: { status?: string; notes?: string; startedAt?: Date; endedAt?: Date } = {};

    if (status) {
      updateData.status = status;
      if (status === "IN_PROGRESS" && !current.startedAt) {
        updateData.startedAt = new Date();
      } else if (status === "COMPLETED" && !current.endedAt) {
        updateData.endedAt = new Date();
      }
    }

    if (notes !== undefined) {
      updateData.notes = notes;
    }

    const updated = await prisma.interview.update({
      where: { id: params.id },
      data: updateData,
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        actorId: session?.userId || null,
        actorEmail: session?.email || "system",
        action: `INTERVIEW_STATUS_${status || "UPDATED"}`,
        resourceType: "INTERVIEW",
        resourceId: params.id,
        metadata: JSON.stringify({ oldStatus: current.status, newStatus: status }),
      },
    });

    return NextResponse.json({ success: true, interview: updated });
  } catch (error) {
    console.error("PATCH Interview Error:", error);
    return NextResponse.json({ error: "Failed to update interview" }, { status: 500 });
  }
}
