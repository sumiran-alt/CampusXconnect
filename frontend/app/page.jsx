"use client";

import Link from "next/link";
import { useAuthStore } from "@/lib/store";

export default function Home() {
  const { isAuthenticated } = useAuthStore();

  return (
    <main className="min-h-screen bg-white">
      <style>{`
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInScale {
          0% {
            opacity: 0;
            transform: scale(0.95);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .animate-fade-up {
          animation: fadeInUp 0.8s ease-out;
        }

        .animate-fade-scale {
          animation: fadeInScale 0.8s ease-out;
        }

        .delay-1 {
          animation-delay: 0.1s;
        }

        .delay-2 {
          animation-delay: 0.2s;
        }

        .delay-3 {
          animation-delay: 0.3s;
        }

        .delay-4 {
          animation-delay: 0.4s;
        }

        .floating {
          animation: float 3s ease-in-out infinite;
        }

        .gradient-text {
          background: linear-gradient(135deg, #2563EB 0%, #7C3AED 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .btn-primary {
          @apply inline-flex items-center justify-center px-8 py-3 md:px-10 md:py-4 bg-blue-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:bg-blue-700 active:scale-95;
        }

        .btn-secondary {
          @apply inline-flex items-center justify-center px-8 py-3 md:px-10 md:py-4 border-2 border-gray-300 text-gray-900 font-semibold rounded-xl transition-all duration-300 hover:border-blue-600 hover:text-blue-600 hover:shadow-md;
        }

        .blob {
          position: absolute;
          background: linear-gradient(135deg, #E0E7FF 0%, #EDE9FE 100%);
          border-radius: 50%;
          opacity: 0.6;
          filter: blur(40px);
        }

        .bg-grid {
          background-image: 
            linear-gradient(to right, rgba(0, 0, 0, 0.02) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.02) 1px, transparent 1px);
          background-size: 50px 50px;
        }
      `}</style>

      {/* HERO SECTION - Modern SaaS Design */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-20 md:pt-0">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50"></div>
        <div className="blob absolute top-20 left-10 w-72 h-72 -z-10"></div>
        <div className="blob absolute bottom-20 right-20 w-96 h-96 -z-10 animation-delay-2000"></div>

        <div className="max-w-7xl mx-auto px-6 w-full z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="flex flex-col justify-center">
              {/* Main Headline */}
              <h1 className="animate-fade-up delay-1 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight text-gray-900 mb-6" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 900, letterSpacing: '-0.03em' }}>
                Build Your{" "}
                <span className="gradient-text">Campus Network</span>
                {" "}Before Graduation
              </h1>

              {/* Subheadline */}
              <p className="animate-fade-up delay-2 text-lg md:text-xl text-gray-600 leading-relaxed mb-10 max-w-lg font-normal">
                Connect with students, collaborate on coding projects, share ideas, and grow your professional network while still in college.
              </p>

              {/* CTA Buttons */}
              <div className="animate-fade-up delay-3 flex flex-col sm:flex-row gap-4 md:gap-6">
                {!isAuthenticated ? (
                  <>
                    <Link href="/auth" className="btn-primary text-base md:text-lg">
                      Get Started
                    </Link>
                    <Link href="/feed" className="btn-secondary text-base md:text-lg">
                      Browse as Guest
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/feed" className="btn-primary text-base md:text-lg">
                      Go to Feed
                    </Link>
                    <Link href="/search" className="btn-secondary text-base md:text-lg">
                      Explore Students
                    </Link>
                  </>
                )}
              </div>

              {/* Trust Badges */}
              <div className="animate-fade-up delay-4 mt-12 flex items-center gap-8 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">✓</div>
                  <span>Trusted by 10K+ students</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">✓</div>
                  <span>100% Free Platform</span>
                </div>
              </div>
            </div>

            {/* Right Column - Illustration & Cards */}
            <div className="animate-fade-scale delay-2 relative h-96 md:h-full min-h-96 hidden md:flex items-center justify-center">
              {/* Main Illustration */}
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Center Illustration */}
                <img 
                  src="https://static.licdn.com/aero-v1/sc/h/dxf91zhqd2z6b0bwg85ktm5s4" 
                  alt="Professional community" 
                  className="w-4/5 h-4/5 object-cover rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEARCH JOBS SECTION */}
      <section className="bg-gray-50 border-b py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 tracking-tight">
                Find the right internship or job for you
              </h2>
              <div className="space-y-4">
                <Link href="/jobs" className="block p-4 bg-white rounded-lg hover:shadow-md transition border border-gray-200">
                  <p className="font-semibold text-gray-900">Find a job →</p>
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-lg p-8 h-80 flex items-center justify-center border border-gray-200 overflow-hidden">
              <img 
                src="https://source.unsplash.com/?photo=U1Vie3iFguI&w=800&q=80" 
                alt="Job Opportunities - hands holding looking for a job paper"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>

          {/* Job Categories */}
          <div className="mt-12">
            <div className="flex flex-wrap gap-3">
              {["Engineering", "Business Development", "Finance", "Design", "Marketing", "Sales"].map((cat) => (
                <button key={cat} className="px-5 py-2 border-2 border-gray-400 text-gray-700 rounded-full hover:border-blue-600 hover:text-blue-600 transition font-medium text-sm">
                  {cat}
                </button>
              ))}
              <button className="px-5 py-2 border-2 border-gray-400 text-gray-700 rounded-full hover:bg-gray-100 transition font-medium text-sm">
                Show more ▼
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION - Keep Original */}
      <section className="bg-white border-b py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 font-semibold">Network</h3>
              <p className="text-gray-600 text-base leading-relaxed">
                Connect with like-minded students, build your professional network, and discover collaborators.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 font-semibold">Collaborate</h3>
              <p className="text-gray-600 text-base leading-relaxed">
                Share your projects, find team members, and build amazing things together.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
              <div className="text-4xl mb-4">💻</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 font-semibold">Code</h3>
              <p className="text-gray-600 text-base leading-relaxed">
                Practice coding problems, solve challenges, and compete on the leaderboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DISCOVER TOOLS/PROJECTS SECTION */}
      <section className="bg-gray-50 border-b py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 tracking-tight">
                Discover amazing projects
              </h2>
              <p className="text-gray-600 mb-8 text-base md:text-lg leading-relaxed">
                Connect with builders who have hands-on experience to find the best projects for you.
              </p>
              <Link href="/projects" className="inline-block px-6 py-3 border-2 border-gray-400 text-gray-700 rounded-full hover:bg-gray-100 transition font-semibold">
                Explore Projects →
              </Link>
            </div>

            <div className="bg-white rounded-lg p-8 h-80 flex items-center justify-center border border-gray-200">
              <div className="text-center">
                <div className="text-6xl mb-4">📁</div>
                <p className="text-gray-600">Projects & Ideas</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GAMES SECTION */}
      <section className="bg-white border-b py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="bg-purple-50 rounded-lg p-8 h-80 flex items-center justify-center border border-purple-200">
              <div className="text-center">
                <div className="text-6xl mb-4">🎮</div>
                <p className="text-gray-600 font-medium">Gamification</p>
              </div>
            </div>

            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 tracking-tight">
                Keep your mind sharp with games
              </h2>
              <p className="text-gray-600 mb-8 text-base md:text-lg leading-relaxed">
                Take a break and reconnect with your network through quick daily games.
              </p>
              <Link href="/coding" className="inline-block px-6 py-3 border-2 border-gray-400 text-gray-700 rounded-full hover:bg-gray-100 transition font-semibold">
                Try Now →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CONNECT SECTION */}
      <section className="bg-gray-50 border-b py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 tracking-tight">
                Connect with people who can help
              </h2>
              <p className="text-gray-600 mb-8 text-base md:text-lg leading-relaxed">
                Explore a diverse network of students, find mentors, and build lasting professional relationships.
              </p>
              <Link href="/connections" className="inline-block px-6 py-3 border-2 border-gray-400 text-gray-700 rounded-full hover:bg-gray-100 transition font-semibold">
                Find People You Know →
              </Link>
            </div>

            <div className="bg-blue-50 rounded-lg p-8 h-80 flex items-center justify-center border border-blue-200">
              <div className="text-center">
                <div className="text-6xl mb-4">🤝</div>
                <p className="text-gray-600">Networking</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHO IS CAMPUSXCONNECT FOR SECTION */}
      <section className="bg-white border-b py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="bg-orange-50 rounded-lg p-8 h-80 flex items-center justify-center border border-orange-200">
              <div className="text-center">
                <div className="text-6xl mb-4">🎓</div>
                <p className="text-gray-600 font-medium">For Students</p>
              </div>
            </div>

            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 tracking-tight">
                Who is CampusXConnect for?
              </h2>
              <p className="text-gray-600 mb-8 text-base leading-relaxed">
                Anyone looking to navigate their academic and professional life.
              </p>

              <div className="space-y-3">
                <Link href="/search" className="block p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
                  <p className="font-semibold text-gray-900 text-base">Find a classmate or coworker</p>
                </Link>

                <Link href="/jobs" className="block p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
                  <p className="font-semibold text-gray-900 text-base">Find an internship or job</p>
                </Link>

                <Link href="/projects" className="block p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
                  <p className="font-semibold text-gray-900 text-base">Find a project to work on</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* JOIN SECTION */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 border-b py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-8 tracking-tight">
            Join your classmates, colleagues, and friends on CampusXConnect
          </h2>
          
          <Link
            href="/signup"
            className="inline-block px-8 py-4 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition text-lg shadow-md hover:shadow-lg"
          >
            Get started
          </Link>

          <div className="mt-16 text-center">
            <div className="text-6xl mb-4">🏫</div>
            <p className="text-gray-600 font-medium">Campus Community</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-300 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-5 gap-12 mb-12">
            <div>
              <h4 className="font-semibold text-white mb-6 text-base">About</h4>
              <ul className="space-y-3">
                <li><Link href="#" className="text-gray-400 hover:text-white transition text-sm">About CampusXConnect</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition text-sm">Blog</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition text-sm">Careers</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-6 text-base">Browse</h4>
              <ul className="space-y-3">
                <li><Link href="/feed" className="text-gray-400 hover:text-white transition text-sm">Feed</Link></li>
                <li><Link href="/jobs" className="text-gray-400 hover:text-white transition text-sm">Jobs</Link></li>
                <li><Link href="/communities" className="text-gray-400 hover:text-white transition text-sm">Community Types</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-6 text-base">Profile</h4>
              <ul className="space-y-3">
                <li><Link href="/communities" className="text-gray-400 hover:text-white transition text-sm">Communities</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-6 text-base">Business</h4>
              <ul className="space-y-3">
                <li><Link href="#" className="text-gray-400 hover:text-white transition text-sm">For Recruiters</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition text-sm">For Companies</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-6 text-base">Legal</h4>
              <ul className="space-y-3">
                <li><Link href="#" className="text-gray-400 hover:text-white transition text-sm">Privacy</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition text-sm">Terms</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition text-sm">Cookies</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8">
            <p className="text-gray-400 text-sm text-center">&copy; 2026 CampusXConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
