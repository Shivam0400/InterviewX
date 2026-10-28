"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Code2, Plus, Trash2, ArrowRight, ChevronLeft, AlertCircle, Check } from "lucide-react";

export default function NewQuestionPage() {
  const router = useRouter();

  // Enforce RBAC: Candidates cannot add questions
  React.useEffect(() => {
    fetch("/api/v1/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user?.role === "CANDIDATE") {
          router.push("/dashboard");
        }
      })
      .catch(() => {});
  }, [router]);

  const [title, setTitle] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [difficulty, setDifficulty] = React.useState<"EASY" | "MEDIUM" | "HARD">("MEDIUM");
  const [topicTags, setTopicTags] = React.useState("Arrays, Two Pointers");
  const [timeLimitMs, setTimeLimitMs] = React.useState(2000);
  const [description, setDescription] = React.useState(`### Problem Description
Given an array of integers...

### Examples
- Input: [1, 2, 3]
- Output: 6

### Constraints
- $1 \\le N \\le 10^5$`);

  const [testCases, setTestCases] = React.useState([
    { inputData: "1 2 3", expectedOutput: "6", isHidden: false, points: 50 },
    { inputData: "-1 -2 -3", expectedOutput: "-6", isHidden: true, points: 50 },
  ]);

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    setSlug(
      val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
    );
  };

  const addTestCase = () => {
    setTestCases([
      ...testCases,
      { inputData: "", expectedOutput: "", isHidden: true, points: 25 },
    ]);
  };

  const removeTestCase = (index: number) => {
    if (testCases.length > 1) {
      setTestCases(testCases.filter((_, i) => i !== index));
    }
  };

  const updateTestCase = (index: number, field: string, val: any) => {
    const updated = [...testCases];
    (updated[index] as any)[field] = val;
    setTestCases(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug || !description) {
      setError("Please complete all required fields.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const tagsArray = topicTags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const res = await fetch("/api/v1/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          difficulty,
          topicTags: tagsArray,
          description,
          timeLimitMs,
          memoryLimitKb: 128000,
          starterCodes: {
            javascript: "// Solution\n",
            python: "# Solution\n",
          },
          testCases,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create question");

      router.push(`/questions/${data.question.id}`);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error creating question");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <Link
          href="/questions"
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Question Library
        </Link>
      </div>

      <div className="pb-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Create Assessment Challenge
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Define problem statement, execution constraints, and deterministic test cases.
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Specs */}
        <div className="p-5 rounded-xl bg-card border border-border/80 space-y-4">
          <h2 className="text-sm font-bold text-foreground">Challenge Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Problem Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-brand-500 font-medium"
                placeholder="e.g. Valid Anagram"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1">URL Slug</label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-background text-foreground font-mono"
                placeholder="valid-anagram"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-background text-foreground font-medium"
              >
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Topic Tags (comma-separated)</label>
              <input
                type="text"
                value={topicTags}
                onChange={(e) => setTopicTags(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-background text-foreground font-mono"
                placeholder="Arrays, Strings, Hash Table"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Wall Time Limit (ms)</label>
              <input
                type="number"
                min={500}
                max={5000}
                value={timeLimitMs}
                onChange={(e) => setTimeLimitMs(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-background text-foreground font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1">Markdown Problem Description</label>
            <textarea
              rows={6}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-background text-foreground font-mono leading-relaxed"
            />
          </div>
        </div>

        {/* Test Matrix */}
        <div className="p-5 rounded-xl bg-card border border-border/80 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-foreground">Verification Test Suites</h2>
              <p className="text-[11px] text-muted-foreground">
                Include both public examples and confidential hidden tests.
              </p>
            </div>

            <button
              type="button"
              onClick={addTestCase}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-background hover:bg-muted text-xs font-medium"
            >
              <Plus className="w-3.5 h-3.5 text-brand-500" />
              Add Test Case
            </button>
          </div>

          <div className="space-y-3">
            {testCases.map((tc, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-lg bg-background border border-border/80 space-y-3 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground font-mono">Test Case #{idx + 1}</span>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 cursor-pointer text-xs">
                      <input
                        type="checkbox"
                        checked={tc.isHidden}
                        onChange={(e) => updateTestCase(idx, "isHidden", e.target.checked)}
                        className="rounded border-border text-brand-600 focus:ring-brand-500"
                      />
                      <span className="text-muted-foreground font-medium">Keep Hidden on Server</span>
                    </label>

                    {testCases.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTestCase(idx)}
                        className="text-muted-foreground hover:text-destructive p-1 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-muted-foreground mb-0.5">
                      Input Data (stdin):
                    </label>
                    <textarea
                      rows={2}
                      value={tc.inputData}
                      onChange={(e) => updateTestCase(idx, "inputData", e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded border border-border bg-card font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-muted-foreground mb-0.5">
                      Expected Output:
                    </label>
                    <textarea
                      rows={2}
                      value={tc.expectedOutput}
                      onChange={(e) => updateTestCase(idx, "expectedOutput", e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded border border-border bg-card font-mono"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/questions"
            className="px-4 py-2 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-md transition-all disabled:opacity-50"
          >
            {loading ? "Saving Question..." : <>Save Question & Test Suites <ArrowRight className="w-3.5 h-3.5" /></>}
          </button>
        </div>
      </form>
    </div>
  );
}
