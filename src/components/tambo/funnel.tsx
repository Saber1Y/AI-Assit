"use client";

import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import * as React from "react";
import { z } from "zod";
import type { FunnelStage } from "@/types/analytics";

/**
 * Type for funnel variant
 */
type FunnelVariant = "default" | "compact" | "horizontal";

/**
 * Variants for the Funnel component
 */
export const funnelVariants = cva(
  "rounded-lg border overflow-hidden transition-all duration-200",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground shadow-sm p-6",
        compact: "bg-card text-card-foreground shadow-sm p-4",
        horizontal: "bg-card text-card-foreground shadow-sm p-6",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

/**
 * Zod schema for Funnel stage
 */
const funnelStageSchema = z.object({
  stage: z.string().describe("Name of the funnel stage"),
  users: z.number().describe("Number of users at this stage"),
  conversionRate: z.number().describe("Conversion rate from previous stage"),
  dropoffRate: z.number().describe("Dropoff rate from previous stage"),
  averageTimeInStage: z.number().describe("Average time users spend in this stage (seconds)"),
});

/**
 * Zod schema for Funnel component
 */
export const funnelSchema = z.object({
  data: z.array(funnelStageSchema).describe("Array of funnel stage data"),
  title: z.string().optional().describe("Title for the funnel"),
  variant: z.enum(["default", "compact", "horizontal"]).optional().describe("Visual style variant"),
  showDropoffDetails: z.boolean().optional().describe("Whether to show detailed dropoff information"),
  showTimeInStage: z.boolean().optional().describe("Whether to show time spent in each stage"),
  colorScheme: z.enum(["blue", "green", "purple", "orange"]).optional().describe("Color scheme for the funnel"),
  className: z.string().optional().describe("Additional CSS classes for styling"),
});

export type FunnelProps = z.infer<typeof funnelSchema>;

/**
 * Color schemes for the funnel
 */
const colorSchemes = {
  blue: ['#3b82f6', '#2563eb', '#1d4ed8', '#1e40af', '#1e3a8a'],
  green: ['#22c55e', '#16a34a', '#15803d', '#166534', '#14532d'],
  purple: ['#a855f7', '#9333ea', '#7e22ce', '#6b21a8', '#581c87'],
  orange: ['#f97316', '#ea580c', '#c2410c', '#9a3412', '#7c2d12'],
};

/**
 * Format time duration in human readable format
 */
const formatDuration = (seconds: number): string => {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
};

/**
 * Funnel component for displaying conversion analysis
 */
export const Funnel = React.forwardRef<HTMLDivElement, FunnelProps>(
  ({ 
    className, 
    data, 
    title, 
    variant = 'default',
    showDropoffDetails = true,
    showTimeInStage = true,
    colorScheme = 'blue',
    ...props 
  }, ref) => {
    const colors = colorSchemes[colorScheme];
    
    // Calculate maximum width for funnel bars
    const maxUsers = Math.max(...data.map(d => d.users));
    
    // Render vertical funnel
    const renderVerticalFunnel = () => {
      return (
        <div className="space-y-3">
          {data.map((stage, index) => {
            const widthPercentage = (stage.users / maxUsers) * 100;
            const previousUsers = index > 0 ? data[index - 1].users : stage.users;
            const dropoffUsers = previousUsers - stage.users;
            
            return (
              <div key={stage.stage} className="relative">
                {/* Stage bar */}
                <div className="flex items-center gap-4">
                  <div className="w-32 text-sm font-medium text-right">
                    {stage.stage}
                  </div>
                  
                  <div className="flex-1 relative">
                    {/* Background bar */}
                    <div className="h-12 bg-muted rounded-full absolute inset-0" />
                    
                    {/* Actual data bar */}
                    <div
                      className="h-12 rounded-full flex items-center px-4 transition-all duration-500 relative"
                      style={{
                        width: `${widthPercentage}%`,
                        backgroundColor: colors[index % colors.length],
                      }}
                    >
                      <div className="text-white font-medium text-sm">
                        {stage.users.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  {/* Metrics */}
                  <div className="w-40 text-sm text-muted-foreground">
                    <div>{(stage.conversionRate * 100).toFixed(1)}% conv.</div>
                    {showDropoffDetails && index > 0 && dropoffUsers > 0 && (
                      <div className="text-red-500">
                        -{dropoffUsers.toLocaleString()} ({(stage.dropoffRate * 100).toFixed(1)}%)
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Time in stage */}
                {showTimeInStage && (
                  <div className="ml-36 text-xs text-muted-foreground mt-1">
                    Avg. time: {formatDuration(stage.averageTimeInStage)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      );
    };
    
    // Render horizontal funnel
    const renderHorizontalFunnel = () => {
      return (
        <div className="flex items-center gap-2">
          {data.map((stage, index) => {
            const barHeight = 80;
            const maxBarHeight = 200;
            const heightPercentage = (stage.users / maxUsers) * maxBarHeight;
            
            return (
              <div key={stage.stage} className="flex flex-col items-center gap-2 flex-1">
                {/* Stage bar */}
                <div
                  className="w-full transition-all duration-500 flex items-center justify-center text-white font-medium text-sm rounded-t-lg"
                  style={{
                    height: `${heightPercentage}px`,
                    backgroundColor: colors[index % colors.length],
                    minHeight: '20px',
                  }}
                >
                  {stage.users.toLocaleString()}
                </div>
                
                {/* Stage label */}
                <div className="text-sm font-medium text-center px-2">
                  {stage.stage}
                </div>
                
                {/* Conversion rate */}
                <div className="text-xs text-muted-foreground text-center">
                  {(stage.conversionRate * 100).toFixed(1)}%
                </div>
                
                {/* Dropoff */}
                {showDropoffDetails && index > 0 && (
                  <div className="text-xs text-red-500 text-center">
                    -{((data[index - 1].users - stage.users)).toLocaleString()}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      );
    };

    return (
      <div
        ref={ref}
        className={cn(funnelVariants({ variant }), className)}
        {...props}
      >
        {/* Title */}
        {title && (
          <h3 className="text-lg font-medium mb-4 text-foreground">
            {title}
          </h3>
        )}

        {/* Overall metrics */}
        <div className="grid grid-cols-3 gap-4 mb-6 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">
              {data[0]?.users.toLocaleString()}
            </div>
            <div className="text-muted-foreground">Started</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {data[data.length - 1]?.users.toLocaleString()}
            </div>
            <div className="text-muted-foreground">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {(data[data.length - 1]?.conversionRate * 100).toFixed(1)}%
            </div>
            <div className="text-muted-foreground">Total Conv.</div>
          </div>
        </div>

        {/* Funnel visualization */}
        {variant === 'horizontal' ? renderHorizontalFunnel() : renderVerticalFunnel()}
        
        {/* Summary insights */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <div className="text-sm text-muted-foreground">
            <strong>Key Insight:</strong> {((data[0]?.users - data[data.length - 1]?.users) / data[0]?.users * 100).toFixed(1)}% 
            {' '}of users drop off during the journey. 
            {data.length > 2 && ` The biggest drop occurs between ${data[1]?.stage} and ${data[2]?.stage}.`}
          </div>
        </div>
      </div>
    );
  },
);

Funnel.displayName = "Funnel";