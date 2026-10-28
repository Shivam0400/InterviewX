import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { aiCopilotService } from "@/lib/ai/copilot";
import { z } from "zod";

const CopilotRequestSchema = z.object({
  action: z.enum(["EXPLAIN", "FOLLOW_UP", "REVIEW"]),
  questionId: z.string(),
  sourceCode: z.string().min(1, "Source code is required"),
  language: z.string(),
});

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const parsed = CopilotRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid copilot parameters" }, { status: 400 });
    }

    const { action, questionId, sourceCode, language } = parsed.data;

    const question = await prisma.question.findUnique({
      where: { id: questionId },
    });

    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    if (action === "EXPLAIN") {
      const result = await aiCopilotService.explainSolution({
        questionTitle: question.title,
        questionDescription: question.description,
        sourceCode,
        language,
      });

      // Record AI run
      await prisma.aiRun.create({
        data: {
          interviewId: params.id,
          provider: result.provider,
          promptType: "EXPLANATION",
          status: "SUCCESS",
          outputJson: JSON.stringify(result.data),
        },
      });

      return NextResponse.json({ success: true, ...result });
    }

    if (action === "FOLLOW_UP") {
      const result = await aiCopilotService.generateFollowUpQuestions({
        questionTitle: question.title,
        sourceCode,
        language,
      });

      await prisma.aiRun.create({
        data: {
          interviewId: params.id,
          provider: result.provider,
          promptType: "FOLLOWUP_QUESTIONS",
          status: "SUCCESS",
          outputJson: JSON.stringify(result.data),
        },
      });

      return NextResponse.json({ success: true, ...result });
    }

    if (action === "REVIEW") {
      const result = await aiCopilotService.reviewCode({
        questionTitle: question.title,
        sourceCode,
        language,
      });

      await prisma.aiRun.create({
        data: {
          interviewId: params.id,
          provider: result.provider,
          promptType: "CODE_REVIEW",
          status: "SUCCESS",
          outputJson: JSON.stringify(result.data),
        },
      });

      return NextResponse.json({ success: true, ...result });
    }

    return NextResponse.json({ error: "Unsupported copilot action" }, { status: 400 });
  } catch (error) {
    console.error("AI Copilot API Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "AI Copilot analysis failed" },
      { status: 500 }
    );
  }
}
