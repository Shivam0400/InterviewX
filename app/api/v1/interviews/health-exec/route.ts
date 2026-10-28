import { NextResponse } from "next/server";
import { executionService } from "@/lib/execution";

export async function POST() {
  const startTime = performance.now();
  try {
    const result = await executionService.runCode({
      sourceCode: `console.log("InterviewX Sandbox Engine Online: " + (2000 + 26));`,
      language: "javascript",
      timeLimitMs: 2500,
    });

    const latencyMs = Math.round(performance.now() - startTime);

    return NextResponse.json({
      success: true,
      stdout: result.stdout?.trim(),
      status: result.status,
      provider: result.provider,
      latencyMs,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Health check execution failed" },
      { status: 500 }
    );
  }
}
