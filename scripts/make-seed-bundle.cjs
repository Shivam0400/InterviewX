const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'prisma', 'dev.db');
const buf = fs.readFileSync(dbPath);
const gz = zlib.gzipSync(buf);
const b64 = gz.toString('base64');

const outputTs = `// Auto-generated compressed SQLite seed database for zero-config Serverless deployment
import zlib from "zlib";
import fs from "fs";

const SEED_GZIP_BASE64 = "${b64}";

export function ensureServerlessDatabase(targetPath: string) {
  try {
    if (!fs.existsSync(targetPath)) {
      const compressed = Buffer.from(SEED_GZIP_BASE64, "base64");
      const decompressed = zlib.gunzipSync(compressed);
      fs.writeFileSync(targetPath, decompressed);
    }
  } catch (err) {
    console.error("[InterviewX DB] Failed to extract serverless seed database:", err);
  }
}
`;

const outputPath = path.join(__dirname, '..', 'lib', 'db', 'seed-bundle.ts');
fs.writeFileSync(outputPath, outputTs, 'utf8');
console.log('Successfully wrote', outputPath, 'length:', outputTs.length);
