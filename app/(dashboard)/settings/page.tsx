import { getCurrentSession } from "@/lib/auth/jwt";
import { executionService } from "@/lib/execution";
import { aiCopilotService } from "@/lib/ai/copilot";
import { SettingsView } from "@/components/settings/settings-view";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await getCurrentSession();
  const execStatus = executionService.getProviderStatus();
  const aiStatus = {
    providerName: aiCopilotService.getProviderName(),
    isConfigured: aiCopilotService.isConfigured(),
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="pb-2 border-b border-border">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Platform Settings & Integrations
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Configure interface preferences, monitor sandboxed code execution providers, and verify AI copilot status.
        </p>
      </div>

      <SettingsView
        session={session}
        execStatus={execStatus}
        aiStatus={aiStatus}
      />
    </div>
  );
}
