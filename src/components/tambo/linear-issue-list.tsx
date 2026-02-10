"use client";

import { cn } from "@/lib/utils";
import { LinearIssue, linearIssueSchema, type LinearIssueProps } from "./linear-issue";
import { z } from "zod";

/**
 * Schema for Linear issue list component
 */
export const linearIssueListSchema = z.object({
  issues: z.array(linearIssueSchema).min(1),
  title: z.string().optional(),
  showProject: z.boolean().optional(),
  showAssignee: z.boolean().optional(),
  groupBy: z.enum(["status", "priority", "project", "assignee", "none"]).optional(),
  maxItems: z.number().optional(),
});

export type LinearIssueListProps = z.infer<typeof linearIssueListSchema>;

/**
 * Group issues by specified criteria
 */
function groupIssues(issues: LinearIssueProps[], groupBy: string) {
  if (groupBy === "none") return { "All Issues": issues };

  return issues.reduce((groups, issue) => {
    let key: string;
    
    switch (groupBy) {
      case "status":
        key = issue.status;
        break;
      case "priority":
        key = issue.priority;
        break;
      case "project":
        key = issue.project?.name || "No Project";
        break;
      case "assignee":
        key = issue.assignee?.name || "Unassigned";
        break;
      default:
        key = "Other";
    }

    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(issue);
    return groups;
  }, {} as Record<string, LinearIssueProps[]>);
}

/**
 * Linear Issue List Component
 * 
 * Displays a list of Linear issues with optional grouping and filtering.
 */
export function LinearIssueList({ 
  issues, 
  title,
  groupBy = "none",
  maxItems,
}: LinearIssueListProps) {
  // Limit items if specified
  const displayIssues = maxItems ? issues.slice(0, maxItems) : issues;
  
  // Group issues if needed
  const groupedIssues = groupIssues(displayIssues, groupBy);
  const groupKeys = Object.keys(groupedIssues);

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      {/* Title */}
      {title && (
        <h2 className="text-xl font-semibold text-foreground mb-4">{title}</h2>
      )}

      {groupBy === "none" ? (
        // Simple list view
        <div className="space-y-3">
          {displayIssues.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No issues found</p>
          ) : (
            displayIssues.map((issue) => (
              <LinearIssue key={issue.id} {...issue} />
            ))
          )}
        </div>
      ) : (
        // Grouped view
        <div className="space-y-6">
          {groupKeys.map((groupKey) => (
            <div key={groupKey}>
              <h3 className="text-lg font-medium text-foreground mb-3 flex items-center justify-between">
                <span>{groupKey}</span>
                <span className="text-sm text-muted-foreground">
                  {groupedIssues[groupKey].length} {groupedIssues[groupKey].length === 1 ? 'issue' : 'issues'}
                </span>
              </h3>
              <div className="space-y-3">
                {groupedIssues[groupKey].map((issue) => (
                  <LinearIssue key={issue.id} {...issue} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Show more indicator if items were limited */}
      {maxItems && issues.length > maxItems && (
        <div className="text-center mt-4 pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Showing {maxItems} of {issues.length} issues
          </p>
        </div>
      )}
    </div>
  );
}