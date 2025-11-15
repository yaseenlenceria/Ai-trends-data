import { TrendingUp, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TrendBadgeProps {
  percentage: number;
  size?: "sm" | "default";
}

export default function TrendBadge({ percentage, size = "default" }: TrendBadgeProps) {
  const isPositive = percentage >= 0;
  const Icon = isPositive ? TrendingUp : TrendingDown;
  
  return (
    <Badge 
      className={`${size === "sm" ? "text-xs px-2 py-0.5" : "px-3 py-1"} font-mono font-bold ${
        isPositive 
          ? "bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400 border-green-500/20" 
          : "bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400 border-red-500/20"
      }`}
      data-testid={`trend-badge-${isPositive ? "positive" : "negative"}`}
    >
      <Icon className={`${size === "sm" ? "w-3 h-3" : "w-4 h-4"} mr-1`} />
      {Math.abs(percentage).toFixed(1)}%
    </Badge>
  );
}
