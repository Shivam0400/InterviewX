import { Judge0Adapter } from "./judge0-adapter";
import { SafeLocalSandboxAdapter } from "./sandbox-adapter";
import { ExecutionRequest, ExecutionResult, IExecutionProvider } from "./types";

export * from "./types";

export class ExecutionService {
  private judge0 = new Judge0Adapter();
  private localSandbox = new SafeLocalSandboxAdapter();

  getActiveProvider(): IExecutionProvider {
    if (this.judge0.isConfigured()) {
      return this.judge0;
    }
    return this.localSandbox;
  }

  getProviderStatus(): {
    activeProvider: "JUDGE0" | "SAFE_LOCAL";
    judge0Configured: boolean;
    localSandboxAvailable: boolean;
    apiUrl?: string;
  } {
    const isJudge0 = this.judge0.isConfigured();
    return {
      activeProvider: isJudge0 ? "JUDGE0" : "SAFE_LOCAL",
      judge0Configured: isJudge0,
      localSandboxAvailable: true,
      apiUrl: process.env.JUDGE0_API_URL || undefined,
    };
  }

  async runCode(request: ExecutionRequest): Promise<ExecutionResult> {
    const provider = this.getActiveProvider();
    try {
      const result = await provider.execute(request);
      return result;
    } catch (err: unknown) {
      // If Judge0 failed unexpectedly, fall back to local sandbox if supported
      if (provider.name === "JUDGE0") {
        console.warn("Judge0 failed, falling back to SafeLocalSandboxAdapter:", err);
        return await this.localSandbox.execute(request);
      }
      throw err;
    }
  }
}

export const executionService = new ExecutionService();
