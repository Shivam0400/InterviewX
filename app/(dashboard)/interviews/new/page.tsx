import { redirect } from "next/navigation";
import prisma from "@/lib/db/prisma";
import { getCurrentSession } from "@/lib/auth/jwt";
import { InterviewCreateForm } from "@/components/interview/interview-create-form";

export const dynamic = "force-dynamic";

export default async function NewInterviewPage() {
  const session = await getCurrentSession();

  // Enforce RBAC: Candidates cannot schedule interviews
  if (session?.role === "CANDIDATE") {
    redirect("/dashboard");
  }
  const questions = await prisma.question.findMany({
    where: { visibility: "PUBLIC" },
    orderBy: { difficulty: "asc" },
    select: {
      id: true,
      title: true,
      slug: true,
      difficulty: true,
      topicTags: true,
      description: true,
      timeLimitMs: true,
    },
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="pb-2 border-b border-border">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Schedule Technical Interview
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Configure session parameters, candidate invitation details, and challenge questions.
        </p>
      </div>

      <InterviewCreateForm availableQuestions={questions} />
    </div>
  );
}
