import { NextResponse } from "next/server";
import { z } from "zod";

const ChatRequestSchema = z.object({
  message: z.string().min(1, "Message cannot be empty"),
  history: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string(),
    })
  ).default([]),
});

const SYSTEM_PROMPT = `You are "InterviewX AI", the official intelligent platform copilot and engineering assistant for InterviewX (Technical interviews, built on evidence).

ABOUT INTERVIEWX:
- Creator: Shivam Sony (B.Tech CS & Data Science, Government Engineering College, Jamui; former Data Analyst Intern at SteamHouse India Limited).
- Primary Capabilities: Live collaborative coding workspaces with Monaco Editor, sandboxed isolated code execution (Judge0 CE and Safe Worker Sandbox), deterministic test case evaluation, server-side hidden test case confidentiality, and evidence-based assessment reports.
- Execution Limits: Hard 2.5s CPU wall-clock limit, 128 MB RAM ceiling, 32 KB output buffer truncation.
- Supported Languages: Python 3, JavaScript (Node.js 20), TypeScript, C++ (GCC), and Java 17.
- User Personas: Shivam Sony (Lead Interviewer & Admin), Vikram Malhotra (Reviewer), Rohan Mukherjee (Candidate), Sneha Patel (Candidate).

YOUR ROLE:
- You help candidates, interviewers, and recruiters with ANY question about:
  1. Technical interview coding challenges (algorithms, Big-O complexity, edge cases, debugging help, data structures like LRU Cache, Two Sum, Merge Intervals).
  2. Platform instructions (how to schedule interviews, how to share random access tokens like IVX-BLR-8492-RM, how to submit solutions, how reports work).
  3. Code execution & sandbox security (how code is isolated, why hidden test cases are private).
  4. General software engineering, backend systems, database schemas, and career guidance.
- Tone: Extremely helpful, concise, technically rigorous, encouraging, and articulate.
- If code is requested, provide clean, idiomatic snippets with clear comments.`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = ChatRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid message payload" }, { status: 400 });
    }

    const { message, history } = parsed.data;
    const geminiKey = process.env.GEMINI_API_KEY?.trim();

    // If Gemini API Key is configured in environment, call Google Gemini 1.5
    if (geminiKey) {
      try {
        const contents = [
          { role: "user", parts: [{ text: `${SYSTEM_PROMPT}\n\nPlease acknowledge and prepare to help the user.` }] },
          { role: "model", parts: [{ text: "Understood! I am InterviewX AI, ready to assist with technical coding questions, platform workflows, code debugging, and interview evaluations." }] },
          ...history.map((h) => ({
            role: h.role === "user" ? "user" : "model",
            parts: [{ text: h.content }],
          })),
          { role: "user", parts: [{ text: message }] },
        ];

        // Try gemini-1.5-flash
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents,
              generationConfig: {
                temperature: 0.3,
                maxOutputTokens: 1024,
              },
            }),
          }
        );

        if (res.ok) {
          const data = await res.json();
          const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reply) {
            return NextResponse.json({
              reply,
              provider: "Google Gemini 1.5 Flash",
            });
          }
        }
      } catch (err) {
        console.warn("Gemini API call failed, falling back to intelligent assistant engine:", err);
      }
    }

    // Context-Aware Heuristic Knowledge Engine Fallback
    const reply = generateHeuristicReply(message);
    return NextResponse.json({
      reply,
      provider: "InterviewX AI Assistant",
    });
  } catch (error) {
    console.error("AI Chat Route Error:", error);
    return NextResponse.json(
      { error: "Failed to generate AI response" },
      { status: 500 }
    );
  }
}

