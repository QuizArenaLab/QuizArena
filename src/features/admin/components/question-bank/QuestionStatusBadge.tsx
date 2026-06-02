import { STATUS_CONFIG } from "@/features/admin/services/question-bank/constants";

interface QuestionStatusBadgeProps {
  status: string;
  size?: "sm" | "md";
}

export function QuestionStatusBadge({ status, size = "md" }: QuestionStatusBadgeProps) {
  const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG];

  if (!config) {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
        {status}
      </span>
    );
  }

  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs";

  return (
    <span
      className={`inline-flex items-center ${sizeClasses} rounded-full font-semibold border`}
      style={{
        backgroundColor: config.bgColor,
        color: config.color,
        borderColor: config.borderColor,
      }}
    >
      <span className="mr-1 text-[10px]">{config.icon}</span>
      {config.label}
    </span>
  );
}
