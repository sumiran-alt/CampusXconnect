export default function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
          {/* Header background skeleton */}
          <div className="h-32 bg-gray-300"></div>

          {/* Profile content */}
          <div className="px-8 py-6">
            <div className="flex items-start justify-between mb-6">
              {/* Profile picture skeleton */}
              <div className="flex items-start gap-6">
                <div className="relative -mt-20">
                  <div className="w-32 h-32 rounded-full bg-gray-300 border-4 border-white shadow-lg"></div>
                </div>

                {/* Basic info skeleton */}
                <div className="flex-1 pt-2">
                  <div className="h-8 bg-gray-300 rounded w-48 mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded w-32 mb-3"></div>
                  <div className="h-4 bg-gray-300 rounded w-56 mb-3"></div>
                  <div className="h-4 bg-gray-300 rounded w-40 mb-3"></div>
                  <div className="h-16 bg-gray-300 rounded w-72 mt-4"></div>
                </div>
              </div>

              {/* Buttons skeleton */}
              <div className="w-48 flex flex-col gap-2">
                <div className="h-10 bg-gray-300 rounded-lg"></div>
                <div className="h-10 bg-gray-300 rounded-lg"></div>
                <div className="h-10 bg-gray-300 rounded-lg"></div>
              </div>
            </div>

            {/* Stats skeleton */}
            <div className="grid grid-cols-3 gap-4 mb-8 pb-8 border-b">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-100 p-4 rounded-lg">
                  <div className="h-8 bg-gray-300 rounded w-12 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-20"></div>
                </div>
              ))}
            </div>

            {/* Skills skeleton */}
            <div className="mb-8">
              <div className="h-6 bg-gray-300 rounded w-20 mb-4"></div>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-8 bg-gray-300 rounded-full w-24"
                  ></div>
                ))}
              </div>
            </div>

            {/* Posts skeleton */}
            <div>
              <div className="h-6 bg-gray-300 rounded w-16 mb-4"></div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <div className="h-6 bg-gray-300 rounded w-full mb-3"></div>
                    <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-3"></div>
                    <div className="flex gap-4">
                      <div className="h-4 bg-gray-300 rounded w-20"></div>
                      <div className="h-4 bg-gray-300 rounded w-20"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
