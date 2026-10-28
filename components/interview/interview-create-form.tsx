"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CalendarDays,
  Clock,
  User,
  Mail,
  Code2,
  Check,
  ArrowRight,
  AlertCircle,
  Dices,
  RefreshCw,
  Sparkles,
  Key,
  Copy,
  CheckCircle2,
  ExternalLink,
  Shield,
  Play,
} from "lucide-react";

interface QuestionItem {
  id: string;
  title: string;
  slug: string;
  difficulty: string;
  topicTags: string;
  timeLimitMs: number;
}

interface InterviewCreateFormProps {
  availableQuestions: QuestionItem[];
}

const INDIAN_CANDIDATE_POOL = [
  {
    name: "Rohan Mukherjee",
    email: "rohan.mukherjee@gmail.com",
    role: "Senior Backend Engineer",
    notes: "4+ years experience in Bengaluru with distributed storage, Go, and Redis caching.",
  },
  {
    name: "Sneha Patel",
    email: "sneha.patel@gmail.com",
    role: "Full-Stack Engineer",
    notes: "3 years experience with TypeScript, Next.js, and high-throughput PostgreSQL systems.",
  },
  {
    name: "Aarav Mehta",
    email: "aarav.mehta@gmail.com",
    role: "Systems & Algorithms Engineer",
    notes: "Specializes in low-latency concurrent services, Python, and C++ memory management.",
  },
  {
    name: "Diya Sengupta",
    email: "diya.sengupta@outlook.in",
    role: "Senior Data & Backend Engineer",
    notes: "Experience with data pipelines, Kafka events, and database query optimization.",
  },
  {
    name: "Kavya Iyer",
    email: "kavya.iyer@gmail.com",
    role: "Backend Infrastructure Lead",
    notes: "Strong knowledge of distributed caches, microservices architecture, and API design.",
  },
  {
    name: "Arjun Kulkarni",
    email: "arjun.kulkarni@gmail.com",
    role: "Platform Engineer",
    notes: "Experience with Docker, Kubernetes, Python backend services, and cloud telemetry.",
  },
  {
    name: "Nikhil Deshmukh",
    email: "nikhil.deshmukh@yahoo.co.in",
    role: "Full-Stack Software Engineer",
    notes: "Passionate about competitive programming and clean code architecture.",
  },
  {
    name: "Tanvi Joshi",
    email: "tanvi.joshi@gmail.com",
    role: "Data Science & Backend Engineer",
    notes: "Strong background in statistics, data structures, and Python analytical tools.",
  },
];

function generateRandomAccessCode(): string {
  const hubs = ["BLR", "DEL", "HYD", "PUN", "MUM", "GGN"];
  const hub = hubs[Math.floor(Math.random() * hubs.length)];
  const num = Math.floor(1000 + Math.random() * 9000);
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const suffix = chars[Math.floor(Math.random() * chars.length)] + chars[Math.floor(Math.random() * chars.length)];
  return `IVX-${hub}-${num}-${suffix}`;
}

