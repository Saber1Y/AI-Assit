/**
 * @file tambo.ts
 * @description Central configuration file for Tambo components and tools
 *
 * This file serves as the central place to register your Tambo components and tools.
 * It exports arrays that will be used by the TamboProvider.
 *
 * Read more about Tambo at https://tambo.co/docs
 */

import { Graph, graphSchema } from "@/components/tambo/graph";
import { DataCard, dataCardSchema } from "@/components/ui/card-data";
import { KPI, kpiCardSchema } from "@/components/tambo/kpi-card";
import { Heatmap, heatmapSchema } from "@/components/tambo/heatmap";
import { Funnel, funnelSchema } from "@/components/tambo/funnel";
import { DataTable, dataTableSchema } from "@/components/tambo/data-table";
import { InsightCard, insightCardSchema } from "@/components/tambo/insight-card";
import { LinearIssue, linearIssueSchema } from "@/components/tambo/linear-issue";
import { LinearIssueList, linearIssueListSchema } from "@/components/tambo/linear-issue-list";
import { TaskList, taskListSchema } from "@/components/tambo/task-list";
import { TaskCard, taskCardSchema } from "@/components/tambo/task-card";
import { KanbanBoard, kanbanBoardSchema } from "@/components/tambo/kanban-board";
import { TeamWorkload, teamWorkloadSchema } from "@/components/tambo/team-workload";
import {
  getCountryPopulations,
  getGlobalPopulationTrend,
} from "@/services/population-stats";
import {
  getTasks,
  createTask,
  updateTaskStatus,
  getProjects,
} from "@/services/project-management";
import {
  analyticsService,
  googleAnalyticsService,
  stripeService,
  databaseService,
} from "@/services/analytics";
import type { TamboComponent, McpServerInfo } from "@tambo-ai/react";
import { TamboTool, MCPTransport } from "@tambo-ai/react";
import { z } from "zod";

/**
 * tools
 *
 * This array contains all the Tambo tools that are registered for use within the application.
 * Each tool is defined with its name, description, and expected props. The tools
 * can be controlled by AI to dynamically fetch data based on user interactions.
 */

