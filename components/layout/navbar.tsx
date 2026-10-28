"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Shield, Sparkles, User, LogIn, LayoutDashboard, Menu, X, ArrowUpRight } from "lucide-react";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { InterviewXBrand } from "@/components/brand/logo";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/features", label: "Features", icon: Sparkles },
    { href: "/security", label: "Security & Sandbox", icon: Shield },
    { href: "/about-developer", label: "About Developer", icon: User },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo with Custom Hexagonal Dynamic Monogram & Luminous Typography */}
        <div className="flex items-center gap-6">
          <InterviewXBrand size="md" showTagline={true} href="/" />

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 pl-4">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    isActive
                      ? "text-brand-400 bg-brand-500/10 font-semibold border border-brand-500/20"
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
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-foreground bg-muted/70 hover:bg-muted rounded-lg border border-border transition-colors group"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-brand-400 group-hover:scale-110 transition-transform" />
            Live Platform
          </Link>

          <Link
            href="/sign-in"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogIn className="w-3.5 h-3.5" />
            Sign In
          </Link>

          <Link
            href="/interviews/new"
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 active:bg-brand-700 rounded-lg shadow-sm shadow-brand-500/25 transition-all"
          >
            <span>Start Interview</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
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
              const isActive =
                link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg ${
                    isActive
                      ? "text-brand-400 bg-brand-500/10 font-semibold"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="w-4 h-4 text-brand-400" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="pt-2 border-t border-border flex flex-col gap-2">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-border text-foreground"
            >
              <Home className="w-4 h-4 text-brand-400" />
              Return to Homepage
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-muted text-foreground"
            >
              <LayoutDashboard className="w-4 h-4 text-brand-400" />
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
