"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Terminal,
  LogOut,
  User,
  ShieldCheck,
  ChevronDown,
  Sparkles,
  ExternalLink,
  Laptop,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme/theme-toggle";

interface AppHeaderProps {
  user?: {
    name: string;
    email: string;
    role: string;
    avatarUrl?: string | null;
  } | null;
}

export function AppHeader({ user }: AppHeaderProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [roleSwitchOpen, setRoleSwitchOpen] = React.useState(false);

  const currentUser = user || {
    name: "Alex Chen",
    email: "alex.chen@interviewx.dev",
    role: "INTERVIEWER",
  };

  const handleLogout = async () => {
    await fetch("/api/v1/auth/logout", { method: "POST" });
    router.push("/sign-in");
    router.refresh();
  };

  const switchRole = async (role: "INTERVIEWER" | "CANDIDATE" | "ADMIN" | "REVIEWER") => {
    await fetch("/api/v1/auth/quick-demo-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    setRoleSwitchOpen(false);
    router.refresh();
    window.location.reload();
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "INTERVIEWER":
        return "bg-brand-500/10 text-brand-400 border-brand-500/20";
      case "CANDIDATE":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "REVIEWER":
        return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <header className="h-14 border-b border-border bg-card/80 backdrop-blur sticky top-0 z-40 px-4 flex items-center justify-between transition-colors">
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white shadow-sm shadow-brand-500/20">
            <Terminal className="w-4 h-4" />
          </div>
          <span className="font-bold text-base text-foreground tracking-tight hidden sm:inline">
            Interview<span className="text-brand-500">X</span>
          </span>
        </Link>

        {/* Demo Persona Switcher Pill */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setRoleSwitchOpen(!roleSwitchOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono bg-muted/80 hover:bg-muted border border-border text-foreground transition-colors"
            title="Click to quickly switch demo roles"
          >
            <span className="text-muted-foreground hidden md:inline">Persona:</span>
            <span className="font-semibold text-brand-400">{currentUser.name}</span>
            <span className={`text-[10px] uppercase px-1.5 py-0.2 rounded border ${getRoleBadge(currentUser.role)}`}>
              {currentUser.role}
            </span>
            <ChevronDown className="w-3 h-3 text-muted-foreground" />
          </button>

          {roleSwitchOpen && (
            <div className="absolute left-0 mt-1.5 w-60 rounded-xl bg-card border border-border shadow-xl p-2 z-50 text-xs space-y-1">
              <div className="px-2 py-1 text-[10px] font-mono text-muted-foreground uppercase">
                Switch Demo Persona
              </div>
              <button
                type="button"
                onClick={() => switchRole("INTERVIEWER")}
                className="w-full text-left p-2 rounded-lg hover:bg-muted transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-foreground">Alex Chen</div>
                  <div className="text-[10px] text-muted-foreground font-mono">alex.chen@interviewx.dev</div>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-brand-500/10 text-brand-400">Interviewer</span>
              </button>
              <button
                type="button"
                onClick={() => switchRole("CANDIDATE")}
                className="w-full text-left p-2 rounded-lg hover:bg-muted transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-foreground">Marcus Vance</div>
                  <div className="text-[10px] text-muted-foreground font-mono">marcus.vance@example.com</div>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400">Candidate</span>
              </button>
              <button
                type="button"
                onClick={() => switchRole("ADMIN")}
                className="w-full text-left p-2 rounded-lg hover:bg-muted transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-foreground">Sarah Jenkins</div>
                  <div className="text-[10px] text-muted-foreground font-mono">admin@interviewx.dev</div>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400">Admin</span>
              </button>
              <button
                type="button"
                onClick={() => switchRole("REVIEWER")}
                className="w-full text-left p-2 rounded-lg hover:bg-muted transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-foreground">David Kim</div>
                  <div className="text-[10px] text-muted-foreground font-mono">david.kim@interviewx.dev</div>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400">Reviewer</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/about-developer"
          className="hidden lg:flex items-center gap-1 px-2.5 py-1 text-xs text-brand-400 hover:text-brand-300 font-medium"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Shivam Sony Profile
        </Link>

        <ThemeToggle />

        {/* User Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 p-1.5 rounded-lg border border-border hover:bg-accent text-foreground text-xs transition-colors"
          >
            <div className="w-6 h-6 rounded-md bg-brand-600 text-white flex items-center justify-center font-bold text-xs uppercase">
              {currentUser.name.charAt(0)}
            </div>
            <span className="font-medium hidden sm:inline">{currentUser.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl bg-card border border-border shadow-xl p-1.5 z-50 text-xs space-y-1">
              <div className="px-2.5 py-1.5 border-b border-border/80">
                <div className="font-semibold text-foreground">{currentUser.name}</div>
                <div className="text-[11px] text-muted-foreground font-mono truncate">{currentUser.email}</div>
              </div>
              <Link
                href="/settings"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-muted text-foreground transition-colors"
              >
                <Laptop className="w-3.5 h-3.5 text-muted-foreground" />
                Settings & Sandbox
              </Link>
              <Link
                href="/about-developer"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-muted text-brand-400 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                About Developer
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-destructive/10 text-destructive text-left transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
