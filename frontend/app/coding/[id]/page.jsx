"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";
import { codingAPI } from "@/lib/api";
import { useAuthStore } from "@/lib/store";

// Dynamic import for Monaco Editor (client-side only)
const CodeEditor = dynamic(() => import("@/components/CodeEditor"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-gray-900 rounded-lg flex items-center justify-center">
      <span className="text-gray-400">Loading editor...</span>
    </div>
  ),
});

const LANGUAGES = [
  { id: "JavaScript", name: "JavaScript", extension: "js" },
  { id: "Python", name: "Python", extension: "py" },
  { id: "Java", name: "Java", extension: "java" },
  { id: "C++", name: "C++", extension: "cpp" },
];

const DEFAULT_STARTER_CODE = {
  JavaScript: `// Write your solution here
function solution(input) {
  // Your code here
  return result;
}`,
  Python: `# Write your solution here
def solution(input):
    # Your code here
    return result`,
  Java: `// Write your solution here
public class Solution {
    public static void main(String[] args) {
        // Your code here
    }
}`,
  "C++": `// Write your solution here
#include <iostream>
using namespace std;

int main() {
    // Your code here
    return 0;
}`,
};

export default function ProblemDetail() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated, user } = useAuthStore();

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("JavaScript");
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [output, setOutput] = useState(null);
  const [activeTab, setActiveTab] = useState("description");
  const [userSolved, setUserSolved] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth");
      return;
    }

    fetchProblem();
  }, [isAuthenticated, router, params.id]);

  useEffect(() => {
    // Set starter code when language changes
    if (problem?.starterCode) {
      const starterCode =
        problem.starterCode.get?.(language) || DEFAULT_STARTER_CODE[language];
      if (!code || Object.values(DEFAULT_STARTER_CODE).includes(code)) {
        setCode(starterCode);
      }
    }
  }, [language, problem]);

  const fetchProblem = async () => {
    try {
      const response = await codingAPI.getProblemById(params.id);
      const problemData = response.data.problem;
      setProblem(problemData);
      setUserSolved(response.data.userSolved || false);

      // Set initial starter code
      const starterCode =
        problemData.starterCode?.get?.(language) ||
        DEFAULT_STARTER_CODE[language];
      setCode(starterCode || "");
    } catch (error) {
      toast.error("Failed to fetch problem");
      router.push("/coding");
    } finally {
      setLoading(false);
    }
  };

  const handleRun = async () => {
    if (!code.trim()) {
      toast.error("Please write some code");
      return;
    }

    setRunning(true);
    setOutput(null);

    try {
      const response = await codingAPI.runCode({
        problemId: params.id,
        code,
        language,
      });

      setOutput({
        type: "run",
        results: response.data.results,
      });
      setActiveTab("output");

      // Check if all passed
      const allPassed = response.data.results.every(
        (r) => r.status === "Accepted",
      );
      if (allPassed) {
        toast.success("All test cases passed!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to run code");
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!code.trim()) {
      toast.error("Please write some code");
      return;
    }

    setSubmitting(true);
    setOutput(null);

    try {
      const response = await codingAPI.submit({
        problemId: params.id,
        code,
        language,
      });

      if (response.data.allPassed) {
        toast.success("🎉 Accepted! Solution submitted successfully!");
        setUserSolved(true);
        setOutput({
          type: "submit",
          success: true,
          submission: response.data.submission,
        });
      } else {
        toast.error("Wrong Answer! Some test cases failed.");
        setOutput({
          type: "submit",
          success: false,
          submission: response.data.submission,
        });
      }
      setActiveTab("output");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit solution");
    } finally {
      setSubmitting(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-700 border-green-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Hard":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading problem...</p>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Problem not found</p>
          <button
            onClick={() => router.push("/coding")}
            className="text-primary hover:underline"
          >
            Go back to problems
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/coding")}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-gray-900">
                  {problem.title}
                </h1>
                {userSolved && (
                  <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium">
                    ✓ Solved
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getDifficultyColor(problem.difficulty)}`}
                >
                  {problem.difficulty}
                </span>
                <span className="text-gray-500 text-sm">
                  {problem.category}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Problem Description */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex">
                <button
                  onClick={() => setActiveTab("description")}
                  className={`px-6 py-3 text-sm font-medium border-b-2 ${
                    activeTab === "description"
                      ? "border-primary text-primary"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Description
                </button>
                <button
                  onClick={() => setActiveTab("examples")}
                  className={`px-6 py-3 text-sm font-medium border-b-2 ${
                    activeTab === "examples"
                      ? "border-primary text-primary"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Examples
                </button>
                <button
                  onClick={() => setActiveTab("output")}
                  className={`px-6 py-3 text-sm font-medium border-b-2 ${
                    activeTab === "output"
                      ? "border-primary text-primary"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Output
                  {output && (
                    <span className="ml-2 bg-primary text-white text-xs px-2 py-0.5 rounded-full">
                      New
                    </span>
                  )}
                </button>
              </nav>
            </div>

            {/* Content */}
            <div className="p-6">
              {activeTab === "description" && (
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap mb-6">
                    {problem.description}
                  </p>

                  {/* Constraints */}
                  {problem.constraints && problem.constraints.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-2">
                        Constraints
                      </h3>
                      <ul className="list-disc list-inside space-y-1 text-gray-600">
                        {problem.constraints.map((constraint, idx) => (
                          <li key={idx} className="font-mono text-sm">
                            {constraint}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Tags */}
                  {problem.tags && problem.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {problem.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "examples" && (
                <div className="space-y-4">
                  {problem.examples && problem.examples.length > 0 ? (
                    problem.examples.map((example, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                      >
                        <h4 className="font-semibold mb-2">
                          Example {idx + 1}
                        </h4>
                        <div className="space-y-2">
                          <p className="text-sm">
                            <span className="font-medium">Input:</span>{" "}
                            <code className="bg-gray-200 px-2 py-0.5 rounded text-sm">
                              {example.input}
                            </code>
                          </p>
                          <p className="text-sm">
                            <span className="font-medium">Output:</span>{" "}
                            <code className="bg-gray-200 px-2 py-0.5 rounded text-sm">
                              {example.output}
                            </code>
                          </p>
                          {example.explanation && (
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Explanation:</span>{" "}
                              {example.explanation}
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : problem.testCases && problem.testCases.length > 0 ? (
                    problem.testCases
                      .filter((tc) => !tc.isHidden)
                      .map((testCase, idx) => (
                        <div
                          key={idx}
                          className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                        >
                          <h4 className="font-semibold mb-2">
                            Test Case {idx + 1}
                          </h4>
                          <div className="space-y-2">
                            <p className="text-sm">
                              <span className="font-medium">Input:</span>{" "}
                              <code className="bg-gray-200 px-2 py-0.5 rounded text-sm">
                                {testCase.input}
                              </code>
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">Output:</span>{" "}
                              <code className="bg-gray-200 px-2 py-0.5 rounded text-sm">
                                {testCase.output}
                              </code>
                            </p>
                          </div>
                        </div>
                      ))
                  ) : (
                    <p className="text-gray-500">No examples available</p>
                  )}
                </div>
              )}

              {activeTab === "output" && (
                <div>
                  {!output ? (
                    <p className="text-gray-500 text-center py-8">
                      Run or submit your code to see the output
                    </p>
                  ) : output.type === "run" ? (
                    <div className="space-y-3">
                      {output.results.map((result, idx) => (
                        <div
                          key={idx}
                          className={`p-4 rounded-lg border ${
                            result.status === "Accepted"
                              ? "bg-green-50 border-green-200"
                              : "bg-red-50 border-red-200"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">
                              Test Case {idx + 1}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded text-xs font-medium ${
                                result.status === "Accepted"
                                  ? "bg-green-200 text-green-800"
                                  : "bg-red-200 text-red-800"
                              }`}
                            >
                              {result.status}
                            </span>
                          </div>
                          <div className="text-sm space-y-1">
                            <p>
                              <span className="font-medium">Input:</span>{" "}
                              <code className="bg-white px-1 rounded">
                                {result.input}
                              </code>
                            </p>
                            <p>
                              <span className="font-medium">Expected:</span>{" "}
                              <code className="bg-white px-1 rounded">
                                {result.expectedOutput}
                              </code>
                            </p>
                            <p>
                              <span className="font-medium">Output:</span>{" "}
                              <code className="bg-white px-1 rounded">
                                {result.actualOutput}
                              </code>
                            </p>
                            {result.runtime && (
                              <p>
                                <span className="font-medium">Runtime:</span>{" "}
                                {result.runtime.toFixed(2)} ms
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : output.type === "submit" ? (
                    <div
                      className={`p-4 rounded-lg border ${
                        output.success
                          ? "bg-green-50 border-green-200"
                          : "bg-red-50 border-red-200"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {output.success ? (
                          <span className="text-green-600 text-2xl">✓</span>
                        ) : (
                          <span className="text-red-600 text-2xl">✗</span>
                        )}
                        <span
                          className={`font-semibold ${
                            output.success ? "text-green-700" : "text-red-700"
                          }`}
                        >
                          {output.success ? "Accepted!" : "Wrong Answer"}
                        </span>
                      </div>
                      {output.submission && (
                        <p className="text-sm text-gray-600">
                          Runtime: {output.submission.runtime?.toFixed(2)} ms
                        </p>
                      )}
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Code Editor */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
            {/* Editor Header */}
            <div className="border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-gray-700">
                    Language:
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {LANGUAGES.map((lang) => (
                      <option key={lang.id} value={lang.id}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleRun}
                    disabled={running || submitting}
                    className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    {running ? "Running..." : "Run"}
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={running || submitting}
                    className="px-4 py-1.5 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    {submitting ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </div>
            </div>

            {/* Editor */}
            <div className="flex-1 min-h-[400px]">
              <CodeEditor value={code} onChange={setCode} language={language} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
