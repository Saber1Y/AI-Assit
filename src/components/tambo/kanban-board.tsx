"use client";

import { cn } from "@/lib/utils";
import * as React from "react";
import { z } from "zod";
import { TaskCard, TaskCardProps } from "./task-card";

// Define props schema
export const kanbanBoardSchema = z.object({
  tasks: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string().optional(),
      status: z.enum(["todo", "in-progress", "review", "done"]),
      priority: z.enum(["low", "medium", "high", "critical"]),
      assignee: z.string().optional(),
      dueDate: z.string().optional(),
      createdDate: z.string(),
      updatedDate: z.string(),
      project: z.string(),
      tags: z.array(z.string()).optional(),
      estimatedHours: z.number().optional(),
      actualHours: z.number().optional(),
    })
  ).describe("Array of tasks to display in kanban columns"),
  columns: z.array(z.string()).optional().describe("Custom column names. Defaults to standard workflow columns"),
  compact: z.boolean().optional().describe("Whether to show compact version of cards"),
  showColumnCounts: z.boolean().optional().describe("Whether to show task count in column headers"),
  emptyMessage: z.string().optional().describe("Message to show when no tasks are found"),
}).describe("A kanban board component that displays tasks in columns by status with drag-and-drop visual organization");

// Infer props type
export type KanbanBoardProps = z.infer<typeof kanbanBoardSchema> & 
  React.HTMLAttributes<HTMLDivElement>;

// Default columns
const defaultColumns = ["To Do", "In Progress", "In Review", "Done"];

// Status mapping to columns
const statusToColumn = (status: string): string => {
  switch (status) {
    case "todo": return "To Do";
    case "in-progress": return "In Progress";
    case "review": return "In Review";
    case "done": return "Done";
    default: return "To Do";
  }
};

// Get column header styling
const getColumnColor = (column: string): string => {
  switch (column) {
    case "To Do": return "bg-blue-50 text-blue-700 border-blue-200";
    case "In Progress": return "bg-purple-50 text-purple-700 border-purple-200";
    case "In Review": return "bg-yellow-50 text-yellow-700 border-yellow-200";
    case "Done": return "bg-green-50 text-green-700 border-green-200";
    default: return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

/**
 * KanbanBoard Component
 * 
 * A kanban board that organizes tasks into columns by status.
 * Features drag-and-drop visual cues, column counts, and responsive design.
 */
export const KanbanBoard = React.forwardRef<HTMLDivElement, KanbanBoardProps>(
  ({
    tasks,
    columns = defaultColumns,
    compact = false,
    showColumnCounts = true,
    emptyMessage = "No tasks to display",
    className,
    ...props
  }, ref) => {
    
    // Group tasks by status
    const tasksByColumn = tasks.reduce((acc, task) => {
      const columnName = statusToColumn(task.status);
      if (!acc[columnName]) {
        acc[columnName] = [];
      }
      acc[columnName].push(task);
      return acc;
    }, {} as Record<string, typeof tasks>);

    return (
      <div ref={ref} className={cn("w-full overflow-x-auto", className)} {...props}>
        <div className="flex gap-4 min-w-max p-4">
          {columns.map((column) => {
            const columnTasks = tasksByColumn[column] || [];
            const columnColor = getColumnColor(column);
            
            return (
              <div key={column} className="flex-shrink-0 w-80">
                {/* Column Header */}
                <div className={cn(
                  "px-4 py-3 rounded-t-lg border font-medium text-sm",
                  columnColor
                )}>
                  <div className="flex items-center justify-between">
                    <span>{column}</span>
                    {showColumnCounts && (
                      <span className="bg-white bg-opacity-50 px-2 py-1 rounded-full text-xs">
                        {columnTasks.length}
                      </span>
                    )}
                  </div>
                </div>

                {/* Column Body */}
                <div className="bg-gray-50 border-x border-b border-gray-200 min-h-[400px] p-4 rounded-b-lg">
                  {columnTasks.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <div className="text-2xl mb-2">📋</div>
                      <p className="text-sm">No tasks here</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {columnTasks.map((task) => (
                        <div
                          key={task.id}
                          className="transform transition-transform hover:scale-[1.02] cursor-move"
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.setData('text/plain', task.id);
                          }}
                        >
                          <TaskCard
                            {...task}
                            compact={compact}
                            className="shadow-sm border-gray-300"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

KanbanBoard.displayName = "KanbanBoard";

export default KanbanBoard;