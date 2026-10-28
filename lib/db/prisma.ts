import { PrismaClient } from "@prisma/client";
import path from "path";
import os from "os";
import fs from "fs";
import { ensureServerlessDatabase } from "./seed-bundle";

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined;
}

function resolveDatabaseUrl(): string {
  const envUrl = process.env.DATABASE_URL;

  // 1. If explicit PostgreSQL / external connection string is provided, use it
  if (envUrl && (envUrl.startsWith("postgresql://") || envUrl.startsWith("postgres://"))) {
    return envUrl;
  }

  // 2. If running on Vercel or Serverless (AWS Lambda / read-only filesystem)
  const isServerless = !!process.env.VERCEL || !!process.env.AWS_LAMBDA_FUNCTION_NAME;

  if (isServerless) {
    const tmpDbPath = path.join(os.tmpdir(), "interviewx.db");
    ensureServerlessDatabase(tmpDbPath);
    return `file:${tmpDbPath.replace(/\\/g, "/")}`;
  }

  // 3. Local development fallback
  const localDb = path.join(process.cwd(), "prisma", "dev.db");
  if (!fs.existsSync(localDb)) {
    ensureServerlessDatabase(localDb);
  }
  return `file:${localDb.replace(/\\/g, "/")}`;
}

const resolvedUrl = resolveDatabaseUrl();

export const prisma =
  globalThis.prismaGlobal ??
  new PrismaClient({
    datasources: {
      db: {
        url: resolvedUrl,
      },
    },
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}

export default prisma;
