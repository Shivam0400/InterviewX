"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Terminal, Shield, Sparkles, User, LogIn, LayoutDashboard, Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme/theme-toggle";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navLinks = [
    { href: "/features", label: "Features", icon: Sparkles },
    { href: "/security", label: "Security", icon: Shield },
    { href: "/about-developer", label: "About Developer", icon: User },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Terminal className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/90 to-brand-400">
                Interview<span className="text-brand-500">X</span>
              </span>
              <span className="text-[10px] text-muted-foreground font-mono tracking-wider uppercase -mt-1">
                Evidence-Based
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 pl-4">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? "text-brand-500 bg-brand-500/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Action Items */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />

          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium text-foreground bg-muted/60 hover:bg-muted rounded-lg border border-border transition-colors"
          >
            <LayoutDashboard className="w-4 h-4 text-brand-500" />
            Live Platform
          </Link>

          <Link
            href="/sign-in"
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogIn className="w-4 h-4" />
            Sign In
          </Link>

          <Link
            href="/interviews/new"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-500 active:bg-brand-700 rounded-lg shadow-sm shadow-brand-500/25 transition-all"
          >
            Start Interview
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg border border-border bg-card text-foreground"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-background px-4 pt-2 pb-6 space-y-3">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg text-foreground hover:bg-muted"
                >
                  <Icon className="w-4 h-4 text-brand-500" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="pt-2 border-t border-border flex flex-col gap-2">
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-muted text-foreground"
            >
              <LayoutDashboard className="w-4 h-4 text-brand-500" />
              Live Platform
            </Link>
            <Link
              href="/sign-in"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-border text-foreground"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </Link>
            <Link
              href="/interviews/new"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-brand-600 text-white"
            >
              Start Interview
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
