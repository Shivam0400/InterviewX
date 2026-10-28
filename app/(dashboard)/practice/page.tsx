import Link from "next/link";
import prisma from "@/lib/db/prisma";
import { getCurrentSession } from "@/lib/auth/jwt";
import {
  Code2,
  Sparkles,
  ArrowRight,
  Play,
  CheckCircle2,
  Cpu,
  Clock,
  Layers,
  Terminal,
  BookOpen,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PracticePage() {
  const session = await getCurrentSession();

  const questions = await prisma.question.findMany({
    where: { visibility: "PUBLIC" },
    orderBy: { difficulty: "asc" },
    include: {
      testCases: {
        where: { isHidden: false },
      },
    },
  });

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="pb-4 border-b border-border space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-brand-500/10 text-brand-400 border border-brand-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          Candidate Mock Preparation & Sandbox
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Algorithmic Practice & Mock Interview Prep
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
          Prepare for your technical assessment in our isolated Monaco Editor sandbox. Write real code, execute against verified test cases, and study optimal space-time complexities with zero penalty.
        </p>
      </div>

      {/* Practice Sandbox Benefits */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-card border border-border/80 space-y-1.5">
          <div className="flex items-center gap-2 text-brand-400">
            <Cpu className="w-4 h-4" />
            <h3 className="font-semibold text-xs text-foreground">Isolated Sandbox Engine</h3>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Runs code in isolated workers with strict 128MB RAM and 2.5s timeouts, matching live assessment environments.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border/80 space-y-1.5">
          <div className="flex items-center gap-2 text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <h3 className="font-semibold text-xs text-foreground">Deterministic Test Validation</h3>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Instantly run and verify solutions against public test vectors with detailed stdout output and latency metrics.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border/80 space-y-1.5">
          <div className="flex items-center gap-2 text-purple-400">
            <Sparkles className="w-4 h-4" />
            <h3 className="font-semibold text-xs text-foreground">AI Algorithmic Copilot</h3>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Request structured hints and Big-O asymptotic analysis powered by Google Gemini 1.5.
          </p>
        </div>
      </div>

      {/* Questions Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-brand-400" />
            <span>Practice Challenges ({questions.length})</span>
          </h2>
          <span className="text-xs font-mono text-muted-foreground">
            Competitive Programming Header Stubs Included
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {questions.map((q) => {
            const tags = JSON.parse(q.topicTags || "[]");
            return (
              <div
                key={q.id}
                className="p-5 rounded-xl bg-card border border-border/80 hover:border-brand-500/40 transition-all flex flex-col justify-between space-y-4 shadow-sm group hover:-translate-y-0.5"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                        q.difficulty === "HARD"
                          ? "bg-red-500/10 text-red-400 border-red-500/20"
                          : q.difficulty === "MEDIUM"
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      }`}
                    >
                      {q.difficulty}
                    </span>
                    <span className="text-[11px] font-mono text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {q.timeLimitMs}ms
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-foreground group-hover:text-brand-400 transition-colors">
                    {q.title}
                  </h3>

                  <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                    {q.description.replace(/###/g, "").replace(/`/g, "")}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-border/60">
                  <div className="flex flex-wrap gap-1">
                    {tags.slice(0, 3).map((t: string, i: number) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-muted text-muted-foreground"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={`/practice/${q.slug}`}
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-sm transition-all group-hover:shadow-brand-500/25"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Start Mock Practice</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
