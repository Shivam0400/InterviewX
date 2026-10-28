const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding InterviewX database with production-grade sample data...");

  // Clear existing records to ensure clean state
  await prisma.auditLog.deleteMany({});
  await prisma.feedbackItem.deleteMany({});
  await prisma.assessmentReport.deleteMany({});
  await prisma.testResult.deleteMany({});
  await prisma.executionJob.deleteMany({});
  await prisma.submission.deleteMany({});
  await prisma.interviewSession.deleteMany({});
  await prisma.interviewQuestion.deleteMany({});
  await prisma.interview.deleteMany({});
  await prisma.testCase.deleteMany({});
  await prisma.question.deleteMany({});
  await prisma.candidateProfile.deleteMany({});
  await prisma.user.deleteMany({});

  const passwordHash = await bcrypt.hash("Password123!", 10);

  // 1. Seed Users
  const adminUser = await prisma.user.create({
    data: {
      name: "Sarah Jenkins",
      email: "admin@interviewx.dev",
      passwordHash,
      role: "ADMIN",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    },
  });

  const interviewerUser = await prisma.user.create({
    data: {
      name: "Alex Chen",
      email: "alex.chen@interviewx.dev",
      passwordHash,
      role: "INTERVIEWER",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    },
  });

  const reviewerUser = await prisma.user.create({
    data: {
      name: "David Kim",
      email: "david.kim@interviewx.dev",
      passwordHash,
      role: "REVIEWER",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    },
  });

  const candidateUser = await prisma.user.create({
    data: {
      name: "Marcus Vance",
      email: "marcus.vance@example.com",
      passwordHash,
      role: "CANDIDATE",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
  });

  await prisma.candidateProfile.create({
    data: {
      userId: candidateUser.id,
      displayName: "Marcus Vance",
      email: "marcus.vance@example.com",
      headline: "Senior Distributed Systems Engineer (5+ yrs)",
      experienceYears: 5,
      skillsJson: JSON.stringify(["Python", "Distributed Systems", "PostgreSQL", "Go", "Redis"]),
    },
  });

  console.log("Users seeded successfully.");

  // 2. Seed Questions
  const q1 = await prisma.question.create({
    data: {
      title: "LRU Cache Implementation",
      slug: "lru-cache-implementation",
      difficulty: "MEDIUM",
      topicTags: JSON.stringify(["Data Structures", "Hash Table", "Design", "Doubly Linked List"]),
      supportedLanguages: JSON.stringify(["python", "javascript", "typescript", "cpp", "java"]),
      timeLimitMs: 2000,
      memoryLimitKb: 128000,
      description: `### Problem Description

Design a data structure that follows the constraints of a **Least Recently Used (LRU) cache**.

Implement the \`LRUCache\` class:
- \`LRUCache(int capacity)\` Initialize the LRU cache with positive size \`capacity\`.
- \`int get(int key)\` Return the value of the \`key\` if the key exists, otherwise return \`-1\`.
- \`void put(int key, int value)\` Update the value of the \`key\` if the \`key\` exists. Otherwise, add the \`key-value\` pair to the cache. If the number of keys exceeds the \`capacity\` from this operation, **evict the least recently used key**.

The functions \`get\` and \`put\` must each run in **$O(1)$ average time complexity**.

### Constraints
- $1 \\le \\text{capacity} \\le 3000$
- $0 \\le \\text{key} \\le 10^4$
- $0 \\le \\text{value} \\le 10^5$
- At most $2 \\times 10^5$ calls will be made to \`get\` and \`put\`.`,
      starterCodes: JSON.stringify({
        python: `class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        # TODO: Initialize hash map and doubly linked list pointers
        pass

    def get(self, key: int) -> int:
        # TODO: Return value or -1 if not found
        return -1

    def put(self, key: int, value: int) -> None:
        # TODO: Insert or update, evict least recently used if exceeding capacity
        pass

# Test harness
if __name__ == "__main__":
    cache = LRUCache(2)
    cache.put(1, 1)
    cache.put(2, 2)
    print(cache.get(1))
    cache.put(3, 3)
    print(cache.get(2))
    cache.put(4, 4)
    print(cache.get(1))
    print(cache.get(3))
    print(cache.get(4))
`,
        javascript: `class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) return -1;
    const val = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, val);
    return val;
  }

  put(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
    this.cache.set(key, value);
  }
}

// Test harness
const cache = new LRUCache(2);
cache.put(1, 1);
cache.put(2, 2);
console.log(cache.get(1));
cache.put(3, 3);
console.log(cache.get(2));
cache.put(4, 4);
console.log(cache.get(1));
console.log(cache.get(3));
console.log(cache.get(4));
`,
      }),
      createdBy: interviewerUser.id,
    },
  });

  // Test cases for LRU Cache
  await prisma.testCase.createMany({
    data: [
      {
        questionId: q1.id,
        inputData: "LRUCache(2), put(1,1), put(2,2), get(1), put(3,3), get(2), put(4,4), get(1), get(3), get(4)",
        expectedOutput: "1\n-1\n-1\n3\n4",
        isHidden: false,
        points: 20,
        sortOrder: 1,
        explanation: "Standard eviction order verification",
      },
      {
        questionId: q1.id,
        inputData: "LRUCache(1), put(2,1), get(2), put(3,2), get(2), get(3)",
        expectedOutput: "1\n-1\n2",
        isHidden: true,
        points: 30,
        sortOrder: 2,
        explanation: "Single capacity boundary condition test",
      },
      {
        questionId: q1.id,
        inputData: "LRUCache(2), put(2,1), put(2,2), get(2), put(1,1), put(4,1), get(2)",
        expectedOutput: "2\n-1",
        isHidden: true,
        points: 50,
        sortOrder: 3,
        explanation: "Duplicate key update without increasing size test",
      },
    ],
  });

  const q2 = await prisma.question.create({
    data: {
      title: "Two Sum with Target Index",
      slug: "two-sum-target-index",
      difficulty: "EASY",
      topicTags: JSON.stringify(["Arrays", "Hash Table", "Two Pointers"]),
      supportedLanguages: JSON.stringify(["python", "javascript", "typescript", "cpp", "java"]),
      timeLimitMs: 1500,
      memoryLimitKb: 64000,
      description: `### Problem Description

Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

You can return the answer in any order, formatted as two space-separated integers on a single line.

### Examples
**Example 1:**
- Input: \`nums = [2,7,11,15], target = 9\`
- Output: \`0 1\`

**Example 2:**
- Input: \`nums = [3,2,4], target = 6\`
- Output: \`1 2\`

### Constraints
- $2 \\le \\text{nums.length} \\le 10^4$
- $-10^9 \\le \\text{nums}[i] \\le 10^9$
- $-10^9 \\le \\text{target} \\le 10^9$
- Only one valid answer exists.`,
      starterCodes: JSON.stringify({
        python: `def two_sum(nums, target):
    # TODO: Implement O(N) hash map solution
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return f"{seen[complement]} {i}"
        seen[num] = i
    return ""

if __name__ == "__main__":
    import sys
    lines = sys.stdin.read().strip().split("\\n")
    if lines and lines[0]:
        nums = list(map(int, lines[0].split(",")))
        target = int(lines[1])
        print(two_sum(nums, target))
    else:
        print(two_sum([2, 7, 11, 15], 9))
`,
        javascript: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];
    if (map.has(diff)) {
      return \`\${map.get(diff)} \${i}\`;
    }
    map.set(nums[i], i);
  }
  return "";
}

const fs = require("fs");
try {
  const input = fs.readFileSync(0, "utf-8").trim().split("\\n");
  if (input.length >= 2) {
    const nums = input[0].split(",").map(Number);
    const target = Number(input[1]);
    console.log(twoSum(nums, target));
  } else {
    console.log(twoSum([2, 7, 11, 15], 9));
  }
} catch (e) {
  console.log(twoSum([2, 7, 11, 15], 9));
}
`,
      }),
      createdBy: interviewerUser.id,
    },
  });

  await prisma.testCase.createMany({
    data: [
      {
        questionId: q2.id,
        inputData: "2,7,11,15\n9",
        expectedOutput: "0 1",
        isHidden: false,
        points: 25,
        sortOrder: 1,
      },
      {
        questionId: q2.id,
        inputData: "3,2,4\n6",
        expectedOutput: "1 2",
        isHidden: false,
        points: 25,
        sortOrder: 2,
      },
      {
        questionId: q2.id,
        inputData: "-3,4,3,90\n0",
        expectedOutput: "0 2",
        isHidden: true,
        points: 25,
        sortOrder: 3,
        explanation: "Negative integers handling",
      },
      {
        questionId: q2.id,
        inputData: "1000000000,-500000000,500000000\n500000000",
        expectedOutput: "0 1",
        isHidden: true,
        points: 25,
        sortOrder: 4,
        explanation: "Large 32-bit boundary integers",
      },
    ],
  });

  const q3 = await prisma.question.create({
    data: {
      title: "Merge Intervals",
      slug: "merge-intervals",
      difficulty: "MEDIUM",
      topicTags: JSON.stringify(["Intervals", "Sorting", "Greedy"]),
      supportedLanguages: JSON.stringify(["python", "javascript", "typescript", "cpp", "java"]),
      timeLimitMs: 2000,
      memoryLimitKb: 128000,
      description: `### Problem Description

Given an array of \`intervals\` where \`intervals[i] = [start_i, end_i]\`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.

### Examples
- Input: \`[[1,3],[2,6],[8,10],[15,18]]\`
- Output: \`[[1,6],[8,10],[15,18]]\`
- Explanation: Since intervals \`[1,3]\` and \`[2,6]\` overlap, merge them into \`[1,6]\`.`,
      starterCodes: JSON.stringify({
        javascript: `function mergeIntervals(intervals) {
  if (!intervals.length) return [];
  intervals.sort((a, b) => a[0] - b[0]);
  const merged = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const last = merged[merged.length - 1];
    const curr = intervals[i];
    if (curr[0] <= last[1]) {
      last[1] = Math.max(last[1], curr[1]);
    } else {
      merged.push(curr);
    }
  }
  return merged;
}

console.log(JSON.stringify(mergeIntervals([[1,3],[2,6],[8,10],[15,18]])));
`,
      }),
      createdBy: interviewerUser.id,
    },
  });

  await prisma.testCase.createMany({
    data: [
      {
        questionId: q3.id,
        inputData: "[[1,3],[2,6],[8,10],[15,18]]",
        expectedOutput: "[[1,6],[8,10],[15,18]]",
        isHidden: false,
        points: 40,
        sortOrder: 1,
      },
      {
        questionId: q3.id,
        inputData: "[[1,4],[4,5]]",
        expectedOutput: "[[1,5]]",
        isHidden: false,
        points: 30,
        sortOrder: 2,
      },
      {
        questionId: q3.id,
        inputData: "[[1,4],[0,4]]",
        expectedOutput: "[[0,4]]",
        isHidden: true,
        points: 30,
        sortOrder: 3,
        explanation: "Unsorted input with nested boundaries",
      },
    ],
  });

  console.log("Questions and Test Cases seeded.");

  // 3. Seed Sample Interviews
  const interview1 = await prisma.interview.create({
    data: {
      title: "Senior Backend Systems Screen — Marcus Vance",
      interviewerId: interviewerUser.id,
      candidateEmail: "marcus.vance@example.com",
      candidateName: "Marcus Vance",
      inviteToken: "ivx-token-mv-2026-demo",
      status: "IN_PROGRESS",
      interviewType: "LIVE_CODING",
      scheduledAt: new Date(),
      durationMinutes: 60,
      startedAt: new Date(Date.now() - 15 * 60 * 1000), // 15 mins ago
      notes: "Candidate has 5+ years of experience with distributed key-value caches and storage engines.",
      allowedLanguages: JSON.stringify(["python", "javascript", "typescript", "cpp", "java"]),
    },
  });

  await prisma.interviewQuestion.createMany({
    data: [
      { interviewId: interview1.id, questionId: q1.id, orderIndex: 0, pointsAvailable: 100 },
      { interviewId: interview1.id, questionId: q2.id, orderIndex: 1, pointsAvailable: 100 },
    ],
  });

  // Completed Interview with Assessment Report
  const interview2 = await prisma.interview.create({
    data: {
      title: "Staff Data Structures & System Algorithms — Elena Rostova",
      interviewerId: interviewerUser.id,
      candidateEmail: "elena.rostova@example.com",
      candidateName: "Elena Rostova",
      inviteToken: "ivx-token-er-2026-completed",
      status: "COMPLETED",
      interviewType: "LIVE_CODING",
      scheduledAt: new Date(Date.now() - 24 * 3600 * 1000),
      durationMinutes: 60,
      startedAt: new Date(Date.now() - 24 * 3600 * 1000),
      endedAt: new Date(Date.now() - 23 * 3600 * 1000),
      notes: "Demonstrated strong knowledge of hash table complexity and amortized O(1) operations.",
    },
  });

  await prisma.interviewQuestion.create({
    data: {
      interviewId: interview2.id,
      questionId: q2.id,
      orderIndex: 0,
      pointsAvailable: 100,
    },
  });

  const sub1 = await prisma.submission.create({
    data: {
      interviewId: interview2.id,
      questionId: q2.id,
      candidateId: candidateUser.id,
      language: "javascript",
      sourceCode: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];
    if (map.has(diff)) {
      return \`\${map.get(diff)} \${i}\`;
    }
    map.set(nums[i], i);
  }
  return "";
}

console.log(twoSum([2, 7, 11, 15], 9));
`,
      status: "EVALUATED",
      deterministicScore: 100,
      maxScore: 100,
      executionTimeMs: 42.5,
      memoryUsedKb: 28400,
    },
  });

  const report1 = await prisma.assessmentReport.create({
    data: {
      interviewId: interview2.id,
      submissionId: sub1.id,
      rubricVersion: 1,
      deterministicScore: 100,
      maxScore: 100,
      percentageScore: 100.0,
      status: "RELEASED",
      reviewerNotes: "Candidate produced an optimal O(N) hash map solution with clean variable naming and strong algorithmic justification.",
      reviewerId: interviewerUser.id,
      releasedAt: new Date(),
    },
  });

  await prisma.feedbackItem.createMany({
    data: [
      {
        reportId: report1.id,
        category: "STRENGTH",
        title: "Optimal Time & Space Trade-off",
        content: "Leveraged Map data structure to achieve deterministic O(N) single-pass lookup rather than brute force O(N²).",
        evidenceReference: "Lines 2-9",
        authorType: "AI_ADVISORY",
      },
      {
        reportId: report1.id,
        category: "CODE_QUALITY",
        title: "Idiomatic Modern JavaScript",
        content: "Effective use of ES6 Map object, template literals, and clean variable scoping.",
        evidenceReference: "Lines 1-11",
        authorType: "INTERVIEWER",
      },
      {
        reportId: report1.id,
        category: "COMPLEXITY",
        title: "Verified Algorithmic Complexity",
        content: "Time complexity: O(N), Space complexity: O(N) auxiliary storage for hash index.",
        evidenceReference: "Deterministic benchmark: 42.5ms average latency",
        authorType: "AI_ADVISORY",
      },
    ],
  });

  // Audit Logs
  await prisma.auditLog.createMany({
    data: [
      {
        actorId: interviewerUser.id,
        actorEmail: interviewerUser.email,
        action: "INTERVIEW_CREATED",
        resourceType: "INTERVIEW",
        resourceId: interview1.id,
        metadata: JSON.stringify({ title: interview1.title, candidate: interview1.candidateName }),
      },
      {
        actorId: interviewerUser.id,
        actorEmail: interviewerUser.email,
        action: "REPORT_RELEASED",
        resourceType: "ASSESSMENT_REPORT",
        resourceId: report1.id,
        metadata: JSON.stringify({ score: 100, candidate: interview2.candidateName }),
      },
    ],
  });

  console.log("Database seeded successfully with all sample data!");
}

main()
  .catch((e) => {
    console.error("Error during database seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
