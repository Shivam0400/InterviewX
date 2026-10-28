import prisma from "@/lib/db/prisma";
import { notFound } from "next/navigation";
import { getCurrentSession } from "@/lib/auth/jwt";
import { MockPracticeWorkspace } from "@/components/practice/mock-practice-workspace";

export const dynamic = "force-dynamic";

interface Props {
  params: { slug: string };
}

export default async function PracticeQuestionPage({ params }: Props) {
  const session = await getCurrentSession();

  const question = await prisma.question.findUnique({
    where: { slug: params.slug },
    include: {
      testCases: {
        where: { isHidden: false },
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  if (!question) {
    notFound();
  }

  return <MockPracticeWorkspace question={question} user={session} />;
}
