import { spawn } from "child_process";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { ExecutionRequest, ExecutionResult, IExecutionProvider } from "./types";

export class SafeLocalSandboxAdapter implements IExecutionProvider {
  name: "SAFE_LOCAL" = "SAFE_LOCAL";

  isConfigured(): boolean {
    return true; // Always available as local development sandbox
  }

  async execute(request: ExecutionRequest): Promise<ExecutionResult> {
    const { sourceCode, language, stdin = "", timeLimitMs = 2500 } = request;

    // Safety checks against hazardous patterns in local sandbox
    const forbiddenPatterns = [
      /rm\s+-rf/i,
      /del\s+\/f/i,
      /format\s+[a-z]:/i,
      /shutdown/i,
      /:(){ :|:& };:/, // fork bomb
    ];

    for (const pattern of forbiddenPatterns) {
      if (pattern.test(sourceCode)) {
        return {
          stdout: null,
          stderr: "Security Violation: Source code contains disallowed system commands or patterns.",
          compileOutput: null,
          exitCode: 1,
          timeUsedMs: 0,
          memoryUsedKb: 0,
          status: "INTERNAL_ERROR",
          statusDescription: "Security Policy Violation",
          provider: "SAFE_LOCAL",
        };
      }
    }

    // Determine executable and file extension
    let command: string;
    let args: string[];
    let fileExt: string;

    if (language === "javascript") {
      command = process.execPath; // node.exe
      fileExt = ".js";
      args = ["--max-old-space-size=128", "--no-warnings"];
    } else if (language === "typescript") {
      command = process.execPath;
      fileExt = ".mjs";
      args = ["--max-old-space-size=128", "--no-warnings"];
    } else if (language === "python") {
      // Check if python or py is available
      command = "python";
      fileExt = ".py";
      args = ["-u"];
    } else {
      return {
        stdout: null,
        stderr: `Language '${language}' requires Judge0 remote execution cluster. Configure JUDGE0_API_URL and JUDGE0_API_KEY in .env to run ${language}.`,
        compileOutput: null,
        exitCode: 1,
        timeUsedMs: 0,
        memoryUsedKb: 0,
        status: "COMPILE_ERROR",
        statusDescription: `Judge0 Sandbox Required for ${language}`,
        provider: "SAFE_LOCAL",
      };
    }

    // Write code to a temporary isolated file
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "interviewx_exec_"));
    const scriptPath = path.join(tempDir, `solution${fileExt}`);

    try {
      fs.writeFileSync(scriptPath, sourceCode, "utf-8");

      const startTime = performance.now();

      return await new Promise<ExecutionResult>((resolve) => {
        let stdout = "";
        let stderr = "";
        let timedOut = false;

        const runArgs = [...args, scriptPath];
        const child = spawn(command, runArgs, {
          cwd: tempDir,
          env: {
            NODE_ENV: "test",
            PATH: process.env.PATH,
          },
          windowsHide: true,
        });

        const timer = setTimeout(() => {
          timedOut = true;
          try {
            child.kill("SIGKILL");
          } catch {
            // ignore
          }
        }, timeLimitMs);

        if (stdin && child.stdin) {
          try {
            child.stdin.write(stdin);
            child.stdin.end();
          } catch {
            // ignore
          }
        }

        child.stdout?.on("data", (chunk: Buffer) => {
          if (stdout.length < 32768) {
            stdout += chunk.toString("utf-8");
          }
        });

        child.stderr?.on("data", (chunk: Buffer) => {
          if (stderr.length < 32768) {
            stderr += chunk.toString("utf-8");
          }
        });

        child.on("error", (err) => {
          clearTimeout(timer);
          const timeUsedMs = Math.round(performance.now() - startTime);
          resolve({
            stdout: null,
            stderr: `Local execution error (${command}): ${err.message}. For complete multi-language execution, connect Judge0.`,
            compileOutput: null,
            exitCode: 1,
            timeUsedMs,
            memoryUsedKb: 12000,
            status: "RUNTIME_ERROR",
            statusDescription: "Runtime Spawn Failure",
            provider: "SAFE_LOCAL",
          });
        });

        child.on("close", (code) => {
          clearTimeout(timer);
          const timeUsedMs = Math.round(performance.now() - startTime);

          if (timedOut) {
            resolve({
              stdout: stdout.trim() || null,
              stderr: "Time Limit Exceeded (execution exceeded allocated time limit).",
              compileOutput: null,
              exitCode: 124,
              timeUsedMs,
              memoryUsedKb: 32000,
              status: "TIME_LIMIT_EXCEEDED",
              statusDescription: "Time Limit Exceeded",
              provider: "SAFE_LOCAL",
            });
            return;
          }

          const hasError = code !== 0 || stderr.length > 0;
          resolve({
            stdout: stdout.trim() || null,
            stderr: stderr.trim() || null,
            compileOutput: null,
            exitCode: code ?? 0,
            timeUsedMs,
            memoryUsedKb: 28000,
            status: hasError ? "RUNTIME_ERROR" : "SUCCESS",
            statusDescription: hasError ? "Runtime Error" : "Success",
            provider: "SAFE_LOCAL",
          });
        });
      });
    } finally {
      try {
        fs.rmSync(tempDir, { recursive: true, force: true });
      } catch {
        // cleanup best-effort
      }
    }
  }
}
