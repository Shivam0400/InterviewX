"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  Code2,
  FileText,
  BarChart3,
  Settings,
  PlusCircle,
  HelpCircle,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

export function AppSidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/interviews", label: "Interviews", icon: CalendarDays },
    { href: "/questions", label: "Question Library", icon: Code2 },
    { href: "/analytics", label: "Analytics & Trends", icon: BarChart3 },
    { href: "/settings", label: "Settings & Providers", icon: Settings },
  ];

  return (
    <aside className="w-56 shrink-0 border-r border-border bg-card/40 flex flex-col justify-between py-4 px-3 select-none transition-colors">
      <div className="space-y-4">
        {/* Quick Launch CTA */}
        <div>
          <Link
            href="/interviews/new"
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-sm shadow-brand-500/20 transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            New Interview
          </Link>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                  isActive
                    ? "bg-brand-500/10 text-brand-400 font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? "text-brand-400" : "text-muted-foreground"}`} />
                  <span>{link.label}</span>
                </div>
                {isActive && <ChevronRight className="w-3 h-3 text-brand-400" />}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* System Status / Sandbox Health Footer */}
      <div className="pt-4 border-t border-border space-y-2">
        <div className="p-2.5 rounded-lg bg-background border border-border/70 space-y-1 text-[11px] font-mono">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Sandbox:</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Active
            </span>
          </div>
          <div className="text-[10px] text-muted-foreground flex items-center justify-between">
            <span>Timeout: 2.5s</span>
            <span>Mem: 128M</span>
          </div>
        </div>

        <Link
          href="/security"
          className="flex items-center justify-between px-2 py-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Security Model
          </span>
          <ChevronRight className="w-3 h-3" />
        </Link>
      </div>
    </aside>
  );
}
