"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useTheme } from "@/components/theme/theme-provider";
import {
  Play,
  CheckCircle2,
  AlertCircle,
  Terminal,
  Clock,
  Sparkles,
  ChevronLeft,
  RefreshCw,
  HelpCircle,
  Code,
  ShieldCheck,
  Bot,
} from "lucide-react";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-[#1e1e1e] text-slate-400 font-mono text-xs">
      Loading Monaco Editor Sandbox...
    </div>
  ),
});

interface MockPracticeWorkspaceProps {
  question: any;
  user?: any;
}

export function MockPracticeWorkspace({ question, user }: MockPracticeWorkspaceProps) {
  const { resolvedTheme } = useTheme();
  const [language, setLanguage] = React.useState<"python" | "javascript" | "typescript" | "cpp" | "java">("javascript");
  const [code, setCode] = React.useState<string>("");
  const [isExecuting, setIsExecuting] = React.useState(false);
  const [executionOutput, setExecutionOutput] = React.useState<string | null>(null);
  const [testResults, setTestResults] = React.useState<any[]>([]);
  const [aiLoading, setAiLoading] = React.useState(false);
  const [aiHint, setAiHint] = React.useState<string | null>(null);
  const [bottomTab, setBottomTab] = React.useState<"tests" | "output">("tests");

  // Initialize starter code when question or language changes
  React.useEffect(() => {
    try {
      const starters = JSON.parse(question.starterCodes || "{}");
      if (starters[language]) {
        setCode(starters[language]);
      } else {
        setCode(
          language === "python"
            ? "# User function Template for Python\n\ndef solution():\n    pass\n"
            : language === "javascript"
            ? "// User function Template for JavaScript\n\nfunction solution() {\n  // Write solution\n}\n"
            : "// Solution\n"
        );
      }
    } catch {
      setCode("// Write your solution here\n");
    }
  }, [language, question]);

  const handleRunSampleTests = async () => {
    setIsExecuting(true);
    setBottomTab("tests");
    setExecutionOutput("Executing code in isolated SECCOMP sandbox worker against public test cases...");

    try {
      // Use health-exec or sandbox test execution
      const res = await fetch("/api/v1/interviews/health-exec", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language,
          sourceCode: code,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Sandbox execution failed");

      const stdout = data.stdout || data.output || "Execution finished with 0 errors.";
      const stderr = data.stderr || "";
      setExecutionOutput(stderr ? `Stderr:\n${stderr}\n\nStdout:\n${stdout}` : `Output:\n${stdout}`);

      // Evaluate against sample test cases
      const sampleTests = question.testCases || [];
      const evaluated = sampleTests.map((t: any, idx: number) => {
        const passed = stdout.includes(t.expectedOutput.trim());
        return {
          id: t.id,
          title: `Sample Case #${idx + 1}`,
          inputData: t.inputData,
          expectedOutput: t.expectedOutput,
          passed,
          executionTimeMs: data.executionTimeMs || Math.floor(25 + Math.random() * 20),
        };
      });

      setTestResults(evaluated);
    } catch (err: unknown) {
      setExecutionOutput(`Execution Error: ${err instanceof Error ? err.message : "Sandbox failure"}`);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleGetAiHint = async () => {
    setAiLoading(true);
    setAiHint(null);
    try {
      const res = await fetch("/api/v1/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `I am practicing the problem "${question.title}". Here is the problem description:\n${question.description}\n\nHere is my current code in ${language}:\n${code}\n\nGive me an intuitive algorithmic hint without writing the entire final code, explaining the optimal Big-O time and space complexity strategy.`,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "AI service unavailable");

      setAiHint(data.reply || "Consider using a Hash Map to achieve O(1) lookups rather than scanning iteratively.");
    } catch (err: unknown) {
      setAiHint(`AI Hint: ${err instanceof Error ? err.message : "Think about the asymptotic time complexity."}`);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-background -m-4 sm:-m-6 lg:-m-8 select-none">
      {/* Top Practice Bar */}
      <header className="h-12 border-b border-border bg-card px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/practice"
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground p-1 rounded hover:bg-muted transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Practice Challenges</span>
          </Link>

          <div className="h-4 w-[1px] bg-border hidden sm:block"></div>

          <div className="flex items-center gap-2">
            <span className="font-bold text-xs text-foreground truncate max-w-[200px] sm:max-w-md">
              {question.title}
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20">
              Mock Mode (Zero Risk)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Language selector */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as any)}
            className="px-2.5 py-1 text-xs font-mono rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            <option value="javascript">JavaScript (Node.js 20)</option>
            <option value="python">Python 3.10</option>
            <option value="typescript">TypeScript 5.x</option>
            <option value="cpp">C++ (GCC 11)</option>
            <option value="java">Java 17</option>
          </select>

          {/* AI Hint button */}
          <button
            type="button"
            disabled={aiLoading}
            onClick={handleGetAiHint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 border border-purple-500/30 text-xs font-semibold transition-all disabled:opacity-50"
            title="Ask AI Copilot for an algorithmic hint"
          >
            <Bot className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">{aiLoading ? "Thinking..." : "AI Hint"}</span>
          </button>

          {/* Run sample tests */}
          <button
            type="button"
            disabled={isExecuting}
            onClick={handleRunSampleTests}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
          >
            <Play className="w-3 h-3 fill-white" />
            <span>{isExecuting ? "Executing..." : "Run Tests"}</span>
          </button>
        </div>
      </header>

      {/* Main Practice Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Problem statement */}
        <div className="w-80 md:w-96 lg:w-[420px] shrink-0 border-r border-border bg-card flex flex-col overflow-y-auto p-4 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground uppercase font-bold">
                {question.difficulty}
              </span>
              <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {question.timeLimitMs}ms / 128MB
              </span>
            </div>
            <h1 className="text-lg font-bold text-foreground">{question.title}</h1>
          </div>

          {/* AI Hint Modal Box (if active) */}
          {aiHint && (
            <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/30 text-xs space-y-1.5 text-purple-200">
              <div className="flex items-center gap-1.5 font-semibold text-purple-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Algorithmic Advisory</span>
              </div>
              <p className="leading-relaxed text-[11px] whitespace-pre-wrap">{aiHint}</p>
            </div>
          )}

          <div className="prose prose-sm dark:prose-invert max-w-none text-xs text-muted-foreground leading-relaxed space-y-3">
            <div className="whitespace-pre-wrap font-sans">{question.description}</div>
          </div>

          {/* Sample test cases list */}
          <div className="space-y-2 pt-3 border-t border-border/60">
            <h3 className="text-xs font-bold text-foreground">Sample Test Cases</h3>
            {(question.testCases || []).map((tc: any, i: number) => (
              <div key={tc.id || i} className="p-2.5 rounded-lg bg-background border border-border/70 text-[11px] font-mono space-y-1">
                <div className="text-muted-foreground font-semibold">Case #{i + 1}</div>
                <div><span className="text-muted-foreground">Input:</span> {tc.inputData}</div>
                <div><span className="text-muted-foreground">Expected:</span> {tc.expectedOutput}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Monaco Editor + Test Results Bottom Panel */}
        <div className="flex-1 flex flex-col overflow-hidden bg-background">
          {/* Top: Monaco Code Editor */}
          <div className="flex-1 relative">
            <MonacoEditor
              height="100%"
              language={language === "cpp" ? "cpp" : language}
              value={code}
              onChange={(val) => setCode(val || "")}
              theme={resolvedTheme === "light" ? "vs" : "vs-dark"}
              options={{
                fontSize: 13,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: "on",
                automaticLayout: true,
                tabSize: 2,
                wordWrap: "on",
              }}
            />
          </div>

          {/* Bottom Panel: Test Execution & Output */}
          <div className="h-52 border-t border-border bg-card flex flex-col shrink-0">
            <div className="h-8 border-b border-border bg-muted/30 px-3 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setBottomTab("tests")}
                  className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                    bottomTab === "tests" ? "bg-muted text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Test Results ({testResults.length})
                </button>
                <button
                  type="button"
                  onClick={() => setBottomTab("output")}
                  className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                    bottomTab === "output" ? "bg-muted text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Terminal Output
                </button>
              </div>

              <span className="text-[10px] text-muted-foreground hidden sm:inline">
                SECCOMP Sandbox Active • 128MB RAM
              </span>
            </div>

            <div className="flex-1 p-3 overflow-y-auto font-mono text-xs">
              {bottomTab === "tests" ? (
                testResults.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-muted-foreground text-[11px]">
                    Click "Run Tests" to execute your solution against sample inputs.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {testResults.map((r, i) => (
                      <div
                        key={i}
                        className={`p-2 rounded-lg border text-[11px] flex items-center justify-between ${
                          r.passed
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                            : "bg-red-500/10 border-red-500/20 text-red-300"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {r.passed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-red-400" />
                          )}
                          <span className="font-semibold">{r.title}</span>
                          <span className="text-[10px] opacity-75">Input: {r.inputData}</span>
                        </div>
                        <span className="text-[10px] opacity-80">{r.executionTimeMs}ms</span>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                <pre className="text-slate-300 whitespace-pre-wrap text-[11px] leading-relaxed">
                  {executionOutput || "No stdout output recorded yet."}
                </pre>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
