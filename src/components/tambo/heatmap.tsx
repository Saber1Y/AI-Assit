"use client";

import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import * as React from "react";
import { z } from "zod";
import type { HeatmapData } from "@/types/analytics";

/**
 * Type for heatmap variant
 */
type HeatmapVariant = "default" | "compact" | "large";

/**
 * Variants for the Heatmap component
 */
export const heatmapVariants = cva(
  "rounded-lg border overflow-hidden transition-all duration-200",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground shadow-sm p-6",
        compact: "bg-card text-card-foreground shadow-sm p-4",
        large: "bg-card text-card-foreground shadow-md p-8",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

/**
 * Zod schema for Heatmap data point
 */
const heatmapDataPointSchema = z.object({
  x: z.string().describe("X-axis label for the data point"),
  y: z.string().describe("Y-axis label for the data point"),
  value: z.number().describe("Numerical value for the data point"),
  label: z.string().optional().describe("Optional display label"),
});

/**
 * Zod schema for Heatmap component
 */
export const heatmapSchema = z.object({
  data: z.array(heatmapDataPointSchema).describe("Array of heatmap data points"),
  title: z.string().optional().describe("Title for the heatmap"),
  xAxisLabel: z.string().optional().describe("Label for X-axis"),
  yAxisLabel: z.string().optional().describe("Label for Y-axis"),
  colorScheme: z.enum(["blue", "green", "red", "purple", "orange"]).optional().describe("Color scheme for the heatmap"),
  variant: z.enum(["default", "compact", "large"]).optional().describe("Visual style variant"),
  showTooltip: z.boolean().optional().describe("Whether to show tooltips on hover"),
  showLabels: z.boolean().optional().describe("Whether to show axis labels"),
  className: z.string().optional().describe("Additional CSS classes for styling"),
});

export type HeatmapProps = z.infer<typeof heatmapSchema>;

/**
 * Color schemes for the heatmap
 */
const colorSchemes = {
  blue: ['#f0f9ff', '#e0f2fe', '#bae6fd', '#7dd3fc', '#38bdf8', '#0ea5e9', '#0284c7', '#0369a1'],
  green: ['#f0fdf4', '#dcfce7', '#bbf7d0', '#86efac', '#4ade80', '#22c55e', '#16a34a', '#15803d'],
  red: ['#fef2f2', '#fee2e2', '#fecaca', '#fca5a5', '#f87171', '#ef4444', '#dc2626', '#b91c1c'],
  purple: ['#faf5ff', '#f3e8ff', '#e9d5ff', '#d8b4fe', '#c084fc', '#a855f7', '#9333ea', '#7e22ce'],
  orange: ['#fff7ed', '#fed7aa', '#fdba74', '#fb923c', '#f97316', '#ea580c', '#c2410c', '#9a3412'],
};

/**
 * Get color for a given value based on color scheme
 */
const getColorForValue = (value: number, maxValue: number, colorScheme: keyof typeof colorSchemes): string => {
  const colors = colorSchemes[colorScheme];
  const intensity = maxValue > 0 ? value / maxValue : 0;
  const index = Math.floor(intensity * (colors.length - 1));
  return colors[Math.min(index, colors.length - 1)];
};

/**
 * Heatmap component for displaying 2D intensity data
 */
export const Heatmap = React.forwardRef<HTMLDivElement, HeatmapProps>(
  ({ 
    className, 
    data, 
    title, 
    xAxisLabel, 
    yAxisLabel, 
    colorScheme = 'blue',
    variant = 'default',
    showTooltip = true,
    showLabels = true,
    ...props 
  }, ref) => {
    const [hoveredCell, setHoveredCell] = React.useState<{x: string; y: string; value: number; label?: string} | null>(null);
    const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });

    // Extract unique X and Y values for grid layout
    const xValues = Array.from(new Set(data.map(d => d.x))).sort();
    const yValues = Array.from(new Set(data.map(d => d.y))).sort();
    
    // Find maximum value for color scaling
    const maxValue = Math.max(...data.map(d => d.value), 1);

    // Handle mouse move for tooltip positioning
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    // Find data point for given coordinates
    const getDataPoint = (x: string, y: string) => {
      return data.find(d => d.x === x && d.y === y);
    };

    // Create grid cells
    const renderGrid = () => {
      return yValues.map(y => (
        <div key={y} className="flex">
          {showLabels && (
            <div className="w-16 text-xs text-muted-foreground flex items-center justify-end pr-2">
              {y}
            </div>
          )}
          <div className="flex">
            {xValues.map(x => {
              const point = getDataPoint(x, y);
              const value = point?.value || 0;
              const color = getColorForValue(value, maxValue, colorScheme);
              
              return (
                <div
                  key={`${x}-${y}`}
                  className={cn(
                    "border border-border/50 transition-all duration-200 cursor-pointer",
                    variant === 'compact' ? 'w-8 h-8' : variant === 'large' ? 'w-16 h-16' : 'w-12 h-12'
                  )}
                  style={{ backgroundColor: color }}
                  onMouseEnter={() => point && setHoveredCell({ x, y, value })}
                  onMouseLeave={() => setHoveredCell(null)}
                  title={point?.label || `${y} ${x}: ${value}`}
                />
              );
            })}
          </div>
        </div>
      ));
    };

    return (
      <div
        ref={ref}
        className={cn(heatmapVariants({ variant }), className)}
        onMouseMove={handleMouseMove}
        {...props}
      >
        {/* Title */}
        {title && (
          <h3 className="text-lg font-medium mb-4 text-foreground">
            {title}
          </h3>
        )}

        {/* Heatmap Grid */}
        <div className="flex flex-col">
          {/* X-axis labels */}
          {showLabels && (
            <div className="flex mb-2">
              <div className="w-16" />
              <div className="flex">
                {xValues.map(x => (
                  <div
                    key={x}
                    className={cn(
                      "text-xs text-muted-foreground text-center",
                      variant === 'compact' ? 'w-8' : variant === 'large' ? 'w-16' : 'w-12'
                    )}
                  >
                    {x}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Grid */}
          {renderGrid()}

          {/* Axis Labels */}
          <div className="flex items-center justify-between mt-4">
            {yAxisLabel && (
              <div className="text-sm text-muted-foreground">
                {yAxisLabel}
              </div>
            )}
            
            {/* Color scale legend */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="text-xs text-muted-foreground">Low</div>
                {colorSchemes[colorScheme].map((color, index) => (
                  <div
                    key={index}
                    className="w-4 h-4 border border-border/50"
                    style={{ backgroundColor: color }}
                  />
                ))}
                <div className="text-xs text-muted-foreground">High</div>
              </div>
            </div>
            
            {xAxisLabel && (
              <div className="text-sm text-muted-foreground">
                {xAxisLabel}
              </div>
            )}
          </div>
        </div>

        {/* Tooltip */}
        {showTooltip && hoveredCell && (
          <div
            className="fixed z-50 px-2 py-1 text-xs bg-popover text-popover-foreground border rounded shadow-lg pointer-events-none"
            style={{
              left: `${mousePosition.x + 10}px`,
              top: `${mousePosition.y - 30}px`,
            }}
          >
            <div className="font-medium">{hoveredCell.label || `${hoveredCell.y} ${hoveredCell.x}`}</div>
            <div>Value: {hoveredCell.value}</div>
          </div>
        )}
      </div>
    );
  },
);

Heatmap.displayName = "Heatmap";