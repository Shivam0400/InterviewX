import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/jwt";
import prisma from "@/lib/db/prisma";
import { z } from "zod";

const UpdateQuestionSchema = z.object({
  visibility: z.enum(["PUBLIC", "ARCHIVED"]).optional(),
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
    const parsed = UpdateQuestionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid question update parameters." }, { status: 400 });
    }

    const updated = await prisma.question.update({
      where: { id: params.id },
      data: parsed.data,
    });

    return NextResponse.json({ success: true, question: updated });
  } catch (error) {
    console.error("Admin question update error:", error);
    return NextResponse.json({ error: "Failed to update question." }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: Props) {
  try {
    const session = await getCurrentSession();
    if (session?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized: Administrator privileges required." }, { status: 403 });
    }

    await prisma.question.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, message: "Question deleted from library." });
  } catch (error) {
    console.error("Admin question delete error:", error);
    return NextResponse.json({ error: "Failed to delete question." }, { status: 500 });
  }
}
