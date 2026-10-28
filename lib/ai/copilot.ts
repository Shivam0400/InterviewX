import { z } from "zod";

export const SolutionExplanationSchema = z.object({
  algorithm: z.string(),
  dataStructures: z.array(z.string()),
  timeComplexity: z.string(),
  spaceComplexity: z.string(),
  timeComplexityReasoning: z.string(),
  spaceComplexityReasoning: z.string(),
  keyAssumptions: z.array(z.string()),
  edgeCasesIdentified: z.array(z.string()),
  summary: z.string(),
});

export type SolutionExplanation = z.infer<typeof SolutionExplanationSchema>;

export const FollowUpQuestionsSchema = z.object({
  questions: z.array(
    z.object({
      id: z.string(),
      category: z.enum(["SCALABILITY", "OPTIMIZATION", "EDGE_CASE", "SYSTEM_DESIGN", "ALTERNATIVE_APPROACH"]),
      question: z.string(),
      rationale: z.string(),
      sampleFollowUp: z.string(),
    })
  ),
});

export type FollowUpQuestions = z.infer<typeof FollowUpQuestionsSchema>;

export const CodeReviewSchema = z.object({
  correctnessAssessment: z.string(),
  readabilityScore: z.number().min(1).max(10),
  maintainabilityScore: z.number().min(1).max(10),
  concerns: z.array(
    z.object({
      severity: z.enum(["LOW", "MEDIUM", "HIGH"]),
      title: z.string(),
      description: z.string(),
      lineReference: z.string().optional(),
      recommendation: z.string(),
    })
  ),
  strengths: z.array(z.string()),
});

export type CodeReview = z.infer<typeof CodeReviewSchema>;

export const AssessmentReportAiSchema = z.object({
  executiveSummary: z.string(),
  verifiedStrengths: z.array(
    z.object({
      title: z.string(),
      evidence: z.string(),
    })
  ),
  improvementOpportunities: z.array(
    z.object({
      title: z.string(),
      evidence: z.string(),
    })
  ),
  rubricNotes: z.object({
    correctness: z.string(),
    codeQuality: z.string(),
    problemSolving: z.string(),
  }),
  advisoryNote: z.string(),
});

export type AssessmentReportAi = z.infer<typeof AssessmentReportAiSchema>;

export class AiCopilotService {
  private geminiKey = process.env.GEMINI_API_KEY?.trim() || "";

  isConfigured(): boolean {
    return Boolean(this.geminiKey);
  }

  getProviderName(): string {
    return this.isConfigured() ? "Google Gemini 1.5" : "InterviewX Heuristic Engine (Advisory)";
  }

  /**
   * Explain Candidate's Solution
   */
  async explainSolution(params: {
    questionTitle: string;
    questionDescription: string;
    sourceCode: string;
    language: string;
  }): Promise<{ data: SolutionExplanation; provider: string; isAiGenerated: boolean }> {
    if (this.isConfigured()) {
      try {
        const prompt = `You are a Principal Software Engineer conducting a live technical interview assessment.
Analyze the following candidate's ${params.language} code for the problem "${params.questionTitle}".
Problem Description:
${params.questionDescription}

Candidate Code:
\`\`\`${params.language}
${params.sourceCode}
\`\`\`

Return a strictly valid JSON object matching this schema:
{
  "algorithm": "name or description of algorithmic paradigm (e.g. Hash Map frequency counting, Two Pointers, Dynamic Programming)",
  "dataStructures": ["list of key data structures used"],
  "timeComplexity": "Big-O notation (e.g. O(N))",
  "spaceComplexity": "Big-O notation (e.g. O(1))",
  "timeComplexityReasoning": "Concise justification referencing code lines or loop bounds",
  "spaceComplexityReasoning": "Concise justification referencing allocated memory or auxiliary structures",
  "keyAssumptions": ["assumptions made by the candidate"],
  "edgeCasesIdentified": ["potential edge cases addressed or missed"],
  "summary": "2-3 sentence technical overview of candidate's approach"
}
Output only the JSON object, no markdown code fence or extra text.`;

        const responseText = await this.callGemini(prompt);
        const parsed = JSON.parse(this.cleanJsonResponse(responseText));
        const validated = SolutionExplanationSchema.parse(parsed);
        return { data: validated, provider: "Gemini 1.5", isAiGenerated: true };
      } catch (err) {
        console.warn("Gemini explanation failed, falling back to heuristic analyzer:", err);
      }
    }

    // Heuristic Fallback Analyzer (Deterministic, rule-based)
    return {
      data: this.heuristicExplain(params.sourceCode, params.language, params.questionTitle),
      provider: "InterviewX Heuristic Engine",
      isAiGenerated: false,
    };
  }

