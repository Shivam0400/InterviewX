import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 py-16 max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground">Terms of Assessment</h1>
          <p className="text-xs text-muted-foreground font-mono mt-1">Effective: October 2026</p>
        </div>

        <section className="space-y-3 text-sm text-muted-foreground leading-relaxed">
          <h2 className="text-lg font-bold text-foreground">1. Acceptable Use of Code Execution Sandbox</h2>
          <p>
            Users and candidates may only submit programming code intended to solve the assigned assessment challenges. Submitting malicious software, fork bombs, denial-of-service attempts, unauthorized port scanners, or attempts to escape isolated execution boundaries is strictly prohibited and subject to immediate session revocation.
          </p>
        </section>

        <section className="space-y-3 text-sm text-muted-foreground leading-relaxed">
          <h2 className="text-lg font-bold text-foreground">2. Assessment Integrity & Evidence Transparency</h2>
          <p>
            InterviewX provides deterministic scoring based on test case verification. Interviewers agree to treat AI-generated observations as advisory supplementary data and not as definitive hiring decisions. Human judgment remains the authoritative arbiter of hiring outcomes.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
