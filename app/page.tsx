import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { InteractivePreview } from "@/components/marketing/interactive-preview";
import { InterviewXLogo, InterviewXBrand } from "@/components/brand/logo";
import {
  Code2,
  Cpu,
  CheckCircle,
  Sparkles,
  Users2,
  BarChart3,
  Shield,
  FileText,
  ArrowRight,
  Zap,
  Layers,
  Terminal,
  Server,
  Lock,
  Binary,
  Workflow,
  ExternalLink,
} from "lucide-react";

export default function HomePage() {
  const deepTechPillars = [
    {
      icon: Cpu,
      title: "Deterministic AST & Syscall Isolation",
      badge: "SECCOMP & CGROUP",
      description:
        "Every execution runs in an ephemeral, memory-bounded (128MB) kernel sandbox with strict Linux seccomp-bpf syscall filtering and a 2500ms hard deadline.",
    },
    {
      icon: Code2,
      title: "Differential AST & Complexity Analysis",
      badge: "STATIC PROFILING",
      description:
        "Parses multi-language abstract syntax trees across Python, TypeScript, C++, and Java to evaluate cyclomatic complexity, invariant preservation, and dead-code branches.",
    },
    {
      icon: Workflow,
      title: "Conflict-Free WebSocket Synchrony",
      badge: "VECTOR CLOCKS",
      description:
        "Low-latency document state replication with vector clocks, authoritative server-side countdown timers, and resilient presence heartbeats.",
    },
    {
      icon: Lock,
      title: "Zero-Leak Cryptographic Invariants",
      badge: "HMAC-SHA256",
      description:
        "Confidential test matrices remain strictly server-side. Session invite tokens are generated with high-entropy cryptographic hashes (e.g. IVX-BLR-8492-RM).",
    },
    {
      icon: Binary,
      title: "Amortized Big-O Heuristic Engine",
      badge: "O(1) TO O(N LOG N)",
      description:
        "Subject candidate solutions to synthetic input workloads scaling up to N = 10^5 to detect sub-optimal quadratic regressions and asymptotic bottlenecks.",
    },
    {
      icon: Sparkles,
      title: "Gemini 1.5 Cognitive Advisory",
      badge: "STRUCTURED ZOD SCHEMAS",
      description:
        "Harnesses Google Gemini 1.5 with strictly validated Zod output schemas to suggest algorithmic probes and edge-case hints without replacing human judgment.",
    },
    {
      icon: BarChart3,
      title: "Evidence-Based Psychometric Analytics",
      badge: "P99 LATENCIES",
      description:
        "Analyzes cohort score distributions, question discrimination coefficients, compile failure ratios, and execution latency trends.",
    },
    {
      icon: FileText,
      title: "Tamper-Evident Assessment Dossiers",
      badge: "IMMUTABLE AUDIT",
      description:
        "Generates reproducible audit dossiers combining machine-verified AST metrics, test pass vectors, and interviewer qualitative scoring.",
    },
  ];

  const workflowPhases = [
    {
      step: "01",
      title: "Calibrate & Select Algorithmic Challenges",
      metric: "AST Difficulty Mapping",
      description:
        "Select challenges from the curated question library with pre-configured competitive programming stubs, customized language runtimes, and memory thresholds.",
    },
    {
      step: "02",
      title: "Dispatch High-Entropy Invite Tokens",
      metric: "HMAC-Signed Session",
      description:
        "Generate a cryptographically random, expiring session invite token (e.g. IVX-BLR-8492-RM) allowing frictionless candidate access with zero setup.",
    },
    {
      step: "03",
      title: "Isolated Execution & Evidence Generation",
      metric: "Sub-40ms P99 Sandbox",
      description:
        "Execute candidate code against public test vectors and confidential server-evaluated verification suites, with real-time AI advisory follow-ups.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-brand-500/20">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section with Animations */}
        <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 border-b border-border/60">
          <div className="absolute inset-0 gradient-glow pointer-events-none -z-10 animate-pulse-glow" />

          {/* Background Animated Floating Blobs */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-brand-600/10 blur-[130px] rounded-full pointer-events-none -z-10" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            {/* Unique Brand Logo Hero Mark */}
            <div className="flex justify-center mb-2">
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs font-mono bg-brand-500/10 text-brand-400 border border-brand-500/20 shadow-sm transition-transform hover:scale-105">
                <InterviewXLogo size="xs" glow={false} />
                <span className="font-semibold">InterviewX Platform v1.0</span>
                <span className="text-muted-foreground hidden sm:inline">• Deterministic AST & Syscall Isolation</span>
              </div>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-foreground max-w-4xl mx-auto leading-tight sm:leading-none">
              Technical interviews, <br className="hidden sm:inline" />
              <span className="shimmer-text">
                built on evidence.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto font-normal leading-relaxed">
              A production-grade technical assessment platform combining isolated multi-language sandboxes, conflict-free collaborative code editing, and AI-assisted engineering advisory.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/interviews/new"
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 active:scale-95 text-white font-medium shadow-lg shadow-brand-500/25 transition-all text-sm group"
              >
                <Zap className="w-4 h-4 fill-white" />
                Schedule Interview
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl border border-border bg-card/80 hover:bg-accent text-foreground font-medium transition-all text-sm hover:shadow-md"
              >
                <Terminal className="w-4 h-4 text-brand-400" />
                Open Live Platform
              </Link>
              <Link
                href="/about-developer"
                className="flex items-center gap-2 px-5 py-3.5 rounded-xl border border-border/80 bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground font-medium transition-all text-sm"
              >
                <img
                  src="/images/shivam-soni.png"
                  alt="Shivam Sony"
                  className="w-4 h-4 rounded-full object-cover"
                />
                About Shivam Sony
              </Link>
            </div>

            {/* Quick Metrics Bar with Unique CS / Systems Terminology */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-mono text-muted-foreground">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-muted/40 border border-border/60">
                <span className="text-foreground font-bold text-sm">2500ms</span>
                <span>SECCOMP Wall Timeout</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-muted/40 border border-border/60">
                <span className="text-emerald-400 font-bold text-sm">128MB</span>
                <span>Cgroup Memory Bound</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-muted/40 border border-border/60">
                <span className="text-brand-400 font-bold text-sm">100%</span>
                <span>Deterministic AST Scoring</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-muted/40 border border-border/60">
                <span className="text-purple-400 font-bold text-sm">O(1)</span>
                <span>Zero Secret Leakage</span>
              </div>
            </div>

            {/* Quick Section Anchor Jump Bar */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-2 text-xs font-mono text-muted-foreground">
              <span className="text-muted-foreground/60">Explore:</span>
              <a href="#demo" className="px-2.5 py-1 rounded bg-card hover:bg-muted border border-border/60 text-foreground transition-colors">
                #LiveWorkspace
              </a>
              <a href="#architecture" className="px-2.5 py-1 rounded bg-card hover:bg-muted border border-border/60 text-foreground transition-colors">
                #SystemArchitecture
              </a>
              <a href="#workflow" className="px-2.5 py-1 rounded bg-card hover:bg-muted border border-border/60 text-foreground transition-colors">
                #ExecutionWorkflow
              </a>
              <a href="#security" className="px-2.5 py-1 rounded bg-card hover:bg-muted border border-border/60 text-foreground transition-colors">
                #SecurityModel
              </a>
            </div>

            {/* Interactive Product Preview with Floating Badges */}
            <div id="demo" className="pt-8 scroll-mt-24 relative">
              <div className="animate-float">
                <InteractivePreview />
              </div>
            </div>
          </div>
        </section>

        {/* Core Architecture & Technical Capabilities Grid */}
        <section id="architecture" className="py-20 md:py-28 border-b border-border/60 bg-muted/20 scroll-mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-brand-500/10 text-brand-400 border border-brand-500/20">
                System Design & Distributed Sandboxes
              </div>
              <h3 className="text-3xl font-bold tracking-tight text-foreground">
                Engineered for High-Stakes Technical Assessments
              </h3>
              <p className="text-sm text-muted-foreground">
                Built to eliminate subjective impressions with mathematically deterministic code evaluation, isolated execution, and low-latency synchrony.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {deepTechPillars.map((pillar, i) => {
                const Icon = pillar.icon;
                return (
                  <div
                    key={i}
                    className="p-5 rounded-xl bg-card border border-border/80 hover:border-brand-500/50 transition-all hover:shadow-xl hover:shadow-brand-500/10 hover:-translate-y-1 group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-lg bg-brand-500/10 text-brand-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-brand-600 group-hover:text-white transition-all shadow-sm">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border/60">
                          {pillar.badge}
                        </span>
                      </div>
                      <h4 className="font-semibold text-foreground text-sm mb-2 group-hover:text-brand-400 transition-colors">
                        {pillar.title}
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">{pillar.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Workflow Pipeline */}
        <section id="workflow" className="py-20 border-b border-border/60 scroll-mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <h2 className="text-xs font-mono uppercase tracking-widest text-brand-400 font-semibold">
                Lifecycle Orchestration
              </h2>
              <h3 className="text-3xl font-bold tracking-tight text-foreground">
                How Technical Interviews Run on InterviewX
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {workflowPhases.map((s, idx) => (
                <div
                  key={idx}
                  className="relative p-6 rounded-xl bg-card border border-border space-y-3 hover:border-brand-500/40 transition-all hover:-translate-y-0.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-extrabold font-mono text-brand-500/40">{s.step}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20">
                      {s.metric}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-foreground">{s.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{s.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Security & Sandbox Section */}
        <section id="security" className="py-20 bg-muted/10 border-b border-border/60 scroll-mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-border bg-card/80 p-8 sm:p-12 shadow-sm">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
                    <Shield className="w-4 h-4" />
                    Zero-Trust Sandbox Architecture
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-foreground">
                    Untrusted Candidate Code Never Compromises the Host Infrastructure
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    InterviewX delegates code execution to isolated, ephemeral worker runners with strict SECCOMP syscall restrictions, cgroup memory enforcement, and zero host network access.
                  </p>
                  <ul className="space-y-2 text-xs text-muted-foreground font-mono">
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-400 font-bold">✓</span> Zero unconstrained `eval()` or child shell forks inside the Next.js process
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-400 font-bold">✓</span> Hidden evaluation suites are strictly server-side and never sent to candidate browsers
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-400 font-bold">✓</span> Cryptographic token validation with Jose JWT and role-based policy enforcement
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

                <div className="p-6 rounded-xl bg-background border border-border/80 space-y-3 font-mono text-xs shadow-inner">
                  <div className="text-muted-foreground text-[11px] pb-2 border-b border-border flex items-center justify-between">
                    <span>execution_guard.ts</span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      Verified Sandbox
                    </span>
                  </div>
                  <p className="text-slate-400">// Invariant & Isolation Bounds</p>
                  <p className="text-cyan-400">MAX_WALL_TIME_MS = 2500; // Hard kill</p>
                  <p className="text-cyan-400">MAX_MEMORY_KB = 128000; // 128 MB Cgroup</p>
                  <p className="text-cyan-400">MAX_OUTPUT_BYTES = 32768; // 32 KB Truncation</p>
                  <p className="text-slate-400">// Isolation: Judge0 CE / SECCOMP Ephemeral Worker</p>
                  <div className="p-2.5 rounded bg-muted/60 border border-border/50 text-[11px]">
                    <span className="text-emerald-400">Engine Health:</span> Ready across Python 3.10, Node.js 20, TypeScript, C++17, and Java 17.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Developer Showcase Card */}
        <section className="py-16 border-b border-border/60 bg-muted/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="p-6 sm:p-8 rounded-2xl bg-card border border-brand-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl shadow-brand-500/5">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-brand-500/40 shrink-0">
                  <img
                    src="/images/shivam-soni.png"
                    alt="Shivam Sony"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-foreground text-base">Shivam Sony</h3>
                    <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20">
                      Creator & Architect
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    B.Tech CS & Data Science • GEC Jamui • shivamjais.op09@gmail.com
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Link
                  href="/about-developer"
                  className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
                >
                  <span>View Full Profile</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <a
                  href="https://shivam-portfolio-eosin-mu.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 rounded-lg border border-border bg-card hover:bg-muted text-foreground text-xs font-medium transition-colors flex items-center gap-1"
                >
                  <span>Portfolio</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="flex justify-center">
              <InterviewXLogo size="lg" glow={true} />
            </div>
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
              <Link
                href="/"
                className="px-6 py-3 rounded-lg border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground font-medium transition-colors text-sm"
              >
                Return to Top
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
