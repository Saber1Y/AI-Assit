// Default MCP server configurations for analytics dashboard

import type { McpServerInfo } from "@tambo-ai/react";
import { MCPTransport } from "@tambo-ai/react";

/**
 * Default MCP servers for analytics integrations
 * These provide connections to external data sources and tools
 */
export const defaultMcpServers: McpServerInfo[] = [
  {
    name: "Linear Project Management",
    url: "ws://localhost:3002/linear", // Example Linear MCP server
    transport: MCPTransport.SSE, // Using SSE instead of websocket
    description:
      "Connect to Linear for project management, issue tracking, and team productivity metrics",
  },
];

/**
 * Initialize default MCP servers in localStorage if none exist
 */
export const initializeDefaultMcpServers = () => {
  if (typeof window === "undefined") return;

  try {
    const existingServers = localStorage.getItem("mcp-servers");

    if (!existingServers || JSON.parse(existingServers).length === 0) {
      // Add default servers to localStorage
      localStorage.setItem("mcp-servers", JSON.stringify(defaultMcpServers));
      console.log("Initialized default MCP servers for analytics dashboard");
    }
  } catch (error) {
    console.error("Failed to initialize default MCP servers:", error);
  }
};

/**
 * Get MCP server status information
 */
export const getMcpServerStatus = (serverName: string) => {
  // This would typically check actual server connectivity
  // For now, return mock status information
  const serverStatuses: Record<
    string,
    { status: "connected" | "disconnected" | "error"; lastSync?: string }
  > = {
    "GitHub Analytics": {
      status: "connected",
      lastSync: new Date().toISOString(),
    },
    "Linear Project Management": { status: "disconnected" },
    "Jira Integration": { status: "disconnected" },
    "Database Analytics": {
      status: "connected",
      lastSync: new Date(Date.now() - 300000).toISOString(),
    },
    "Stripe Analytics": {
      status: "connected",
      lastSync: new Date().toISOString(),
    },
    "Google Analytics Enhanced": {
      status: "connected",
      lastSync: new Date().toISOString(),
    },
  };

  return serverStatuses[serverName] || { status: "disconnected" };
};
