"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Terminal, Lock, Mail, ArrowRight, ShieldCheck, UserCheck, AlertCircle } from "lucide-react";
import { ThemeToggle } from "@/components/theme/theme-toggle";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("alex.chen@interviewx.dev");
  const [password, setPassword] = React.useState("Password123!");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Authentication error");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (role: "INTERVIEWER" | "CANDIDATE" | "ADMIN" | "REVIEWER") => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/v1/auth/quick-demo-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Demo login failed");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Demo login error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-background relative selection:bg-brand-500/20">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <Link href="/" className="inline-flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-lg bg-brand-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
            <Terminal className="w-5 h-5" />
          </div>
          <span className="font-bold text-2xl tracking-tight text-foreground">InterviewX</span>
        </Link>
        <h2 className="text-xl font-bold tracking-tight text-foreground">Sign in to your assessment portal</h2>
        <p className="text-xs text-muted-foreground">
          Enter credentials or select a 1-click demonstration persona below.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-card border border-border/80 py-8 px-6 shadow-xl shadow-brand-500/5 sm:rounded-xl space-y-6">
          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Demo Personas */}
          <div className="space-y-2.5">
            <div className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider flex items-center justify-between">
              <span>Fast 1-Click Demo Personas:</span>
              <span className="text-brand-400 font-semibold">Ready</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickDemo("INTERVIEWER")}
                disabled={loading}
                className="p-2.5 rounded-lg border border-border bg-background hover:bg-muted text-left transition-colors flex flex-col gap-0.5 group"
              >
                <span className="font-semibold text-foreground group-hover:text-brand-400 flex items-center justify-between">
                  Interviewer <UserCheck className="w-3.5 h-3.5 text-brand-500" />
                </span>
                <span className="text-[10px] text-muted-foreground font-mono">Alex Chen (Staff Eng)</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo("CANDIDATE")}
                disabled={loading}
                className="p-2.5 rounded-lg border border-border bg-background hover:bg-muted text-left transition-colors flex flex-col gap-0.5 group"
              >
                <span className="font-semibold text-foreground group-hover:text-brand-400 flex items-center justify-between">
                  Candidate <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
                </span>
                <span className="text-[10px] text-muted-foreground font-mono">Marcus Vance (Candidate)</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo("ADMIN")}
                disabled={loading}
                className="p-2.5 rounded-lg border border-border bg-background hover:bg-muted text-left transition-colors flex flex-col gap-0.5 group"
              >
                <span className="font-semibold text-foreground group-hover:text-brand-400 flex items-center justify-between">
                  Admin <ShieldCheck className="w-3.5 h-3.5 text-purple-500" />
                </span>
                <span className="text-[10px] text-muted-foreground font-mono">Sarah Jenkins (Admin)</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo("REVIEWER")}
                disabled={loading}
                className="p-2.5 rounded-lg border border-border bg-background hover:bg-muted text-left transition-colors flex flex-col gap-0.5 group"
              >
                <span className="font-semibold text-foreground group-hover:text-brand-400 flex items-center justify-between">
                  Reviewer <UserCheck className="w-3.5 h-3.5 text-cyan-500" />
                </span>
                <span className="text-[10px] text-muted-foreground font-mono">David Kim (Reviewer)</span>
              </button>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-border w-full"></div>
            <span className="bg-card px-3 text-[11px] text-muted-foreground font-mono uppercase">
              Or Sign In With Password
            </span>
          </div>

          {/* Regular Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Email Address</label>
              <div className="relative rounded-lg">
                <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono"
                  placeholder="alex.chen@interviewx.dev"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-foreground">Password</label>
                <Link href="/forgot-password" className="text-[11px] text-brand-400 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative rounded-lg">
                <Lock className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-medium text-xs shadow-sm shadow-brand-500/25 transition-all disabled:opacity-50"
            >
              {loading ? (
                "Authenticating..."
              ) : (
                <>
                  Sign In to Platform <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          <div className="text-center text-xs text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/sign-up" className="text-brand-400 font-medium hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
