import { cn } from "@/lib/utils";

interface ProgressBarProps {
  progress: number;
  className?: string;
  showLabel?: boolean;
}

export default function ProgressBar({ progress, className, showLabel = true }: ProgressBarProps) {
  const getProgressColor = () => {
    if (progress === 100) return "bg-emerald-500";
    if (progress >= 75) return "bg-blue-500";
    if (progress >= 50) return "bg-amber-500";
    return "bg-slate-400";
  };

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-600">Progress</span>
          <span className={`text-sm font-semibold ${
            progress === 100 ? "text-emerald-600" : "text-slate-900"
          }`}>
            {progress}%
          </span>
        </div>
      )}
      <div className="w-full bg-slate-200 rounded-full h-2">
        <div
          className={cn("h-2 rounded-full transition-all duration-300", getProgressColor())}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </div>
  );
}
