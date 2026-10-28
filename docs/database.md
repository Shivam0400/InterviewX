# InterviewX — Database Architecture & Schema Reference

## 1. Overview
The persistence layer is managed via **Prisma ORM**, configured for local out-of-the-box zero-dependency execution via SQLite (`file:./dev.db`), and fully compatible with managed PostgreSQL in production (e.g. Supabase, Neon, AWS RDS).

---

## 2. Core Entities & Relationships

### `User`
Stores system accounts with credentials and roles.
- `id` (String, Primary Key)
- `name` (String)
- `email` (String, Unique)
- `passwordHash` (String, bcrypt)
- `role` (String: `ADMIN`, `INTERVIEWER`, `CANDIDATE`, `REVIEWER`)
- `createdAt`, `updatedAt` (DateTime)

### `Question`
Challenge definitions in the question library.
- `id` (String, Primary Key)
- `title` (String)
- `slug` (String, Unique)
- `description` (String, Markdown)
- `difficulty` (String: `EASY`, `MEDIUM`, `HARD`)
- `topicTags` (String, JSON array)
- `timeLimitMs` (Int, default 2000)
- `memoryLimitKb` (Int, default 128000)
- `starterCodes` (String, JSON map: python, javascript, etc.)
- `visibility` (String: `PUBLIC`, `ARCHIVED`)

### `TestCase`
Public sample and confidential hidden verification assertions.
- `id` (String, Primary Key)
- `questionId` (String, Foreign Key -> `Question`)
- `inputData` (String)
- `expectedOutput` (String)
- `isHidden` (Boolean, default false)
- `points` (Int)
- `sortOrder` (Int)
- `explanation` (String, optional)

### `Interview`
Scheduled and live assessment sessions.
- `id` (String, Primary Key)
- `title` (String)
- `interviewerId` (String, Foreign Key -> `User`)
- `candidateEmail` (String)
- `candidateName` (String)
- `inviteToken` (String, Unique cryptographically secure token)
- `status` (String: `DRAFT`, `SCHEDULED`, `IN_PROGRESS`, `SUBMITTED`, `COMPLETED`, `CANCELLED`)
- `interviewType` (String: `LIVE_CODING`, `TIMED_ASSESSMENT`, `DSA`)
- `durationMinutes` (Int, default 60)
- `scheduledAt`, `startedAt`, `endedAt` (DateTime)
- `allowedLanguages` (String, JSON array)

### `Submission`
Code submitted by candidates during sessions.
- `id` (String, Primary Key)
- `interviewId` (String, Foreign Key -> `Interview`)
- `questionId` (String, Foreign Key -> `Question`)
- `candidateId` (String, Foreign Key -> `User`, optional)
- `language` (String)
- `sourceCode` (String)
- `status` (String: `PENDING`, `EVALUATED`, `ERROR`)
- `deterministicScore` (Int)
- `maxScore` (Int)
- `executionTimeMs`, `memoryUsedKb` (Float)
- `submittedAt` (DateTime)

### `TestResult`
Individual test outcomes for a submission.
- `id` (String, Primary Key)
- `submissionId` (String, Foreign Key -> `Submission`)
- `testCaseId` (String, Foreign Key -> `TestCase`)
- `isHidden` (Boolean)
- `passed` (Boolean)
- `inputSample`, `expectedSample`, `actualOutput` (String)
- `executionTimeMs`, `memoryUsedKb` (Float)
- `pointsAwarded` (Int)
- `statusMessage` (String: `OK`, `WRONG_ANSWER`, `TIME_LIMIT_EXCEEDED`, `RUNTIME_ERROR`)

### `AssessmentReport`
Comprehensive evaluation dossier.
- `id` (String, Primary Key)
- `interviewId` (String, Foreign Key -> `Interview`)
- `submissionId` (String, Foreign Key -> `Submission`)
- `deterministicScore`, `maxScore`, `percentageScore` (Int/Float)
- `status` (String: `DRAFT`, `FINALIZED`, `RELEASED`)
- `reviewerNotes` (String)
- `reviewerId` (String, Foreign Key -> `User`)
- `releasedAt` (DateTime)

### `FeedbackItem`
Evidence-linked observations and rubric items.
- `id` (String, Primary Key)
- `reportId` (String, Foreign Key -> `AssessmentReport`)
- `category` (String: `STRENGTH`, `IMPROVEMENT`, `CODE_QUALITY`, `COMPLEXITY`)
- `title`, `content` (String)
- `evidenceReference` (String)
- `authorType` (String: `AI_ADVISORY`, `INTERVIEWER`, `REVIEWER`)

### `AuditLog`
Security and administrative audit trail.
- `id` (String, Primary Key)
- `actorId`, `actorEmail` (String)
- `action` (String)
- `resourceType`, `resourceId` (String)
- `metadata` (String, JSON)
- `createdAt` (DateTime)

---

## 3. Migration & Seeding Commands
```bash
# Push schema changes to database
npm run prisma:push

# Generate Prisma Client
npm run prisma:generate

# Seed with production-grade sample data
npm run db:seed
```
