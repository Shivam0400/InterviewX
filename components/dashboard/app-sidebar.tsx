"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  Code2,
  BarChart3,
  Settings,
  PlusCircle,
  Home,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Play,
  Sparkles,
  BookOpen,
  FileCheck,
} from "lucide-react";

interface AppSidebarProps {
  user?: {
    name?: string;
    role?: string;
    email?: string;
  } | null;
}

export function AppSidebar({ user }: AppSidebarProps) {
  const pathname = usePathname();
  const role = user?.role || "INTERVIEWER";
  const isCandidate = role === "CANDIDATE";
  const isAdmin = role === "ADMIN";

  // Build role-specific navigation links
  const candidateLinks = [
    { href: "/dashboard", label: "My Assessments", icon: CalendarDays },
    { href: "/practice", label: "Practice & Mock Prep", icon: Code2 },
    { href: "/questions", label: "Practice Questions", icon: BookOpen },
  ];

  const adminLinks = [
    { href: "/admin", label: "Admin Control Center", icon: ShieldCheck, highlight: true },
    { href: "/dashboard", label: "Operations Hub", icon: LayoutDashboard },
    { href: "/interviews", label: "Interviews Directory", icon: CalendarDays },
    { href: "/questions", label: "Question Library", icon: Code2 },
    { href: "/analytics", label: "Analytics & Trends", icon: BarChart3 },
    { href: "/settings", label: "Settings & Providers", icon: Settings },
  ];

  const interviewerLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/interviews", label: "Interviews", icon: CalendarDays },
    { href: "/questions", label: "Question Library", icon: Code2 },
    { href: "/analytics", label: "Analytics & Trends", icon: BarChart3 },
    { href: "/settings", label: "Settings & Providers", icon: Settings },
  ];

  const activeLinks = isCandidate ? candidateLinks : isAdmin ? adminLinks : interviewerLinks;

  return (
    <aside className="w-60 shrink-0 border-r border-border bg-card/40 flex flex-col justify-between py-4 px-3 select-none transition-colors">
      <div className="space-y-4">
        {/* Role-specific Action Banner */}
        <div>
          {isCandidate ? (
            /* Candidate Action: Attempt Interview (No scheduling allowed) */
            <Link
              href="/dashboard#attempt"
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm shadow-emerald-500/20 transition-all group"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Attempt Interview</span>
            </Link>
          ) : (
            /* Interviewer / Admin Action: New Interview */
            <Link
              href="/interviews/new"
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-sm shadow-brand-500/20 transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>New Interview</span>
            </Link>
          )}
        </div>

        {/* Navigation list */}
        <nav className="space-y-1">
          {/* Explicit Link to Starting Homepage */}
          <Link
            href="/"
            className="flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors group"
            title="Go to the starting homepage"
          >
            <div className="flex items-center gap-2.5">
              <Home className="w-4 h-4 text-brand-400 group-hover:scale-110 transition-transform" />
              <span>Landing Homepage</span>
            </div>
            <ExternalLink className="w-3 h-3 text-muted-foreground opacity-60" />
          </Link>

          <div className="h-[1px] bg-border/60 my-1 mx-2" />

          {activeLinks.map((link: any) => {
            const Icon = link.icon;
            const isActive =
              pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(link.href));
            const isHighlight = link.highlight;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                  isActive
                    ? isHighlight
                      ? "bg-purple-500/15 text-purple-300 font-semibold border border-purple-500/30"
                      : "bg-brand-500/10 text-brand-400 font-semibold border border-brand-500/20"
                    : isHighlight
                    ? "text-purple-400 hover:text-purple-300 hover:bg-purple-950/20 border border-purple-500/20 font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 ${
                      isHighlight
                        ? "text-purple-400"
                        : isActive
                        ? "text-brand-400"
                        : "text-muted-foreground"
                    }`}
                  />
                  <span>{link.label}</span>
                </div>
                {isActive && (
                  <ChevronRight
                    className={`w-3 h-3 ${isHighlight ? "text-purple-400" : "text-brand-400"}`}
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* System Status / Sandbox Health Footer with Authentic Tech Metrics */}
      <div className="pt-4 border-t border-border space-y-2">
        <div className="p-2.5 rounded-lg bg-background border border-border/70 space-y-1.5 text-[11px] font-mono">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Sandbox:</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              SECCOMP Active
            </span>
          </div>
          <div className="text-[10px] text-muted-foreground flex items-center justify-between">
            <span>Timeout: 2500ms</span>
            <span>Cgroup: 128MB</span>
          </div>
          <div className="text-[9px] text-brand-400/80 pt-0.5 border-t border-border/50 truncate">
            {isCandidate ? "Candidate Mock Mode Ready" : "Deterministic AST Active"}
          </div>
        </div>

        <Link
          href="/security"
          className="flex items-center justify-between px-2 py-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Security & Threat Model
          </span>
          <ChevronRight className="w-3 h-3" />
        </Link>
      </div>
    </aside>
  );
}
