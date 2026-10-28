import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { getCurrentSession } from "@/lib/auth/jwt";
import { evaluateSubmission } from "@/lib/scoring/evaluator";
import { SupportedLanguage } from "@/lib/execution/types";
import { z } from "zod";

const SubmitCodeSchema = z.object({
  questionId: z.string(),
  language: z.enum(["python", "javascript", "typescript", "cpp", "java"]),
  sourceCode: z.string().min(1, "Source code cannot be empty"),
  isFinalSubmission: z.boolean().default(false),
});

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getCurrentSession();
    const body = await req.json();
    const parsed = SubmitCodeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "Invalid submission payload" },
        { status: 400 }
      );
    }

    const { questionId, language, sourceCode, isFinalSubmission } = parsed.data;

    // Verify interview exists
    const interview = await prisma.interview.findUnique({
      where: { id: params.id },
      include: { interviewer: true },
    });

    if (!interview) {
      return NextResponse.json({ error: "Interview session not found" }, { status: 404 });
    }

    // Load question and test cases
    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: {
        testCases: {
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    if (!question) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    // Filter test cases: if just running sample tests, run only public ones; if final submit, run all
    const testCasesToRun = isFinalSubmission
      ? question.testCases
      : question.testCases.filter((tc) => !tc.isHidden);

    const isCandidate = session?.role === "CANDIDATE" || !session;

    // Run deterministic assessment engine
    const evaluation = await evaluateSubmission(
      sourceCode,
      language as SupportedLanguage,
      testCasesToRun.map((tc) => ({
        id: tc.id,
        inputData: tc.inputData,
        expectedOutput: tc.expectedOutput,
        isHidden: tc.isHidden,
        points: tc.points,
        explanation: tc.explanation,
      })),
      isCandidate
    );

    // If final submission, persist submission & test results to database
    let submissionRecord = null;
    if (isFinalSubmission) {
      submissionRecord = await prisma.submission.create({
        data: {
          interviewId: interview.id,
          questionId: question.id,
          candidateId: session?.userId || null,
          language,
          sourceCode,
          status: "EVALUATED",
          deterministicScore: evaluation.score,
          maxScore: evaluation.maxScore,
          executionTimeMs: evaluation.averageExecutionTimeMs,
          memoryUsedKb: evaluation.peakMemoryKb,
        },
      });

      // Create execution job record
      await prisma.executionJob.create({
        data: {
          submissionId: submissionRecord.id,
          provider: process.env.JUDGE0_API_URL ? "JUDGE0" : "SAFE_LOCAL",
          status: "COMPLETED",
          timeUsed: evaluation.averageExecutionTimeMs,
          memoryUsed: evaluation.peakMemoryKb,
          exitCode: 0,
        },
      });

      // Create test result records
      for (const res of evaluation.results) {
        await prisma.testResult.create({
          data: {
            submissionId: submissionRecord.id,
            testCaseId: res.testCaseId,
            isHidden: res.isHidden,
            passed: res.passed,
            inputSample: res.inputSample,
            expectedSample: res.expectedSample,
            actualOutput: res.actualOutput,
            executionTimeMs: res.executionTimeMs,
            memoryUsedKb: res.memoryUsedKb,
            pointsAwarded: res.pointsAwarded,
            statusMessage: res.statusMessage,
          },
        });
      }

      // Automatically create or update assessment report draft
      await prisma.assessmentReport.create({
        data: {
          interviewId: interview.id,
          submissionId: submissionRecord.id,
          deterministicScore: evaluation.score,
          maxScore: evaluation.maxScore,
          percentageScore: evaluation.percentageScore,
          status: "DRAFT",
          reviewerId: interview.interviewerId,
        },
      });

      // Update interview status to SUBMITTED if in progress
      if (interview.status === "IN_PROGRESS" || interview.status === "SCHEDULED") {
        await prisma.interview.update({
          where: { id: interview.id },
          data: { status: "SUBMITTED" },
        });
      }
    }

    return NextResponse.json({
      success: true,
      evaluation,
      submissionId: submissionRecord?.id || null,
      isFinalSubmission,
    });
  } catch (error) {
    console.error("Submission Execution Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Execution failed" },
      { status: 500 }
    );
  }
}
