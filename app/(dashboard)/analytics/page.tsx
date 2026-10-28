import prisma from "@/lib/db/prisma";
import { AnalyticsView } from "@/components/analytics/analytics-view";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const [interviews, submissions, questions, executionJobs] = await Promise.all([
    prisma.interview.findMany(),
    prisma.submission.findMany({
      include: { question: true, testResults: true },
    }),
    prisma.question.findMany({
      include: {
        submissions: true,
        testCases: true,
      },
    }),
    prisma.executionJob.findMany({
      take: 50,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  // Aggregate stats
  const totalInterviews = interviews.length;
  const completedInterviews = interviews.filter((i) => i.status === "COMPLETED" || i.status === "SUBMITTED").length;
  const completionRate = totalInterviews > 0 ? Math.round((completedInterviews / totalInterviews) * 100) : 0;

  const totalSubmissions = submissions.length;
  const passingSubmissions = submissions.filter((s) => s.deterministicScore === s.maxScore).length;
  const passRate = totalSubmissions > 0 ? Math.round((passingSubmissions / totalSubmissions) * 100) : 0;

  // Question calibration calculations
  const questionCalibration = questions.map((q) => {
    const qSubs = q.submissions;
    const qPasses = qSubs.filter((s) => s.deterministicScore === s.maxScore).length;
    const qPassRate = qSubs.length > 0 ? Math.round((qPasses / qSubs.length) * 100) : 100;

    let calibrationNote = "Calibrated";
    if (qSubs.length === 0) calibrationNote = "Insufficient observations";
    else if (qPassRate < 30) calibrationNote = "High Failure Rate — Review Constraints";
    else if (qPassRate > 95) calibrationNote = "High Pass Rate — Benchmark Low Difficulty";

    return {
      id: q.id,
      title: q.title,
      difficulty: q.difficulty,
      submissionCount: qSubs.length,
      passRate: qPassRate,
      calibrationNote,
      timeLimitMs: q.timeLimitMs,
    };
  });

  return (
    <div className="space-y-6">
      <div className="pb-2 border-b border-border">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Assessment Analytics & Reliability
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Data-driven metrics on candidate performance, execution engine latencies, and question calibration.
        </p>
      </div>

      <AnalyticsView
        stats={{
          totalInterviews,
          completedInterviews,
          completionRate,
          totalSubmissions,
          passRate,
          questionCalibration,
        }}
      />
    </div>
  );
}