  /**
   * Generate Follow-Up Questions for the Interviewer
   */
  async generateFollowUpQuestions(params: {
    questionTitle: string;
    sourceCode: string;
    language: string;
  }): Promise<{ data: FollowUpQuestions; provider: string; isAiGenerated: boolean }> {
    if (this.isConfigured()) {
      try {
        const prompt = `You are an interviewer conducting a senior-level technical coding interview for "${params.questionTitle}".
Candidate's current ${params.language} code:
\`\`\`${params.language}
${params.sourceCode}
\`\`\`

Generate 4 high-value follow-up questions for the interviewer to probe the candidate's engineering depth.
Return strictly valid JSON:
{
  "questions": [
    {
      "id": "q1",
      "category": "SCALABILITY | OPTIMIZATION | EDGE_CASE | SYSTEM_DESIGN | ALTERNATIVE_APPROACH",
      "question": "The interview question to ask",
      "rationale": "Why this question tests engineering competency",
      "sampleFollowUp": "A deeper secondary probe"
    }
  ]
}
Output only JSON.`;

        const responseText = await this.callGemini(prompt);
        const parsed = JSON.parse(this.cleanJsonResponse(responseText));
        const validated = FollowUpQuestionsSchema.parse(parsed);
        return { data: validated, provider: "Gemini 1.5", isAiGenerated: true };
      } catch (err) {
        console.warn("Gemini follow-up generation failed, using heuristic questions:", err);
      }
    }

    return {
      data: this.heuristicFollowUps(params.sourceCode, params.language),
      provider: "InterviewX Heuristic Engine",
      isAiGenerated: false,
    };
  }

  /**
   * Code Review and Maintainability Assessment
   */
  async reviewCode(params: {
    questionTitle: string;
    sourceCode: string;
    language: string;
  }): Promise<{ data: CodeReview; provider: string; isAiGenerated: boolean }> {
    if (this.isConfigured()) {
      try {
        const prompt = `Review this candidate's interview code for "${params.questionTitle}":
\`\`\`${params.language}
${params.sourceCode}
\`\`\`

Provide an objective engineering review.
Return strictly valid JSON:
{
  "correctnessAssessment": "Concise statement on apparent logic completeness",
  "readabilityScore": 8, // 1-10
  "maintainabilityScore": 8, // 1-10
  "concerns": [
    {
      "severity": "LOW | MEDIUM | HIGH",
      "title": "Concern summary",
      "description": "Details",
      "lineReference": "e.g. Line 8",
      "recommendation": "How to improve"
    }
  ],
  "strengths": ["List of strengths demonstrated in code structure or style"]
}
Output only JSON.`;

        const responseText = await this.callGemini(prompt);
        const parsed = JSON.parse(this.cleanJsonResponse(responseText));
        const validated = CodeReviewSchema.parse(parsed);
        return { data: validated, provider: "Gemini 1.5", isAiGenerated: true };
      } catch (err) {
        console.warn("Gemini code review failed, using heuristic review:", err);
      }
    }

    return {
      data: this.heuristicReview(params.sourceCode, params.language),
      provider: "InterviewX Heuristic Engine",
      isAiGenerated: false,
    };
  }

