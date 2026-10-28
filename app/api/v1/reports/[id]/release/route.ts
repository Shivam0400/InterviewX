import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { getCurrentSession } from "@/lib/auth/jwt";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getCurrentSession();

    const report = await prisma.assessmentReport.update({
      where: { id: params.id },
      data: {
        status: "RELEASED",
        releasedAt: new Date(),
        reviewerId: session?.userId || null,
      },
    });

    await prisma.auditLog.create({
      data: {
        actorId: session?.userId || null,
        actorEmail: session?.email || "system",
        action: "REPORT_RELEASED",
        resourceType: "ASSESSMENT_REPORT",
        resourceId: params.id,
      },
    });

    return NextResponse.json({ success: true, report });
  } catch (error) {
    console.error("Release Report Error:", error);
    return NextResponse.json({ error: "Failed to release report" }, { status: 500 });
  }
}
