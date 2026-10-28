export interface Participant {
  id: string;
  name: string;
  role: "INTERVIEWER" | "CANDIDATE" | "REVIEWER" | "ADMIN";
  avatarUrl?: string;
  lastPing: number;
  cursor?: { lineNumber: number; column: number };
}

export interface SessionState {
  interviewId: string;
  document: string;
  language: string;
  version: number;
  participants: Map<string, Participant>;
  startedAt: number | null;
  durationMinutes: number;
  isPaused: boolean;
  status: string;
}

// Global in-memory cache for live sessions
const sessionStore = new Map<string, SessionState>();

export class LiveSessionHub {
  getOrCreateSession(interviewId: string, initialCode: string = "", language: string = "python", durationMinutes: number = 60): SessionState {
    let session = sessionStore.get(interviewId);
    if (!session) {
      session = {
        interviewId,
        document: initialCode,
        language,
        version: 1,
        participants: new Map(),
        startedAt: null,
        durationMinutes,
        isPaused: false,
        status: "READY",
      };
      sessionStore.set(interviewId, session);
    }
    return session;
  }

  joinSession(interviewId: string, participant: Participant): SessionState {
    const session = this.getOrCreateSession(interviewId);
    session.participants.set(participant.id, {
      ...participant,
      lastPing: Date.now(),
    });
    return session;
  }

  leaveSession(interviewId: string, participantId: string): void {
    const session = sessionStore.get(interviewId);
    if (session) {
      session.participants.delete(participantId);
    }
  }

  updateCode(interviewId: string, newCode: string, language?: string): { version: number; document: string } {
    const session = this.getOrCreateSession(interviewId);
    session.document = newCode;
    if (language) session.language = language;
    session.version += 1;
    return { version: session.version, document: session.document };
  }

  updateCursor(interviewId: string, participantId: string, cursor: { lineNumber: number; column: number }): void {
    const session = sessionStore.get(interviewId);
    if (session) {
      const p = session.participants.get(participantId);
      if (p) {
        p.cursor = cursor;
        p.lastPing = Date.now();
      }
    }
  }

  startSessionTimer(interviewId: string): void {
    const session = this.getOrCreateSession(interviewId);
    if (!session.startedAt) {
      session.startedAt = Date.now();
      session.status = "IN_PROGRESS";
    }
  }

  getSessionSummary(interviewId: string): {
    interviewId: string;
    document: string;
    language: string;
    version: number;
    participants: Participant[];
    timeRemainingSeconds: number;
    hasStarted: boolean;
    status: string;
  } {
    const session = this.getOrCreateSession(interviewId);

    // Clean stale participants (inactive for > 45 seconds)
    const now = Date.now();
    for (const [id, p] of session.participants.entries()) {
      if (now - p.lastPing > 45000) {
        session.participants.delete(id);
      }
    }

    let timeRemainingSeconds = session.durationMinutes * 60;
    if (session.startedAt) {
      const elapsedSeconds = Math.floor((now - session.startedAt) / 1000);
      timeRemainingSeconds = Math.max(0, session.durationMinutes * 60 - elapsedSeconds);
    }

    return {
      interviewId,
      document: session.document,
      language: session.language,
      version: session.version,
      participants: Array.from(session.participants.values()),
      timeRemainingSeconds,
      hasStarted: Boolean(session.startedAt),
      status: session.status,
    };
  }
}

export const liveSessionHub = new LiveSessionHub();
