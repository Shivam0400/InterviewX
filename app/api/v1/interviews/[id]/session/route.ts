import { NextResponse } from "next/server";
import { liveSessionHub } from "@/lib/collaboration/session-hub";
import { getCurrentSession } from "@/lib/auth/jwt";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const summary = liveSessionHub.getSessionSummary(params.id);
    return NextResponse.json(summary);
  } catch (error) {
    console.error("GET Session Error:", error);
    return NextResponse.json({ error: "Failed to get session state" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getCurrentSession();
    const body = await req.json();
    const { action, code, language, participant, cursor } = body;

    const interviewId = params.id;

    if (action === "JOIN") {
      const p = participant || {
        id: session?.userId || `guest-${Date.now()}`,
        name: session?.name || "Candidate",
        role: session?.role || "CANDIDATE",
      };
      liveSessionHub.joinSession(interviewId, p);
    } else if (action === "CODE_CHANGE") {
      liveSessionHub.updateCode(interviewId, code, language);
    } else if (action === "CURSOR_MOVE" && cursor && participant?.id) {
      liveSessionHub.updateCursor(interviewId, participant.id, cursor);
    } else if (action === "START_TIMER") {
      liveSessionHub.startSessionTimer(interviewId);
    }

    const state = liveSessionHub.getSessionSummary(interviewId);
    return NextResponse.json(state);
  } catch (error) {
    console.error("POST Session Error:", error);
    return NextResponse.json({ error: "Failed to update session" }, { status: 500 });
  }
}
