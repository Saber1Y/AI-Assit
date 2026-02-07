"use client";

import { MessageThreadFull } from "@/components/tambo/message-thread-full";
import { useMcpServers } from "@/components/tambo/mcp-config-modal";
import { components, tools } from "@/lib/tambo";
import { TamboProvider } from "@tambo-ai/react";
import Link from "next/link";
import { BarChart3, TrendingUp, Users, DollarSign } from "lucide-react";

/**
 * Analytics Dashboard page with enhanced chat interface
 * 
 * This page provides a specialized interface for business analytics,
 * featuring quick actions, example queries, and contextual suggestions.
 */
export default function AnalyticsDashboard() {
  // Load MCP server configurations
  const mcpServers = useMcpServers();

  // Quick action queries
  const quickQueries = [
    {
      title: "Revenue Overview",
      query: "Show me revenue trends for the last 30 days with a line chart",
      icon: <DollarSign className="w-4 h-4" />,
      color: "bg-green-100 text-green-700 hover:bg-green-200"
    },
    {
      title: "User Analytics",
      query: "Display active users and conversion rates for the past week",
      icon: <Users className="w-4 h-4" />,
      color: "bg-blue-100 text-blue-700 hover:bg-blue-200"
    },
    {
      title: "Performance Metrics",
      query: "Create KPI cards showing the most important business metrics",
      icon: <BarChart3 className="w-4 h-4" />,
      color: "bg-purple-100 text-purple-700 hover:bg-purple-200"
    },
    {
      title: "Trend Analysis",
      query: "Generate insights about our current business performance",
      icon: <TrendingUp className="w-4 h-4" />,
      color: "bg-orange-100 text-orange-700 hover:bg-orange-200"
    }
  ];

  // Example questions for users
  const exampleQuestions = [
    "What's our revenue growth this month?",
    "Which products are underperforming?",
    "Show me user engagement patterns",
    "Create a funnel analysis for signups",
    "What are the top traffic sources?",
    "How does device usage vary by time of day?",
    "Generate a weekly performance report",
    "Which customer segments have highest churn?"
  ];

  return (
    <TamboProvider
      apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
      components={components}
      tools={tools}
      tamboUrl={process.env.NEXT_PUBLIC_TAMBO_URL}
      mcpServers={mcpServers}
    >
      <div className="h-screen flex">
        {/* Sidebar with Quick Actions */}
        <div className="w-80 border-r border-border bg-muted/30 p-6 overflow-y-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Analytics Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              Ask questions about your data and get instant visualizations
            </p>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-foreground mb-4">
              Quick Actions
            </h3>
            <div className="space-y-2">
              {quickQueries.map((action, index) => (
                <button
                  key={index}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-colors ${action.color}`}
                  onClick={() => {
                    // This will be handled by the chat interface
                    const event = new CustomEvent('quickQuery', { 
                      detail: { query: action.query } 
                    });
                    window.dispatchEvent(event);
                  }}
                >
                  {action.icon}
                  {action.title}
                </button>
              ))}
            </div>
          </div>

          {/* Example Questions */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-foreground mb-4">
              Try asking...
            </h3>
            <div className="space-y-2">
              {exampleQuestions.slice(0, 4).map((question, index) => (
                <button
                  key={index}
                  className="w-full text-left p-3 rounded-lg bg-card border border-border text-sm hover:bg-muted/50 transition-colors"
                  onClick={() => {
                    const event = new CustomEvent('quickQuery', { 
                      detail: { query: question } 
                    });
                    window.dispatchEvent(event);
                  }}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          {/* Data Sources Status */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-foreground mb-4">
              Connected Data Sources
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Google Analytics</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Stripe</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Database</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span>GitHub (MCP)</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="border-t border-border pt-6">
            <div className="space-y-2">
              <Link
                href="/chat"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Back to General Chat
              </Link>
              <Link
                href="/interactables"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                View Component Demos →
              </Link>
            </div>
          </div>
        </div>

        {/* Main Chat Interface */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="border-b border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Analytics Assistant
                </h2>
                <p className="text-sm text-muted-foreground">
                  Powered by AI with real-time data visualization
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                  All Systems Operational
                </div>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1">
            <MessageThreadFull />
          </div>
        </div>
      </div>
    </TamboProvider>
  );
}