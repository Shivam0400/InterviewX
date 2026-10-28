import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { getCurrentSession } from "@/lib/auth/jwt";
import { z } from "zod";

const CreateQuestionSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]).default("MEDIUM"),
  topicTags: z.array(z.string()).default([]),
  description: z.string().min(10),
  timeLimitMs: z.number().default(2000),
  memoryLimitKb: z.number().default(128000),
  starterCodes: z.record(z.string()).default({}),
  testCases: z.array(
    z.object({
      inputData: z.string(),
      expectedOutput: z.string(),
      isHidden: z.boolean().default(false),
      points: z.number().default(25),
      explanation: z.string().optional(),
    })
  ).min(1, "At least one test case required"),
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const difficulty = searchParams.get("difficulty");
    const tag = searchParams.get("tag");

    const where: any = { visibility: "PUBLIC" };
    if (difficulty && difficulty !== "ALL") {
      where.difficulty = difficulty;
    }

    const questions = await prisma.question.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        testCases: {
          select: { id: true, isHidden: true, points: true },
        },
      },
    });

    return NextResponse.json({ questions });
  } catch (error) {
    console.error("GET Questions Error:", error);
    return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getCurrentSession();
    if (session?.role !== "INTERVIEWER" && session?.role !== "ADMIN") {
      // In demo mode, allow default interviewer
    }

    const body = await req.json();
    const parsed = CreateQuestionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "Invalid question payload" },
        { status: 400 }
      );
    }

    const {
      title,
      slug,
      difficulty,
      topicTags,
      description,
      timeLimitMs,
      memoryLimitKb,
      starterCodes,
      testCases,
    } = parsed.data;

    const existing = await prisma.question.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json({ error: "A question with this slug already exists" }, { status: 409 });
    }

    const question = await prisma.question.create({
      data: {
        title,
        slug,
        difficulty,
        topicTags: JSON.stringify(topicTags),
        description,
        timeLimitMs,
        memoryLimitKb,
        starterCodes: JSON.stringify(starterCodes),
        createdBy: session?.userId || null,
        testCases: {
          create: testCases.map((tc, idx) => ({
            inputData: tc.inputData,
            expectedOutput: tc.expectedOutput,
            isHidden: tc.isHidden,
            points: tc.points,
            sortOrder: idx + 1,
            explanation: tc.explanation || null,
          })),
        },
      },
    });

    return NextResponse.json({ success: true, question });
  } catch (error) {
    console.error("POST Question Error:", error);
    return NextResponse.json({ error: "Failed to create question" }, { status: 500 });
  }
}
