"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { adminAPI } from "@/lib/api";
import { useAuthStore } from "@/lib/store";

export default function AdminProblems() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProblem, setEditingProblem] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficulty: "Medium",
    category: "",
    tags: "",
    constraints: "",
    examples: [{ input: "", output: "", explanation: "" }],
    testCases: [{ input: "", output: "", isHidden: false }],
    starterCode: {
      JavaScript: "",
      Python: "",
      Java: "",
      "C++": "",
    },
  });

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      router.push("/login");
      return;
    }

    fetchProblems();
  }, [isAuthenticated, router, user]);

  const fetchProblems = async () => {
    try {
      const response = await adminAPI.getProblems();
      setProblems(response.data.problems);
    } catch (error) {
      toast.error("Failed to fetch problems");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const problemData = {
      title: formData.title,
      description: formData.description,
      difficulty: formData.difficulty,
      category: formData.category,
      tags: formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      constraints: formData.constraints.split("\n").filter(Boolean),
      examples: formData.examples.filter((ex) => ex.input && ex.output),
      testCases: formData.testCases.filter((tc) => tc.input && tc.output),
      starterCode: Object.fromEntries(
        Object.entries(formData.starterCode).filter(([_, v]) => v),
      ),
    };

    try {
      if (editingProblem) {
        await adminAPI.updateProblem(editingProblem._id, problemData);
        toast.success("Problem updated successfully");
      } else {
        await adminAPI.createProblem(problemData);
        toast.success("Problem created successfully");
      }

      setShowModal(false);
      setEditingProblem(null);
      resetForm();
      fetchProblems();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save problem");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this problem?")) return;

    try {
      await adminAPI.deleteProblem(id);
      toast.success("Problem deleted successfully");
      fetchProblems();
    } catch (error) {
      toast.error("Failed to delete problem");
    }
  };

  const handleEdit = (problem) => {
    setEditingProblem(problem);
    setFormData({
      title: problem.title,
      description: problem.description,
      difficulty: problem.difficulty,
      category: problem.category,
      tags: problem.tags?.join(", ") || "",
      constraints: problem.constraints?.join("\n") || "",
      examples:
        problem.examples?.length > 0
          ? problem.examples
          : [{ input: "", output: "", explanation: "" }],
      testCases:
        problem.testCases?.length > 0
          ? problem.testCases.map((tc) => ({
              ...tc,
              isHidden: tc.isHidden || false,
            }))
          : [{ input: "", output: "", isHidden: false }],
      starterCode: problem.starterCode
        ? Object.fromEntries(problem.starterCode)
        : { JavaScript: "", Python: "", Java: "", "C++": "" },
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      difficulty: "Medium",
      category: "",
      tags: "",
      constraints: "",
      examples: [{ input: "", output: "", explanation: "" }],
      testCases: [{ input: "", output: "", isHidden: false }],
      starterCode: {
        JavaScript: "",
        Python: "",
        Java: "",
        "C++": "",
      },
    });
  };

  const addExample = () => {
    setFormData({
      ...formData,
      examples: [
        ...formData.examples,
        { input: "", output: "", explanation: "" },
      ],
    });
  };

  const removeExample = (index) => {
    setFormData({
      ...formData,
      examples: formData.examples.filter((_, i) => i !== index),
    });
  };

  const addTestCase = () => {
    setFormData({
      ...formData,
      testCases: [
        ...formData.testCases,
        { input: "", output: "", isHidden: false },
      ],
    });
  };

  const removeTestCase = (index) => {
    setFormData({
      ...formData,
      testCases: formData.testCases.filter((_, i) => i !== index),
    });
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-700";
      case "Medium":
        return "bg-yellow-100 text-yellow-700";
      case "Hard":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Problem Management
          </h1>
          <p className="text-gray-600 mt-1">
            Create, edit, and manage coding problems
          </p>
        </div>
        <button
          onClick={() => {
            setEditingProblem(null);
            resetForm();
            setShowModal(true);
          }}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Problem
        </button>
      </div>

      {/* Problems Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Difficulty
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Test Cases
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {problems.map((problem) => (
              <tr key={problem._id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {problem.title}
                  </div>
                  <div className="text-sm text-gray-500">{problem.slug}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                      problem.difficulty,
                    )}`}
                  >
                    {problem.difficulty}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {problem.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {problem.testCases?.length || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(problem)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(problem._id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {problems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No problems found</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 my-8 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-xl font-bold">
                {editingProblem ? "Edit Problem" : "Create New Problem"}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingProblem(null);
                }}
                className="text-gray-400 hover:text-gray-600"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g., Arrays, Dynamic Programming"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Difficulty *
                </label>
                <select
                  required
                  value={formData.difficulty}
                  onChange={(e) =>
                    setFormData({ ...formData, difficulty: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., array, hash table, dynamic programming"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Constraints (one per line)
                </label>
                <textarea
                  rows={3}
                  value={formData.constraints}
                  onChange={(e) =>
                    setFormData({ ...formData, constraints: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="1 <= n <= 10^5&#10;-10^9 <= arr[i] <= 10^9"
                />
              </div>

              {/* Examples */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Examples
                  </label>
                  <button
                    type="button"
                    onClick={addExample}
                    className="text-sm text-primary hover:underline"
                  >
                    + Add Example
                  </button>
                </div>
                <div className="space-y-3">
                  {formData.examples.map((example, idx) => (
                    <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-medium">
                          Example {idx + 1}
                        </span>
                        {formData.examples.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeExample(idx)}
                            className="text-red-500 text-sm"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <input
                          type="text"
                          placeholder="Input"
                          value={example.input}
                          onChange={(e) => {
                            const newExamples = [...formData.examples];
                            newExamples[idx].input = e.target.value;
                            setFormData({ ...formData, examples: newExamples });
                          }}
                          className="px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Output"
                          value={example.output}
                          onChange={(e) => {
                            const newExamples = [...formData.examples];
                            newExamples[idx].output = e.target.value;
                            setFormData({ ...formData, examples: newExamples });
                          }}
                          className="px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Explanation (optional)"
                          value={example.explanation}
                          onChange={(e) => {
                            const newExamples = [...formData.examples];
                            newExamples[idx].explanation = e.target.value;
                            setFormData({ ...formData, examples: newExamples });
                          }}
                          className="px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Test Cases */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Test Cases *
                  </label>
                  <button
                    type="button"
                    onClick={addTestCase}
                    className="text-sm text-primary hover:underline"
                  >
                    + Add Test Case
                  </button>
                </div>
                <div className="space-y-3">
                  {formData.testCases.map((testCase, idx) => (
                    <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-medium">
                          Test Case {idx + 1}
                        </span>
                        {formData.testCases.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeTestCase(idx)}
                            className="text-red-500 text-sm"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <input
                          type="text"
                          placeholder="Input"
                          required
                          value={testCase.input}
                          onChange={(e) => {
                            const newTestCases = [...formData.testCases];
                            newTestCases[idx].input = e.target.value;
                            setFormData({
                              ...formData,
                              testCases: newTestCases,
                            });
                          }}
                          className="px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Expected Output"
                          required
                          value={testCase.output}
                          onChange={(e) => {
                            const newTestCases = [...formData.testCases];
                            newTestCases[idx].output = e.target.value;
                            setFormData({
                              ...formData,
                              testCases: newTestCases,
                            });
                          }}
                          className="px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={testCase.isHidden}
                            onChange={(e) => {
                              const newTestCases = [...formData.testCases];
                              newTestCases[idx].isHidden = e.target.checked;
                              setFormData({
                                ...formData,
                                testCases: newTestCases,
                              });
                            }}
                            className="rounded"
                          />
                          Hidden
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Starter Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Starter Code (optional)
                </label>
                <div className="space-y-3">
                  {["JavaScript", "Python", "Java", "C++"].map((lang) => (
                    <div key={lang}>
                      <label className="block text-xs text-gray-500 mb-1">
                        {lang}
                      </label>
                      <textarea
                        rows={3}
                        value={formData.starterCode[lang] || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            starterCode: {
                              ...formData.starterCode,
                              [lang]: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
                        placeholder={`// Starter code for ${lang}`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingProblem(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition"
                >
                  {editingProblem ? "Update Problem" : "Create Problem"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
