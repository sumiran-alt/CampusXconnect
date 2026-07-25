"use client";

import Link from "next/link";
import { useAuthStore } from "@/lib/store";

export default function Home() {
  const { isAuthenticated } = useAuthStore();

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to CampusXConnect
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Connect, Collaborate, and Code with Students from Dronacharya Group
            of Institutions
          </p>

          {!isAuthenticated ? (
            <div className="flex gap-4 justify-center">
              <Link
                href="/signup"
                className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Get Started
              </Link>
              <Link
                href="/login"
                className="bg-white text-primary px-8 py-3 rounded-lg font-semibold border-2 border-primary hover:bg-blue-50 transition"
              >
                Login
              </Link>
            </div>
          ) : (
            <Link
              href="/feed"
              className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition inline-block"
            >
              Go to Feed
            </Link>
          )}
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-bold mb-3">Network</h3>
            <p className="text-gray-600">
              Connect with like-minded students, build your professional
              network, and discover collaborators.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-xl font-bold mb-3">Collaborate</h3>
            <p className="text-gray-600">
              Share your projects, find team members, and build amazing things
              together.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="text-4xl mb-4">💻</div>
            <h3 className="text-xl font-bold mb-3">Code</h3>
            <p className="text-gray-600">
              Practice coding problems, solve challenges, and compete on the
              leaderboard.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
