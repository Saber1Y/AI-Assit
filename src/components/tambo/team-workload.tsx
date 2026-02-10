"use client";

import { cn } from "@/lib/utils";
import * as React from "react";
import { z } from "zod";
import { 
  Users, 
  TrendingUp, 
  Clock,
  AlertTriangle
} from "lucide-react";

// Define props schema
export const teamWorkloadSchema = z.object({
  teamMembers: z.array(
    z.object({
      name: z.string().describe("Name of the team member"),
      assignedHours: z.number().describe("Total hours assigned to this person"),
      completedHours: z.number().optional().describe("Total hours completed by this person"),
      capacity: z.number().optional().describe("Maximum work capacity in hours"),
      efficiency: z.number().optional().describe("Work efficiency as a percentage"),
      currentTasks: z.number().optional().describe("Number of tasks currently assigned"),
      skillSet: z.array(z.string()).optional().describe("Array of skills or specializations"),
      status: z.enum(["available", "busy", "overloaded", "unavailable"]).optional().describe("Current availability status"),
    })
  ).min(1).describe("Array of team members with their workload information"),
  timeRange: z.enum(["today", "week", "month", "sprint"]).optional().describe("Time period for workload calculation"),
  showDetails: z.boolean().optional().describe("Whether to show detailed breakdown"),
  compact: z.boolean().optional().describe("Whether to show compact version"),
}).describe("A team workload visualization component showing capacity utilization, task distribution, and availability across team members");

// Infer props type
export type TeamWorkloadProps = z.infer<typeof teamWorkloadSchema> & 
  React.HTMLAttributes<HTMLDivElement>;

// Get workload color based on percentage
const getWorkloadColor = (percentage: number): string => {
  if (percentage >= 90) return "bg-red-500";
  if (percentage >= 75) return "bg-orange-500";
  if (percentage >= 50) return "bg-yellow-500";
  return "bg-green-500";
};

// Get status color
const getStatusColor = (status: string): string => {
  switch (status) {
    case "available": return "bg-green-100 text-green-800";
    case "busy": return "bg-yellow-100 text-yellow-800";
    case "overloaded": return "bg-red-100 text-red-800";
    case "unavailable": return "bg-gray-100 text-gray-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

// Get status icon
const getStatusIcon = (status: string) => {
  switch (status) {
    case "available": return <Users className="h-4 w-4" />;
    case "busy": return <Clock className="h-4 w-4" />;
    case "overloaded": return <AlertTriangle className="h-4 w-4" />;
    default: return <Clock className="h-4 w-4" />;
  }
};

/**
 * TeamWorkload Component
 * 
 * Visualizes team capacity utilization, task distribution, and availability.
 * Features progress bars, status indicators, and detailed breakdowns.
 */
export const TeamWorkload = React.forwardRef<HTMLDivElement, TeamWorkloadProps>(
  ({
    teamMembers,
    timeRange = "week",
    showDetails = true,
    compact = false,
    className,
    ...props
  }, ref) => {
    
    const totalCapacity = teamMembers.reduce((sum, member) => sum + (member.capacity || 40), 0);
    const totalAssigned = teamMembers.reduce((sum, member) => sum + member.assignedHours, 0);

    return (
      <div ref={ref} className={cn("bg-white rounded-lg border border-gray-200", className)} {...props}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Team Workload
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>This {timeRange}</span>
            </div>
          </div>
          
          {/* Summary Stats */}
          <div className="mt-3 grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {teamMembers.length}
              </div>
              <div className="text-xs text-gray-600">Team Members</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {totalAssigned}h
              </div>
              <div className="text-xs text-gray-600">Assigned</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {totalCapacity}h
              </div>
              <div className="text-xs text-gray-600">Capacity</div>
            </div>
          </div>
        </div>

        {/* Team Members List */}
        <div className={cn(
          "p-4 space-y-4",
          !showDetails && "p-6"
        )}>
          {teamMembers.map((member, index) => {
            const percentage = ((member.assignedHours / (member.capacity || 40)) * 100);
            const workloadColor = getWorkloadColor(percentage);
            const statusColor = getStatusColor(member.status || "available");
            
            return (
              <div key={member.name} className={cn(
                "border border-gray-200 rounded-lg p-4",
                !compact ? "bg-white" : "bg-gray-50"
              )}>
                {/* Member Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-700">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{member.name}</h4>
                      <div className={cn(
                        "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                        statusColor
                      )}>
                        {getStatusIcon(member.status || "available")}
                        <span>{member.status || "available"}</span>
                      </div>
                    </div>
                  </div>
                  
                  {member.efficiency && (
                    <div className="text-right">
                      <div className="text-xs text-gray-600">Efficiency</div>
                      <div className={cn(
                        "text-lg font-semibold",
                        member.efficiency >= 90 ? "text-green-600" :
                        member.efficiency >= 75 ? "text-yellow-600" : "text-red-600"
                      )}>
                        {member.efficiency}%
                      </div>
                    </div>
                  )}
                </div>

                {/* Workload Progress Bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Workload</span>
                    <span className="text-sm text-gray-600">
                      {member.assignedHours}h / {member.capacity || 40}h
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={cn(
                        "h-3 rounded-full transition-all duration-300",
                        workloadColor
                      )}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-600">{percentage.toFixed(0)}% utilized</span>
                    {percentage >= 100 && (
                      <span className="text-xs text-red-600 font-medium">Over capacity!</span>
                    )}
                  </div>
                </div>

                {/* Detailed Information */}
                {showDetails && (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {member.currentTasks && (
                      <div>
                        <span className="text-gray-600">Current Tasks:</span>
                        <span className="font-medium text-gray-900 ml-1">
                          {member.currentTasks}
                        </span>
                      </div>
                    )}
                    
                    {member.completedHours && (
                      <div>
                        <span className="text-gray-600">Completed:</span>
                        <span className="font-medium text-gray-900 ml-1">
                          {member.completedHours}h
                        </span>
                      </div>
                    )}
                    
                    {member.skillSet && member.skillSet.length > 0 && (
                      <div className="col-span-2">
                        <span className="text-gray-600">Skills:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {member.skillSet.map((skill, skillIndex) => (
                            <span 
                              key={skillIndex}
                              className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Summary */}
        <div className="px-4 pb-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-gray-600">Busy</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-gray-600">Overloaded</span>
              </div>
            </div>
            
            <div className="text-gray-600">
              Total: {totalAssigned}h assigned of {totalCapacity}h capacity
            </div>
          </div>
        </div>
      </div>
    );
  }
);

TeamWorkload.displayName = "TeamWorkload";

export default TeamWorkload;