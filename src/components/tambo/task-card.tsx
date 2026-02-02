"use client";

import { cn } from "@/lib/utils";
import * as React from "react";
import { z } from "zod";
import { 
  Calendar, 
  Clock, 
  User, 
  Tag, 
  AlertCircle,
  CheckCircle2,
  Timer,
  Eye
} from "lucide-react";

// Define the props schema with descriptions for AI
export const taskCardSchema = z.object({
  id: z.string().describe("Unique identifier for the task"),
  title: z.string().describe("Title/name of the task"),
  description: z.string().optional().describe("Optional description of what the task involves"),
  status: z.enum(["todo", "in-progress", "review", "done"]).describe("Current status of the task"),
  priority: z.enum(["low", "medium", "high", "critical"]).describe("Priority level of the task"),
  assignee: z.string().optional().describe("Person assigned to this task"),
  dueDate: z.string().optional().describe("Due date in ISO format"),
  createdDate: z.string().describe("Date when task was created in ISO format"),
  updatedDate: z.string().describe("Date when task was last updated in ISO format"),
  project: z.string().describe("Name of the project this task belongs to"),
  tags: z.array(z.string()).optional().describe("Array of tags associated with the task"),
  estimatedHours: z.number().optional().describe("Estimated hours to complete the task"),
  actualHours: z.number().optional().describe("Actual hours spent on the task"),
  compact: z.boolean().optional().describe("Whether to show a compact version of the card"),
  onClick: z.function().optional().describe("Optional click handler for the card"),
}).describe("A card component that displays task information with status, priority, and metadata");

// Infer the props type from the schema
export type TaskCardProps = z.infer<typeof taskCardSchema> & 
  Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> & 
  { onClick?: () => void };

// Helper functions for display
const getStatusIcon = (status: string) => {
  switch (status) {
    case "done": return <CheckCircle2 className="h-4 w-4" />;
    case "in-progress": return <Timer className="h-4 w-4" />;
    case "review": return <Eye className="h-4 w-4" />;
    default: return <AlertCircle className="h-4 w-4" />;
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "critical": return "bg-red-100 text-red-800 border-red-200";
    case "high": return "bg-orange-100 text-orange-800 border-orange-200";
    case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "low": return "bg-green-100 text-green-800 border-green-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "done": return "bg-green-50 text-green-700 border-green-200";
    case "in-progress": return "bg-blue-50 text-blue-700 border-blue-200";
    case "review": return "bg-purple-50 text-purple-700 border-purple-200";
    default: return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

const isOverdue = (dueDate?: string, status?: string): boolean => {
  if (!dueDate || status === "done") return false;
  return new Date(dueDate) < new Date();
};

/**
 * TaskCard Component
 * 
 * A versatile card component for displaying task information with different
 * visual states based on status and priority. Supports both full and compact views.
 */
export const TaskCard = React.forwardRef<HTMLDivElement, TaskCardProps>(
  ({
    id,
    title,
    description,
    status,
    priority,
    assignee,
    dueDate,
    createdDate,
    updatedDate,
    project,
    tags,
    estimatedHours,
    actualHours,
    compact = false,
    onClick,
    className,
    ...props
  }, ref) => {
    
    const overdue = isOverdue(dueDate, status);
    
    return (
      <div
        ref={ref}
        className={cn(
          "bg-white border rounded-lg transition-all duration-200 hover:shadow-md",
          compact ? "p-3" : "p-4",
          overdue && "border-red-200 bg-red-50",
          onClick && "cursor-pointer hover:shadow-lg",
          className
        )}
        onClick={onClick}
        {...props}
      >
        {/* Header with title and status */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <h3 className={cn(
              "font-medium text-gray-900 truncate",
              compact ? "text-sm" : "text-base"
            )}>
              {title}
            </h3>
            {project && (
              <p className="text-xs text-gray-500 truncate mt-1">{project}</p>
            )}
          </div>
          
          <div className={cn(
            "flex items-center gap-1 px-2 py-1 rounded-full border text-xs font-medium",
            getStatusColor(status)
          )}>
            {getStatusIcon(status)}
            <span className="hidden sm:inline">{status.replace("-", " ")}</span>
          </div>
        </div>

        {/* Description */}
        {!compact && description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{description}</p>
        )}

        {/* Metadata */}
        <div className={cn(
          "flex flex-wrap gap-2 items-center",
          compact ? "text-xs" : "text-sm text-gray-500"
        )}>
          {/* Priority Badge */}
          <div className={cn(
            "px-2 py-1 rounded border text-xs font-medium",
            getPriorityColor(priority)
          )}>
            {priority}
          </div>

          {/* Assignee */}
          {assignee && (
            <div className="flex items-center gap-1 text-gray-500">
              <User className={compact ? "h-3 w-3" : "h-4 w-4"} />
              <span>{assignee}</span>
            </div>
          )}

          {/* Due Date */}
          {dueDate && (
            <div className={cn(
              "flex items-center gap-1",
              overdue && "text-red-600 font-medium"
            )}>
              <Calendar className={compact ? "h-3 w-3" : "h-4 w-4"} />
              <span>{new Date(dueDate).toLocaleDateString()}</span>
              {overdue && <AlertCircle className="h-3 w-3" />}
            </div>
          )}

          {/* Hours */}
          {!compact && (estimatedHours || actualHours) && (
            <div className="flex items-center gap-1 text-gray-500">
              <Clock className="h-4 w-4" />
              {actualHours && <span>{actualHours}h</span>}
              {actualHours && estimatedHours && <span>/</span>}
              {estimatedHours && <span>{estimatedHours}h</span>}
            </div>
          )}
        </div>

        {/* Tags */}
        {!compact && tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {tags.map((tag, index) => (
              <div
                key={index}
                className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
              >
                <Tag className="h-3 w-3" />
                {tag}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);

TaskCard.displayName = "TaskCard";

export default TaskCard;