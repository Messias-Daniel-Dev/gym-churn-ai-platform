import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "success" | "warning" | "danger";
}

export function MetricCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  variant = "default" 
}: MetricCardProps) {
  const variantStyles = {
    default: "border-border bg-card",
    success: "border-success/20 bg-gradient-to-br from-success/5 to-success/10",
    warning: "border-warning/20 bg-gradient-to-br from-warning/5 to-warning/10",
    danger: "border-destructive/20 bg-gradient-to-br from-destructive/5 to-destructive/10"
  };

  const iconStyles = {
    default: "text-muted-foreground",
    success: "text-success",
    warning: "text-warning",
    danger: "text-destructive"
  };

  return (
    <Card className={cn(
      "p-6 transition-all duration-200 hover:shadow-lg",
      variantStyles[variant]
    )}>
      <div className="flex items-center justify-between mb-2">
        <Icon className={cn("h-5 w-5", iconStyles[variant])} />
        {trend && (
          <span className={cn(
            "text-sm font-medium",
            trend.isPositive ? "text-success" : "text-destructive"
          )}>
            {trend.isPositive ? "+" : ""}{trend.value}%
          </span>
        )}
      </div>
      
      <div className="space-y-1">
        <h3 className="text-2xl font-bold text-foreground">{value}</h3>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>
    </Card>
  );
}