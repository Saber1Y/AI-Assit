"use client";

import React from "react";

/**
 * Linear MCP Authentication Helper
 * 
 * This component provides information about Linear MCP authentication
 * and helps users understand how to connect their Linear workspace.
 */
export function LinearAuthHelper() {
  const [showInstructions, setShowInstructions] = React.useState(false);

  const instructions = `
## Linear MCP Authentication

The Linear MCP server uses OAuth 2.1 with dynamic client registration for secure authentication.

### How to Connect:

1. **Start a chat** with the configured Linear MCP server
2. **Authenticate** when prompted by clicking the authentication link
3. **Grant permissions** to allow access to your Linear workspace
4. **Start using** Linear tools directly in the chat

### Available Tools:

- \`linear_search_issues\` - Search and filter issues
- \`linear_get_issue\` - Get specific issue details  
- \`linear_create_issue\` - Create new issues
- \`linear_update_issue\` - Update existing issues
- \`linear_list_projects\` - List all projects
- \`linear_list_teams\` - List all teams

### Permissions Required:

- Read access to issues, projects, and teams
- Write access to create and update issues (if using creation tools)

### Security:

- OAuth 2.1 ensures secure token-based authentication
- No API keys are stored in the browser
- Tokens are automatically refreshed
- You can revoke access at any time from Linear settings
  `;

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-foreground">Linear MCP Connection</h3>
        <button
          onClick={() => setShowInstructions(!showInstructions)}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {showInstructions ? "Hide" : "Show"} Instructions
        </button>
      </div>

      <div className="text-xs text-muted-foreground mb-2">
        Linear MCP server configured. Authentication will be prompted when you first use Linear tools.
      </div>

      {showInstructions && (
        <div className="mt-3 p-3 bg-muted rounded-lg">
          <pre className="text-xs text-foreground whitespace-pre-wrap font-mono">
            {instructions}
          </pre>
        </div>
      )}

      <div className="mt-3 flex items-center gap-2">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <span className="text-xs text-muted-foreground">Server: https://mcp.linear.app/mcp</span>
      </div>
    </div>
  );
}