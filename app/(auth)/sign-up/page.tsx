"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, User, ArrowRight, AlertCircle, CheckCircle2, Home } from "lucide-react";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { InterviewXBrand } from "@/components/brand/logo";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [role, setRole] = React.useState<"INTERVIEWER" | "CANDIDATE">("INTERVIEWER");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-background relative selection:bg-brand-500/20">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <Link
          href="/"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card/80 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <Home className="w-3.5 h-3.5 text-brand-400" />
          <span>Homepage</span>
        </Link>
        <ThemeToggle />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="flex justify-center">
          <InterviewXBrand size="lg" showTagline={false} href="/" />
        </div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">Create your account</h2>
        <p className="text-xs text-muted-foreground">
          Join the evidence-based live technical assessment platform.
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Full Name</label>
              <div className="relative rounded-lg">
                <User className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="Jane Doe"
                />
              </div>
            </div>

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
                  placeholder="jane@company.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Password</label>
              <div className="relative rounded-lg">
                <Lock className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono"
                  placeholder="Min 6 characters"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Account Role</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole("INTERVIEWER")}
                  className={`p-2.5 rounded-lg border text-xs font-medium flex items-center justify-between transition-colors ${
                    role === "INTERVIEWER"
                      ? "border-brand-500 bg-brand-500/10 text-brand-400"
                      : "border-border bg-background text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <span>Interviewer</span>
                  {role === "INTERVIEWER" && <CheckCircle2 className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={() => setRole("CANDIDATE")}
                  className={`p-2.5 rounded-lg border text-xs font-medium flex items-center justify-between transition-colors ${
                    role === "CANDIDATE"
                      ? "border-brand-500 bg-brand-500/10 text-brand-400"
                      : "border-border bg-background text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <span>Candidate</span>
                  {role === "CANDIDATE" && <CheckCircle2 className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">
                Note: Administrator accounts cannot be created publicly and are provisioned via secure admin seeds.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-medium text-xs shadow-sm shadow-brand-500/25 transition-all disabled:opacity-50"
            >
              {loading ? (
                "Creating Account..."
              ) : (
                <>
                  Register Account <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          <div className="flex flex-col gap-2 text-center text-xs text-muted-foreground">
            <div>
              Already have an account?{" "}
              <Link href="/sign-in" className="text-brand-400 font-medium hover:underline">
                Sign in
              </Link>
            </div>
            <div>
              <Link href="/" className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground">
                <Home className="w-3 h-3" /> Back to Homepage
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
