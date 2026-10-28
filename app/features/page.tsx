import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import {
  Code2,
  Cpu,
  CheckCircle,
  Sparkles,
  Users2,
  BarChart3,
  ShieldAlert,
  FileCheck,
  ArrowRight,
  Terminal,
} from "lucide-react";

export const metadata = {
  title: "Features & Architecture — InterviewX",
  description:
    "Explore the complete feature suite of InterviewX: collaborative coding, sandboxed execution, test verification, AI copilot, and reproducible reports.",
};

export default function FeaturesPage() {
  const deepFeatures = [
    {
      icon: Code2,
      tag: "Live Workspace",
      title: "Real-time Collaborative Code Workspace",
      description:
        "Full Monaco Editor integration with multi-language syntax highlighting, line numbers, automatic light/dark theme synchronization, code autosave with debounced persistence, and participant presence indicators.",
      bullets: [
        "Language-aware Monaco editing with bracket matching and indentation",
        "Participant presence and live connection indicators",
        "Authoritative server-side countdown timer to prevent client tampering",
        "Support for Python, JavaScript, TypeScript, C++, and Java",
      ],
    },
    {
      icon: Cpu,
      tag: "Isolated Execution",
      title: "Sandboxed Code Execution Engine",
      description:
        "Engineered with a provider-adapter pattern supporting Judge0 CE clusters and an isolated local sandbox. Code execution runs in isolated worker processes with strict resource boundaries.",
      bullets: [
        "Hard CPU execution timeout (2.5s default limit)",
        "Memory ceiling enforcement (128 MB default threshold)",
        "Output stream truncation to prevent buffer overflow attacks",
        "Zero access to application database, filesystem, or environment credentials",
      ],
    },
    {
      icon: CheckCircle,
      tag: "Deterministic Scoring",
      title: "Automated Test-Driven Evaluation",
      description:
        "Every candidate submission is evaluated against rigorous public and hidden test cases. Machine outputs are normalized to prevent false negatives from CRLF differences or JSON spacing.",
      bullets: [
        "Secret hidden test suites evaluated securely server-side",
        "Clear distinction between Wrong Answer, Timeout, Runtime Error, and Compile Error",
        "Deterministic points allocation based on test weights",
        "Sanitized aggregate feedback sent to candidate view without leaking secrets",
      ],
    },
    {
      icon: Sparkles,
      tag: "AI Copilot",
      title: "Evidence-Based AI Interview Copilot",
      description:
        "Augments the interviewer with structured analysis. Uses Google Gemini API (or structured heuristic fallback) with schema validation to summarize approaches and recommend follow-up probes.",
      bullets: [
        "Algorithmic complexity estimation with Big-O justifications",
        "Contextual follow-up question generator for interviewer guidance",
        "Readability and maintainability code review metrics",
        "Advisory labeling: AI never automatically rejects or decides candidate fate",
      ],
    },
    {
      icon: Users2,
      tag: "Interview Lifecycle",
      title: "Structured Assessment Lifecycle",
      description:
        "Manage candidates from drafting to final hiring recommendation. Secure cryptographic invitation tokens ensure candidates access only authorized sessions without predictable URLs.",
      bullets: [
        "Explicit state transitions: Scheduled → In Progress → Submitted → Evaluated",
        "Customizable scoring rubrics (Correctness, Code Quality, Problem Solving)",
        "Language whitelist and time duration configuration per interview",
        "Candidate invitation token generation with revocation controls",
      ],
    },
    {
      icon: BarChart3,
      tag: "Analytics",
      title: "Candidate Performance & Question Calibration",
      description:
        "Aggregated data science metrics track question difficulty, execution latencies, error distributions, and historical pass rates across topics.",
      bullets: [
        "Question pass rate and completion rate tracking",
        "Execution latency distributions across languages",
        "Question calibration diagnostics to identify ambiguous problem statements",
        "Audit logging of all interview events and score releases",
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-brand-500/20">
      <Navbar />

      <main className="flex-1 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-brand-500/10 text-brand-400 border border-brand-500/20">
              Platform Capabilities
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
              Engineered for Technical Precision
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Every subsystem in InterviewX is designed to deliver verified engineering evidence, eliminate subjective bias, and provide an authentic development environment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {deepFeatures.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="p-6 sm:p-8 rounded-xl bg-card border border-border/80 space-y-4 hover:border-brand-500/40 transition-colors shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-lg bg-brand-500/10 text-brand-400 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono uppercase px-2.5 py-0.5 rounded bg-muted text-muted-foreground">
                      {feat.tag}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-foreground">{feat.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {feat.description}
                  </p>

                  <ul className="space-y-2 pt-2 border-t border-border/60">
                    {feat.bullets.map((b, i) => (
                      <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                        <span className="text-brand-400 font-bold">✓</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* CTA Box */}
          <div className="p-8 rounded-2xl bg-gradient-to-r from-brand-950/40 to-indigo-950/40 border border-brand-500/30 text-center space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Ready to test the live platform?</h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
              Launch an assessment session, write code in the Monaco workspace, execute tests against the sandbox runner, and inspect the AI copilot.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <Link
                href="/dashboard"
                className="px-6 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-medium text-xs shadow-md transition-colors"
              >
                Open Live Dashboard
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
