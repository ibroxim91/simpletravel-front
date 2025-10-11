export default function TourDetailLoading() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Image Skeleton */}
      <div className="w-full h-[400px] bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title and Price Section */}
        <div className="flex items-center justify-between mt-5 max-lg:flex-col max-lg:items-start gap-10">
          <div className="flex-1 w-full">
            <div className="flex items-center gap-2 mb-3">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-5 h-5 bg-gray-200 rounded-full animate-pulse"
                ></div>
              ))}
            </div>
            <div className="h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg w-3/4 animate-pulse mb-3"></div>
            <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg w-1/3 animate-pulse"></div>
          </div>
          <div>
            <div className="h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg w-48 animate-pulse mb-3"></div>
            <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg w-40 animate-pulse"></div>
          </div>
        </div>

        {/* Amenities Grid */}
        <div className="grid grid-cols-5 w-full items-start mt-5 gap-5 max-xl:grid-cols-2 max-md:grid-cols-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-16 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-pulse"
            ></div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-4 mt-5 max-lg:flex-col">
          <div className="h-12 bg-gradient-to-r from-blue-200 via-blue-300 to-blue-200 rounded-full w-64 max-lg:w-full animate-pulse"></div>
          <div className="h-12 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full w-64 max-lg:w-full animate-pulse"></div>
        </div>

        <hr className="mt-16 mb-16" />

        {/* Hotel Description */}
        <div className="mb-16">
          <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg w-64 animate-pulse mb-5"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-full animate-pulse"></div>
            <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-5/6 animate-pulse"></div>
            <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-4/6 animate-pulse"></div>
          </div>

          {/* Hotel Info Cards */}
          <div className="grid grid-cols-4 gap-5 mt-8 max-lg:grid-cols-2 max-md:grid-cols-1">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-48 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 rounded-2xl animate-pulse"
              ></div>
            ))}
          </div>
        </div>

        {/* Tour Included Items */}
        <div className="mb-16">
          <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg w-96 animate-pulse mb-5"></div>
          <div className="grid grid-cols-5 gap-4 max-xl:grid-cols-3 max-lg:grid-cols-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-32 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 rounded-xl animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Travel Plan Section */}
      <div className="w-full bg-gray-100 rounded-3xl mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="h-64 bg-gradient-to-r from-blue-200 via-blue-300 to-blue-200 rounded-2xl animate-pulse mb-10"></div>

          {/* Itinerary Items */}
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-40 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-xl animate-pulse"
              ></div>
            ))}
          </div>

          {/* Hotel Meals */}
          <div className="mt-20">
            <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg w-64 animate-pulse mb-5"></div>
            <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-1/2 animate-pulse mb-10"></div>
            <div className="grid grid-cols-5 gap-4 max-xl:grid-cols-3 max-lg:grid-cols-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-48 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 rounded-xl animate-pulse"
                ></div>
              ))}
            </div>
          </div>

          {/* Important Info Cards */}
          <div className="mt-16 grid grid-cols-2 gap-6 max-lg:grid-cols-1">
            <div className="h-96 bg-gradient-to-br from-blue-200 via-blue-300 to-blue-200 rounded-2xl animate-pulse"></div>
            <div className="h-96 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 rounded-2xl animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 py-10">
        <div className="h-64 bg-gradient-to-r from-blue-100 via-yellow-100 to-blue-100 rounded-3xl animate-pulse mb-10"></div>

        {/* Similar Tours */}
        <div className="mt-16">
          <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg w-96 animate-pulse mb-5"></div>
          <div className="grid grid-cols-4 gap-4 max-lg:grid-cols-2 max-md:grid-cols-1">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-80 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 rounded-xl animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}
