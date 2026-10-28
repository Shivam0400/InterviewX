import { redirect } from "next/navigation";
import prisma from "@/lib/db/prisma";
import { getCurrentSession } from "@/lib/auth/jwt";
import { AdminPanelView } from "@/components/admin/admin-panel-view";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Control Center — InterviewX",
  description: "Platform governance, user management, and interview oversight for InterviewX administrator Shivam Sony.",
};

export default async function AdminPage() {
  const session = await getCurrentSession();

  // Enforce strict root administrator role
  if (session?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  // Fetch all system resources
  const [users, interviews, questions, submissions] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.interview.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        interviewer: {
          select: { name: true, email: true },
        },
      },
    }),
    prisma.question.findMany({
      orderBy: { createdAt: "desc" },
    }),
    prisma.submission.findMany({
      take: 10,
      orderBy: { submittedAt: "desc" },
    }),
  ]);

  return (
    <AdminPanelView
      initialUsers={users}
      initialInterviews={interviews}
      initialQuestions={questions}
      initialSubmissions={submissions}
      adminUser={session}
    />
  );
}
