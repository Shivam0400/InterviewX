import { notFound } from "next/navigation";
import prisma from "@/lib/db/prisma";
import { getCurrentSession } from "@/lib/auth/jwt";
import { WorkspaceView } from "@/components/workspace/workspace-view";

export const dynamic = "force-dynamic";

export default async function InterviewWorkspacePage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: { token?: string };
}) {
  const session = await getCurrentSession();
  const token = searchParams?.token;

  const interview = await prisma.interview.findUnique({
    where: { id: params.id },
    include: {
      interviewer: {
        select: { id: true, name: true, email: true },
      },
      questions: {
        include: {
          question: {
            include: {
              testCases: {
                where: { isHidden: false }, // Only public test cases sent to browser
                orderBy: { sortOrder: "asc" },
              },
            },
          },
        },
        orderBy: { orderIndex: "asc" },
      },
    },
  });

  if (!interview) {
    notFound();
  }

  // Verify access: either matching session, interview owner, or valid inviteToken
  const isInterviewer = session?.role === "INTERVIEWER" || session?.role === "ADMIN";
  const isValidToken = token && token === interview.inviteToken;
  const isAssignedCandidate = session?.email === interview.candidateEmail;

  if (!isInterviewer && !isValidToken && !isAssignedCandidate) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="max-w-md w-full p-6 rounded-xl bg-card border border-destructive/30 space-y-3 text-center shadow-lg">
          <div className="w-10 h-10 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto font-bold">
            !
          </div>
          <h2 className="text-lg font-bold text-foreground">Access Restricted</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            This interview session is private. To access this workspace, please use the secure invitation link provided in your candidate invitation or sign in with your interviewer account.
          </p>
          <div className="pt-2">
            <a
              href="/sign-in"
              className="inline-block px-4 py-2 rounded-lg bg-brand-600 text-white text-xs font-semibold"
            >
              Sign In to Platform
            </a>
          </div>
        </div>
      </div>
    );
  }

  const currentUser = {
    id: session?.userId || `candidate-${interview.candidateName.toLowerCase().replace(/\s+/g, "-")}`,
    name: isInterviewer ? session?.name || interview.interviewer.name : interview.candidateName,
    role: isInterviewer ? ("INTERVIEWER" as const) : ("CANDIDATE" as const),
    email: isInterviewer ? session?.email || interview.interviewer.email : interview.candidateEmail,
  };

  return (
    <WorkspaceView
      interview={interview}
      currentUser={currentUser}
    />
  );
}