  /**
   * Generate Comprehensive Assessment Report Items
   */
  async generateAssessmentSummary(params: {
    questionTitle: string;
    sourceCode: string;
    language: string;
    passRate: number;
    score: number;
    maxScore: number;
  }): Promise<{ data: AssessmentReportAi; provider: string; isAiGenerated: boolean }> {
    const isAi = this.isConfigured();
    if (isAi) {
      try {
        const prompt = `Generate an evidence-linked candidate evaluation summary for "${params.questionTitle}".
Pass rate: ${params.passRate}% (${params.score}/${params.maxScore} points).
Code:
\`\`\`${params.language}
${params.sourceCode}
\`\`\`

Return strictly valid JSON:
{
  "executiveSummary": "Concise 2-paragraph assessment of candidate performance and technical execution",
  "verifiedStrengths": [
    { "title": "Strength name", "evidence": "Direct evidence from code or test outcomes" }
  ],
  "improvementOpportunities": [
    { "title": "Area for improvement", "evidence": "Evidence from edge cases, code style, or complexity" }
  ],
  "rubricNotes": {
    "correctness": "Assessment of functional correctness based on verified test runs",
    "codeQuality": "Assessment of naming, decomposition, and idiomatic idioms",
    "problemSolving": "Assessment of approach efficiency and algorithm selection"
  },
  "advisoryNote": "Notice: AI-assisted observations are advisory and must be reviewed alongside human interviewer notes."
}
Output only JSON.`;

        const responseText = await this.callGemini(prompt);
        const parsed = JSON.parse(this.cleanJsonResponse(responseText));
        const validated = AssessmentReportAiSchema.parse(parsed);
        return { data: validated, provider: "Gemini 1.5", isAiGenerated: true };
      } catch (err) {
        console.warn("Gemini assessment report failed, using structured fallback:", err);
      }
    }

    // Deterministic fallback
    return {
      data: {
        executiveSummary: `The candidate completed the problem "${params.questionTitle}" achieving a deterministic test score of ${params.score}/${params.maxScore} (${params.passRate}% pass rate). The submitted ${params.language} solution demonstrates functional logic with room for edge-case fortification and memory profiling.`,
        verifiedStrengths: [
          {
            title: "Functional Execution",
            evidence: `Deterministic test engine verified passing tests with score ${params.score}/${params.maxScore}.`,
          },
          {
            title: "Idiomatic Language Constructs",
            evidence: `Appropriate usage of ${params.language} built-in constructs and structured control flow.`,
          },
        ],
        improvementOpportunities: [
          {
            title: "Boundary Condition Defense",
            evidence: "Consider validating empty collections, single-element collections, and extreme numerical boundaries upfront.",
          },
          {
            title: "Memory Footprint Optimization",
            evidence: "Auxiliary space allocations could be examined for in-place modifications where constraints permit.",
          },
        ],
        rubricNotes: {
          correctness: `Achieved ${params.passRate}% deterministic pass rate across verified test suites.`,
          codeQuality: "Code is cleanly structured with readable variable naming conventions.",
          problemSolving: "Selected appropriate algorithmic paradigms to meet standard time complexity bounds.",
        },
        advisoryNote: "Notice: AI-assisted observations are advisory and must be reviewed alongside human interviewer notes.",
      },
      provider: "InterviewX Heuristic Engine",
      isAiGenerated: false,
    };
  }

