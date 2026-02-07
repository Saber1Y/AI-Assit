"use client";

import { cn } from "@/lib/utils";
import { z } from "zod";

/**
 * Schema for Linear issue display component
 */
export const linearIssueSchema = z.object({
  id: z.string(),
  identifier: z.string(),
  title: z.string(),
  description: z.string().optional(),
  status: z.string(),
  priority: z.enum(["urgent", "high", "medium", "low"]),
  assignee: z.object({
    name: z.string(),
    avatarUrl: z.string().optional(),
  }).optional(),
  project: z.object({
    name: z.string(),
    color: z.string().optional(),
  }).optional(),
  labels: z.array(z.object({
    name: z.string(),
    color: z.string().optional(),
  })).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  dueDate: z.string().optional(),
  estimate: z.number().optional(),
});

export type LinearIssueProps = z.infer<typeof linearIssueSchema>;

/**
 * Priority color mapping
 */
const priorityColors = {
  urgent: "bg-red-500",
  high: "bg-orange-500", 
  medium: "bg-yellow-500",
  low: "bg-green-500",
};

/**
 * Status color mapping for common Linear statuses
 */
const statusColors = {
  "Backlog": "bg-gray-100 text-gray-700",
  "Todo": "bg-blue-100 text-blue-700",
  "In Progress": "bg-yellow-100 text-yellow-700",
  "Done": "bg-green-100 text-green-700",
  "Canceled": "bg-red-100 text-red-700",
};

/**
 * Linear Issue Component
 * 
 * Displays a Linear issue with all relevant information including
 * status, priority, assignee, project, and labels.
 */
export function LinearIssue({ 
  id,
  identifier,
  title,
  description,
  status,
  priority,
  assignee,
  project,
  labels,
  createdAt,
  updatedAt,
  dueDate,
  estimate,
}: LinearIssueProps) {
  const statusColor = statusColors[status as keyof typeof statusColors] || "bg-gray-100 text-gray-700";
  const priorityColor = priorityColors[priority];

  return (
    <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
      {/* Header with identifier and priority */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-foreground">{identifier}</h3>
          <div className={cn("w-2 h-2 rounded-full", priorityColor)} title={`Priority: ${priority}`} />
        </div>
        <span className={cn("px-2 py-1 rounded-full text-xs font-medium", statusColor)}>
          {status}
        </span>
      </div>

      {/* Title */}
      <h4 className="text-lg font-medium text-foreground mb-2">{title}</h4>

      {/* Description */}
      {description && (
        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{description}</p>
      )}

      {/* Metadata */}
      <div className="flex flex-wrap items-center gap-3 mb-3">
        {/* Assignee */}
        {assignee && (
          <div className="flex items-center gap-2">
            {assignee.avatarUrl ? (
              <img 
                src={assignee.avatarUrl} 
                alt={assignee.name}
                className="w-5 h-5 rounded-full"
              />
            ) : (
              <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center">
                <span className="text-xs">{assignee.name.charAt(0).toUpperCase()}</span>
              </div>
            )}
            <span className="text-sm text-muted-foreground">{assignee.name}</span>
          </div>
        )}

        {/* Project */}
        {project && (
          <div className="flex items-center gap-2">
            {project.color && (
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: project.color }}
              />
            )}
            <span className="text-sm text-muted-foreground">{project.name}</span>
          </div>
        )}

        {/* Estimate */}
        {estimate && (
          <span className="text-sm text-muted-foreground">
            {estimate}h
          </span>
        )}

        {/* Due Date */}
        {dueDate && (
          <span className="text-sm text-muted-foreground">
            Due: {new Date(dueDate).toLocaleDateString()}
          </span>
        )}
      </div>

      {/* Labels */}
      {labels && labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {labels.map((label, index) => (
            <span
              key={index}
              className={cn(
                "px-2 py-1 rounded text-xs font-medium",
                label.color 
                  ? `bg-opacity-10 text-opacity-80`
                  : "bg-gray-100 text-gray-700"
              )}
              style={{
                backgroundColor: label.color ? `${label.color}20` : undefined,
                color: label.color || undefined,
              }}
            >
              {label.name}
            </span>
          ))}
        </div>
      )}

      {/* Footer with timestamps */}
      <div className="text-xs text-muted-foreground border-t border-border pt-2">
        <div>Created {new Date(createdAt).toLocaleDateString()}</div>
        {updatedAt !== createdAt && (
          <div>Updated {new Date(updatedAt).toLocaleDateString()}</div>
        )}
      </div>
    </div>
  );
}