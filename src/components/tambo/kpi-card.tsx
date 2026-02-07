"use client";

import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import * as React from "react";
import { z } from "zod";
import type { KPIData } from "@/types/analytics";

/**
 * Type for KPI card variant
 */
type KPIVariant = "default" | "compact" | "large";

/**
 * Type for KPI card trend
 */
type KPITrend = "increase" | "decrease" | "neutral";

/**
 * Variants for the KPI card component
 */
export const kpiCardVariants = cva(
  "rounded-lg border p-6 transition-all duration-200",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground shadow-sm",
        compact: "bg-card text-card-foreground shadow-sm p-4",
        large: "bg-card text-card-foreground shadow-md p-8",
      },
      trend: {
        increase: "border-l-4 border-l-green-500",
        decrease: "border-l-4 border-l-red-500",
        neutral: "border-l-4 border-l-gray-300",
      },
    },
    defaultVariants: {
      variant: "default",
      trend: "neutral",
    },
  },
);

/**
 * Props for the KPI card component
 */
interface KPICardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** KPI data to display */
  data: KPIData;
  /** Visual style variant */
  variant?: KPIVariant;
  /** Whether to show trend indicator */
  showTrend?: boolean;
  /** Whether to show target progress */
  showTarget?: boolean;
}

/**
 * Format value based on format type
 */
const formatValue = (value: number | string, format?: string): string => {
  if (typeof value === 'string') return value;
  
  switch (format) {
    case 'currency':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(value);
    case 'percentage':
      return `${value}%`;
    case 'duration':
      const minutes = Math.floor(value / 60);
      const seconds = value % 60;
      return `${minutes}m ${seconds}s`;
    default:
      return new Intl.NumberFormat('en-US').format(value);
  }
};

/**
 * Zod schema for KPI card
 */
export const kpiCardSchema = z.object({
  data: z.object({
    title: z.string().describe("Title of the KPI"),
    value: z.union([z.number(), z.string()]).describe("Current value of the KPI"),
    previousValue: z.union([z.number(), z.string()]).optional().describe("Previous period value for comparison"),
    change: z.number().optional().describe("Percentage change from previous period"),
    changeType: z.enum(["increase", "decrease", "neutral"]).optional().describe("Type of change"),
    format: z.enum(["currency", "percentage", "number", "duration"]).optional().describe("How to format the value"),
    target: z.number().optional().describe("Target value for this KPI"),
    targetAchieved: z.boolean().optional().describe("Whether the target has been achieved"),
  }).describe("KPI data object"),
  variant: z.enum(["default", "compact", "large"]).optional().describe("Visual style variant"),
  showTrend: z.boolean().optional().describe("Whether to show trend indicator"),
  showTarget: z.boolean().optional().describe("Whether to show target progress"),
});

export type KPIProps = z.infer<typeof kpiCardSchema>;

/**
 * KPI Card component for displaying key performance indicators
 */
export const KPI = React.forwardRef<HTMLDivElement, KPICardProps>(
  ({ className, data, variant, showTrend = true, showTarget = true, ...props }, ref) => {
    const trendType = data.changeType || 
      (data.change && data.change > 0 ? 'increase' : data.change && data.change < 0 ? 'decrease' : 'neutral');

    return (
      <div
        ref={ref}
        className={cn(kpiCardVariants({ variant, trend: trendType }), className)}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            {data.title}
          </h3>
          {data.targetAchieved !== undefined && (
            <div className={cn(
              "w-2 h-2 rounded-full",
              data.targetAchieved ? "bg-green-500" : "bg-yellow-500"
            )} />
          )}
        </div>

        {/* Main Value */}
        <div className="flex items-baseline gap-2">
          <div className="text-2xl font-semibold">
            {formatValue(data.value, data.format)}
          </div>
          
          {/* Trend Indicator */}
          {showTrend && data.change && (
            <div className={cn(
              "flex items-center text-sm font-medium",
              data.changeType === 'increase' ? 'text-green-600' : 
              data.changeType === 'decrease' ? 'text-red-600' : 
              'text-gray-500'
            )}>
              <span className="mr-1">
                {data.changeType === 'increase' ? '↑' : 
                 data.changeType === 'decrease' ? '↓' : '→'}
              </span>
              {Math.abs(data.change)}%
            </div>
          )}
        </div>

        {/* Previous Value */}
        {data.previousValue && (
          <div className="text-xs text-muted-foreground mt-1">
            Previous: {formatValue(data.previousValue, data.format)}
          </div>
        )}

        {/* Target Progress */}
        {showTarget && data.target && typeof data.value === 'number' && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Target</span>
              <span>{Math.round((data.value / data.target) * 100)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  data.targetAchieved ? "bg-green-500" : "bg-yellow-500"
                )}
                style={{ width: `${Math.min((data.value / data.target) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>
    );
  },
);

KPI.displayName = "KPI";