  private async callGemini(prompt: string): Promise<string> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.geminiKey}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          topK: 40,
          topP: 0.95,
        },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Gemini API HTTP ${res.status}: ${errText}`);
    }

    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
  }

  private cleanJsonResponse(raw: string): string {
    let clean = raw.trim();
    if (clean.startsWith("```json")) {
      clean = clean.replace(/^```json\s*/i, "").replace(/```\s*$/, "");
    } else if (clean.startsWith("```")) {
      clean = clean.replace(/^```\s*/, "").replace(/```\s*$/, "");
    }
    return clean.trim();
  }

  // --- Heuristic Rule-Based Analyzers ---

  private heuristicExplain(code: string, language: string, questionTitle: string): SolutionExplanation {
    const hasNestedLoops = /(for|while).*\{?[\s\S]*?(for|while)/i.test(code);
    const hasMapOrSet = /(Map|Set|dict|hash_map|unordered_map)/i.test(code);
    const hasRecursion = /function\s+(\w+)[\s\S]*?\1\(|def\s+(\w+)[\s\S]*?\2\(/i.test(code);

    let estimatedTime = "O(N)";
    let timeReason = "Single linear traversal over input elements.";
    if (hasNestedLoops) {
      estimatedTime = "O(N²)";
      timeReason = "Nested iterative loops traversing the dataset.";
    } else if (hasRecursion) {
      estimatedTime = "O(2^N) or O(N log N)";
      timeReason = "Recursive branching search.";
    } else if (hasMapOrSet) {
      estimatedTime = "O(N)";
      timeReason = "Single pass with O(1) hash map operations.";
    }

    const dataStructures: string[] = ["Array / List"];
    if (hasMapOrSet) dataStructures.push("Hash Table / Map");
    if (/stack/i.test(code)) dataStructures.push("Stack");
    if (/queue/i.test(code)) dataStructures.push("Queue");

    return {
      algorithm: hasRecursion ? "Recursive Search" : hasMapOrSet ? "Hash Map Lookup" : hasNestedLoops ? "Brute Force Iteration" : "Linear Traversal",
      dataStructures,
      timeComplexity: estimatedTime,
      spaceComplexity: hasMapOrSet ? "O(N)" : "O(1)",
      timeComplexityReasoning: timeReason,
      spaceComplexityReasoning: hasMapOrSet ? "Allocates auxiliary space for hash mapping." : "Constant auxiliary memory usage.",
      keyAssumptions: [
        "Input fits within memory boundaries.",
        "Input formats match specified problem constraints.",
      ],
      edgeCasesIdentified: [
        "Empty array / null inputs.",
        "Single-element inputs.",
        "Duplicate values.",
      ],
      summary: `The candidate implemented an approach for "${questionTitle}" in ${language}. The logic relies on ${dataStructures.join(" and ")} with estimated ${estimatedTime} time complexity.`,
    };
  }

  private heuristicFollowUps(code: string, language: string): FollowUpQuestions {
    return {
      questions: [
        {
          id: "q-scale",
          category: "SCALABILITY",
          question: "How would this solution behave if the input size grew from 10⁴ to 10⁸ elements?",
          rationale: "Tests candidate's understanding of asymptotic scaling, cache locality, and streaming data constraints.",
          sampleFollowUp: "Could we process this dataset as a stream or via external memory chunks?",
        },
        {
          id: "q-space",
          category: "OPTIMIZATION",
          question: "Can we achieve the same time complexity while reducing the auxiliary space to O(1)?",
          rationale: "Probes candidate's ability to trade space for time or leverage in-place pointer techniques.",
          sampleFollowUp: "What trade-offs would an in-place approach introduce regarding input mutability?",
        },
        {
          id: "q-edge",
          category: "EDGE_CASE",
          question: "How does your implementation handle extreme values, negative integers, or duplicate elements?",
          rationale: "Verifies defensive programming habits and edge-case awareness.",
          sampleFollowUp: "What specific assertions or unit tests would you write to guarantee robustness?",
        },
        {
          id: "q-concurrency",
          category: "SYSTEM_DESIGN",
          question: "If this function were called concurrently by 10,000 workers in a distributed service, what thread-safety or idempotency considerations would arise?",
          rationale: "Bridges competitive programming logic to production backend architecture.",
          sampleFollowUp: "Are there any shared mutable state or memory allocation bottlenecks?",
        },
      ],
    };
  }

  private heuristicReview(code: string, language: string): CodeReview {
    const lines = code.split("\n");
    const concerns = [];

    if (code.length > 20 && !code.includes("try") && !code.includes("throw") && !code.includes("except")) {
      concerns.push({
        severity: "LOW" as const,
        title: "Defensive Error Handling",
        description: "Code executes without explicit exception handling or input validation guards.",
        lineReference: "Lines 1-5",
        recommendation: "Add early returns or guard clauses to validate non-null input constraints.",
      });
    }

    if (lines.length > 60) {
      concerns.push({
        severity: "MEDIUM" as const,
        title: "Function Decomposition",
        description: "The primary function is lengthy. Decomposing into helper functions improves readability and testing.",
        lineReference: `Lines 1-${lines.length}`,
        recommendation: "Extract helper routines for sub-steps.",
      });
    }

    return {
      correctnessAssessment: "Implementation follows clear imperative logic suitable for technical evaluation.",
      readabilityScore: 8,
      maintainabilityScore: 8,
      concerns,
      strengths: [
        "Clean indentation and variable naming conventions.",
        "Straightforward procedural execution path without obfuscation.",
        "Appropriate language-specific standard library usage.",
      ],
    };
  }
}

export const aiCopilotService = new AiCopilotService();
