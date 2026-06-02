import { Calendar, ShieldAlert } from "lucide-react";

interface SeasonalBannerProps {
  seasonName: string;
  category: string;
  description: string | null;
  status: "UPCOMING" | "ACTIVE" | "ENDED" | "ARCHIVED";
  endsAt: Date;
}

export function SeasonalBanner({
  seasonName,
  category,
  description,
  status,
  endsAt,
}: SeasonalBannerProps) {
  const isEndingSoon =
    status === "ACTIVE" && new Date(endsAt).getTime() - new Date().getTime() < 86400000 * 3;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-[#0A1C40] to-[#1a365d] text-white p-8 shadow-xl">
      <div className="absolute top-0 right-0 p-8 opacity-10">
        <ShieldAlert className="w-48 h-48" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-white/10 rounded-full border border-white/20">
            {category}
          </span>
          <span
            className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border ${
              status === "ACTIVE"
                ? "bg-green-500/20 text-green-300 border-green-500/30"
                : status === "UPCOMING"
                  ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                  : "bg-gray-500/20 text-gray-300 border-gray-500/30"
            }`}
          >
            {status}
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">{seasonName}</h1>

        {description && (
          <p className="text-blue-100 max-w-2xl text-lg mb-8 leading-relaxed">{description}</p>
        )}

        {isEndingSoon && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/30 text-red-200">
            <Calendar className="w-5 h-5" />
            <span className="font-medium">Season ends soon. Finalize your ranking.</span>
          </div>
        )}
      </div>
    </div>
  );
}
