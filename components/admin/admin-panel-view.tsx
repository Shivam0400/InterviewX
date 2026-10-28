"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Users,
  CalendarDays,
  Code2,
  Cpu,
  ShieldCheck,
  Trash2,
  Play,
  ExternalLink,
  AlertTriangle,
  RefreshCw,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  ArrowRight,
  Eye,
  KeyRound,
  Shield,
  Activity,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface AdminPanelViewProps {
  initialUsers: any[];
  initialInterviews: any[];
  initialQuestions: any[];
  initialSubmissions: any[];
  adminUser: any;
}

export function AdminPanelView({
  initialUsers,
  initialInterviews,
  initialQuestions,
  initialSubmissions,
  adminUser,
}: AdminPanelViewProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState<"users" | "interviews" | "questions" | "engine">("users");

  const [users, setUsers] = React.useState(initialUsers);
  const [interviews, setInterviews] = React.useState(initialInterviews);
  const [questions, setQuestions] = React.useState(initialQuestions);

  const [loadingAction, setLoadingAction] = React.useState<string | null>(null);
  const [notification, setNotification] = React.useState<{ type: "success" | "error"; message: string } | null>(null);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Change user role
  const handleRoleChange = async (userId: string, newRole: string) => {
    setLoadingAction(`role-${userId}`);
    try {
      const res = await fetch(`/api/v1/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update user role");

      setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
      showNotification("success", `Updated user role to ${newRole}`);
    } catch (err: unknown) {
      showNotification("error", err instanceof Error ? err.message : "Failed to update role");
    } finally {
      setLoadingAction(null);
    }
  };

  // Delete user
  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to permanently delete user "${userName}"?`)) return;
    setLoadingAction(`del-user-${userId}`);
    try {
      const res = await fetch(`/api/v1/admin/users/${userId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete user");

      setUsers(users.filter((u) => u.id !== userId));
      showNotification("success", `User "${userName}" deleted.`);
    } catch (err: unknown) {
      showNotification("error", err instanceof Error ? err.message : "Failed to delete user");
    } finally {
      setLoadingAction(null);
    }
  };

  // Update interview status (e.g. Cancel session)
  const handleInterviewStatus = async (interviewId: string, newStatus: string) => {
    setLoadingAction(`status-${interviewId}`);
    try {
      const res = await fetch(`/api/v1/admin/interviews/${interviewId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update interview");

      setInterviews(interviews.map((i) => (i.id === interviewId ? { ...i, status: newStatus } : i)));
      showNotification("success", `Interview status set to ${newStatus}`);
    } catch (err: unknown) {
      showNotification("error", err instanceof Error ? err.message : "Failed to update interview");
    } finally {
      setLoadingAction(null);
    }
  };

  // Delete interview
  const handleDeleteInterview = async (interviewId: string, title: string) => {
    if (!confirm(`Delete interview session "${title}"? This will remove all associated submissions and logs.`)) return;
    setLoadingAction(`del-int-${interviewId}`);
    try {
      const res = await fetch(`/api/v1/admin/interviews/${interviewId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete interview");

      setInterviews(interviews.filter((i) => i.id !== interviewId));
      showNotification("success", "Interview session deleted.");
    } catch (err: unknown) {
      showNotification("error", err instanceof Error ? err.message : "Failed to delete interview");
    } finally {
      setLoadingAction(null);
    }
  };

  // Toggle question visibility
  const handleToggleQuestionVisibility = async (questionId: string, currentVis: string) => {
    const nextVis = currentVis === "PUBLIC" ? "ARCHIVED" : "PUBLIC";
    setLoadingAction(`vis-${questionId}`);
    try {
      const res = await fetch(`/api/v1/admin/questions/${questionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visibility: nextVis }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update question");

      setQuestions(questions.map((q) => (q.id === questionId ? { ...q, visibility: nextVis } : q)));
      showNotification("success", `Question visibility updated to ${nextVis}`);
    } catch (err: unknown) {
      showNotification("error", err instanceof Error ? err.message : "Failed to update visibility");
    } finally {
      setLoadingAction(null);
    }
  };

  // Delete question
  const handleDeleteQuestion = async (questionId: string, title: string) => {
    if (!confirm(`Delete question "${title}" and its test suites from library?`)) return;
    setLoadingAction(`del-q-${questionId}`);
    try {
      const res = await fetch(`/api/v1/admin/questions/${questionId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete question");

      setQuestions(questions.filter((q) => q.id !== questionId));
      showNotification("success", `Deleted question "${title}".`);
    } catch (err: unknown) {
      showNotification("error", err instanceof Error ? err.message : "Failed to delete question");
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Superuser Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-card border-2 border-purple-500/40 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-lg shadow-purple-500/30 shrink-0">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
                  Admin Control Center
                </h1>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold uppercase">
                  Root Governance
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Full platform control authenticated as <strong className="text-foreground">{adminUser.name}</strong> (<span className="text-purple-300 font-mono">{adminUser.email}</span>).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/interviews/new"
              className="px-3.5 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-sm transition-all"
            >
              + Schedule Interview
            </Link>
            <Link
              href="/dashboard"
              className="px-3.5 py-2 rounded-lg border border-border bg-card hover:bg-muted text-foreground text-xs font-medium transition-colors"
            >
              Operations Hub
            </Link>
          </div>
        </div>

        {notification && (
          <div
            className={`p-3 rounded-lg text-xs font-mono flex items-center gap-2 ${
              notification.type === "success"
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "bg-red-500/10 text-red-400 border border-red-500/20"
            }`}
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{notification.message}</span>
          </div>
        )}
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-card border border-border/80 space-y-1">
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span>Registered Users</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-foreground">{users.length}</div>
          <div className="text-[10px] text-muted-foreground font-mono">
            {users.filter((u) => u.role === "CANDIDATE").length} Candidates • {users.filter((u) => u.role === "INTERVIEWER").length} Interviewers
          </div>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border/80 space-y-1">
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span>Total Interviews</span>
            <CalendarDays className="w-4 h-4 text-brand-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-foreground">{interviews.length}</div>
          <div className="text-[10px] text-muted-foreground font-mono">
            {interviews.filter((i) => i.status === "COMPLETED").length} Completed • {interviews.filter((i) => i.status === "IN_PROGRESS").length} Active
          </div>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border/80 space-y-1">
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span>Questions in Catalog</span>
            <Code2 className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-foreground">{questions.length}</div>
          <div className="text-[10px] text-muted-foreground font-mono">
            {questions.filter((q) => q.visibility === "PUBLIC").length} Public Challenges
          </div>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border/80 space-y-1">
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span>Sandbox Envelopes</span>
            <Cpu className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">128 MB</div>
          <div className="text-[10px] text-muted-foreground font-mono">
            SECCOMP • 2500ms Timeout
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-border flex items-center gap-2 overflow-x-auto text-xs font-medium">
        <button
          type="button"
          onClick={() => setActiveTab("users")}
          className={`flex items-center gap-2 px-4 py-2.5 border-b-2 font-semibold transition-colors ${
            activeTab === "users"
              ? "border-purple-500 text-purple-400"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User Management ({users.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("interviews")}
          className={`flex items-center gap-2 px-4 py-2.5 border-b-2 font-semibold transition-colors ${
            activeTab === "interviews"
              ? "border-purple-500 text-purple-400"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <CalendarDays className="w-4 h-4" />
          <span>Interviews Overseer ({interviews.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("questions")}
          className={`flex items-center gap-2 px-4 py-2.5 border-b-2 font-semibold transition-colors ${
            activeTab === "questions"
              ? "border-purple-500 text-purple-400"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>Questions & Challenges ({questions.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("engine")}
          className={`flex items-center gap-2 px-4 py-2.5 border-b-2 font-semibold transition-colors ${
            activeTab === "engine"
              ? "border-purple-500 text-purple-400"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>Execution Engine & SECCOMP Limits</span>
        </button>
      </div>

      {/* Tab 1: User Management */}
      {activeTab === "users" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-foreground">User Directory & Role Governance</h2>
              <p className="text-xs text-muted-foreground">
                Manage roles, grant interviewer privileges, or promote platform administrators.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/50 border-b border-border text-[11px] font-mono text-muted-foreground uppercase">
                  <tr>
                    <th className="p-3.5">User</th>
                    <th className="p-3.5">Email</th>
                    <th className="p-3.5">Current Role</th>
                    <th className="p-3.5">Role Action</th>
                    <th className="p-3.5">Registered</th>
                    <th className="p-3.5 text-right">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-3.5 flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-brand-600/20 text-brand-400 border border-brand-500/30 flex items-center justify-center font-bold text-xs">
                          {u.name?.charAt(0) || "U"}
                        </div>
                        <span className="font-semibold text-foreground">{u.name}</span>
                      </td>
                      <td className="p-3.5 font-mono text-[11px] text-muted-foreground">{u.email}</td>
                      <td className="p-3.5">
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${
                            u.role === "ADMIN"
                              ? "bg-purple-500/15 text-purple-300 border-purple-500/30"
                              : u.role === "INTERVIEWER"
                              ? "bg-brand-500/15 text-brand-300 border-brand-500/30"
                              : u.role === "CANDIDATE"
                              ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                              : "bg-cyan-500/15 text-cyan-300 border-cyan-500/30"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <select
                          value={u.role}
                          disabled={loadingAction === `role-${u.id}`}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          className="px-2 py-1 text-xs rounded border border-border bg-background text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-purple-500"
                        >
                          <option value="ADMIN">ADMIN</option>
                          <option value="INTERVIEWER">INTERVIEWER</option>
                          <option value="CANDIDATE">CANDIDATE</option>
                          <option value="REVIEWER">REVIEWER</option>
                        </select>
                      </td>
                      <td className="p-3.5 text-muted-foreground font-mono text-[11px]">
                        {formatDate(u.createdAt)}
                      </td>
                      <td className="p-3.5 text-right">
                        {u.id !== adminUser.id && (
                          <button
                            type="button"
                            onClick={() => handleDeleteUser(u.id, u.name)}
                            disabled={loadingAction === `del-user-${u.id}`}
                            className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                            title="Delete user"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Interviews Overseer */}
      {activeTab === "interviews" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-foreground">Global Interview Overseer</h2>
              <p className="text-xs text-muted-foreground">
                Inspect, supervisor-join, or cancel technical interview sessions across all candidates.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/50 border-b border-border text-[11px] font-mono text-muted-foreground uppercase">
                  <tr>
                    <th className="p-3.5">Interview Title</th>
                    <th className="p-3.5">Candidate</th>
                    <th className="p-3.5">Access Code</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Duration</th>
                    <th className="p-3.5">Supervisor Action</th>
                    <th className="p-3.5 text-right">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {interviews.map((iv) => (
                    <tr key={iv.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-3.5">
                        <div className="font-semibold text-foreground">{iv.title}</div>
                        <div className="text-[10px] text-muted-foreground">
                          Interviewer: {iv.interviewer?.name || "Shivam Sony"}
                        </div>
                      </td>
                      <td className="p-3.5">
                        <div className="font-medium text-foreground">{iv.candidateName}</div>
                        <div className="text-[10px] text-muted-foreground font-mono">{iv.candidateEmail}</div>
                      </td>
                      <td className="p-3.5">
                        <span className="font-mono font-bold text-brand-400 bg-muted px-2 py-0.5 rounded text-[11px]">
                          {iv.inviteToken}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold border ${
                            iv.status === "IN_PROGRESS"
                              ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                              : iv.status === "COMPLETED"
                              ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                              : iv.status === "CANCELLED"
                              ? "bg-red-500/10 text-red-400 border-red-500/20"
                              : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          }`}
                        >
                          {iv.status}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono text-[11px] text-muted-foreground">
                        {iv.durationMinutes} min
                      </td>
                      <td className="p-3.5 flex items-center gap-2">
                        <Link
                          href={`/interviews/${iv.id}/workspace`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 font-semibold text-[11px] hover:bg-emerald-600 hover:text-white transition-all"
                        >
                          <Play className="w-3 h-3 fill-emerald-400" />
                          <span>Enter Workspace</span>
                        </Link>
                        {iv.status !== "CANCELLED" && (
                          <button
                            type="button"
                            onClick={() => handleInterviewStatus(iv.id, "CANCELLED")}
                            disabled={loadingAction === `status-${iv.id}`}
                            className="px-2 py-1 rounded bg-muted hover:bg-red-500/15 text-muted-foreground hover:text-red-400 border border-border text-[11px] transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => handleDeleteInterview(iv.id, iv.title)}
                          disabled={loadingAction === `del-int-${iv.id}`}
                          className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                          title="Delete interview"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Question Catalog */}
      {activeTab === "questions" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-foreground">Challenge Problem Catalog</h2>
              <p className="text-xs text-muted-foreground">
                Control challenge visibility, review test suite points, or add new algorithmic challenges.
              </p>
            </div>
            <Link
              href="/questions/new"
              className="px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-sm transition-all"
            >
              + Create Problem
            </Link>
          </div>

          <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/50 border-b border-border text-[11px] font-mono text-muted-foreground uppercase">
                  <tr>
                    <th className="p-3.5">Title & Slug</th>
                    <th className="p-3.5">Difficulty</th>
                    <th className="p-3.5">Visibility</th>
                    <th className="p-3.5">Time / Mem</th>
                    <th className="p-3.5">Toggle</th>
                    <th className="p-3.5 text-right">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {questions.map((q) => (
                    <tr key={q.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-3.5">
                        <div className="font-semibold text-foreground">{q.title}</div>
                        <div className="text-[10px] text-muted-foreground font-mono">{q.slug}</div>
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${
                            q.difficulty === "HARD"
                              ? "bg-red-500/10 text-red-400 border-red-500/20"
                              : q.difficulty === "MEDIUM"
                              ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                              : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          }`}
                        >
                          {q.difficulty}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                            q.visibility === "PUBLIC"
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {q.visibility}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono text-[11px] text-muted-foreground">
                        {q.timeLimitMs}ms / 128MB
                      </td>
                      <td className="p-3.5">
                        <button
                          type="button"
                          onClick={() => handleToggleQuestionVisibility(q.id, q.visibility)}
                          disabled={loadingAction === `vis-${q.id}`}
                          className="px-2.5 py-1 rounded bg-muted hover:bg-muted/80 text-foreground border border-border text-[11px] font-mono transition-colors"
                        >
                          {q.visibility === "PUBLIC" ? "Archive" : "Publish"}
                        </button>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => handleDeleteQuestion(q.id, q.title)}
                          disabled={loadingAction === `del-q-${q.id}`}
                          className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                          title="Delete question"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Execution Engine & Diagnostics */}
      {activeTab === "engine" && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-foreground">Sandboxed Code Execution Engine Health</h2>
            <p className="text-xs text-muted-foreground">
              Review resource bounds, syscall isolation, and active container worker limits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-card border border-border/80 space-y-3 font-mono text-xs shadow-inner">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <span className="font-semibold text-foreground">Worker Security Limits</span>
                <span className="text-emerald-400 font-bold">SECCOMP Enforced</span>
              </div>
              <div className="space-y-1.5 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">MAX_WALL_TIME_MS:</span>
                  <span className="text-cyan-400">2500 ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">MAX_MEMORY_KB:</span>
                  <span className="text-cyan-400">128000 KB (128 MB)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">MAX_OUTPUT_BYTES:</span>
                  <span className="text-cyan-400">32768 bytes (32 KB)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ALLOWED_LANGUAGES:</span>
                  <span className="text-purple-400">Python, JS, TS, C++, Java</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-card border border-border/80 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <span className="font-semibold text-foreground">Active Runtimes & Adapters</span>
                <span className="text-cyan-400 font-bold">Judge0 CE / Safe Sandbox</span>
              </div>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Node.js v20 (V8 JIT compiler active)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Python 3.10 (Standard library isolation)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>GCC 11 C++17 (Optimization -O2 enabled)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>OpenJDK 17 (Java compilation runtime)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
