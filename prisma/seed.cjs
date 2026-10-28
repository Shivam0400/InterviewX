const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding InterviewX database with Shivam Sony as Admin & Lead Interviewer, HackerRank/GFG style starter templates...");

  // Clear existing records
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

  // 1. Seed Shivam Sony as Admin & Lead Interviewer
  const adminUser = await prisma.user.create({
    data: {
      name: "Shivam Sony",
      email: "shivam.admin@interviewx.in",
      passwordHash,
      role: "ADMIN",
      avatarUrl: "/images/shivam-soni.png",
    },
  });

  const interviewerUser = await prisma.user.create({
    data: {
      name: "Shivam Sony",
      email: "legendshivam11@gmail.com",
      passwordHash,
      role: "INTERVIEWER",
      avatarUrl: "/images/shivam-soni.png",
    },
  });

  const reviewerUser = await prisma.user.create({
    data: {
      name: "Vikram Malhotra",
      email: "vikram.malhotra@interviewx.in",
      passwordHash,
      role: "REVIEWER",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    },
  });

  const candidateUser1 = await prisma.user.create({
    data: {
      name: "Rohan Mukherjee",
      email: "rohan.mukherjee@gmail.com",
      passwordHash,
      role: "CANDIDATE",
      avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
    },
  });

  await prisma.candidateProfile.create({
    data: {
      userId: candidateUser1.id,
      displayName: "Rohan Mukherjee",
      email: "rohan.mukherjee@gmail.com",
      headline: "Senior Backend Systems Engineer • 4+ yrs (Bengaluru)",
      experienceYears: 4,
      skillsJson: JSON.stringify(["Python", "Go", "Distributed Caches", "PostgreSQL", "Kafka"]),
    },
  });

  const candidateUser2 = await prisma.user.create({
    data: {
      name: "Sneha Patel",
      email: "sneha.patel@gmail.com",
      passwordHash,
      role: "CANDIDATE",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
  });

  await prisma.candidateProfile.create({
    data: {
      userId: candidateUser2.id,
      displayName: "Sneha Patel",
      email: "sneha.patel@gmail.com",
      headline: "Full-Stack Software Engineer • 3 yrs (Pune / Hyderabad)",
      experienceYears: 3,
      skillsJson: JSON.stringify(["TypeScript", "React", "Node.js", "SQL", "Redis"]),
    },
  });

  console.log("Users seeded with Shivam Sony as Admin and Lead Interviewer.");

  // 2. Seed Questions with Incomplete Competitive Programming Style Headers (HackerRank / GFG)
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
        javascript: `// User function Template for JavaScript (Node.js)
// Complete the 'LRUCache' class below.

class LRUCache {
  /**
   * @param {number} capacity
   */
  constructor(capacity) {
    this.capacity = capacity;
    // Complete the constructor initialization below
  }

  /**
   * @param {number} key
   * @return {number}
   */
  get(key) {
    // Complete the get method below: return value or -1
    return -1;
  }

  /**
   * @param {number} key
   * @param {number} value
   * @return {void}
   */
  put(key, value) {
    // Complete the put method below: add/update key-value and evict LRU
  }
}
`,
        python: `# User function Template for Python 3
# Complete the 'LRUCache' class below.

class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        # Complete constructor initialization below
        pass

    def get(self, key: int) -> int:
        # Complete get method below: return value or -1
        return -1

    def put(self, key: int, value: int) -> None:
        # Complete put method below: add/update key-value and evict LRU
        pass
`,
        typescript: `// User function Template for TypeScript
class LRUCache {
  private capacity: number;

  constructor(capacity: number) {
    this.capacity = capacity;
    // Complete constructor initialization below
  }

  get(key: number): number {
    // Complete get method below
    return -1;
  }

  put(key: number, value: number): void {
    // Complete put method below
  }
}
`,
        cpp: `// User function Template for C++
#include <iostream>
#include <unordered_map>
using namespace std;

class LRUCache {
private:
    int capacity;

public:
    LRUCache(int capacity) {
        this->capacity = capacity;
        // Complete constructor initialization
    }
    
    int get(int key) {
        // Complete get method
        return -1;
    }
    
    void put(int key, int value) {
        // Complete put method
    }
};
`,
      }),
      createdBy: interviewerUser.id,
    },
  });

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
- Output: \`1 2\``,
      starterCodes: JSON.stringify({
        javascript: `// User function Template for JavaScript (Node.js)

/**
 * Complete the 'twoSum' function below.
 * @param {number[]} nums - Array of integers
 * @param {number} target - Target integer sum
 * @return {string} Space-separated indices of the two numbers (e.g. "0 1")
 */
function twoSum(nums, target) {
  // Complete the function below
  return "";
}

// Driver Code
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
        python: `# User function Template for Python 3

def two_sum(nums, target):
    """
    Complete the function below.
    :param nums: List[int]
    :param target: int
    :return: str formatted as space-separated indices, e.g. "0 1"
    """
    # Write your solution here
    pass

# Driver Code
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
        typescript: `// User function Template for TypeScript

function twoSum(nums: number[], target: number): string {
  // Complete the function below
  return "";
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
- Output: \`[[1,6],[8,10],[15,18]]\``,
      starterCodes: JSON.stringify({
        javascript: `// User function Template for JavaScript (Node.js)

/**
 * Complete the 'mergeIntervals' function below.
 * @param {number[][]} intervals
 * @return {number[][]}
 */
function mergeIntervals(intervals) {
  // Complete the function below
  return [];
}

// Driver Code
console.log(JSON.stringify(mergeIntervals([[1,3],[2,6],[8,10],[15,18]])));
`,
        python: `# User function Template for Python 3

def merge_intervals(intervals):
    """
    Complete the function below.
    :param intervals: List[List[int]]
    :return: List[List[int]]
    """
    # Complete implementation below
    return []
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
      },
    ],
  });

  // 3. Seed Sample Interviews
  const interview1 = await prisma.interview.create({
    data: {
      title: "Senior Backend Systems Assessment — Rohan Mukherjee",
      interviewerId: interviewerUser.id,
      candidateEmail: "rohan.mukherjee@gmail.com",
      candidateName: "Rohan Mukherjee",
      inviteToken: "IVX-BLR-8492-RM",
      status: "IN_PROGRESS",
      interviewType: "LIVE_CODING",
      scheduledAt: new Date(),
      durationMinutes: 60,
      startedAt: new Date(Date.now() - 15 * 60 * 1000),
      notes: "Candidate has 4+ years of backend experience in Bengaluru focusing on distributed key-value storage and caching.",
      allowedLanguages: JSON.stringify(["python", "javascript", "typescript", "cpp", "java"]),
    },
  });

  await prisma.interviewQuestion.createMany({
    data: [
      { interviewId: interview1.id, questionId: q1.id, orderIndex: 0, pointsAvailable: 100 },
      { interviewId: interview1.id, questionId: q2.id, orderIndex: 1, pointsAvailable: 100 },
    ],
  });

  const interview2 = await prisma.interview.create({
    data: {
      title: "Full-Stack Data & Algorithms Interview — Sneha Patel",
      interviewerId: interviewerUser.id,
      candidateEmail: "sneha.patel@gmail.com",
      candidateName: "Sneha Patel",
      inviteToken: "IVX-PUN-3921-SP",
      status: "COMPLETED",
      interviewType: "LIVE_CODING",
      scheduledAt: new Date(Date.now() - 24 * 3600 * 1000),
      durationMinutes: 60,
      startedAt: new Date(Date.now() - 24 * 3600 * 1000),
      endedAt: new Date(Date.now() - 23 * 3600 * 1000),
      notes: "Demonstrated strong grasp of Map data structures and amortized O(1) space-time trade-offs.",
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
      candidateId: candidateUser2.id,
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
      executionTimeMs: 38.2,
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
        title: "Clean Modern JavaScript Idioms",
        content: "Effective use of ES6 Map object, template literals, and clean variable scoping.",
        evidenceReference: "Lines 1-11",
        authorType: "INTERVIEWER",
      },
      {
        reportId: report1.id,
        category: "COMPLEXITY",
        title: "Verified Algorithmic Complexity",
        content: "Time complexity: O(N), Space complexity: O(N) auxiliary storage for hash index.",
        evidenceReference: "Deterministic benchmark: 38.2ms latency",
        authorType: "AI_ADVISORY",
      },
    ],
  });

  console.log("Database seeded successfully with Shivam Sony and HackerRank/GFG templates!");
}

main()
  .catch((e) => {
    console.error("Error during database seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