export function InterviewCreateForm({ availableQuestions }: InterviewCreateFormProps) {
  const router = useRouter();

  // Interviewer config (Defaults to Shivam Sony)
  const [interviewerName, setInterviewerName] = React.useState("Shivam Sony");
  const [interviewerEmail, setInterviewerEmail] = React.useState("shivamjais.op09@gmail.com");

  // Candidate & Interview info
  const [title, setTitle] = React.useState("Technical Assessment Screen — Rohan Mukherjee");
  const [candidateName, setCandidateName] = React.useState("Rohan Mukherjee");
  const [candidateEmail, setCandidateEmail] = React.useState("rohan.mukherjee@gmail.com");
  const [accessCode, setAccessCode] = React.useState<string>("");
  const [interviewType, setInterviewType] = React.useState("LIVE_CODING");
  const [durationMinutes, setDurationMinutes] = React.useState(60);
  const [selectedQuestions, setSelectedQuestions] = React.useState<string[]>(
    availableQuestions.length > 0 ? [availableQuestions[0].id] : []
  );
  const [allowedLanguages, setAllowedLanguages] = React.useState<string[]>([
    "python",
    "javascript",
    "typescript",
  ]);
  const [notes, setNotes] = React.useState("Candidate has 4+ years of backend engineering experience.");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Success state: Candidate Info Package Modal
  const [createdInterview, setCreatedInterview] = React.useState<any | null>(null);
  const [copiedNotice, setCopiedNotice] = React.useState(false);

  // Initialize fresh random code on client mount
  React.useEffect(() => {
    setAccessCode(generateRandomAccessCode());
  }, []);

  const handleRollCode = () => {
    setAccessCode(generateRandomAccessCode());
  };

  const handleRandomizeCandidate = () => {
    const randomCand = INDIAN_CANDIDATE_POOL[Math.floor(Math.random() * INDIAN_CANDIDATE_POOL.length)];
    const newCode = generateRandomAccessCode();
    setCandidateName(randomCand.name);
    setCandidateEmail(randomCand.email);
    setNotes(randomCand.notes);
    setTitle(`${randomCand.role} Screen — ${randomCand.name}`);
    setAccessCode(newCode);
  };

  const toggleQuestion = (id: string) => {
    if (selectedQuestions.includes(id)) {
      if (selectedQuestions.length > 1) {
        setSelectedQuestions(selectedQuestions.filter((q) => q !== id));
      }
    } else {
      setSelectedQuestions([...selectedQuestions, id]);
    }
  };

  const toggleLanguage = (lang: string) => {
    if (allowedLanguages.includes(lang)) {
      if (allowedLanguages.length > 1) {
        setAllowedLanguages(allowedLanguages.filter((l) => l !== lang));
      }
    } else {
      setAllowedLanguages([...allowedLanguages, lang]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateName || !candidateEmail) {
      setError("Please provide the candidate's name and email.");
      return;
    }
    if (selectedQuestions.length === 0) {
      setError("Please select at least one question from the library.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/v1/interviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          candidateName,
          candidateEmail,
          interviewerName,
          interviewerEmail,
          interviewType,
          durationMinutes,
          questionIds: selectedQuestions,
          allowedLanguages,
          notes,
          inviteToken: accessCode,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create interview");
      }

      // Display the Candidate Info & Access Kit
      setCreatedInterview(data.interview);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error creating interview");
    } finally {
      setLoading(false);
    }
  };

  const copyCandidateNotice = () => {
    if (!createdInterview) return;
    const appUrl = window.location.origin;
    const workspaceUrl = `${appUrl}/interviews/${createdInterview.id}/workspace?token=${createdInterview.inviteToken}`;
    
    const noticeText = `Subject: Invitation to Live Technical Interview with ${interviewerName} — InterviewX

Hi ${candidateName},

You have been scheduled for a Live Technical Assessment session on InterviewX.

Details of your session:
• Assessment Title: ${title}
• Lead Interviewer: ${interviewerName} (${interviewerEmail})
• Allocated Duration: ${durationMinutes} Minutes
• Format: Live Collaborative Coding Workspace
• Supported Languages: ${allowedLanguages.join(", ")}
• Private Meeting Code: ${createdInterview.inviteToken}

Join your live coding workspace directly:
${workspaceUrl}

Please ensure a stable internet connection. No special software is required — your code editor and tests will run directly in your browser.

Best regards,
${interviewerName}
InterviewX Technical Assessments Team`;

    navigator.clipboard.writeText(noticeText);
    setCopiedNotice(true);
    setTimeout(() => setCopiedNotice(false), 2500);
  };

  // If created, render the Candidate Info Package
  if (createdInterview) {
    const appUrl = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
    const workspaceUrl = `${appUrl}/interviews/${createdInterview.id}/workspace?token=${createdInterview.inviteToken}`;

    return (
      <div className="p-6 rounded-2xl bg-card border border-brand-500/40 shadow-xl shadow-brand-500/5 space-y-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
              ✓
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Interview Scheduled Successfully!</h2>
              <p className="text-xs text-muted-foreground">
                Candidate access package generated with live workspace credentials.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={copyCandidateNotice}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-sm transition-all"
          >
            {copiedNotice ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedNotice ? "Candidate Notice Copied!" : "Copy Candidate Notice Email"}
          </button>
        </div>

        {/* Candidate Info Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-background border border-border/80 space-y-2">
            <span className="text-[10px] font-mono uppercase text-muted-foreground font-semibold">Candidate Credentials</span>
            <div className="font-semibold text-foreground text-sm">{candidateName}</div>
            <div className="text-muted-foreground font-mono">{candidateEmail}</div>
            <div className="pt-2 border-t border-border flex items-center justify-between">
              <span className="text-muted-foreground">Meeting Code:</span>
              <code className="text-brand-400 font-bold bg-brand-500/10 px-2 py-0.5 rounded font-mono">
                {createdInterview.inviteToken}
              </code>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-background border border-border/80 space-y-2">
            <span className="text-[10px] font-mono uppercase text-muted-foreground font-semibold">Interviewer Authority</span>
            <div className="font-semibold text-foreground text-sm">{interviewerName}</div>
            <div className="text-muted-foreground font-mono">{interviewerEmail}</div>
            <div className="pt-2 border-t border-border flex items-center justify-between">
              <span className="text-muted-foreground">Session Duration:</span>
              <span className="font-semibold text-foreground">{durationMinutes} Minutes</span>
            </div>
          </div>
        </div>

        {/* Direct Workspace URL */}
        <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-2 text-xs">
          <label className="block font-semibold text-foreground">Candidate Live Workspace URL</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={workspaceUrl}
              className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-background text-foreground font-mono select-all focus:outline-none"
            />
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(workspaceUrl);
                setCopiedNotice(true);
                setTimeout(() => setCopiedNotice(false), 2000);
              }}
              className="px-3.5 py-2 rounded-lg bg-card hover:bg-muted border border-border text-foreground text-xs font-semibold shrink-0 transition-colors"
            >
              Copy Link
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <Link
            href={`/interviews/${createdInterview.id}`}
            className="px-4 py-2 rounded-lg border border-border bg-card hover:bg-muted text-xs font-medium text-foreground transition-colors"
          >
            Go to Session Dashboard
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href={workspaceUrl}
              className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              Launch Live Workspace Now
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3.5 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Fast Candidate & Access Code Generator Pill */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-brand-950/40 via-indigo-950/30 to-background border border-brand-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2 text-brand-400 font-semibold text-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fast Candidate & Access Code Generator</span>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Instantly randomizes an authentic Indian candidate, email, and meeting access code.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRandomizeCandidate}
          className="flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-sm transition-all shrink-0"
        >
          <Dices className="w-4 h-4" />
          Randomize Candidate & Code
        </button>
      </div>

      {/* Section 0: Interviewer Configuration (Default Shivam Sony with edit option) */}
      <div className="p-5 rounded-xl bg-card border border-border/80 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Shield className="w-4 h-4 text-brand-500" />
            Interviewer Identity (Default: Shivam Sony)
          </h2>
          <span className="text-[10px] font-mono text-muted-foreground">Editable</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1">Interviewer Name</label>
            <input
              type="text"
              required
              value={interviewerName}
              onChange={(e) => setInterviewerName(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-brand-500 font-medium"
              placeholder="e.g. Shivam Sony"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1">Interviewer Email</label>
            <input
              type="email"
              required
              value={interviewerEmail}
              onChange={(e) => setInterviewerEmail(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-background text-foreground font-mono focus:ring-2 focus:ring-brand-500"
              placeholder="e.g. shivamjais.op09@gmail.com"
            />
          </div>
        </div>
      </div>

      {/* Section 1: General Info */}
      <div className="p-5 rounded-xl bg-card border border-border/80 space-y-4">
        <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-brand-500" />
          Session Fundamentals
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-foreground mb-1">Interview Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-brand-500 font-medium"
              placeholder="e.g. Technical Assessment Screen — Rohan Mukherjee"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1">Interview Format</label>
            <select
              value={interviewType}
              onChange={(e) => setInterviewType(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-background text-foreground"
            >
              <option value="LIVE_CODING">Live Collaborative Coding</option>
              <option value="TIMED_ASSESSMENT">Timed Technical Assessment</option>
              <option value="DSA">Data Structures & Algorithms</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1">Duration</label>
            <select
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-background text-foreground"
            >
              <option value={30}>30 Minutes</option>
              <option value={45}>45 Minutes</option>
              <option value={60}>60 Minutes (Standard)</option>
              <option value={90}>90 Minutes</option>
            </select>
          </div>
        </div>
      </div>

      {/* Section 2: Candidate Details & Random Access Code */}
      <div className="p-5 rounded-xl bg-card border border-border/80 space-y-4">
        <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
          <User className="w-4 h-4 text-brand-500" />
          Candidate Identity & Random Meeting Token
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1">Candidate Full Name</label>
            <input
              type="text"
              required
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-brand-500"
              placeholder="e.g. Rohan Mukherjee"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1">Candidate Email Address</label>
            <input
              type="email"
              required
              value={candidateEmail}
              onChange={(e) => setCandidateEmail(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-brand-500 font-mono"
              placeholder="e.g. rohan.mukherjee@gmail.com"
            />
          </div>

          {/* Random Meeting Code Field */}
          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-foreground flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-brand-500" />
                Session Access Token / Meeting Code
              </label>
              <span className="text-[10px] text-emerald-400 font-mono">Randomly Generated</span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                required
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-background text-foreground font-mono font-bold tracking-wider"
                placeholder="IVX-BLR-8492-RM"
              />
              <button
                type="button"
                onClick={handleRollCode}
                className="px-3 py-2 rounded-lg border border-border bg-muted/60 hover:bg-muted text-foreground text-xs font-medium flex items-center gap-1.5 shrink-0 transition-colors"
                title="Generate another random code"
              >
                <RefreshCw className="w-3.5 h-3.5 text-brand-400" />
                New Code
              </button>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1 font-mono">
              The candidate will receive this access token to authenticate into their workspace.
            </p>
          </div>
        </div>
      </div>

      {/* Section 3: Question Selection */}
      <div className="p-5 rounded-xl bg-card border border-border/80 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Code2 className="w-4 h-4 text-brand-500" />
            Select Assessment Questions ({selectedQuestions.length} selected)
          </h2>
          <span className="text-[11px] text-muted-foreground font-mono">
            {availableQuestions.length} problems available
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
          {availableQuestions.map((q) => {
            const isSelected = selectedQuestions.includes(q.id);
            return (
              <div
                key={q.id}
                onClick={() => toggleQuestion(q.id)}
                className={`p-3 rounded-lg border cursor-pointer transition-all flex items-start justify-between gap-3 text-xs ${
                  isSelected
                    ? "border-brand-500 bg-brand-500/10 shadow-sm"
                    : "border-border bg-background hover:bg-muted/60"
                }`}
              >
                <div className="space-y-1">
                  <div className="font-semibold text-foreground">{q.title}</div>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground">
                    <span
                      className={`px-1.5 py-0.2 rounded font-semibold ${
                        q.difficulty === "EASY"
                          ? "text-emerald-400 bg-emerald-500/10"
                          : q.difficulty === "MEDIUM"
                          ? "text-amber-400 bg-amber-500/10"
                          : "text-red-400 bg-red-500/10"
                      }`}
                    >
                      {q.difficulty}
                    </span>
                    <span>{q.timeLimitMs}ms timeout</span>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded flex items-center justify-center shrink-0 border ${
                    isSelected
                      ? "bg-brand-600 border-brand-600 text-white"
                      : "border-border bg-background"
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 4: Allowed Languages & Notes */}
      <div className="p-5 rounded-xl bg-card border border-border/80 space-y-4">
        <h2 className="text-sm font-bold text-foreground">Language Whitelist & Instructions</h2>

        <div className="space-y-2">
          <label className="block text-xs font-medium text-foreground">Permitted Programming Languages</label>
          <div className="flex flex-wrap gap-2 text-xs">
            {["python", "javascript", "typescript", "cpp", "java"].map((lang) => {
              const active = allowedLanguages.includes(lang);
              return (
                <button
                  key={lang}
                  type="button"
                  onClick={() => toggleLanguage(lang)}
                  className={`px-3 py-1.5 rounded-lg border font-mono uppercase text-[11px] transition-colors ${
                    active
                      ? "bg-brand-600 text-white border-brand-600 font-semibold"
                      : "bg-background text-muted-foreground border-border hover:bg-muted"
                  }`}
                >
                  {lang}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-foreground mb-1">
            Private Notes & Instructions (Interviewer only)
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-brand-500"
            placeholder="Candidate notes..."
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-md shadow-brand-500/25 transition-all disabled:opacity-50"
        >
          {loading ? (
            "Creating Assessment..."
          ) : (
            <>
              Schedule Assessment & Generate Candidate Kit <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
