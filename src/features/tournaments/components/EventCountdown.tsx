"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface EventCountdownProps {
  targetDate: Date;
  label: string;
}

export function EventCountdown({ targetDate, label }: EventCountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(targetDate).getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <Clock className="w-5 h-5 text-blue-600" />
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">{label}</h3>
      </div>

      <div className="grid grid-cols-4 gap-4 text-center">
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
          <div className="text-2xl font-black text-[#0A1C40]">{timeLeft.days}</div>
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">
            Days
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
          <div className="text-2xl font-black text-[#0A1C40]">{timeLeft.hours}</div>
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">
            Hours
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
          <div className="text-2xl font-black text-[#0A1C40]">{timeLeft.minutes}</div>
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">
            Mins
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
          <div className="text-2xl font-black text-blue-600">{timeLeft.seconds}</div>
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">
            Secs
          </div>
        </div>
      </div>
    </div>
  );
}
