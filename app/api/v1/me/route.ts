import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/jwt";
import { prisma } from "@/lib/db/prisma";
import { PERMISSIONS } from "@/lib/auth/rbac";

export async function GET() {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatarUrl: true,
      createdAt: true,
    },
  });

  if (!user) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }

  const userRole = user.role as keyof typeof PERMISSIONS;
  const permissions = PERMISSIONS[userRole] || [];

  return NextResponse.json({
    authenticated: true,
    user,
    permissions,
  });
}
