import Link from "next/link";
import { ShieldCheck, Github, ExternalLink, Mail, Home } from "lucide-react";
import { InterviewXBrand } from "@/components/brand/logo";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/60 backdrop-blur text-muted-foreground mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div className="space-y-3 md:col-span-1">
            <InterviewXBrand size="md" showTagline={true} href="/" />
            <p className="text-xs text-muted-foreground leading-relaxed pt-1">
              Technical interviews, built on evidence. Live coding workspaces, sandboxed execution, and structured evaluation.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              Isolated Sandbox Execution (128MB / 2.5s)
            </div>
            <div>
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs text-brand-400 hover:text-brand-300 font-medium transition-colors"
              >
                <Home className="w-3.5 h-3.5" />
                Return to Landing Homepage
              </Link>
            </div>
          </div>

          {/* Product links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3 font-mono">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-foreground transition-colors flex items-center gap-1">
                  Homepage
                </Link>
              </li>
              <li>
                <Link href="/features" className="hover:text-foreground transition-colors">
                  Features & Tools
                </Link>
              </li>
              <li>
                <Link href="/questions" className="hover:text-foreground transition-colors">
                  Question Library
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-foreground transition-colors">
                  Interviewer Dashboard
                </Link>
              </li>
              <li>
                <Link href="/analytics" className="hover:text-foreground transition-colors">
                  Assessment Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* Architecture & Security */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3 font-mono">Architecture</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/security" className="hover:text-foreground transition-colors">
                  Security Model & Sandbox
                </Link>
              </li>
              <li>
                <Link href="/settings" className="hover:text-foreground transition-colors">
                  Provider Integrations
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-foreground transition-colors">
                  Privacy & Data Retention
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-foreground transition-colors">
                  Terms of Assessment
                </Link>
              </li>
            </ul>
          </div>

          {/* Developer Column */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3 font-mono">Developer</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about-developer" className="text-brand-400 font-medium hover:underline flex items-center gap-1">
                  Shivam Sony
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </li>
              <li className="text-xs text-muted-foreground">
                B.Tech CS & Data Science, GEC Jamui
              </li>
              <li>
                <a
                  href="mailto:shivamjais.op09@gmail.com"
                  className="hover:text-foreground transition-colors flex items-center gap-1 font-mono text-xs"
                >
                  <Mail className="w-3.5 h-3.5 text-brand-400" />
                  shivamjais.op09@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="https://shivam-portfolio-eosin-mu.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors flex items-center gap-1"
                >
                  Portfolio Website
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/Shivam0400"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors flex items-center gap-1"
                >
                  <Github className="w-3.5 h-3.5" />
                  github.com/Shivam0400
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
          <p>© {new Date().getFullYear()} InterviewX. Engineered with precision by Shivam Sony.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Execution Engine Ready • Sub-40ms P99
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
