import { ExecutionRequest, ExecutionResult, IExecutionProvider, SupportedLanguage } from "./types";

const LANGUAGE_ID_MAP: Record<SupportedLanguage, number> = {
  python: 71,       // Python (3.8.1) / 92 (Python 3.11.2)
  javascript: 93,   // JavaScript (Node.js 18.15.0)
  typescript: 94,   // TypeScript (5.0.3)
  cpp: 54,          // C++ (GCC 9.2.0)
  java: 62,         // Java (OpenJDK 13.0.1)
};

export class Judge0Adapter implements IExecutionProvider {
  name: "JUDGE0" = "JUDGE0";
  private apiUrl: string;
  private apiKey: string;
  private apiHost: string;

  constructor() {
    this.apiUrl = process.env.JUDGE0_API_URL?.trim() || "";
    this.apiKey = process.env.JUDGE0_API_KEY?.trim() || "";
    this.apiHost = process.env.JUDGE0_API_HOST?.trim() || "judge0-ce.p.rapidapi.com";
  }

  isConfigured(): boolean {
    return Boolean(this.apiUrl && (this.apiKey || this.apiUrl.includes("localhost") || this.apiUrl.includes("127.0.0.1")));
  }

  async execute(request: ExecutionRequest): Promise<ExecutionResult> {
    if (!this.isConfigured()) {
      throw new Error("Judge0 execution provider is not configured. Set JUDGE0_API_URL and JUDGE0_API_KEY.");
    }

    const languageId = LANGUAGE_ID_MAP[request.language] || 71;
    const cpuLimitSeconds = Math.max(1, Math.min(5, Math.ceil((request.timeLimitMs || 2000) / 1000)));
    const memoryLimitKb = request.memoryLimitKb || 128000;

    const payload = {
      source_code: request.sourceCode,
      language_id: languageId,
      stdin: request.stdin || "",
      cpu_time_limit: cpuLimitSeconds,
      memory_limit: memoryLimitKb,
    };

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (this.apiKey) {
      if (this.apiUrl.includes("rapidapi")) {
        headers["x-rapidapi-key"] = this.apiKey;
        headers["x-rapidapi-host"] = this.apiHost;
      } else {
        headers["X-Auth-Token"] = this.apiKey;
      }
    }

    const submissionEndpoint = `${this.apiUrl.replace(/\/+$/, "")}/submissions?base64_encoded=false&wait=true`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    try {
      const response = await fetch(submissionEndpoint, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Judge0 API returned HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      return this.mapJudge0Response(data);
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      const message = err instanceof Error ? err.message : "Unknown Judge0 execution error";
      return {
        stdout: null,
        stderr: message,
        compileOutput: null,
        exitCode: 1,
        timeUsedMs: 0,
        memoryUsedKb: 0,
        status: "INTERNAL_ERROR",
        statusDescription: `Judge0 Connection Error: ${message}`,
        provider: "JUDGE0",
      };
    }
  }

  private mapJudge0Response(data: {
    status?: { id: number; description: string };
    stdout?: string | null;
    stderr?: string | null;
    compile_output?: string | null;
    time?: string | number | null;
    memory?: string | number | null;
  }): ExecutionResult {
    const statusId = data.status?.id || 13;
    const description = data.status?.description || "Unknown";

    let status: ExecutionResult["status"] = "INTERNAL_ERROR";
    if (statusId === 3) status = "SUCCESS";
    else if (statusId === 4) status = "WRONG_ANSWER";
    else if (statusId === 5) status = "TIME_LIMIT_EXCEEDED";
    else if (statusId === 6) status = "COMPILE_ERROR";
    else if (statusId >= 7 && statusId <= 12) status = "RUNTIME_ERROR";

    const timeSeconds = typeof data.time === "number" ? data.time : parseFloat(String(data.time || "0"));
    const timeUsedMs = Math.round(timeSeconds * 1000);
    const memoryUsedKb = typeof data.memory === "number" ? data.memory : parseFloat(String(data.memory || "0"));

    return {
      stdout: data.stdout || null,
      stderr: data.stderr || null,
      compileOutput: data.compile_output || null,
      exitCode: statusId === 3 ? 0 : 1,
      timeUsedMs,
      memoryUsedKb,
      status,
      statusDescription: description,
      provider: "JUDGE0",
    };
  }
}