export const tools: TamboTool[] = [
  {
    name: "countryPopulation",
    description:
      "A tool to get population statistics by country with advanced filtering options",
    tool: getCountryPopulations,
    inputSchema: z.object({
      continent: z.string().optional(),
      sortBy: z.enum(["population", "growthRate"]).optional(),
      limit: z.number().optional(),
      order: z.enum(["asc", "desc"]).optional(),
    }),
    outputSchema: z.array(
      z.object({
        countryCode: z.string(),
        countryName: z.string(),
        continent: z.enum([
          "Asia",
          "Africa",
          "Europe",
          "North America",
          "South America",
          "Oceania",
        ]),
        population: z.number(),
        year: z.number(),
        growthRate: z.number(),
      }),
    ),
  },
  {
    name: "globalPopulation",
    description:
      "A tool to get global population trends with optional year range filtering",
    tool: getGlobalPopulationTrend,
    inputSchema: z.object({
      startYear: z.number().optional(),
      endYear: z.number().optional(),
    }),
    outputSchema: z.array(
      z.object({
        year: z.number(),
        population: z.number(),
        growthRate: z.number(),
      }),
    ),
  },
  // Analytics Tools
  {
    name: "getRevenueAnalytics",
    description: "Get revenue and sales data with filtering options",
    tool: stripeService.getRevenueData,
    inputSchema: z.object({
      dateRange: z.object({
        start: z.string().optional(),
        end: z.string().optional(),
      }).optional(),
      source: z.string().optional(),
      category: z.string().optional(),
    }),
    outputSchema: z.array(
      z.object({
        date: z.string(),
        revenue: z.number(),
        orders: z.number(),
        averageOrderValue: z.number(),
        currency: z.string(),
        source: z.string().optional(),
        productCategory: z.string().optional(),
      }),
    ),
  },
  {
    name: "getUserAnalytics",
    description: "Get user behavior and engagement data from Google Analytics",
    tool: googleAnalyticsService.getUserAnalytics,
    inputSchema: z.object({
      dateRange: z.object({
        start: z.string().optional(),
        end: z.string().optional(),
      }).optional(),
      device: z.string().optional(),
      channel: z.string().optional(),
    }),
    outputSchema: z.array(
      z.object({
        date: z.string(),
        activeUsers: z.number(),
        newUsers: z.number(),
        returningUsers: z.number(),
        sessionDuration: z.number(),
        bounceRate: z.number(),
        conversionRate: z.number(),
        country: z.string().optional(),
        device: z.string().optional(),
        acquisitionChannel: z.string().optional(),
      }),
    ),
  },
  {
    name: "getProductPerformance",
    description: "Get product performance data with sales and conversion metrics",
    tool: databaseService.getProductPerformance,
    inputSchema: z.object({
      category: z.string().optional(),
      sortBy: z.enum(["revenue", "unitsSold", "views", "conversionRate"]).optional(),
      limit: z.number().optional(),
    }),
    outputSchema: z.array(
      z.object({
        productId: z.string(),
        productName: z.string(),
        category: z.string(),
        revenue: z.number(),
        unitsSold: z.number(),
        views: z.number(),
        conversionRate: z.number(),
        averageRating: z.number(),
        stockLevel: z.number(),
        trend: z.enum(["up", "down", "stable"]),
      }),
    ),
  },
  {
    name: "getFunnelAnalysis",
    description: "Get conversion funnel analysis with dropoff rates",
    tool: databaseService.getFunnelAnalysis,
    inputSchema: z.object({}).optional(),
    outputSchema: z.array(
      z.object({
        stage: z.string(),
        users: z.number(),
        conversionRate: z.number(),
        dropoffRate: z.number(),
        averageTimeInStage: z.number(),
      }),
    ),
  },
  {
    name: "getHeatmapData",
    description: "Get activity heatmap data for time-based analysis",
    tool: databaseService.getHeatmapData,
    inputSchema: z.object({}).optional(),
    outputSchema: z.array(
      z.object({
        x: z.string(),
        y: z.string(),
        value: z.number(),
        label: z.string().optional(),
      }),
    ),
  },
  {
    name: "getKPIData",
    description: "Get key performance indicators for the business dashboard",
    tool: analyticsService.getKPIData,
    inputSchema: z.object({}).optional(),
    outputSchema: z.array(
      z.object({
        title: z.string(),
        value: z.union([z.number(), z.string()]),
        previousValue: z.union([z.number(), z.string()]).optional(),
        change: z.number().optional(),
        changeType: z.enum(["increase", "decrease", "neutral"]).optional(),
        format: z.enum(["currency", "percentage", "number", "duration"]).optional(),
        target: z.number().optional(),
        targetAchieved: z.boolean().optional(),
      }),
    ),
  },
  {
    name: "generateInsights",
    description: "Generate AI-powered insights and recommendations based on data",
    tool: analyticsService.generateInsights,
    inputSchema: z.object({}).optional(),
    outputSchema: z.array(
      z.object({
        title: z.string(),
        description: z.string(),
        type: z.enum(["trend", "anomaly", "recommendation", "warning", "success"]),
        confidence: z.number(),
        impact: z.enum(["high", "medium", "low"]),
        actionable: z.boolean(),
        suggestedActions: z.array(z.string()).optional(),
        relatedMetrics: z.array(z.string()).optional(),
      }),
    ),
  },
  // Project Management Tools
  {
    name: "getTasks",
    description: "Get tasks with optional filtering and sorting capabilities",
    tool: getTasks,
    inputSchema: z.object({
      status: z.enum(["todo", "in-progress", "review", "done"]).optional(),
      priority: z.enum(["low", "medium", "high", "critical"]).optional(),
      assignee: z.string().optional(),
      project: z.string().optional(),
      overdue: z.boolean().optional(),
      sortBy: z.enum(["dueDate", "priority", "createdDate"]).optional(),
      sortOrder: z.enum(["asc", "desc"]).optional(),
    }),
    outputSchema: z.array(
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
      }),
    ),
  },
  {
    name: "createTask",
    description: "Create a new task with the provided details",
    tool: createTask,
    inputSchema: z.object({
      title: z.string().describe("Title of the task"),
      description: z.string().optional().describe("Optional description of the task"),
      status: z.enum(["todo", "in-progress", "review", "done"]).optional().describe("Initial status of the task"),
      priority: z.enum(["low", "medium", "high", "critical"]).optional().describe("Priority level of the task"),
      assignee: z.string().optional().describe("Person to assign the task to"),
      dueDate: z.string().optional().describe("Due date for the task"),
      project: z.string().describe("Project this task belongs to"),
      tags: z.array(z.string()).optional().describe("Tags associated with the task"),
      estimatedHours: z.number().optional().describe("Estimated hours to complete"),
    }),
    outputSchema: z.object({
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
    }),
  },
  {
    name: "updateTaskStatus",
    description: "Update an existing task's status or other properties",
    tool: async (params: { taskId: string; status?: string; priority?: string; assignee?: string; dueDate?: string }) => {
      return await updateTaskStatus(params.taskId, {
        status: params.status as any,
        priority: params.priority as any,
        assignee: params.assignee,
        dueDate: params.dueDate,
      });
    },
    inputSchema: z.object({
      taskId: z.string().describe("ID of the task to update"),
      status: z.enum(["todo", "in-progress", "review", "done"]).optional().describe("New status for the task"),
      priority: z.enum(["low", "medium", "high", "critical"]).optional().describe("New priority for the task"),
      assignee: z.string().optional().describe("New assignee for the task"),
      dueDate: z.string().optional().describe("New due date for the task"),
    }),
    outputSchema: z.object({
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
    }),
  },
  {
    name: "getProjects",
    description: "Get all projects with their details",
    tool: getProjects,
    inputSchema: z.object({}).optional(),
    outputSchema: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        description: z.string().optional(),
        status: z.enum(["active", "completed", "on-hold"]),
        startDate: z.string(),
        endDate: z.string().optional(),
        members: z.array(z.string()),
      }),
    ),
  },
];

