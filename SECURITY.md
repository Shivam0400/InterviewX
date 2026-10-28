# Security Policy & Threat Model — InterviewX

## 1. Threat Model & Trust Boundaries

```
[ Untrusted Candidate Browser ]
            │  (Submits Source Code & Session Token)
            ▼
┌────────────────────────────────────────────────────────┐
│  Next.js Server API (Authentication & Rate Limiting)   │
│  - Session token validation                            │
│  - Hidden test cases kept in memory / database         │
│  - Input payload sanitation                            │
└────────────────────────────────────────────────────────┘
            │
            │ (Isolated Job Dispatch)
            ▼
┌────────────────────────────────────────────────────────┐
│  Isolated Execution Sandbox (Judge0 / Worker Sandbox)  │
│  - Hard CPU timeout: 2500ms max execution              │
│  - Hard Memory limit: 128 MB                           │
│  - Hard Output buffer: 32 KB limit                     │
│  - No application database credentials or secrets      │
│  - Disallowed host system call patterns                │
└────────────────────────────────────────────────────────┘
```

---

## 2. Core Security Controls

### A. Execution Isolation
- Untrusted user code is **never** executed using `eval()`, unconstrained shell commands, or within the primary Next.js process.
- Submissions are executed in ephemeral, resource-capped worker environments.
- Infinite loops or runaway tasks trigger SIGKILL after timeout expiration (2500ms).

### B. Hidden Test Case Confidentiality
- Problem test cases are divided into **Public Sample Tests** and **Confidential Hidden Tests**.
- Hidden test inputs, expected outputs, and raw assertions are evaluated entirely server-side.
- Candidates receive sanitized responses indicating only aggregate passing status and execution time.

### C. Authentication & Session Cryptography
- Session tokens are signed using high-entropy HS256 JWT keys (`AUTH_SECRET`).
- Passwords are hashed using `bcryptjs` with standard salt rounds.
- Role-based access controls (RBAC) are verified on server-side mutations. Public registration cannot grant administrator privileges.

### D. Responsible AI Governance
- AI-generated observations (solution explanation, follow-up probes) are advisory instruments to augment human reviewers.
- No automated candidate rejection is permitted based solely on AI feedback.
- Prompts do not contain candidate credentials or PII.

---

## 3. Reporting a Vulnerability
To report a security vulnerability or sandbox boundary issue, please file an issue or contact the repository maintainers.
