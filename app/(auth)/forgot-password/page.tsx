"use client";

import * as React from "react";
import Link from "next/link";
import { Terminal, Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import { ThemeToggle } from "@/components/theme/theme-toggle";

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-background relative">
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
        <h2 className="text-xl font-bold tracking-tight text-foreground">Reset Password</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-card border border-border/80 py-8 px-6 shadow-xl shadow-brand-500/5 sm:rounded-xl space-y-6">
          {submitted ? (
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-foreground">Recovery Link Dispatched</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                If an account exists for <code className="text-foreground">{email}</code>, a secure cryptographic recovery link has been sent.
              </p>
              <div className="pt-2">
                <Link href="/sign-in" className="text-xs text-brand-400 font-semibold hover:underline">
                  Return to Sign In
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-xs text-muted-foreground">
                Enter your account email to receive a password reset link.
              </p>
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

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-medium text-xs shadow-sm transition-all"
              >
                Send Password Reset Email <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="text-center text-xs text-muted-foreground">
                Remember your password?{" "}
                <Link href="/sign-in" className="text-brand-400 font-medium hover:underline">
                  Sign in
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
