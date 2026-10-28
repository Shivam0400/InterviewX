# InterviewX — REST API Specification

All API endpoints are mounted under `/api/v1` and return JSON payloads.

---

## 1. Authentication & Identity

### `POST /api/v1/auth/login`
Authenticates a user with email and password.
- **Request Body**: `{ "email": "...", "password": "..." }`
- **Response**: `{ "success": true, "user": { ... } }` + Sets HTTP-only `interviewx_session` cookie.

### `POST /api/v1/auth/quick-demo-login`
Fast 1-click persona switch for demonstrations.
- **Request Body**: `{ "role": "INTERVIEWER" | "CANDIDATE" | "ADMIN" | "REVIEWER" }`
- **Response**: `{ "success": true, "user": { ... } }`

### `POST /api/v1/auth/register`
Creates a new account (Interviewer or Candidate).
- **Request Body**: `{ "name": "...", "email": "...", "password": "...", "role": "..." }`

### `POST /api/v1/auth/logout`
Clears session cookie.

### `GET /api/v1/me`
Returns current session profile and role permissions.

---

## 2. Assessment Questions

### `GET /api/v1/questions`
Lists all public questions with optional `?difficulty=` filter.

### `POST /api/v1/questions`
Creates a new challenge and associated test suites.
- **Request Body**:
  ```json
  {
    "title": "Two Sum",
    "slug": "two-sum",
    "difficulty": "EASY",
    "topicTags": ["Arrays", "Hash Table"],
    "description": "...",
    "timeLimitMs": 2000,
    "memoryLimitKb": 128000,
    "testCases": [
      { "inputData": "2,7,11,15\n9", "expectedOutput": "0 1", "isHidden": false, "points": 50 }
    ]
  }
  ```

---

## 3. Interview Sessions

### `GET /api/v1/interviews`
Lists all interview sessions with optional `?status=` filter.

### `POST /api/v1/interviews`
Schedules an interview, generates cryptographically random token, and associates questions.

### `PATCH /api/v1/interviews/:id`
Updates interview state (`IN_PROGRESS`, `COMPLETED`, `CANCELLED`).

### `POST /api/v1/interviews/:id/session`
Synchronizes live workspace state (presence, document edits, cursor position, timer).

---

## 4. Submissions & Code Execution

### `POST /api/v1/interviews/:id/submissions`
Runs code against test cases in the sandbox.
- **Request Body**:
  ```json
  {
    "questionId": "...",
    "language": "javascript",
    "sourceCode": "...",
    "isFinalSubmission": true
  }
  ```
- **Response**: Contains `evaluation` summary (score, percentageScore, latencies, sanitized test results).

---

## 5. AI Copilot

### `POST /api/v1/interviews/:id/ai-copilot`
Triggers structured AI analysis on submitted code.
- **Actions**:
  - `EXPLAIN`: Algorithmic summary & time/space complexity
  - `FOLLOW_UP`: 4 structured interviewer follow-up questions
  - `REVIEW`: Maintainability, readability score & concerns
