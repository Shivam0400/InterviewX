import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { InterviewXLogo, InterviewXBrand } from "@/components/brand/logo";
import {
  GraduationCap,
  Briefcase,
  Terminal,
  ExternalLink,
  Code2,
  Database,
  Cpu,
  Layers,
  Sparkles,
  CheckCircle2,
  Globe,
  ArrowRight,
  Mail,
  Github,
  Home,
  ShieldCheck,
  Zap,
} from "lucide-react";

export const metadata = {
  title: "About the Developer — Shivam Sony | InterviewX",
  description:
    "Learn about Shivam Sony, Computer Science and Data Science student at Government Engineering College, Jamui, and creator of InterviewX.",
};

export default function AboutDeveloperPage() {
  const technicalInterests = [
    {
      category: "Data & Systems Architecture",
      skills: ["Python", "SQL & Stored Procedures", "Database Design & Normalization", "ETL Pipelines", "Data Quality Auditing"],
      icon: Database,
    },
    {
      category: "AI & Machine Learning",
      skills: ["Gemini 1.5 LLM Probes", "Structured Output Validation (Zod)", "AST Algorithmic Heuristics", "Prompt Engineering"],
      icon: Cpu,
    },
    {
      category: "Full-Stack Web Engineering",
      skills: ["TypeScript", "Next.js 14 (App Router)", "React", "Tailwind CSS", "Prisma ORM", "Monaco Editor"],
      icon: Code2,
    },
    {
      category: "Enterprise Workflows",
      skills: ["SAP Business One", "SQL Server", "Procurement & Inventory Flows", "Material Master Records"],
      icon: Layers,
    },
  ];

  const coreArchitecturePillars = [
    {
      title: "Deterministic AST & Syscall Isolation",
      desc: "Engineered dual-adapter code execution with Judge0 CE and ephemeral worker sandboxes enforcing strict 128MB cgroup memory bounds and 2500ms wall-clock timeouts.",
    },
    {
      title: "Lock-Free Real-time Synchrony",
      desc: "Architected collaborative live coding with low-latency document state synchronization, authoritative server countdown timers, and live candidate presence.",
    },
    {
      title: "Zero-Leak Hidden Test Verification",
      desc: "Engineered strict cryptographic isolation between public sample suites and confidential server-evaluated verification test suites.",
    },
    {
      title: "Responsible AI Advisory Engine",
      desc: "Integrated Google Gemini 1.5 with strict Zod schema parsing to supply complexity analysis, invariant hints, and dynamic interviewer follow-up questions.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-brand-500/20">
      <Navbar />

      <main className="flex-1 py-12 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Breadcrumb / Homepage Navigation */}
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
            <Link href="/" className="hover:text-foreground flex items-center gap-1 transition-colors">
              <Home className="w-3.5 h-3.5 text-brand-400" />
              <span>Home</span>
            </Link>
            <span>/</span>
            <span className="text-foreground font-semibold">About the Developer</span>
          </div>

          {/* Hero Section with Shivam Sony's Portrait */}
          <section className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-brand-500/10 text-brand-400 border border-brand-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Principal Architect & Full-Stack Engineer Profile
            </div>

            <div className="flex flex-col-reverse md:flex-row md:items-center justify-between gap-8 pt-2">
              <div className="space-y-4 max-w-2xl">
                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
                  Building intelligent systems that solve{" "}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-400 via-indigo-500 to-cyan-400">
                    real problems.
                  </span>
                </h1>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                  Hi, I’m <strong className="text-foreground font-semibold">Shivam Sony</strong>. I am a Computer Science & Data Science student at Government Engineering College, Jamui, passionate about architecting scalable software, high-throughput database systems, and isolated execution engines.
                </p>

                {/* Direct Contact Info & Email */}
                <div className="pt-1 flex flex-wrap items-center gap-4 text-xs font-mono">
                  <a
                    href="mailto:shivamjais.op09@gmail.com"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border text-foreground hover:border-brand-500 transition-colors shadow-2xs"
                  >
                    <Mail className="w-3.5 h-3.5 text-brand-400" />
                    <span>shivamjais.op09@gmail.com</span>
                  </a>
                  <a
                    href="https://github.com/Shivam0400"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border text-foreground hover:border-brand-500 transition-colors shadow-2xs"
                  >
                    <Github className="w-3.5 h-3.5 text-brand-400" />
                    <span>github.com/Shivam0400</span>
                  </a>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-3">
                  <a
                    href="https://shivam-portfolio-eosin-mu.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-medium text-xs shadow-md shadow-brand-500/20 transition-all"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    Visit Live Portfolio
                    <ExternalLink className="w-3 h-3 ml-0.5" />
                  </a>
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-card hover:bg-muted text-foreground font-medium text-xs transition-colors"
                  >
                    <Zap className="w-3.5 h-3.5 text-brand-400" />
                    Explore Live Platform
                  </Link>
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground font-medium text-xs transition-colors"
                  >
                    <Home className="w-3.5 h-3.5" />
                    Homepage
                  </Link>
                </div>
              </div>

              {/* Developer Portrait Image with Glowing Frame & Badges */}
              <div className="shrink-0 flex items-center justify-center">
                <div className="relative group">
                  {/* Glowing background ring */}
                  <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-cyan-400 opacity-60 blur-lg group-hover:opacity-100 transition-opacity duration-300"></div>

                  <div className="relative w-44 h-44 sm:w-48 sm:h-48 rounded-2xl bg-card border-2 border-brand-500/40 p-1.5 overflow-hidden shadow-2xl flex flex-col items-center justify-center bg-gradient-to-b from-card to-background">
                    {/* Real Profile Image with fallback styling */}
                    <div className="relative w-full h-full rounded-xl overflow-hidden bg-muted/40">
                      <img
                        src="/images/shivam-soni.png"
                        alt="Shivam Sony"
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </div>

                  {/* Active Status Badge */}
                  <div className="absolute -bottom-2 -right-2 px-3 py-1 rounded-full bg-background border border-emerald-500/40 text-emerald-400 text-[11px] font-mono shadow-md flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    <span>Lead Architect</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Education & Academic Background */}
          <section className="p-6 sm:p-8 rounded-xl bg-card border border-border/80 space-y-4">
            <div className="flex items-center gap-2.5 text-brand-400">
              <GraduationCap className="w-5 h-5" />
              <h2 className="text-lg font-bold text-foreground">Academic Rigor & Engineering Foundations</h2>
            </div>
            <div className="border-l-2 border-brand-500/40 pl-4 space-y-1.5">
              <h3 className="text-base font-semibold text-foreground">
                Bachelor of Technology in Computer Science & Engineering
              </h3>
              <p className="text-xs text-brand-400 font-mono">
                Specialization in Data Science • Government Engineering College, Jamui
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                Coursework emphasizes algorithmic complexity, data structures, relational database management, data science foundations, machine learning architectures, and distributed systems. Focused on connecting analytical mathematical rigor with hands-on full-stack product development.
              </p>
            </div>
          </section>

          {/* Professional Experience */}
          <section className="p-6 sm:p-8 rounded-xl bg-card border border-border/80 space-y-6">
            <div className="flex items-center gap-2.5 text-brand-400">
              <Briefcase className="w-5 h-5" />
              <h2 className="text-lg font-bold text-foreground">Professional Industry Experience</h2>
            </div>

            <div className="space-y-4">
              <div className="border-l-2 border-brand-500/40 pl-4 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-base font-semibold text-foreground">
                    Data Analyst Intern
                  </h3>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground">
                    SteamHouse India Limited
                  </span>
                </div>
                <p className="text-xs text-muted-foreground font-mono">
                  Enterprise Data Analytics, SQL Stored Procedures & Business Process Optimization
                </p>

                <ul className="space-y-2 text-xs text-muted-foreground leading-relaxed pt-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-400 mt-0.5 shrink-0" />
                    <span>
                      <strong>SAP Business One & SQL Server:</strong> Worked with enterprise database schemas and SQL Server instances, querying, testing, and documenting complex SQL stored procedures.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-400 mt-0.5 shrink-0" />
                    <span>
                      <strong>Cross-Functional Business Workflows:</strong> Analyzed end-to-end data flows across procurement, vendor purchasing, sales orders, inventory valuation, finance reconciliation, and executive operational reporting.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-400 mt-0.5 shrink-0" />
                    <span>
                      <strong>Material Master Data Quality:</strong> Helped audit and systematically improve material master records across large datasets, enhancing categorization, standardizing descriptions, and adding critical business remarks to minimize procurement inaccuracies.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Technical Disciplines & Interests */}
          <section className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-foreground">Technical Disciplines & Stack Proficiency</h2>
              <p className="text-xs text-muted-foreground">
                Technologies and conceptual domains applied across engineering projects and research.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {technicalInterests.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="p-5 rounded-xl bg-card border border-border/80 space-y-3">
                    <div className="flex items-center gap-2 text-brand-400">
                      <Icon className="w-4 h-4" />
                      <h3 className="font-semibold text-foreground text-sm">{item.category}</h3>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {item.skills.map((s, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-muted/60 text-foreground border border-border/60"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Featured Architecture: InterviewX */}
          <section className="p-6 sm:p-8 rounded-xl bg-card border border-brand-500/30 shadow-lg shadow-brand-500/5 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <InterviewXLogo size="sm" />
                <h2 className="text-lg font-bold text-foreground">Flagship System: InterviewX Platform</h2>
              </div>
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20">
                Full-Stack Architecture
              </span>
            </div>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              InterviewX was designed and engineered by Shivam Sony as a production-grade live technical assessment platform to replace subjective whiteboard interviews with reproducible, evidence-based evaluation.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {coreArchitecturePillars.map((pillar, i) => (
                <div key={i} className="p-4 rounded-lg bg-background border border-border/70 space-y-1.5">
                  <h4 className="text-xs font-semibold text-foreground">{pillar.title}</h4>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{pillar.desc}</p>
                </div>
              ))}
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-medium">
              <Link
                href="/dashboard"
                className="text-brand-400 hover:underline flex items-center gap-1"
              >
                Launch Live Interview Workspace <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/security"
                className="text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                View Sandbox Threat Model <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/"
                className="text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                <Home className="w-3.5 h-3.5" />
                Return to Starting Homepage
              </Link>
            </div>
          </section>

          {/* Portfolio & Verified Links */}
          <section className="p-6 rounded-xl bg-muted/30 border border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-foreground text-sm">Online Portfolio & Direct Profiles</h3>
              <p className="text-xs text-muted-foreground">
                Connect with Shivam Sony directly or explore live deployed applications.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="mailto:shivamjais.op09@gmail.com"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-600 text-white text-xs font-medium hover:bg-brand-500 transition-colors shadow-sm"
              >
                <Mail className="w-3.5 h-3.5" />
                shivamjais.op09@gmail.com
              </a>
              <a
                href="https://shivam-portfolio-eosin-mu.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-foreground text-background text-xs font-medium hover:opacity-90 transition-opacity"
              >
                <Globe className="w-3.5 h-3.5" />
                shivam-portfolio.vercel.app
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
