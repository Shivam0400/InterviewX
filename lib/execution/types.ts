export type SupportedLanguage = "python" | "javascript" | "typescript" | "cpp" | "java";

export interface ExecutionRequest {
  sourceCode: string;
  language: SupportedLanguage;
  stdin?: string;
  timeLimitMs?: number;
  memoryLimitKb?: number;
}

export interface ExecutionResult {
  stdout: string | null;
  stderr: string | null;
  compileOutput: string | null;
  exitCode: number;
  timeUsedMs: number;
  memoryUsedKb: number;
  status: "SUCCESS" | "WRONG_ANSWER" | "TIME_LIMIT_EXCEEDED" | "MEMORY_LIMIT_EXCEEDED" | "RUNTIME_ERROR" | "COMPILE_ERROR" | "INTERNAL_ERROR";
  statusDescription: string;
  provider: "JUDGE0" | "SAFE_LOCAL";
}

export interface IExecutionProvider {
  name: "JUDGE0" | "SAFE_LOCAL";
  isConfigured(): boolean;
  execute(request: ExecutionRequest): Promise<ExecutionResult>;
}
