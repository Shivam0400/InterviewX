import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/jwt";
import prisma from "@/lib/db/prisma";
import { z } from "zod";

const UpdateUserSchema = z.object({
  role: z.enum(["ADMIN", "INTERVIEWER", "CANDIDATE", "REVIEWER"]).optional(),
  name: z.string().min(2).optional(),
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
    const parsed = UpdateUserSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid role or user parameters." }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: params.id },
      data: parsed.data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
        updatedAt: true,
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: "USER_ROLE_CHANGED",
        resourceType: "USER",
        resourceId: params.id,
        actorId: session.userId,
        actorEmail: session.email,
        metadata: JSON.stringify({ newRole: parsed.data.role }),
      },
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (error) {
    console.error("Admin user update error:", error);
    return NextResponse.json({ error: "Failed to update user." }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: Props) {
  try {
    const session = await getCurrentSession();
    if (session?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized: Administrator privileges required." }, { status: 403 });
    }

    // Prevent deleting own account
    if (session.userId === params.id) {
      return NextResponse.json({ error: "Cannot delete your own active administrator account." }, { status: 400 });
    }

    await prisma.user.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, message: "User account deleted." });
  } catch (error) {
    console.error("Admin user delete error:", error);
    return NextResponse.json({ error: "Failed to delete user." }, { status: 500 });
  }
}
