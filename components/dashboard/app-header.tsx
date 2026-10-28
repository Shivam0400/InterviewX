"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LogOut,
  ChevronDown,
  Laptop,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { InterviewXBrand } from "@/components/brand/logo";

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

  const currentUser = user || {
    name: "Shivam Sony",
    email: "shivamjais.op09@gmail.com",
    role: "ADMIN",
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
    setMenuOpen(false);
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
      <div className="flex items-center gap-3">
        {/* Brand Logo & Name (Links to Home) */}
        <InterviewXBrand size="sm" showTagline={false} href="/" />

        {/* Superuser Admin Panel Quick Button (Only for Admin) */}
        {currentUser.role === "ADMIN" && (
          <Link
            href="/admin"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 border border-purple-500/30 rounded-md transition-colors shadow-2xs"
            title="Open Admin Control Center"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            <span>Admin Panel</span>
          </Link>
        )}
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />

        {/* Single Consolidated User Profile & Switcher Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 p-1.5 px-2 rounded-lg border border-border hover:bg-accent text-foreground text-xs transition-colors"
          >
            <div className="w-6 h-6 rounded-md bg-brand-600 text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
              {currentUser.name.charAt(0)}
            </div>
            <span className="font-semibold text-foreground">{currentUser.name}</span>
            <span className={`text-[10px] uppercase px-1.5 py-0.2 rounded border font-mono ${getRoleBadge(currentUser.role)}`}>
              {currentUser.role}
            </span>
            <ChevronDown className="w-3 h-3 text-muted-foreground" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-xl bg-card border border-border shadow-xl p-2 z-50 text-xs space-y-2">
              <div className="px-2.5 py-1.5 border-b border-border/80">
                <div className="font-semibold text-foreground">{currentUser.name}</div>
                <div className="text-[11px] text-muted-foreground font-mono truncate">{currentUser.email}</div>
                <div className="mt-1">
                  <span className={`text-[10px] uppercase px-1.5 py-0.2 rounded border font-mono ${getRoleBadge(currentUser.role)}`}>
                    Active Role: {currentUser.role}
                  </span>
                </div>
              </div>

              {/* Fast Persona Switcher inside User Menu */}
              <div className="space-y-1">
                <div className="px-2 text-[10px] font-mono text-muted-foreground uppercase">
                  Switch Demo Persona:
                </div>
                <div className="grid grid-cols-2 gap-1 text-[11px]">
                  <button
                    type="button"
                    onClick={() => switchRole("CANDIDATE")}
                    className={`p-1.5 rounded text-left transition-colors flex items-center justify-between ${
                      currentUser.role === "CANDIDATE" ? "bg-emerald-500/15 text-emerald-300 font-semibold" : "hover:bg-muted text-foreground"
                    }`}
                  >
                    <span>Candidate</span>
                    <UserCheck className="w-3 h-3 text-emerald-400" />
                  </button>
                  <button
                    type="button"
                    onClick={() => switchRole("INTERVIEWER")}
                    className={`p-1.5 rounded text-left transition-colors flex items-center justify-between ${
                      currentUser.role === "INTERVIEWER" ? "bg-brand-500/15 text-brand-300 font-semibold" : "hover:bg-muted text-foreground"
                    }`}
                  >
                    <span>Interviewer</span>
                    <UserCheck className="w-3 h-3 text-brand-400" />
                  </button>
                  <button
                    type="button"
                    onClick={() => switchRole("ADMIN")}
                    className={`p-1.5 rounded text-left transition-colors flex items-center justify-between ${
                      currentUser.role === "ADMIN" ? "bg-purple-500/15 text-purple-300 font-semibold" : "hover:bg-muted text-foreground"
                    }`}
                  >
                    <span>Admin</span>
                    <ShieldCheck className="w-3 h-3 text-purple-400" />
                  </button>
                  <button
                    type="button"
                    onClick={() => switchRole("REVIEWER")}
                    className={`p-1.5 rounded text-left transition-colors flex items-center justify-between ${
                      currentUser.role === "REVIEWER" ? "bg-cyan-500/15 text-cyan-300 font-semibold" : "hover:bg-muted text-foreground"
                    }`}
                  >
                    <span>Reviewer</span>
                    <UserCheck className="w-3 h-3 text-cyan-400" />
                  </button>
                </div>
              </div>

              <div className="pt-1 border-t border-border space-y-1">
                {currentUser.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 font-semibold transition-colors"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                    Admin Control Panel
                  </Link>
                )}
                <Link
                  href="/settings"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-muted text-foreground transition-colors"
                >
                  <Laptop className="w-3.5 h-3.5 text-muted-foreground" />
                  Settings & Sandbox
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
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
