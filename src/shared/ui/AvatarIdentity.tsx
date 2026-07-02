import { cn } from "@/lib/utils";

interface AvatarIdentityProps {
  name?: string | null;
  username?: string | null;
  image?: string | null;
  examCategory?: string | null;
  rankTier?: "UNRANKED" | "BRONZE" | "SILVER" | "GOLD" | "DIAMOND" | null;
  size?: number;
  className?: string;
}

const COLORS = [
  "bg-[#0A2342]", // Navy
  "bg-[#1E3A8A]", // Indigo
  "bg-[#334155]", // Slate
  "bg-[#065F46]", // Emerald
  "bg-[#92400E]", // Amber
];

const getDeterministicColor = (seed: string) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % COLORS.length;
  return COLORS[index];
};

const getInitials = (name?: string | null) => {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return parts[0].slice(0, 2).toUpperCase();
};

export function AvatarIdentity({
  name,
  username,
  image,
  examCategory,
  rankTier = "BRONZE",
  size = 48,
  className,
}: AvatarIdentityProps) {
  const isMonogramPref = image?.endsWith("#monogram");
  const actualImage = image?.replace("#monogram", "");

  // We only consider the image valid if it's a Google Profile photo
  const isGoogle = !!actualImage && actualImage.includes("googleusercontent.com");

  const seed = username || name || "anonymous";
  const bgColor = getDeterministicColor(seed);
  const initials = getInitials(name);

  // Determine Rank Ring Color
  let ringColor = "ring-gray-200 border-white"; // UNRANKED fallback/default
  if (rankTier === "BRONZE") ringColor = "ring-[#CD7F32] border-white";
  if (rankTier === "SILVER") ringColor = "ring-gray-400 border-white";
  if (rankTier === "GOLD") ringColor = "ring-amber-400 border-white";
  if (rankTier === "DIAMOND") ringColor = "ring-cyan-400 border-white";

  // Exam Badge Text Mapping
  let badgeText = null;
  if (examCategory === "SSC") badgeText = "SSC";
  if (examCategory === "BANKING") badgeText = "BANK";
  if (examCategory === "RAILWAYS") badgeText = "RAIL";
  if (examCategory === "STATE_PSC") badgeText = "PSC";

  const badgeFontSize = size >= 64 ? "text-[10px]" : "text-[8px]";
  const badgePadding = size >= 64 ? "px-2 py-0.5" : "px-1.5 py-0.5";

  return (
    <div className={cn("relative inline-block", className)} style={{ width: size, height: size }}>
      <div
        className={cn(
          "w-full h-full rounded-full flex items-center justify-center overflow-hidden text-white font-bold tracking-wider ring-2 ring-offset-2 shadow-sm transition-all duration-300",
          !(isGoogle && !isMonogramPref) && bgColor,
          ringColor
        )}
        style={{ fontSize: size * 0.4 }}
      >
        {isGoogle && !isMonogramPref ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={actualImage!}
            alt={name || "Avatar"}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <span>{initials}</span>
        )}
      </div>

      {badgeText && (
        <div
          className={cn(
            "absolute -bottom-1 -right-3 bg-navy text-white font-bold rounded-full border-2 border-white shadow-md z-10",
            badgeFontSize,
            badgePadding
          )}
        >
          {badgeText}
        </div>
      )}
    </div>
  );
}
