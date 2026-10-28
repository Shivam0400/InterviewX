import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Shield, Lock, Terminal, AlertTriangle, CheckCircle2, Cpu, EyeOff, KeyRound } from "lucide-react";

export const metadata = {
  title: "Security & Sandbox Architecture — InterviewX",
  description:
    "Review the security controls, sandboxed code execution model, secret protection, and threat boundaries implemented in InterviewX.",
};

export default function SecurityPage() {
  const securityPillars = [
    {
      icon: Cpu,
      title: "Isolated Code Execution",
      description:
        "Untrusted candidate code is never executed inside the Next.js application server process. Submissions are delegated to Judge0 CE or dedicated isolated worker sandboxes with strict resource caps.",
      details: [
        "CPU Wall-Clock Limit: Max 2500ms execution before mandatory SIGKILL",
        "Memory Limit: Max 128 MB RAM ceiling",
        "Output Buffering: Hard 32 KB truncation prevents stdout denial-of-service",
        "No network socket creation or environment secret injection",
      ],
    },
    {
      icon: EyeOff,
      title: "Hidden Test Protection",
      description:
        "Assessment questions utilize both public sample test cases and confidential hidden verification suites. Hidden inputs and outputs never touch the candidate's browser bundle.",
      details: [
        "Server-side evaluation: All test assertions run inside isolated workers",
        "Sanitized responses: Candidates only receive pass/fail aggregates and latency metrics",
        "Anti-tampering: Candidate code cannot inspect assessment secrets from environment variables",
      ],
    },
    {
      icon: KeyRound,
      title: "Cryptographic Invitation Tokens",
      description:
        "Interviews are accessed via high-entropy cryptographically random session tokens rather than guessable sequential IDs.",
      details: [
        "Role-based authorization enforced on every API route and mutation",
        "Explicit session expiration based on interview duration bounds",
        "Token revocation capability for interviewers and platform administrators",
      ],
    },
    {
      icon: Lock,
      title: "Responsible AI Governance",
      description:
        "AI capabilities (Gemini / LLM Copilot) are explicitly designed as advisory instruments to assist human interviewers rather than make autonomous hiring decisions.",
      details: [
        "Structured schema validation: Outputs strictly conform to Zod definitions",
        "No automated candidate rejection based solely on AI feedback",
        "Evidence linking: Observations reference line numbers and verified test results",
        "Candidate privacy: Prompts do not contain candidate PII or passwords",
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-brand-500/20">
      <Navbar />

      <main className="flex-1 py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Shield className="w-3.5 h-3.5" />
              Security & Threat Boundaries
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
              Security Architecture
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed">
              Evaluating arbitrary code submitted by external candidates requires rigorous defensive architecture. Here is how InterviewX protects host infrastructure and assessment integrity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {securityPillars.map((p, i) => {
              const Icon = p.icon;
              return (
                <div key={i} className="p-6 rounded-xl bg-card border border-border/80 space-y-3">
                  <div className="flex items-center gap-2.5 text-brand-400">
                    <Icon className="w-5 h-5" />
                    <h3 className="font-bold text-foreground text-base">{p.title}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{p.description}</p>
                  <ul className="space-y-1.5 pt-2 border-t border-border/50">
                    {p.details.map((d, idx) => (
                      <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Honest Disclosure Alert */}
          <div className="p-6 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              Honest Security Boundaries & Limitations
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              In accordance with our engineering principles, we do not claim compliance certifications (e.g. SOC2, FedRAMP, ISO 27001) that have not been audited by third-party bodies. Code execution isolation relies on Judge0 CE sandboxing or isolated child processes with process guards. Production enterprise deployments should run sandbox clusters on dedicated isolated VPC subnets with ephemeral node recycling.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
