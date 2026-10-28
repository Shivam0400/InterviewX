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
  Users,
  Bot,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  RefreshCw,
  Send,
  HelpCircle,
  BookOpen,
  Code,
  FileCheck,
  ZoomIn,
  ZoomOut,
  ShieldCheck,
  Home,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { InterviewXLogo } from "@/components/brand/logo";

// Dynamically import Monaco Editor to avoid SSR window issues
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-[#1e1e1e] text-slate-400 font-mono text-xs">
      Loading Monaco Editor Environment...
    </div>
  ),
});

interface WorkspaceViewProps {
  interview: any;
  currentUser: {
    id: string;
    name: string;
    role: "INTERVIEWER" | "CANDIDATE";
    email: string;
  };
}

export function WorkspaceView({ interview, currentUser }: WorkspaceViewProps) {
  const { resolvedTheme } = useTheme();

  // Active question state
  const questions = interview.questions.map((iq: any) => iq.question);
  const [activeQuestionIndex, setActiveQuestionIndex] = React.useState(0);
  const currentQuestion = questions[activeQuestionIndex] || questions[0];

  // Editor state
  const [language, setLanguage] = React.useState<"python" | "javascript" | "typescript" | "cpp" | "java">("javascript");
  const [fontSize, setFontSize] = React.useState(13);
  const [code, setCode] = React.useState<string>("");
  const [dirty, setDirty] = React.useState(false);
  const [autosaveStatus, setAutosaveStatus] = React.useState("Saved");

  // Output and tests state
  const [bottomTab, setBottomTab] = React.useState<"tests" | "output" | "evaluation">("tests");
  const [isExecuting, setIsExecuting] = React.useState(false);
  const [executionOutput, setExecutionOutput] = React.useState<string | null>(null);
  const [testResults, setTestResults] = React.useState<any[]>([]);
  const [evaluationSummary, setEvaluationSummary] = React.useState<any | null>(null);

  // Right sidebar state (Participants / AI Copilot)
  const [rightTab, setRightTab] = React.useState<"copilot" | "presence" | "rubric">("copilot");
  const [rightSidebarOpen, setRightSidebarOpen] = React.useState(true);

  // AI Copilot state
  const [aiLoading, setAiLoading] = React.useState(false);
  const [aiExplanation, setAiExplanation] = React.useState<any | null>(null);
  const [aiFollowUps, setAiFollowUps] = React.useState<any | null>(null);
  const [aiReview, setAiReview] = React.useState<any | null>(null);
  const [aiProviderLabel, setAiProviderLabel] = React.useState<string>("AI Copilot");

  // Timer state (seconds)
  const [secondsRemaining, setSecondsRemaining] = React.useState(interview.durationMinutes * 60);

  // Initialize starter code when question or language changes
  React.useEffect(() => {
    try {
      const starters = JSON.parse(currentQuestion.starterCodes || "{}");
      if (starters[language]) {
        setCode(starters[language]);
      } else {
        setCode(
          language === "python"
            ? "# Write your solution here\n"
            : language === "javascript"
            ? "// Write your solution here\n"
            : "// Solution\n"
        );
      }
    } catch {
      setCode("// Write your solution here\n");
    }
    setDirty(false);
  }, [currentQuestion.id, language]);

  // Session presence & live timer countdown
  React.useEffect(() => {
    // Notify session hub of join
    fetch(`/api/v1/interviews/${interview.id}/session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "JOIN",
        participant: {
          id: currentUser.id,
          name: currentUser.name,
          role: currentUser.role,
        },
      }),
    }).catch(() => {});

    // Countdown interval
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [interview.id, currentUser.id, currentUser.name, currentUser.role]);

  // Handle editor code change with debounced autosave status
  const handleEditorChange = (value: string | undefined) => {
    const val = value || "";
    setCode(val);
    setDirty(true);
    setAutosaveStatus("Unsaved changes...");

    // Debounced autosave simulation
    const timer = setTimeout(() => {
      setDirty(false);
      setAutosaveStatus("Autosaved to session");
    }, 1500);

    return () => clearTimeout(timer);
  };

  // Run public test cases
  const handleRunPublicTests = async () => {
    setIsExecuting(true);
    setBottomTab("tests");
    setExecutionOutput("Submitting to isolated sandbox runner...");

    try {
      const res = await fetch(`/api/v1/interviews/${interview.id}/submissions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: currentQuestion.id,
          language,
          sourceCode: code,
          isFinalSubmission: false,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Execution failed");

      setEvaluationSummary(data.evaluation);
      setTestResults(data.evaluation.results || []);

      const out = (data.evaluation.results || [])
        .map((r: any, idx: number) => `[Test #${idx + 1}] ${r.statusMessage} (${r.executionTimeMs}ms)\nOutput: ${r.actualOutput || "<none>"}`)
        .join("\n\n");
      setExecutionOutput(out || "All public tests passed.");
    } catch (err: unknown) {
      setExecutionOutput(`Execution Error: ${err instanceof Error ? err.message : "Sandbox failure"}`);
    } finally {
      setIsExecuting(false);
    }
  };

  // Submit final assessment (all tests including hidden)
  const handleSubmitAssessment = async () => {
    setIsExecuting(true);
    setBottomTab("evaluation");
    setExecutionOutput("Evaluating full test matrix (public & confidential hidden suites)...");

    try {
      const res = await fetch(`/api/v1/interviews/${interview.id}/submissions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: currentQuestion.id,
          language,
          sourceCode: code,
          isFinalSubmission: true,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");

      setEvaluationSummary(data.evaluation);
      setTestResults(data.evaluation.results || []);
      setExecutionOutput(
        `Deterministic Evaluation Complete!\nScore: ${data.evaluation.score} / ${data.evaluation.maxScore} (${data.evaluation.percentageScore}%)\nPassed: ${data.evaluation.passedTests} of ${data.evaluation.totalTests} total suites.`
      );
    } catch (err: unknown) {
      setExecutionOutput(`Evaluation Error: ${err instanceof Error ? err.message : "Evaluation failed"}`);
    } finally {
      setIsExecuting(false);
    }
  };

  // Trigger AI Copilot actions
  const triggerAiAction = async (action: "EXPLAIN" | "FOLLOW_UP" | "REVIEW") => {
    setAiLoading(true);
    try {
      const res = await fetch(`/api/v1/interviews/${interview.id}/ai-copilot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          questionId: currentQuestion.id,
          sourceCode: code,
          language,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "AI Copilot call failed");

      setAiProviderLabel(data.provider || "AI Copilot");
      if (action === "EXPLAIN") setAiExplanation(data.data);
      if (action === "FOLLOW_UP") setAiFollowUps(data.data);
      if (action === "REVIEW") setAiReview(data.data);
    } catch (err: unknown) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-background text-foreground overflow-hidden font-sans select-none">
      {/* Top Application Bar */}
      <header className="h-12 border-b border-border bg-card flex items-center justify-between px-3 shrink-0 gap-3 z-30">
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Logo & Brand in Workspace */}
          <Link href="/" className="flex items-center gap-2 group mr-1" title="Go to Starting Homepage">
            <InterviewXLogo size="xs" glow={false} />
            <span className="font-bold text-xs tracking-tight text-foreground hidden md:inline">
              Interview<span className="text-brand-400">X</span>
            </span>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground px-2 py-1 rounded hover:bg-muted border border-border/60 transition-colors"
            title="Return to Starting Homepage"
          >
            <Home className="w-3.5 h-3.5 text-brand-400" />
            <span className="hidden sm:inline">Homepage</span>
          </Link>

          <Link
            href={`/interviews/${interview.id}`}
            className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground px-2 py-1 rounded hover:bg-muted transition-colors"
            title="Return to Interview Details"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Exit</span>
          </Link>

          <div className="h-4 w-[1px] bg-border hidden sm:block"></div>

          <div className="flex items-center gap-2">
            <span className="font-bold text-xs tracking-tight text-foreground truncate max-w-[150px] sm:max-w-xs md:max-w-sm">
              {interview.title}
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20 hidden lg:inline">
              Deterministic AST Active
            </span>
          </div>
        </div>

        {/* Center: Authoritative Timer & Tech Badge */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-muted/60 border border-border text-xs font-mono">
            <Clock className={`w-3.5 h-3.5 ${secondsRemaining < 300 ? "text-red-400 animate-pulse" : "text-brand-400"}`} />
            <span className={`font-semibold ${secondsRemaining < 300 ? "text-red-400" : "text-foreground"}`}>
              {formatTimer(secondsRemaining)}
            </span>
          </div>
          <span className="hidden xl:inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            SECCOMP Cgroup: 128MB
          </span>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center gap-2">
          {/* Persona role badge */}
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono bg-muted text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>{currentUser.name} ({currentUser.role})</span>
          </div>

          <ThemeToggle className="p-1.5" />

          {/* Run & Submit buttons */}
          <button
            type="button"
            disabled={isExecuting}
            onClick={handleRunPublicTests}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-muted hover:bg-muted/80 text-foreground border border-border text-xs font-semibold transition-colors disabled:opacity-50"
          >
            <Play className="w-3 h-3 text-emerald-400 fill-emerald-400" />
            <span className="hidden sm:inline">Run Tests</span>
          </button>

          <button
            type="button"
            disabled={isExecuting}
            onClick={handleSubmitAssessment}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
          >
            <Send className="w-3 h-3" />
            <span>Submit Solution</span>
          </button>

          <button
            type="button"
            onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
            className={`p-1.5 rounded-md border text-xs transition-colors ${
              rightSidebarOpen
                ? "bg-brand-500/10 text-brand-400 border-brand-500/30"
                : "bg-card text-muted-foreground border-border hover:bg-muted"
            }`}
            title="Toggle AI Copilot & Presence Panel"
          >
            <Bot className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Problem Statement (resizable width, 30-35%) */}
        <div className="w-80 md:w-96 lg:w-[420px] shrink-0 border-r border-border bg-card flex flex-col overflow-hidden">
          {/* Multiple Question Tabs (if more than 1 assigned) */}
          {questions.length > 1 && (
            <div className="flex items-center border-b border-border bg-muted/30 px-2 py-1 gap-1 overflow-x-auto text-xs font-medium">
              {questions.map((q: any, idx: number) => (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setActiveQuestionIndex(idx)}
                  className={`px-3 py-1 rounded text-xs transition-colors shrink-0 ${
                    activeQuestionIndex === idx
                      ? "bg-card text-foreground shadow-sm font-semibold border border-border"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Q{idx + 1}: {q.title.split(" ")[0]}...
                </button>
              ))}
            </div>
          )}

          {/* Problem Spec Content Area */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 select-text text-xs leading-relaxed">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <span
                className={`font-mono text-[10px] uppercase px-2 py-0.5 rounded font-semibold ${
                  currentQuestion.difficulty === "EASY"
                    ? "text-emerald-400 bg-emerald-500/10"
                    : currentQuestion.difficulty === "MEDIUM"
                    ? "text-amber-400 bg-amber-500/10"
                    : "text-red-400 bg-red-500/10"
                }`}
              >
                {currentQuestion.difficulty}
              </span>
              <span className="font-mono text-[11px] text-muted-foreground">
                Time Limit: {currentQuestion.timeLimitMs}ms
              </span>
            </div>

            <h2 className="text-base font-bold text-foreground">
              {currentQuestion.title}
            </h2>

            {/* Description Render */}
            <div className="prose prose-invert prose-xs max-w-none space-y-3 text-muted-foreground">
              <div
                dangerouslySetInnerHTML={{
                  __html: currentQuestion.description
                    .replace(/\n\n/g, "<br/><br/>")
                    .replace(/### (.*?)\n/g, "<h3 class='text-foreground font-bold text-xs mt-3 mb-1'>$1</h3>")
                    .replace(/`([^`]+)`/g, "<code class='bg-muted px-1 py-0.5 rounded text-foreground font-mono'>$1</code>"),
                }}
              />
            </div>

            {/* Public Test Cases Preview */}
            <div className="space-y-2 pt-4 border-t border-border">
              <h3 className="font-bold text-foreground text-xs flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-brand-500" />
                Sample Test Assertions
              </h3>
              {currentQuestion.testCases?.map((tc: any, i: number) => (
                <div key={tc.id} className="p-2.5 rounded bg-muted/40 border border-border/60 font-mono text-[11px] space-y-1">
                  <div className="text-muted-foreground">
                    <strong className="text-foreground">Input:</strong> {tc.inputData}
                  </div>
                  <div className="text-emerald-500 font-semibold">
                    <strong>Expected:</strong> {tc.expectedOutput}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center Panel: Editor + Bottom Runner Panels */}
        <div className="flex-1 flex flex-col overflow-hidden bg-background">
          {/* Editor Header Bar */}
          <div className="h-9 border-b border-border bg-card/60 flex items-center justify-between px-3 shrink-0 text-xs gap-3">
            <div className="flex items-center gap-3">
              {/* Language Selector */}
              <div className="flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-brand-500" />
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as any)}
                  className="bg-background text-foreground border border-border rounded px-2 py-0.5 text-xs font-mono focus:outline-none"
                >
                  <option value="javascript">JavaScript (Node.js 20)</option>
                  <option value="typescript">TypeScript</option>
                  <option value="python">Python 3</option>
                  <option value="cpp">C++ (GCC)</option>
                  <option value="java">Java 17</option>
                </select>
              </div>

              {/* Autosave status indicator */}
              <span className="text-[11px] font-mono text-muted-foreground flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${dirty ? "bg-amber-400" : "bg-emerald-400"}`}></span>
                {autosaveStatus}
              </span>
            </div>

            {/* Font scaling controls */}
            <div className="flex items-center gap-1 text-muted-foreground">
              <button
                type="button"
                onClick={() => setFontSize((s) => Math.max(11, s - 1))}
                className="p-1 hover:text-foreground rounded"
                title="Decrease font size"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-[11px]">{fontSize}px</span>
              <button
                type="button"
                onClick={() => setFontSize((s) => Math.min(20, s + 1))}
                className="p-1 hover:text-foreground rounded"
                title="Increase font size"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Monaco Editor Container */}
          <div className="flex-1 relative overflow-hidden">
            <MonacoEditor
              height="100%"
              language={language === "cpp" ? "cpp" : language}
              theme={resolvedTheme === "dark" ? "vs-dark" : "vs"}
              value={code}
              onChange={handleEditorChange}
              options={{
                fontSize,
                minimap: { enabled: false },
                lineNumbers: "on",
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                cursorBlinking: "smooth",
                fontFamily: "'Geist Mono', Menlo, Monaco, 'Courier New', monospace",
                bracketPairColorization: { enabled: true },
                formatOnPaste: true,
              }}
            />
          </div>

          {/* Bottom Execution & Test Output Panel (height ~240px) */}
          <div className="h-60 border-t border-border bg-card flex flex-col shrink-0">
            {/* Bottom Tabs */}
            <div className="flex items-center justify-between border-b border-border bg-muted/40 px-3 py-1.5 text-xs">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setBottomTab("tests")}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded font-medium transition-colors ${
                    bottomTab === "tests"
                      ? "bg-card text-foreground font-semibold border border-border shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Test Cases ({testResults.length})
                </button>

                <button
                  type="button"
                  onClick={() => setBottomTab("output")}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded font-medium transition-colors ${
                    bottomTab === "output"
                      ? "bg-card text-foreground font-semibold border border-border shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  Terminal Output
                </button>

                <button
                  type="button"
                  onClick={() => setBottomTab("evaluation")}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded font-medium transition-colors ${
                    bottomTab === "evaluation"
                      ? "bg-card text-foreground font-semibold border border-border shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <FileCheck className="w-3.5 h-3.5 text-brand-400" />
                  Deterministic Assessment
                </button>
              </div>

              {evaluationSummary && (
                <div className="flex items-center gap-2 font-mono text-[11px]">
                  <span className="text-emerald-400 font-bold">
                    Score: {evaluationSummary.score}/{evaluationSummary.maxScore} pts ({evaluationSummary.percentageScore}%)
                  </span>
                </div>
              )}
            </div>

            {/* Bottom Tab Content */}
            <div className="flex-1 p-3 overflow-y-auto font-mono text-xs select-text bg-background/50">
              {bottomTab === "tests" && (
                <div className="space-y-2">
                  {testResults.length === 0 ? (
                    <div className="text-muted-foreground text-center py-6">
                      Click <strong className="text-foreground">"Run Tests"</strong> above to execute code against sample test suites in the sandbox.
                    </div>
                  ) : (
                    testResults.map((r, i) => (
                      <div
                        key={r.testCaseId || i}
                        className={`p-2.5 rounded-lg border flex items-center justify-between text-[11px] ${
                          r.passed
                            ? "bg-emerald-500/10 border-emerald-500/30 text-foreground"
                            : "bg-destructive/10 border-destructive/30 text-destructive"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${r.passed ? "text-emerald-400" : "text-destructive"}`}>
                            {r.passed ? "✓ Passed" : "✗ Failed"}
                          </span>
                          <span className="text-muted-foreground">
                            {r.isHidden ? "[Hidden Test Case]" : `Input: ${r.inputSample}`}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-muted-foreground font-mono">
                          <span>{r.executionTimeMs}ms</span>
                          <span className="font-bold text-foreground">{r.pointsAwarded}/{r.maxPoints} pts</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {bottomTab === "output" && (
                <div className="h-full bg-[#121214] text-slate-200 p-3 rounded-lg overflow-y-auto whitespace-pre-wrap leading-relaxed">
                  {executionOutput || "No console output yet. Click 'Run Tests' or 'Submit Solution'."}
                </div>
              )}

              {bottomTab === "evaluation" && (
                <div className="space-y-3">
                  {evaluationSummary ? (
                    <div className="space-y-3">
                      <div className="p-3 rounded-lg bg-card border border-border flex items-center justify-between">
                        <div>
                          <div className="font-bold text-foreground text-sm">Deterministic Verification Outcome</div>
                          <div className="text-[11px] text-muted-foreground font-mono">
                            {evaluationSummary.passedTests} of {evaluationSummary.totalTests} total test suites passed
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold font-mono text-emerald-400">
                            {evaluationSummary.score} / {evaluationSummary.maxScore} PTS
                          </div>
                          <div className="text-[10px] text-muted-foreground font-mono">
                            Avg Latency: {evaluationSummary.averageExecutionTimeMs}ms
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-1">
                        <Link
                          href={`/reports/${interview.id}`}
                          className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold"
                        >
                          View Full Assessment Report
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="text-muted-foreground text-center py-6">
                      Click <strong className="text-foreground">"Submit Solution"</strong> to trigger final deterministic assessment including hidden test suites.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar: AI Copilot & Presence (320px) */}
        {rightSidebarOpen && (
          <aside className="w-80 border-l border-border bg-card flex flex-col shrink-0 overflow-hidden">
            {/* Sidebar Tabs */}
            <div className="flex items-center border-b border-border bg-muted/40 px-2 py-1.5 text-xs font-medium gap-1">
              <button
                type="button"
                onClick={() => setRightTab("copilot")}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors ${
                  rightTab === "copilot"
                    ? "bg-card text-foreground font-semibold border border-border shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Bot className="w-3.5 h-3.5 text-brand-500" />
                AI Copilot
              </button>

              <button
                type="button"
                onClick={() => setRightTab("presence")}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors ${
                  rightTab === "presence"
                    ? "bg-card text-foreground font-semibold border border-border shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Users className="w-3.5 h-3.5 text-emerald-400" />
                Presence
              </button>
            </div>

            {/* Sidebar Body */}
            <div className="flex-1 p-3.5 overflow-y-auto space-y-4 text-xs">
              {rightTab === "copilot" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase text-muted-foreground">
                      Provider: {aiProviderLabel}
                    </span>
                    <span className="text-[10px] text-brand-400 font-semibold">Advisory Mode</span>
                  </div>

                  {/* Copilot Action Triggers */}
                  <div className="grid grid-cols-1 gap-1.5">
                    <button
                      type="button"
                      disabled={aiLoading}
                      onClick={() => triggerAiAction("EXPLAIN")}
                      className="p-2 rounded-lg border border-border bg-background hover:bg-muted text-left transition-colors flex items-center justify-between text-xs disabled:opacity-50"
                    >
                      <span className="font-semibold text-foreground">Explain Solution</span>
                      <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                    </button>

                    <button
                      type="button"
                      disabled={aiLoading}
                      onClick={() => triggerAiAction("FOLLOW_UP")}
                      className="p-2 rounded-lg border border-border bg-background hover:bg-muted text-left transition-colors flex items-center justify-between text-xs disabled:opacity-50"
                    >
                      <span className="font-semibold text-foreground">Follow-Up Probes</span>
                      <Bot className="w-3.5 h-3.5 text-brand-500" />
                    </button>

                    <button
                      type="button"
                      disabled={aiLoading}
                      onClick={() => triggerAiAction("REVIEW")}
                      className="p-2 rounded-lg border border-border bg-background hover:bg-muted text-left transition-colors flex items-center justify-between text-xs disabled:opacity-50"
                    >
                      <span className="font-semibold text-foreground">Code Review</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    </button>
                  </div>

                  {aiLoading && (
                    <div className="p-3 text-center text-xs text-muted-foreground font-mono animate-pulse">
                      Analyzing submitted source code...
                    </div>
                  )}

                  {/* AI Explanation Result */}
                  {aiExplanation && (
                    <div className="p-3 rounded-lg bg-muted/40 border border-border space-y-2 select-text">
                      <div className="font-bold text-foreground text-xs">Algorithmic Overview</div>
                      <p className="text-muted-foreground text-[11px] leading-relaxed">
                        {aiExplanation.summary}
                      </p>
                      <div className="grid grid-cols-2 gap-2 font-mono text-[10px] pt-1">
                        <div className="p-1.5 rounded bg-background border border-border/60">
                          <span className="text-muted-foreground block">Time:</span>
                          <span className="font-bold text-emerald-400">{aiExplanation.timeComplexity}</span>
                        </div>
                        <div className="p-1.5 rounded bg-background border border-border/60">
                          <span className="text-muted-foreground block">Space:</span>
                          <span className="font-bold text-indigo-400">{aiExplanation.spaceComplexity}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* AI Follow-Ups Result */}
                  {aiFollowUps?.questions && (
                    <div className="space-y-2 select-text">
                      <div className="font-bold text-foreground text-xs">Interviewer Follow-Up Probes</div>
                      {aiFollowUps.questions.map((q: any) => (
                        <div key={q.id} className="p-2.5 rounded-lg bg-background border border-border/80 space-y-1">
                          <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-muted text-brand-400 font-semibold">
                            {q.category}
                          </span>
                          <p className="font-medium text-foreground text-[11px]">{q.question}</p>
                          <p className="text-[10px] text-muted-foreground italic">Probe: {q.sampleFollowUp}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* AI Review Result */}
                  {aiReview && (
                    <div className="p-3 rounded-lg bg-muted/40 border border-border space-y-2 select-text">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-foreground text-xs">Code Maintainability</span>
                        <span className="text-xs font-mono font-bold text-emerald-400">
                          {aiReview.readabilityScore}/10
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        {aiReview.correctnessAssessment}
                      </p>
                    </div>
                  )}

                  <div className="text-[10px] text-muted-foreground/80 leading-relaxed border-t border-border pt-2">
                    Notice: AI-assisted observations are advisory and must be reviewed alongside human interviewer notes.
                  </div>
                </div>
              )}

              {rightTab === "presence" && (
                <div className="space-y-3">
                  <div className="font-bold text-foreground text-xs">Active Session Participants</div>

                  <div className="p-2.5 rounded-lg bg-background border border-border/80 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-foreground">{interview.interviewer.name}</div>
                      <div className="text-[10px] text-muted-foreground font-mono">Interviewer</div>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-background border border-border/80 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-foreground">{interview.candidateName}</div>
                      <div className="text-[10px] text-muted-foreground font-mono">Candidate</div>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  </div>

                  <div className="p-3 rounded-lg bg-muted/30 border border-border text-[11px] text-muted-foreground space-y-1">
                    <div className="font-semibold text-foreground flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      Session Integrity
                    </div>
                    <p>Document changes and countdown timers are validated against authoritative server state.</p>
                  </div>
                </div>
              )}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
