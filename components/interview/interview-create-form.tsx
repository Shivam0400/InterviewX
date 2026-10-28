"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
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

  const [title, setTitle] = React.useState("Senior Engineering Technical Screen");
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

      router.push(`/interviews/${data.interview.id}`);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error creating interview");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3.5 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Quick Generator Pill */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-brand-950/40 via-indigo-950/30 to-background border border-brand-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2 text-brand-400 font-semibold text-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fast Candidate & Access Code Generator</span>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Instantly generates an authentic Indian candidate profile, professional email, and fresh access token.
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
              placeholder="e.g. Senior Backend Engineering Screen — Rohan Mukherjee"
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
          Candidate Identity & Random Access Code
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
              Candidate workspace URL: <code className="text-foreground">/interviews/workspace?token={accessCode || "..."}</code>
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
              Schedule Session with Access Code <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
