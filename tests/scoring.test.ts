import { describe, it, expect } from "vitest";
import { normalizeOutput, compareOutputs, evaluateSubmission } from "@/lib/scoring/evaluator";

describe("Scoring Engine & Output Normalizer", () => {
  it("normalizes CRLF to LF and trims trailing whitespace", () => {
    const raw = "hello world  \r\nline two   \r\n";
    const normalized = normalizeOutput(raw);
    expect(normalized).toBe("hello world\nline two");
  });

  it("compares outputs correctly with string equivalence", () => {
    expect(compareOutputs("42\n", "42")).toBe(true);
    expect(compareOutputs("0 1 \r\n", "0 1")).toBe(true);
    expect(compareOutputs("hello", "world")).toBe(false);
  });

  it("compares JSON outputs with key and array whitespace tolerance", () => {
    const jsonA = '[[1, 6], [8, 10]]';
    const jsonB = '[[1,6],[8,10]]';
    expect(compareOutputs(jsonA, jsonB)).toBe(true);
  });

  it("evaluates test cases deterministically in sandbox", async () => {
    const testCases = [
      {
        id: "tc1",
        inputData: "test",
        expectedOutput: "3",
        isHidden: false,
        points: 50,
      },
      {
        id: "tc2",
        inputData: "hidden",
        expectedOutput: "3",
        isHidden: true,
        points: 50,
      },
    ];

    const code = `console.log(1 + 2);`;
    const summary = await evaluateSubmission(code, "javascript", testCases, false);

    expect(summary.totalTests).toBe(2);
    expect(summary.passedTests).toBe(2);
    expect(summary.score).toBe(100);
    expect(summary.percentageScore).toBe(100);
  });

  it("correctly identifies wrong answers and awards partial points", async () => {
    const testCases = [
      {
        id: "tc1",
        inputData: "",
        expectedOutput: "3",
        isHidden: false,
        points: 50,
      },
      {
        id: "tc2",
        inputData: "",
        expectedOutput: "99",
        isHidden: true,
        points: 50,
      },
    ];

    const code = `console.log(3);`;
    const summary = await evaluateSubmission(code, "javascript", testCases, false);

    expect(summary.passedTests).toBe(1);
    expect(summary.score).toBe(50);
    expect(summary.percentageScore).toBe(50);
    expect(summary.results[0].passed).toBe(true);
    expect(summary.results[1].passed).toBe(false);
  });

  it("sanitizes hidden test outputs when isCandidateView is true", async () => {
    const testCases = [
      {
        id: "tc_hidden",
        inputData: "SECRET_INPUT_42",
        expectedOutput: "SECRET_OUTPUT_99",
        isHidden: true,
        points: 40,
      },
    ];

    const code = `console.log("SECRET_OUTPUT_99");`;
    const candidateSummary = await evaluateSubmission(code, "javascript", testCases, true);

    expect(candidateSummary.results[0].inputSample).toBe("[Hidden Test Case]");
    expect(candidateSummary.results[0].expectedSample).toBe("[Hidden Expected Output]");
  });
});
