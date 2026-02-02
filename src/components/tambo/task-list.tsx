"use client";

import { cn } from "@/lib/utils";
import { useTamboComponentState } from "@tambo-ai/react";
import * as React from "react";
import { z } from "zod";
import { TaskCard, TaskCardProps } from "./task-card";
import { 
  Filter,
  SortAsc,
  SortDesc,
  Grid,
  List,
  Search
} from "lucide-react";

// Define the props schema
export const taskListSchema = z.object({
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
  ).describe("Array of tasks to display"),
  viewMode: z.enum(["grid", "list"]).optional().describe("Display mode - grid or list layout"),
  showFilters: z.boolean().optional().describe("Whether to show filter controls"),
  compact: z.boolean().optional().describe("Whether to show compact version of cards"),
  searchable: z.boolean().optional().describe("Whether to include search functionality"),
  groupBy: z.enum(["status", "priority", "assignee", "project", "none"]).optional().describe("How to group the tasks"),
  emptyMessage: z.string().optional().describe("Message to show when no tasks are found"),
}).describe("A component that displays a list or grid of tasks with optional filtering, searching, and grouping");

// Infer the props type
export type TaskListProps = z.infer<typeof taskListSchema> & 
  React.HTMLAttributes<HTMLDivElement>;

// Define component state type
export type TaskListState = {
  searchQuery: string;
  viewMode: "grid" | "list";
  groupBy: "status" | "priority" | "assignee" | "project" | "none";
  selectedTaskIds: string[];
};

// Import task type from the data service
type Task = {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "review" | "done";
  priority: "low" | "medium" | "high" | "critical";
  assignee?: string;
  dueDate?: string;
  createdDate: string;
  updatedDate: string;
  project: string;
  tags?: string[];
  estimatedHours?: number;
  actualHours?: number;
};

// Grouping functions
const groupTasks = (tasks: Task[], groupBy: string) => {
  if (groupBy === "none") return { "All Tasks": tasks };
  
  return tasks.reduce((groups, task) => {
    const key = task[groupBy as keyof Task] || "Uncategorized";
    if (!groups[key as string]) groups[key as string] = [];
    groups[key as string].push(task);
    return groups;
  }, {} as Record<string, Task[]>);
};

// Filter tasks based on search
const filterTasks = (tasks: Task[], searchQuery: string) => {
  if (!searchQuery.trim()) return tasks;
  
  const query = searchQuery.toLowerCase();
  return tasks.filter(task => 
    task.title.toLowerCase().includes(query) ||
    (task.description && task.description.toLowerCase().includes(query)) ||
    (task.assignee && task.assignee.toLowerCase().includes(query)) ||
    (task.project && task.project.toLowerCase().includes(query)) ||
    (task.tags && task.tags.some((tag: string) => tag.toLowerCase().includes(query)))
  );
};

// Get priority order for sorting groups
const getPriorityOrder = (priority: string) => {
  const order = { "critical": 0, "high": 1, "medium": 2, "low": 3 };
  return order[priority as keyof typeof order] || 999;
};

// Get status order for sorting groups
const getStatusOrder = (status: string) => {
  const order = { "todo": 0, "in-progress": 1, "review": 2, "done": 3 };
  return order[status as keyof typeof order] || 999;
};

/**
 * TaskList Component
 * 
 * A flexible component for displaying tasks with various view modes, filtering,
 * searching, and grouping capabilities. Supports both grid and list layouts.
 */
export const TaskList = React.forwardRef<HTMLDivElement, TaskListProps>(
  ({
    tasks,
    viewMode = "grid",
    showFilters = true,
    compact = false,
    searchable = true,
    groupBy = "none",
    emptyMessage = "No tasks found",
    className,
    ...props
  }, ref) => {
    
    // Initialize Tambo component state
    const [state, setState] = useTamboComponentState<TaskListState>(
      `task-list`,
      {
        searchQuery: "",
        viewMode,
        groupBy,
        selectedTaskIds: [],
      }
    );

    // Handle search input
    const handleSearchChange = (query: string) => {
      setState?.({ ...state!, searchQuery: query });
    };

    // Handle view mode toggle
    const handleViewModeToggle = () => {
      const newMode = state?.viewMode === "grid" ? "list" : "grid";
      setState?.({ ...state!, viewMode: newMode });
    };

    // Handle group by change
    const handleGroupByChange = (newGroupBy: TaskListState["groupBy"]) => {
      setState?.({ ...state!, groupBy: newGroupBy });
    };

    // Filter and group tasks
    const filteredTasks = filterTasks(tasks, state?.searchQuery || "");
    const groupedTasks = groupTasks(filteredTasks, state?.groupBy || groupBy);

    // Sort group keys
    const sortedGroupKeys = Object.keys(groupedTasks).sort((a, b) => {
      if (state?.groupBy === "priority") {
        return getPriorityOrder(a) - getPriorityOrder(b);
      }
      if (state?.groupBy === "status") {
        return getStatusOrder(a) - getStatusOrder(b);
      }
      return a.localeCompare(b);
    });

    return (
      <div ref={ref} className={cn("w-full space-y-4", className)} {...props}>
        
        {/* Controls Header */}
        {showFilters && (
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white p-4 rounded-lg border">
            {/* Search */}
            {searchable && (
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={state?.searchQuery || ""}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}

            {/* Controls */}
            <div className="flex items-center gap-2">
              {/* Group By */}
              <select
                value={state?.groupBy || groupBy}
                onChange={(e) => handleGroupByChange(e.target.value as TaskListState["groupBy"])}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="none">No Grouping</option>
                <option value="status">Group by Status</option>
                <option value="priority">Group by Priority</option>
                <option value="assignee">Group by Assignee</option>
                <option value="project">Group by Project</option>
              </select>

              {/* View Mode Toggle */}
              <button
                onClick={handleViewModeToggle}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                title={`Switch to ${state?.viewMode === "grid" ? "list" : "grid"} view`}
              >
                {state?.viewMode === "grid" ? (
                  <List className="h-4 w-4" />
                ) : (
                  <Grid className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        )}

        {/* Task Display */}
        {filteredTasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Filter className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>{emptyMessage}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedGroupKeys.map((groupKey) => (
              <div key={groupKey}>
                {/* Group Header */}
                {state?.groupBy !== "none" && (
                  <h3 className="text-lg font-medium text-gray-900 mb-3 capitalize">
                    {groupKey} ({groupedTasks[groupKey].length})
                  </h3>
                )}

                {/* Tasks Grid/List */}
                <div
                  className={cn(
                    "gap-4",
                    state?.viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                      : "space-y-3"
                  )}
                >
                  {groupedTasks[groupKey].map((task: Task) => (
                    <TaskCard
                      key={task.id}
                      {...task}
                      compact={compact}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);

TaskList.displayName = "TaskList";

export default TaskList;