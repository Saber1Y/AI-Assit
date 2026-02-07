"use client";

import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import * as React from "react";
import { z } from "zod";
import type { InsightCard as InsightCardData } from "@/types/analytics";

/**
 * Type for insight card variant
 */
type InsightVariant = "default" | "compact" | "detailed";

/**
 * Variants for the Insight Card component
 */
export const insightCardVariants = cva(
  "rounded-lg border p-4 transition-all duration-200",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground shadow-sm p-6",
        compact: "bg-card text-card-foreground shadow-sm p-4",
        detailed: "bg-card text-card-foreground shadow-md p-6",
      },
      type: {
        trend: "border-l-4 border-l-blue-500",
        anomaly: "border-l-4 border-l-orange-500",
        recommendation: "border-l-4 border-l-green-500",
        warning: "border-l-4 border-l-yellow-500",
        success: "border-l-4 border-l-green-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

/**
 * Zod schema for Insight Card
 */
export const insightCardSchema = z.object({
  data: z.object({
    title: z.string().describe("Title of the insight"),
    description: z.string().describe("Description of the insight"),
    type: z.enum(["trend", "anomaly", "recommendation", "warning", "success"]).describe("Type of insight"),
    confidence: z.number().describe("Confidence score from 0 to 1"),
    impact: z.enum(["high", "medium", "low"]).describe("Business impact level"),
    actionable: z.boolean().describe("Whether the insight is actionable"),
    suggestedActions: z.array(z.string()).optional().describe("Suggested actions to take"),
    relatedMetrics: z.array(z.string()).optional().describe("Related metrics for this insight"),
  }).describe("Insight card data"),
  variant: z.enum(["default", "compact", "detailed"]).optional().describe("Visual style variant"),
  showConfidence: z.boolean().optional().describe("Whether to show confidence score"),
  showImpact: z.boolean().optional().describe("Whether to show impact level"),
  showActions: z.boolean().optional().describe("Whether to show suggested actions"),
  className: z.string().optional().describe("Additional CSS classes for styling"),
});

export type InsightCardComponentProps = z.infer<typeof insightCardSchema>;

/**
 * Get icon for insight type
 */
const getInsightIcon = (type: string): string => {
  switch (type) {
    case 'trend': return '📈';
    case 'anomaly': return '⚠️';
    case 'recommendation': return '💡';
    case 'warning': return '🚨';
    case 'success': return '✅';
    default: return 'ℹ️';
  }
};

/**
 * Get color for impact level
 */
const getImpactColor = (impact: string): string => {
  switch (impact) {
    case 'high': return 'text-red-600 bg-red-100';
    case 'medium': return 'text-yellow-600 bg-yellow-100';
    case 'low': return 'text-green-600 bg-green-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

/**
 * Get color for confidence score
 */
const getConfidenceColor = (confidence: number): string => {
  if (confidence >= 0.8) return 'text-green-600';
  if (confidence >= 0.6) return 'text-yellow-600';
  return 'text-red-600';
};

/**
 * Insight Card component for displaying AI-generated insights
 */
export const InsightCard = React.forwardRef<HTMLDivElement, InsightCardComponentProps>(
  ({ 
    className, 
    data, 
    variant = 'default',
    showConfidence = true,
    showImpact = true,
    showActions = true,
    ...props 
  }, ref) => {
    const [isExpanded, setIsExpanded] = React.useState(false);

    return (
      <div
        ref={ref}
        className={cn(insightCardVariants({ variant, type: data.type }), className)}
        {...props}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-3">
            <div className="text-2xl">
              {getInsightIcon(data.type)}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-foreground mb-1">
                {data.title}
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {data.description}
              </p>
            </div>
          </div>
          
          {/* Expand/Collapse button */}
          {(data.suggestedActions && data.suggestedActions.length > 0) && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {isExpanded ? '▼' : '▶'}
            </button>
          )}
        </div>

        {/* Metadata */}
        <div className="flex items-center gap-3 text-xs">
          {/* Confidence */}
          {showConfidence && (
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">Confidence:</span>
              <span className={cn("font-medium", getConfidenceColor(data.confidence))}>
                {Math.round(data.confidence * 100)}%
              </span>
            </div>
          )}
          
          {/* Impact */}
          {showImpact && (
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">Impact:</span>
              <span className={cn(
                "px-2 py-0.5 rounded-full font-medium",
                getImpactColor(data.impact)
              )}>
                {data.impact}
              </span>
            </div>
          )}
          
          {/* Actionable indicator */}
          {data.actionable && (
            <div className="flex items-center gap-1 text-blue-600">
              <span>🎯</span>
              <span>Actionable</span>
            </div>
          )}
        </div>

        {/* Related metrics */}
        {data.relatedMetrics && data.relatedMetrics.length > 0 && (
          <div className="mt-3 pt-3 border-t border-border/50">
            <div className="text-xs text-muted-foreground mb-1">Related metrics:</div>
            <div className="flex flex-wrap gap-1">
              {data.relatedMetrics.map(metric => (
                <span
                  key={metric}
                  className="px-2 py-1 bg-muted rounded text-xs text-foreground"
                >
                  {metric}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Suggested actions (expandable) */}
        {showActions && data.suggestedActions && data.suggestedActions.length > 0 && (
          <div className={cn(
            "mt-3 pt-3 border-t border-border/50 overflow-hidden transition-all duration-200",
            !isExpanded && "max-h-0"
          )}>
            <div className="text-sm font-medium text-foreground mb-2">
              Suggested Actions:
            </div>
            <ul className="space-y-2">
              {data.suggestedActions.map((action, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span className="text-foreground">{action}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  },
);

InsightCard.displayName = "InsightCard";

/**
 * Insight List component for displaying multiple insight cards
 */
interface InsightListProps extends React.HTMLAttributes<HTMLDivElement> {
  insights: InsightCardData[];
  variant?: InsightVariant;
  maxItems?: number;
  sortBy?: 'confidence' | 'impact' | 'type';
}

export const InsightList = React.forwardRef<HTMLDivElement, InsightListProps>(
  ({ className, insights, variant = 'default', maxItems, sortBy = 'confidence', ...props }, ref) => {
    // Sort insights
    const sortedInsights = React.useMemo(() => {
      const sorted = [...insights].sort((a, b) => {
        switch (sortBy) {
          case 'confidence':
            return b.confidence - a.confidence;
          case 'impact':
          const impactOrder: Record<string, number> = { high: 3, medium: 2, low: 1 };
          return impactOrder[b.impact] - impactOrder[a.impact];
          case 'type':
            return a.type.localeCompare(b.type);
          default:
            return 0;
        }
      });
      
      return maxItems ? sorted.slice(0, maxItems) : sorted;
    }, [insights, sortBy, maxItems]);

    return (
      <div ref={ref} className={cn("space-y-4", className)} {...props}>
        {sortedInsights.map((insight, index) => (
          <InsightCard
            key={index}
            data={insight}
            variant={variant}
          />
        ))}
        
        {insights.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <div className="text-4xl mb-2">🔍</div>
            <div>No insights available</div>
            <div className="text-sm">Check back later for new insights</div>
          </div>
        )}
      </div>
    );
  },
);

InsightList.displayName = "InsightList";