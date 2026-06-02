"use client";

interface DifficultyProgressionProps {
  difficulties: {
    difficulty: string;
    averageAccuracy: number;
    totalAttempts: number;
  }[];
}

export function DifficultyProgression({ difficulties }: DifficultyProgressionProps) {
  const levels = ["BEGINNER", "MEDIUM", "HARDCORE"];

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case "BEGINNER":
        return "bg-green-500";
      case "MEDIUM":
        return "bg-blue-500";
      case "HARDCORE":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getDifficultyLabel = (level: string) => {
    switch (level) {
      case "BEGINNER":
        return "Beginner";
      case "MEDIUM":
        return "Medium";
      case "HARDCORE":
        return "Hardcore";
      default:
        return level;
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-bold text-[#0A1C40] uppercase tracking-wider">
          Difficulty Progression
        </h3>
        <span className="text-xs font-bold text-gray-400 uppercase">Maturity Visibility</span>
      </div>

      <div className="flex flex-col gap-6">
        {levels.map((level) => {
          const stat = difficulties.find((d) => d.difficulty === level);
          const accuracy = stat?.averageAccuracy || 0;
          const attempts = stat?.totalAttempts || 0;

          return (
            <div key={level} className="relative">
              <div className="flex justify-between items-end mb-2">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                  {getDifficultyLabel(level)}
                </span>
                <span className="text-xs font-black text-[#0A1C40]">
                  {attempts > 0 ? `${accuracy.toFixed(1)}%` : "0%"}
                </span>
              </div>
              <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-700 ease-out ${getDifficultyColor(level)} ${attempts === 0 ? "opacity-20" : ""}`}
                  style={{ width: `${attempts > 0 ? accuracy : 0}%` }}
                />
              </div>
              <div className="mt-1 text-[10px] font-bold text-gray-400 uppercase">
                {attempts} Completed
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
