
import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  description?: string;
  trend?: {
    value: number;
    positive?: boolean;
  };
  className?: string;
}

export function SummaryCard({ title, value, icon, description, trend, className }: SummaryCardProps) {
  return (
    <Card className={cn("shadow-md overflow-hidden relative transition-all hover:shadow-lg", className)}>
      <div className="absolute top-0 left-0 h-full w-1 bg-primary/40"></div>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/30">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        {trend && (
          <div className={cn("flex items-center text-xs mt-2.5 font-medium rounded-full px-1.5 py-0.5 w-fit", 
            trend.positive ? "bg-safe/10 text-safe" : "bg-danger/10 text-danger"
          )}>
            <span className="mr-1">{trend.positive ? '↑' : '↓'}</span>
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
