import React, { useEffect, useState } from "react";

type TimeLeft = {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
};

const ChristmasBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  type TimeKey = keyof TimeLeft;

  useEffect(() => {
    const endDate = new Date("2025-12-25T23:59:59");

    const updateTimer = () => {
      const now = new Date();
      now.setHours(now.getHours() + 3);
      const diff = endDate.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft({
          days: "00",
          hours: "00",
          minutes: "00",
          seconds: "00",
        });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({
        days: String(days).padStart(2, "0"),
        hours: String(hours).padStart(2, "0"),
        minutes: String(minutes).padStart(2, "0"),
        seconds: String(seconds).padStart(2, "0"),
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="relative w-full bg-gradient-to-r from-red-600 via-red-500 to-red-600 py-2 px-3 overflow-hidden">
      <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_8px,rgba(255,255,255,0.05)_8px,rgba(255,255,255,0.05)_16px)]"></div>

      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-white/20 via-white/40 to-white/20"></div>
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-white/20 via-white/40 to-white/20"></div>

      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-1.5 right-1.5 p-1 rounded-full bg-white/20 hover:bg-white/30 transition z-10"
        aria-label="Close banner"
      >
        <svg
          className="w-3.5 h-3.5 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="relative flex flex-col sm:flex-row items-center justify-center gap-3">
        <div className="flex items-center gap-2">
          <svg
            className="w-8 h-8"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <ellipse cx="32" cy="58" rx="16" ry="3" fill="rgba(0,0,0,0.2)" />
            <path
              d="M20 35 Q20 28 26 24 Q28 20 32 20 Q36 20 38 24 Q44 28 44 35 L44 45 Q44 52 32 52 Q20 52 20 45 Z"
              fill="#DC2626"
            />
            <ellipse cx="32" cy="45" rx="13" ry="8" fill="#B91C1C" />
            <path d="M32 20 Q28 20 26 24 L38 24 Q36 20 32 20 Z" fill="#7C2D12" />
            <circle cx="32" cy="16" r="5" fill="#FEF3C7" />
            <path
              d="M19 35 L45 35 Q46 35 46 36 Q46 37 45 37 L19 37 Q18 37 18 36 Q18 35 19 35 Z"
              fill="#FEFCE8"
            />
            <rect x="30" y="37" width="4" height="8" rx="1" fill="#FEFCE8" />
            <path
              d="M26 24 Q24 28 22 32 Q20 28 20 35 L44 35 Q44 28 42 32 Q40 28 38 24 Z"
              fill="#EF4444"
            />
          </svg>

          <div className="text-center sm:text-left">
            <h2 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wide drop-shadow-lg">
              Christmas Sale
            </h2>
            <p className="text-xs sm:text-sm text-red-100 font-medium">
              Up to <span className="font-bold text-white text-base">60% OFF</span> on <span className="font-bold text-white text-base">LIFETIME</span> plan
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {(Object.keys(timeLeft) as TimeKey[]).map((key, index) => (
            <React.Fragment key={key}>
              <div className="text-center">
                <div className="bg-white border border-red-200 px-2 py-1.5 rounded-md shadow-md min-w-[2.3rem]">
                  <span className="text-lg sm:text-xl font-bold text-red-600 tabular-nums">
                    {timeLeft[key]}
                  </span>
                </div>
                <span className="text-[9px] sm:text-[10px] text-red-100 uppercase font-semibold mt-0.5 block">
                  {key === "days" ? "days" : key === "hours" ? "hours" : key === "minutes" ? "min" : "sec"}
                </span>
              </div>

              {index < 3 && (
                <span className="text-white font-bold text-xl sm:text-2xl mb-3">:</span>
              )}
            </React.Fragment>
          ))}
        </div>

        <button
          onClick={() => (window.location.href = "/plans")}
          className="px-4 py-2 text-xs sm:text-sm font-bold text-red-600 bg-white rounded-lg hover:bg-red-50 transition-all shadow-lg hover:shadow-xl hover:scale-105 uppercase tracking-wide"
        >
          Get Offer
        </button>
      </div>
    </div>
  );
};

export default ChristmasBanner;
