import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/jwt";
import prisma from "@/lib/db/prisma";
import { z } from "zod";

const UpdateInterviewSchema = z.object({
  status: z.enum([
    "DRAFT",
    "SCHEDULED",
    "READY",
    "IN_PROGRESS",
    "SUBMITTED",
    "UNDER_REVIEW",
    "COMPLETED",
    "CANCELLED",
    "EXPIRED",
  ]).optional(),
});

interface Props {
  params: { id: string };
}

export async function PATCH(req: Request, { params }: Props) {
  try {
    const session = await getCurrentSession();
    if (session?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized: Administrator privileges required." }, { status: 403 });
    }

    const body = await req.json();
    const parsed = UpdateInterviewSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid interview status." }, { status: 400 });
    }

    const updated = await prisma.interview.update({
      where: { id: params.id },
      data: parsed.data,
    });

    return NextResponse.json({ success: true, interview: updated });
  } catch (error) {
    console.error("Admin interview update error:", error);
    return NextResponse.json({ error: "Failed to update interview." }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: Props) {
  try {
    const session = await getCurrentSession();
    if (session?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized: Administrator privileges required." }, { status: 403 });
    }

    await prisma.interview.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, message: "Interview deleted successfully." });
  } catch (error) {
    console.error("Admin interview delete error:", error);
    return NextResponse.json({ error: "Failed to delete interview." }, { status: 500 });
  }
}
