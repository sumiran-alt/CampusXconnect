"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";
import { codingAPI } from "@/lib/api";
import { useAuthStore } from "@/lib/store";

export default function ProblemDetail() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated } = useAuthStore();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("JavaScript");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    fetchProblem();
  }, [isAuthenticated, router, params]);

  const fetchProblem = async () => {
    try {
      const response = await codingAPI.getProblemById(params.id);
      setProblem(response.data.problem);
    } catch (error) {
      toast.error("Failed to fetch problem");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!code.trim()) {
      toast.error("Please write some code");
      return;
    }

    setSubmitting(true);

    try {
      const response = await codingAPI.submit({
        problemId: params.id,
        code,
        language,
        status: "Accepted",
      });

      toast.success("Solution submitted successfully!");
      setCode("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit solution");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!problem) {
    return <div className="text-center py-8">Problem not found</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <button
        onClick={() => router.back()}
        className="mb-4 text-primary hover:underline"
      >
        ← Back
      </button>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Problem Description */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold">{problem.title}</h1>
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                problem.difficulty === "Easy"
                  ? "bg-green-100 text-green-700"
                  : problem.difficulty === "Medium"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
              }`}
            >
              {problem.difficulty}
            </span>
          </div>

          <p className="text-gray-700 mb-6">{problem.description}</p>

          <h3 className="text-xl font-bold mb-4">Category</h3>
          <p className="text-gray-600 mb-6">{problem.category}</p>

          <h3 className="text-xl font-bold mb-4">Test Cases</h3>
          <div className="space-y-4">
            {problem.testCases?.map((testCase, idx) => (
              <div
                key={idx}
                className="bg-gray-50 p-4 rounded border border-gray-200"
              >
                <p className="text-sm font-semibold text-gray-700">
                  Test Case {idx + 1}
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  <strong>Input:</strong> {testCase.input}
                </p>
                <p className="text-gray-600 text-sm">
                  <strong>Output:</strong> {testCase.output}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Code Editor */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Submit Your Solution</h2>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
            >
              <option>JavaScript</option>
              <option>Python</option>
              <option>Java</option>
              <option>C++</option>
              <option>Go</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Code
            </label>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary font-mono text-sm"
              rows="15"
              placeholder="Write your solution here..."
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit Solution"}
          </button>

          {/* Submissions */}
          {problem.submissions?.length > 0 && (
            <div className="mt-6 pt-6 border-t">
              <h3 className="text-lg font-bold mb-4">Recent Submissions</h3>
              <div className="space-y-2">
                {problem.submissions.slice(0, 5).map((submission, idx) => (
                  <div key={idx} className="bg-gray-50 p-3 rounded text-sm">
                    <p className="font-semibold">{submission.user?.name}</p>
                    <p className="text-gray-600">
                      {submission.language} - {submission.status}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