/**
 * components
 *
 * This array contains all the Tambo components that are registered for use within the application.
 * Each component is defined with its name, description, and expected props. The components
 * can be controlled by AI to dynamically render UI elements based on user interactions.
 */
export const components: TamboComponent[] = [
  {
    name: "Graph",
    description:
      "A component that renders various types of charts (bar, line, pie) using Recharts. Supports customizable data visualization with labels, datasets, and styling options.",
    component: Graph,
    propsSchema: graphSchema,
  },
  {
    name: "DataCard",
    description:
      "A component that displays options as clickable cards with links and summaries with the ability to select multiple items.",
    component: DataCard,
    propsSchema: dataCardSchema,
  },
  {
    name: "KPI",
    description:
      "A key performance indicator card that displays metrics with trends, comparisons, and target progress. Supports various formatting options and visual indicators.",
    component: KPI,
    propsSchema: kpiCardSchema,
  },
  {
    name: "Heatmap",
    description:
      "A 2D heatmap component for visualizing intensity data across two dimensions. Supports color schemes, tooltips, and flexible grid layouts for time-based or categorical data.",
    component: Heatmap,
    propsSchema: heatmapSchema,
  },
  {
    name: "Funnel",
    description:
      "A conversion funnel visualization component that shows user journey through different stages. Displays conversion rates, dropoff rates, and time spent in each stage.",
    component: Funnel,
    propsSchema: funnelSchema,
  },
  {
    name: "DataTable",
    description:
      "An interactive data table component with sorting, filtering, search, and pagination. Supports various data formatting options and responsive design.",
    component: DataTable,
    propsSchema: dataTableSchema,
  },
  {
    name: "InsightCard",
    description:
      "An AI-powered insight card that displays data-driven insights with confidence scores, impact levels, and actionable recommendations. Supports expandable suggested actions.",
    component: InsightCard,
    propsSchema: insightCardSchema,
  },
  {
    name: "LinearIssue",
    description:
      "A component that displays a single Linear issue with all relevant information including status, priority, assignee, project, labels, and timestamps. Includes visual indicators for priority and status.",
    component: LinearIssue,
    propsSchema: linearIssueSchema,
  },
  {
    name: "LinearIssueList",
    description:
      "A component that displays a list of Linear issues with optional grouping by status, priority, project, or assignee. Supports title, item limiting, and empty state handling.",
    component: LinearIssueList,
    propsSchema: linearIssueListSchema,
  },
  {
    name: "TaskList",
    description:
      "A flexible component for displaying tasks with various view modes (grid/list), filtering, searching, and grouping capabilities. Supports both compact and full card views with real-time updates.",
    component: TaskList,
    propsSchema: taskListSchema,
  },
  {
    name: "TaskCard",
    description:
      "A versatile card component for displaying individual task information with different visual states based on status and priority. Supports both full and compact views with metadata display.",
    component: TaskCard,
    propsSchema: taskCardSchema,
  },
  {
    name: "KanbanBoard",
    description:
      "A kanban board component that organizes tasks into columns by status with drag-and-drop visual cues, column counts, and responsive design. Supports custom columns and compact views.",
    component: KanbanBoard,
    propsSchema: kanbanBoardSchema,
  },
  {
    name: "TeamWorkload",
    description:
      "A team workload visualization component showing capacity utilization, task distribution, and availability across team members. Features progress bars, status indicators, and detailed breakdowns.",
    component: TeamWorkload,
    propsSchema: teamWorkloadSchema,
  },
];

/**
 * mcpServers
 *
 * This array contains all the MCP (Model Context Protocol) servers that are registered
 * for use within the application. Each server provides external tools and capabilities
 * that can be accessed by AI through the standardized MCP interface.
 */
export const mcpServers: McpServerInfo[] = [
  {
    name: "Linear",
    url: "https://mcp.linear.app/mcp",
    transport: MCPTransport.HTTP,
  },
];
