import Link from "next/link";
import prisma from "@/lib/db/prisma";
import { getCurrentSession } from "@/lib/auth/jwt";
import {
  Code2,
  PlusCircle,
  Clock,
  Cpu,
  CheckCircle2,
  ChevronRight,
  Search,
  Filter,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function QuestionsPage({
  searchParams,
}: {
  searchParams?: { difficulty?: string; search?: string };
}) {
  const session = await getCurrentSession();
  const filterDifficulty = searchParams?.difficulty || "ALL";

  const where: any = { visibility: "PUBLIC" };
  if (filterDifficulty !== "ALL") {
    where.difficulty = filterDifficulty;
  }

  const questions = await prisma.question.findMany({
    where,
    orderBy: { difficulty: "asc" },
    include: {
      testCases: true,
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Assessment Question Library
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Curated programming challenges, test suites, and reference starter templates.
          </p>
        </div>

        <Link
          href="/questions/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-sm transition-all"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          Create Question
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border pb-3 text-xs">
        {["ALL", "EASY", "MEDIUM", "HARD"].map((diff) => (
          <Link
            key={diff}
            href={`/questions${diff === "ALL" ? "" : `?difficulty=${diff}`}`}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filterDifficulty === diff
                ? "bg-brand-600 text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground bg-card border border-border"
            }`}
          >
            {diff}
          </Link>
        ))}
      </div>

      {/* Question Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {questions.map((q) => {
          let tags: string[] = [];
          try {
            tags = JSON.parse(q.topicTags || "[]");
          } catch {
            tags = [];
          }

          const publicTests = q.testCases.filter((tc) => !tc.isHidden);
          const hiddenTests = q.testCases.filter((tc) => tc.isHidden);

          return (
            <div
              key={q.id}
              className="p-5 rounded-xl bg-card border border-border/80 hover:border-brand-500/40 transition-all flex flex-col justify-between gap-4 shadow-sm"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-semibold ${
                      q.difficulty === "EASY"
                        ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                        : q.difficulty === "MEDIUM"
                        ? "text-amber-400 bg-amber-500/10 border border-amber-500/20"
                        : "text-red-400 bg-red-500/10 border border-red-500/20"
                    }`}
                  >
                    {q.difficulty}
                  </span>

                  <span className="text-[11px] font-mono text-muted-foreground">
                    Timeout: {q.timeLimitMs}ms
                  </span>
                </div>

                <h3 className="font-bold text-foreground text-base">
                  {q.title}
                </h3>

                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {q.description.replace(/[#*`]/g, "")}
                </p>

                {/* Topic tags */}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {tags.map((t, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-muted text-muted-foreground border border-border/60"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
                  <span>{publicTests.length} public tests</span>
                  <span>•</span>
                  <span>{hiddenTests.length} hidden tests</span>
                </div>

                <Link
                  href={`/questions/${q.id}`}
                  className="flex items-center gap-1 font-semibold text-brand-400 hover:text-brand-300"
                >
                  View Details <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
