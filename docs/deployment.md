# InterviewX — Production Deployment Guide

## 1. Hosting Architecture
```
┌────────────────────────────────────────────────────────┐
│  Vercel / AWS Amplify / Render (Next.js 14 App Router) │
│  - Static & Dynamic Routes                             │
│  - Serverless / Node Server API endpoints              │
└────────────────────────────────────────────────────────┘
            │
      ┌─────┴──────────────────┐
      ▼                        ▼
┌──────────────────┐    ┌─────────────────────────────────┐
│ Managed Postgres │    │ Judge0 CE Code Execution Pool   │
│ (Neon, Supabase) │    │ (RapidAPI or Self-Hosted EC2)   │
└──────────────────┘    └─────────────────────────────────┘
```

---

## 2. Environment Variables Checklist
Configure these environment variables in your production hosting platform:

| Variable | Description | Example / Default |
|---|---|---|
| `DATABASE_URL` | PostgreSQL or SQLite connection string | `postgresql://user:pass@host:5432/interviewx` |
| `AUTH_SECRET` | 32+ character cryptographic secret for HS256 tokens | Generate via `openssl rand -base64 32` |
| `NEXT_PUBLIC_APP_URL` | Production public URL for candidate invite links | `https://interviewx.example.com` |
| `JUDGE0_API_URL` | Judge0 CE cluster API endpoint (optional) | `https://judge0-ce.p.rapidapi.com` |
| `JUDGE0_API_KEY` | Judge0 CE RapidAPI / Auth key (optional) | `your_rapidapi_key` |
| `GEMINI_API_KEY` | Google Gemini API key for AI Copilot (optional) | `your_gemini_api_key` |
| `NODE_ENV` | Runtime environment | `production` |

---

## 3. Database Migration
When connecting to a new production PostgreSQL instance:
```bash
npx prisma db push
# or for formal migration history:
npx prisma migrate deploy
npx prisma db seed
```

---

## 4. Docker Deployment (Optional Alternative)
A standard multi-stage `Dockerfile`:
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
```
