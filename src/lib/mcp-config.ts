// Default MCP server configurations for analytics dashboard

import type { McpServerInfo, MCPTransport } from "@tambo-ai/react";

/**
 * Default MCP servers for analytics integrations
 * These provide connections to external data sources and tools
 */
export const defaultMcpServers: McpServerInfo[] = [
  {
    name: "GitHub Analytics",
    url: "ws://localhost:3001/github", // Example GitHub MCP server
    transport: "websocket" as const,
    description: "Connect to GitHub for repository analytics, issue tracking, and development metrics"
  },
  {
    name: "Linear Project Management",
    url: "ws://localhost:3002/linear", // Example Linear MCP server
    transport: "websocket" as const,
    description: "Connect to Linear for project management, issue tracking, and team productivity metrics"
  },
  {
    name: "Jira Integration",
    url: "ws://localhost:3003/jira", // Example Jira MCP server
    transport: "websocket" as const,
    description: "Connect to Jira for project tracking, sprint analytics, and team performance metrics"
  },
  {
    name: "Database Analytics",
    url: "ws://localhost:3004/database", // Example Database MCP server
    transport: "websocket" as const,
    description: "Connect to databases for custom analytics queries and real-time data extraction"
  },
  {
    name: "Stripe Analytics",
    url: "ws://localhost:3005/stripe", // Example Stripe MCP server
    transport: "websocket" as const,
    description: "Connect to Stripe for advanced payment analytics, subscription metrics, and revenue insights"
  },
  {
    name: "Google Analytics Enhanced",
    url: "ws://localhost:3006/ga", // Example GA MCP server
    transport: "websocket" as const,
    description: "Connect to Google Analytics for enhanced web analytics, user behavior insights, and conversion tracking"
  }
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
  const serverStatuses: Record<string, { status: 'connected' | 'disconnected' | 'error'; lastSync?: string }> = {
    "GitHub Analytics": { status: 'connected', lastSync: new Date().toISOString() },
    "Linear Project Management": { status: 'disconnected' },
    "Jira Integration": { status: 'disconnected' },
    "Database Analytics": { status: 'connected', lastSync: new Date(Date.now() - 300000).toISOString() },
    "Stripe Analytics": { status: 'connected', lastSync: new Date().toISOString() },
    "Google Analytics Enhanced": { status: 'connected', lastSync: new Date().toISOString() }
  };

  return serverStatuses[serverName] || { status: 'disconnected' };
};