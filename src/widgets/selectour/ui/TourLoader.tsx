import { useEffect, useState } from "react";

export default function CircleLoader() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 100); // har 100ms da 1% qo‘shadi (10 sekundda to‘liq)

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="relative w-40 h-40 flex items-center justify-center">
        {/* Dumaloq aylanuvchi halqa */}
        <div className="absolute w-full h-full border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>

        {/* O‘rtadagi foiz */}
        <span className="text-xl font-bold text-blue-600">
          {progress}%
        </span>
      </div>
    </div>
  );
}
