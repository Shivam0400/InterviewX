# InterviewX — Live Technical Interview & Assessment Platform

> **"Technical interviews, built on evidence."**

InterviewX is a live technical assessment platform where candidates solve real programming challenges, interviewers collaborate in real-time, submitted code runs in an isolated execution sandbox, and evaluation outcomes are backed by deterministic verification.

Built by **Shivam Sony** (B.Tech in Computer Science & Data Science, Government Engineering College, Jamui).

---

## 🌟 Key Features

1. **Live Collaborative Monaco Workspace**
   - Syntax highlighting, line numbers, automatic light/dark theme synchronization (`vs-dark` / `vs`).
   - Multi-language support: Python, JavaScript, TypeScript, C++, and Java.
   - Live presence tracking and authoritative server-side countdown timer.
   - Code persistence with debounced autosave.

2. **Isolated Code Execution Engine**
   - Pluggable provider adapter (`Judge0Adapter` & `SafeLocalSandboxAdapter`).
   - Strict resource limits: 2.5s CPU wall-clock limit, 128 MB RAM ceiling, 32 KB output buffer truncation.
   - Process isolation ensures untrusted candidate code never touches application secrets or host databases.

3. **Deterministic Assessment & Scoring**
   - Strict distinction between Wrong Answer, Timeout, Runtime Error, and Compile Error.
   - Output normalizer handles CRLF differences, whitespace, and JSON structures.
   - **Confidential Hidden Test Suites**: Evaluated entirely server-side, returning only sanitized aggregate results to candidate clients.

4. **Evidence-Based AI Interview Copilot**
   - Powered by Google Gemini 1.5 with Zod schema validation (plus built-in rule-based fallback).
   - Generates algorithmic complexity analysis (time & space with code citations).
   - Generates contextual follow-up probes for interviewers.
   - Advisory governance: Machine observations augment human reviewers and never autonomously reject candidates.

5. **Assessment Lifecycle Management**
   - High-entropy cryptographic invitation tokens for candidates.
   - Customizable rubrics (Correctness, Code Quality, Problem Solving).
   - Structured states: `SCHEDULED` → `IN_PROGRESS` → `SUBMITTED` → `COMPLETED`.

6. **Analytics & Question Calibration**
   - Data science dashboards with Recharts.
   - Pass rates, outcome distributions, execution latencies, and item response calibration diagnostics.

7. **Developer Profile**
   - Dedicated page at `/about-developer` highlighting Shivam Sony's academic background and data engineering internship at SteamHouse India Limited.

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript (Strict), Tailwind CSS, Lucide Icons, Monaco Editor, Recharts.
- **Backend**: Next.js Server Handlers, Jose (JWT), Bcryptjs, Zod.
- **Database & ORM**: SQLite (`dev.db`) for instant zero-dependency local runs, fully compatible with managed PostgreSQL via Prisma ORM.
- **Code Execution**: Judge0 CE API Adapter + Safe Local Sandbox Runner.
- **AI Integration**: Google Gemini 1.5 Flash API + Structured Heuristic Engine.
- **Testing**: Vitest test suite covering scoring engine, execution sandbox limits, RBAC permissions, and AI schemas.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js 18+ (tested on Node v20/v24)
- npm or pnpm

### 2. Installation
```bash
git clone https://github.com/shivamsony/interviewx.git
cd interviewx
npm install
```

### 3. Database Initialization & Seed
```bash
# Push schema to SQLite database (dev.db)
npm run prisma:push

# Seed with questions, test suites, sample interviews, and demo personas
npm run db:seed
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Demonstration Personas (1-Click Login)

On the `/sign-in` screen, select any 1-click demo persona:
- **Interviewer**: Alex Chen (`alex.chen@interviewx.dev` / `Password123!`)
- **Candidate**: Marcus Vance (`marcus.vance@example.com` / `Password123!`)
- **Administrator**: Sarah Jenkins (`admin@interviewx.dev` / `Password123!`)
- **Reviewer**: David Kim (`david.kim@interviewx.dev` / `Password123!`)

---

## 🧪 Automated Testing
```bash
npm run test
```
Runs 19 automated tests across 4 suites:
- Scoring & Output Normalization
- Role-Based Access Control (RBAC)
- Execution Sandbox Isolation & Timeouts
- AI Copilot Schema Validation

---

## 👨‍💻 About the Developer

**Shivam Sony**  
- **Education**: B.Tech in Computer Science with a specialization in Data Science, Government Engineering College, Jamui.
- **Experience**: Data Analyst Intern at SteamHouse India Limited (SAP Business One, SQL Server, Stored Procedures, Material Master Data Quality).
- **Interests**: Python, SQL, Machine Learning, Data Science, AI/ML, Full-Stack Web Development.
- **Portfolio**: [shivam-portfolio-eosin-mu.vercel.app](https://shivam-portfolio-eosin-mu.vercel.app/)

---

## 📄 License
MIT License. Built for evidence-based hiring.
