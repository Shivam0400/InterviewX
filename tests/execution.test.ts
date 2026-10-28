import { describe, it, expect } from "vitest";
import { SafeLocalSandboxAdapter } from "@/lib/execution/sandbox-adapter";
import { executionService } from "@/lib/execution";

describe("Isolated Code Execution Engine", () => {
  const sandbox = new SafeLocalSandboxAdapter();

  it("executes valid JavaScript and captures stdout", async () => {
    const res = await sandbox.execute({
      sourceCode: `console.log("Hello from InterviewX Sandbox");`,
      language: "javascript",
      timeLimitMs: 2500,
    });

    expect(res.status).toBe("SUCCESS");
    expect(res.exitCode).toBe(0);
    expect(res.stdout).toBe("Hello from InterviewX Sandbox");
  });

  it("handles runtime errors gracefully without crashing the host process", async () => {
    const res = await sandbox.execute({
      sourceCode: `throw new Error("Simulated candidate code runtime failure");`,
      language: "javascript",
      timeLimitMs: 2500,
    });

    expect(res.status).toBe("RUNTIME_ERROR");
    expect(res.exitCode).not.toBe(0);
    expect(res.stderr).toContain("Simulated candidate code runtime failure");
  });

  it("terminates infinite loops with TIME_LIMIT_EXCEEDED", async () => {
    const res = await sandbox.execute({
      sourceCode: `while (true) {}`,
      language: "javascript",
      timeLimitMs: 800, // short test timeout
    });

    expect(res.status).toBe("TIME_LIMIT_EXCEEDED");
    expect(res.exitCode).toBe(124);
  });

  it("rejects malicious system destruction patterns", async () => {
    const res = await sandbox.execute({
      sourceCode: `rm -rf / --no-preserve-root`,
      language: "javascript",
    });

    expect(res.status).toBe("INTERNAL_ERROR");
    expect(res.statusDescription).toBe("Security Policy Violation");
    expect(res.stderr).toContain("Security Violation");
  });

  it("execution service defaults to active provider", () => {
    const status = executionService.getProviderStatus();
    expect(status.localSandboxAvailable).toBe(true);
    expect(["JUDGE0", "SAFE_LOCAL"]).toContain(status.activeProvider);
  });
});
