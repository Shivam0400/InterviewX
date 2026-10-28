import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 py-16 max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground">Privacy Policy</h1>
          <p className="text-xs text-muted-foreground font-mono mt-1">Last Updated: October 2026</p>
        </div>

        <section className="space-y-3 text-sm text-muted-foreground leading-relaxed">
          <h2 className="text-lg font-bold text-foreground">1. Minimal Candidate Data Collection</h2>
          <p>
            InterviewX strictly adheres to the principle of data minimization. We only collect the candidate's name, email, submitted code, and execution test results necessary to conduct technical evaluation.
          </p>
          <p>
            <strong>No Invasive Surveillance:</strong> InterviewX does not record biometric data, facial recognition, continuous eye-tracking, or ambient audio by default. We believe technical interviews should evaluate code quality and problem-solving, not invasive surveillance.
          </p>
        </section>

        <section className="space-y-3 text-sm text-muted-foreground leading-relaxed">
          <h2 className="text-lg font-bold text-foreground">2. Code Submissions & AI Processing</h2>
          <p>
            Candidate code submissions are processed in real-time execution sandboxes and evaluated against deterministic test suites. When AI analysis is enabled by the interviewer, code is sent to configured model providers (e.g. Google Gemini) solely for runtime advisory feedback. Code is not used to train proprietary third-party foundation models without authorization.
          </p>
        </section>

        <section className="space-y-3 text-sm text-muted-foreground leading-relaxed">
          <h2 className="text-lg font-bold text-foreground">3. Data Retention & Deletion</h2>
          <p>
            Assessment records and session telemetry can be purged upon request by either the interviewer organization or the candidate.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
