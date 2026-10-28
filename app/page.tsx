import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { InteractivePreview } from "@/components/marketing/interactive-preview";
import {
  Code2,
  Cpu,
  CheckCircle,
  Sparkles,
  Users2,
  BarChart,
  Shield,
  FileText,
  ArrowRight,
  Terminal,
  ExternalLink,
} from "lucide-react";

export default function HomePage() {
  const features = [
    {
      icon: Code2,
      title: "Live Collaborative Workspace",
      description:
        "Low-latency document synchronization, interviewer and candidate presence, Monaco Editor syntax highlighting, and autosave.",
    },
    {
      icon: Cpu,
      title: "Sandboxed Code Execution",
      description:
        "Judge0 cluster adapter with strict CPU limits, memory bounds, timeouts, and ephemeral execution isolation.",
    },
    {
      icon: CheckCircle,
      title: "Deterministic Assessment",
      description:
        "Deterministic test suite scoring with strict distinction between compile errors, runtime panics, and wrong outputs.",
    },
    {
      icon: Sparkles,
      title: "AI Interview Copilot",
      description:
        "Algorithmic complexity summaries, edge case analysis, and dynamic interviewer follow-up questions.",
    },
    {
      icon: Users2,
      title: "Interview Lifecycle Management",
      description:
        "Cryptographically secure candidate invite tokens, authoritative server-side countdown timers, and state transitions.",
    },
    {
      icon: BarChart,
      title: "Evidence-Based Analytics",
      description:
        "Detailed performance distributions, execution latencies, question calibration insights, and error analytics.",
    },
    {
      icon: Shield,
      title: "Server-Side Assessment Security",
      description:
        "Secret hidden test suites are evaluated entirely on the server and never transmitted to the candidate's browser.",
    },
    {
      icon: FileText,
      title: "Reproducible Evaluation Reports",
      description:
        "Generate comprehensive assessment dossiers combining machine-verified metrics with human reviewer notes.",
    },
  ];

  const steps = [
    {
      step: "01",
      title: "Configure Assessment & Select Problems",
      description:
        "Pick challenges from the question library, customize allowed languages, set time limits, and configure scoring rubrics.",
    },
    {
      step: "02",
      title: "Invite Candidate to Live Workspace",
      description:
        "Send a cryptographically random, expiring session invite token. Candidate joins without complex software installation.",
    },
    {
      step: "03",
      title: "Execute, Verify, and Evaluate",
      description:
        "Run code against public and hidden test cases, observe realtime execution metrics, and generate AI-assisted feedback.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-brand-500/20">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28 border-b border-border/60">
          <div className="absolute inset-0 gradient-glow pointer-events-none -z-10" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-brand-500/10 text-brand-400 border border-brand-500/20">
              <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse"></span>
              InterviewX v1.0 Production Platform
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground max-w-4xl mx-auto leading-tight sm:leading-none">
              Technical interviews, <br className="hidden sm:inline" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-400 via-indigo-500 to-cyan-400">
                built on evidence.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto font-normal leading-relaxed">
              A collaborative technical assessment platform for live coding, secure execution, structured evaluation, and AI-assisted engineering feedback.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/interviews/new"
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-medium shadow-lg shadow-brand-500/25 transition-all text-sm group"
              >
                Start an Interview
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <a
                href="#product-demo"
                className="flex items-center gap-2 px-6 py-3 rounded-lg border border-border bg-card hover:bg-accent text-foreground font-medium transition-colors text-sm"
              >
                Explore the Platform
              </a>
              <Link
                href="/about-developer"
                className="flex items-center gap-2 px-5 py-3 rounded-lg border border-border/80 bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground font-medium transition-colors text-sm"
              >
                About Shivam Sony
              </Link>
            </div>

            {/* Interactive Product Preview */}
            <div id="product-demo" className="pt-10 scroll-mt-24">
              <InteractivePreview />
            </div>
          </div>
        </section>

        {/* Core Features Grid */}
        <section className="py-20 md:py-28 border-b border-border/60 bg-muted/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <h2 className="text-xs font-mono uppercase tracking-widest text-brand-400 font-semibold">
                Architecture & Capabilities
              </h2>
              <h3 className="text-3xl font-bold tracking-tight text-foreground">
                Engineered for High-Stakes Technical Assessments
              </h3>
              <p className="text-sm text-muted-foreground">
                Built from the ground up to replace unreliable screen-shares and subjective guessing with reproducible engineering evidence.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((f, i) => {
                const Icon = f.icon;
                return (
                  <div
                    key={i}
                    className="p-5 rounded-xl bg-card border border-border/80 hover:border-brand-500/40 transition-all hover:shadow-lg hover:shadow-brand-500/5 group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-brand-500/10 text-brand-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h4 className="font-semibold text-foreground text-base mb-2">{f.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{f.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 border-b border-border/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <h2 className="text-xs font-mono uppercase tracking-widest text-brand-400 font-semibold">Workflow</h2>
              <h3 className="text-3xl font-bold tracking-tight text-foreground">
                How Technical Interviews Run on InterviewX
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map((s, idx) => (
                <div key={idx} className="relative p-6 rounded-xl bg-card border border-border space-y-3">
                  <div className="text-3xl font-extrabold font-mono text-brand-500/40">{s.step}</div>
                  <h4 className="text-lg font-bold text-foreground">{s.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Security & Sandbox Section */}
        <section className="py-20 bg-muted/10 border-b border-border/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-border bg-card/80 p-8 sm:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
                    <Shield className="w-4 h-4" />
                    Security & Sandbox Architecture
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-foreground">
                    Untrusted Code Never Compromises the Core Application
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    InterviewX delegates code execution to isolated, ephemeral sandbox runners (Judge0 CE / isolated worker processes) with strictly enforced CPU, memory, and wall-clock time limits.
                  </p>
                  <ul className="space-y-2 text-xs text-muted-foreground font-mono">
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-400 font-bold">✓</span> No arbitrary `eval()` or unconstrained shell execution in Next.js server
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-400 font-bold">✓</span> Secret test cases remain strictly server-side
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-400 font-bold">✓</span> Cryptographic session tokens with role-based server verification
                    </li>
                  </ul>
                  <div className="pt-2">
                    <Link
                      href="/security"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-400 hover:text-brand-300"
                    >
                      Read Complete Security Model & Threat Boundaries <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                <div className="p-6 rounded-xl bg-background border border-border/80 space-y-3 font-mono text-xs">
                  <div className="text-muted-foreground text-[11px] pb-2 border-b border-border flex items-center justify-between">
                    <span>execution_guard.ts</span>
                    <span className="text-emerald-400 font-semibold">Verified Sandbox</span>
                  </div>
                  <p className="text-slate-400">// Execution Boundaries</p>
                  <p className="text-cyan-400">MAX_WALL_TIME_MS = 2500;</p>
                  <p className="text-cyan-400">MAX_MEMORY_KB = 128000; // 128 MB</p>
                  <p className="text-cyan-400">MAX_OUTPUT_BYTES = 32768; // 32 KB</p>
                  <p className="text-slate-400">// Isolation Adapter: Judge0 CE / Worker Sandbox</p>
                  <div className="p-2.5 rounded bg-muted/60 border border-border/50 text-[11px]">
                    <span className="text-emerald-400">Status:</span> Connected and ready for multi-language execution.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              Run better technical interviews.
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
              Move beyond subjective impressions. Evaluate real engineering competence with transparent, deterministic evidence.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/interviews/new"
                className="px-6 py-3 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-medium shadow-md shadow-brand-500/25 transition-all text-sm"
              >
                Schedule an Assessment
              </Link>
              <Link
                href="/dashboard"
                className="px-6 py-3 rounded-lg border border-border bg-card hover:bg-muted text-foreground font-medium transition-colors text-sm"
              >
                Open Demo Dashboard
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