function generateHeuristicReply(input: string): string {
  const query = input.toLowerCase();

  if (query.includes("how") && (query.includes("schedule") || query.includes("invite") || query.includes("create"))) {
    return `### How to Schedule & Invite on InterviewX:
1. Navigate to **Interviews** > Click **"New Interview"** (or use \`/interviews/new\`).
2. Fill in the session title, candidate name, candidate email, and select your interview format (Live Coding, Timed Assessment, or DSA).
3. The platform automatically assigns a **fresh random meeting code** (e.g. \`IVX-BLR-8492-RM\`) and creates a private workspace URL.
4. Once created, click **"Copy Candidate Notice Email"** to copy a pre-formatted email invitation ready to send to your candidate!`;
  }

  if (query.includes("lru") || query.includes("cache")) {
    return `### LRU Cache Implementation Guide:
An **LRU (Least Recently Used) cache** requires $O(1)$ average time for both \`get\` and \`put\`:
- **Data Structures**: Combine a **Hash Map** (for $O(1)$ lookup) with a **Doubly Linked List** (for $O(1)$ node insertion at the head and deletion from the tail).
- **JavaScript Alternative**: ES6 \`Map\` preserves key insertion order. You can re-insert accessed keys (\`map.delete(k); map.set(k, v);\`) to maintain recency in $O(1)$ amortized time.
- **Edge cases to watch for**:
  - Updating an existing key without exceeding capacity.
  - Initializing with \`capacity = 1\`.
  - Evicting the oldest key when capacity is reached.`;
  }

  if (query.includes("sandbox") || query.includes("limit") || query.includes("execute") || query.includes("judge0")) {
    return `### Code Execution & Sandbox Architecture:
- **Provider Adapters**: InterviewX routes submissions through **Judge0 CE** (remote container cluster) or our built-in **Safe Local Sandbox** (isolated worker processes).
- **Resource Constraints**:
  - **Wall-Clock Timeout**: 2.5 seconds (prevents runaway \`while(true)\` loops).
  - **Memory Ceiling**: 128 MB RAM.
  - **Output Limit**: 32 KB stdout buffer truncation to prevent log-bombing.
- **Safety**: Code executes in non-privileged worker isolation with zero access to the host database or environment credentials.`;
  }

  if (query.includes("hidden") || query.includes("test") || query.includes("score")) {
    return `### Deterministic Scoring & Hidden Tests:
- Every problem features both **Public Sample Tests** (visible to candidates to test logic) and **Confidential Hidden Tests** (used for grading).
- **Security Guarantee**: Hidden test inputs, expected outputs, and private edge cases are executed strictly on the server and are NEVER exposed in the candidate's browser bundle.
- Candidates receive an aggregate pass/fail score with latency benchmarks.`;
  }

  if (query.includes("who") || query.includes("shivam") || query.includes("developer")) {
    return `### About the Developer:
**Shivam Sony** is the creator and architect of InterviewX.
- **Education**: B.Tech in Computer Science with a specialization in Data Science from **Government Engineering College, Jamui**.
- **Experience**: Data Analyst Intern at **SteamHouse India Limited** (analyzed SQL stored procedures, SAP Business One, material master data quality).
- **Interests**: Python, SQL, Distributed Systems, Machine Learning, and Web Architecture.
- **Portfolio**: You can explore his verified projects at [shivam-portfolio-eosin-mu.vercel.app](https://shivam-portfolio-eosin-mu.vercel.app/).`;
  }

  return `Hello! I am **InterviewX AI**, your technical assessment assistant.

I can help you with:
• **Solving Problems**: Algorithmic complexity, optimal data structures (Hash Maps, Sliding Window, DP, Trees).
• **Debugging Code**: Resolving runtime panics, Time Limit Exceeded (TLE), and edge cases.
• **Platform Guidance**: Scheduling interviews, sharing meeting tokens (e.g. \`IVX-BLR-8492-RM\`), and configuring rubrics.
• **Sandbox Architecture**: Resource boundaries (2500ms timeout, 128MB RAM, Judge0 CE).

Feel free to ask a specific question or paste a code snippet you'd like to analyze!`;
}
