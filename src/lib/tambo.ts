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
import {
  getCountryPopulations,
  getGlobalPopulationTrend,
} from "@/services/population-stats";
import {
  analyticsService,
  googleAnalyticsService,
  stripeService,
  databaseService,
} from "@/services/analytics";
import type { TamboComponent } from "@tambo-ai/react";
import { TamboTool } from "@tambo-ai/react";
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
];
