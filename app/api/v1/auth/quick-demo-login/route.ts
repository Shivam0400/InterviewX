import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { signToken, COOKIE_NAME } from "@/lib/auth/jwt";
import { z } from "zod";

const DemoRoleSchema = z.object({
  role: z.enum(["ADMIN", "INTERVIEWER", "CANDIDATE", "REVIEWER"]),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = DemoRoleSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid demo role selected." }, { status: 400 });
    }

    const { role } = parsed.data;

    // Map role to seeded Indian professional personas
    const emailMap: Record<string, string> = {
      ADMIN: "shivamjais.op09@gmail.com",
      INTERVIEWER: "shivam.interviewer@interviewx.in",
      CANDIDATE: "rohan.mukherjee@gmail.com",
      REVIEWER: "vikram.malhotra@interviewx.in",
    };

    const targetEmail = emailMap[role];
    let user = await prisma.user.findUnique({
      where: { email: targetEmail },
    });

    if (!user) {
      // Find any user with that role
      user = await prisma.user.findFirst({
        where: { role },
      });
    }

    if (!user) {
      return NextResponse.json({ error: `Demo user for role ${role} not found in database.` }, { status: 404 });
    }

    const token = await signToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role as "ADMIN" | "INTERVIEWER" | "CANDIDATE" | "REVIEWER",
      avatarUrl: user.avatarUrl,
    });

    const response = NextResponse.json({
      success: true,
      message: `Signed in as Demo ${role}: ${user.name}`,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
    });

    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Demo login error:", error);
    return NextResponse.json({ error: "Demo sign-in failed." }, { status: 500 });
  }
}
