import { executionService, ExecutionResult, SupportedLanguage } from "../execution";

export interface TestCaseInput {
  id: string;
  inputData: string;
  expectedOutput: string;
  isHidden: boolean;
  points: number;
  explanation?: string | null;
}

export interface EvaluatedTestResult {
  testCaseId: string;
  isHidden: boolean;
  passed: boolean;
  inputSample: string | null;
  expectedSample: string | null;
  actualOutput: string | null;
  executionTimeMs: number;
  memoryUsedKb: number;
  pointsAwarded: number;
  maxPoints: number;
  statusMessage: "OK" | "WRONG_ANSWER" | "TIME_LIMIT_EXCEEDED" | "RUNTIME_ERROR" | "COMPILE_ERROR";
}

export interface EvaluationSummary {
  totalTests: number;
  passedTests: number;
  publicTestsPassed: number;
  publicTestsTotal: number;
  hiddenTestsPassed: number;
  hiddenTestsTotal: number;
  score: number;
  maxScore: number;
  percentageScore: number;
  averageExecutionTimeMs: number;
  peakMemoryKb: number;
  results: EvaluatedTestResult[];
  status: "EVALUATED" | "ERROR";
}

/**
 * Normalizes output strings to avoid false failures due to CRLF, extra trailing newlines, or whitespace.
 */
export function normalizeOutput(str: string | null | undefined): string {
  if (!str) return "";
  return str
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n")
    .trim();
}

/**
 * Compare actual vs expected outputs with numeric and JSON awareness
 */
export function compareOutputs(actual: string, expected: string): boolean {
  const normActual = normalizeOutput(actual);
  const normExpected = normalizeOutput(expected);

  if (normActual === normExpected) return true;

  // Try JSON comparison (handles differences in array/object spacing)
  try {
    const jsonA = JSON.parse(normActual);
    const jsonB = JSON.parse(normExpected);
    if (JSON.stringify(jsonA) === JSON.stringify(jsonB)) return true;
  } catch {
    // Not valid JSON, compare as normalized strings
  }

  return false;
}

/**
 * Helper to prepare executable source code with stdin or runner wrapper if appropriate
 */
function wrapCodeForExecution(sourceCode: string, inputData: string, language: SupportedLanguage): { wrappedCode: string; stdin: string } {
  // If the language is JavaScript / Node, we can provide input via process.argv, readline, or standard input
  return {
    wrappedCode: sourceCode,
    stdin: inputData,
  };
}

export async function evaluateSubmission(
  sourceCode: string,
  language: SupportedLanguage,
  testCases: TestCaseInput[],
  isCandidateView: boolean = false
): Promise<EvaluationSummary> {
  const results: EvaluatedTestResult[] = [];
  let totalScore = 0;
  let totalMaxScore = 0;
  let totalTimeMs = 0;
  let peakMemoryKb = 0;

  for (const tc of testCases) {
    totalMaxScore += tc.points;
    const { wrappedCode, stdin } = wrapCodeForExecution(sourceCode, tc.inputData, language);

    const execResult: ExecutionResult = await executionService.runCode({
      sourceCode: wrappedCode,
      language,
      stdin,
      timeLimitMs: 2500,
      memoryLimitKb: 128000,
    });

    totalTimeMs += execResult.timeUsedMs;
    peakMemoryKb = Math.max(peakMemoryKb, execResult.memoryUsedKb);

    let statusMessage: EvaluatedTestResult["statusMessage"] = "OK";
    let passed = false;

    if (execResult.status === "COMPILE_ERROR") {
      statusMessage = "COMPILE_ERROR";
    } else if (execResult.status === "TIME_LIMIT_EXCEEDED") {
      statusMessage = "TIME_LIMIT_EXCEEDED";
    } else if (execResult.status === "RUNTIME_ERROR" || execResult.stderr) {
      statusMessage = "RUNTIME_ERROR";
    } else {
      passed = compareOutputs(execResult.stdout || "", tc.expectedOutput);
      statusMessage = passed ? "OK" : "WRONG_ANSWER";
    }

    const pointsAwarded = passed ? tc.points : 0;
    totalScore += pointsAwarded;

    // Sanitize output for candidate view if test case is hidden
    const shouldSanitize = isCandidateView && tc.isHidden;

    results.push({
      testCaseId: tc.id,
      isHidden: tc.isHidden,
      passed,
      inputSample: shouldSanitize ? "[Hidden Test Case]" : tc.inputData,
      expectedSample: shouldSanitize ? "[Hidden Expected Output]" : tc.expectedOutput,
      actualOutput: shouldSanitize
        ? passed
          ? "[Passed]"
          : "[Test Failed - Output Hidden]"
        : execResult.stdout || execResult.stderr || "",
      executionTimeMs: execResult.timeUsedMs,
      memoryUsedKb: execResult.memoryUsedKb,
      pointsAwarded,
      maxPoints: tc.points,
      statusMessage,
    });
  }

  const passedTests = results.filter((r) => r.passed).length;
  const publicTests = results.filter((r) => !r.isHidden);
  const hiddenTests = results.filter((r) => r.isHidden);

  const percentageScore = totalMaxScore > 0 ? Math.round((totalScore / totalMaxScore) * 100) : 0;

  return {
    totalTests: testCases.length,
    passedTests,
    publicTestsPassed: publicTests.filter((r) => r.passed).length,
    publicTestsTotal: publicTests.length,
    hiddenTestsPassed: hiddenTests.filter((r) => r.passed).length,
    hiddenTestsTotal: hiddenTests.length,
    score: totalScore,
    maxScore: totalMaxScore,
    percentageScore,
    averageExecutionTimeMs: testCases.length > 0 ? Math.round(totalTimeMs / testCases.length) : 0,
    peakMemoryKb,
    results,
    status: "EVALUATED",
  };
}
