import { describe, it, expect } from "vitest";
import {
  SolutionExplanationSchema,
  FollowUpQuestionsSchema,
  CodeReviewSchema,
  AssessmentReportAiSchema,
} from "@/lib/ai/copilot";

describe("AI Copilot Structured Output Validation", () => {
  it("validates valid SolutionExplanation JSON", () => {
    const valid = {
      algorithm: "Hash Map Two-Pass",
      dataStructures: ["Map", "Array"],
      timeComplexity: "O(N)",
      spaceComplexity: "O(N)",
      timeComplexityReasoning: "Single linear traversal of array",
      spaceComplexityReasoning: "Map allocates entry for each element",
      keyAssumptions: ["All integers fit in 32-bit bounds"],
      edgeCasesIdentified: ["Empty array", "Target not found"],
      summary: "Candidate implements an optimal hash map solution.",
    };

    const parsed = SolutionExplanationSchema.safeParse(valid);
    expect(parsed.success).toBe(true);
  });

  it("rejects invalid SolutionExplanation JSON missing required fields", () => {
    const invalid = {
      algorithm: "Hash Map",
      // missing timeComplexity, etc.
    };

    const parsed = SolutionExplanationSchema.safeParse(invalid);
    expect(parsed.success).toBe(false);
  });

  it("validates valid FollowUpQuestions JSON", () => {
    const valid = {
      questions: [
        {
          id: "q1",
          category: "SCALABILITY",
          question: "How would this scale to 10 billion records?",
          rationale: "Tests streaming intuition",
          sampleFollowUp: "Would you partition by hash key?",
        },
      ],
    };

    const parsed = FollowUpQuestionsSchema.safeParse(valid);
    expect(parsed.success).toBe(true);
  });

  it("validates CodeReview schema with bounds", () => {
    const valid = {
      correctnessAssessment: "Logic is complete",
      readabilityScore: 9,
      maintainabilityScore: 8,
      concerns: [],
      strengths: ["Clean syntax", "Early return"],
    };

    const parsed = CodeReviewSchema.safeParse(valid);
    expect(parsed.success).toBe(true);
  });
});
