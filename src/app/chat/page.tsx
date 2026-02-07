"use client";

import { MessageThreadFull } from "@/components/tambo/message-thread-full";
import { LinearAuthHelper } from "@/components/tambo/linear-auth-helper";
import { useMcpServers } from "@/components/tambo/mcp-config-modal";
import { components, tools, mcpServers } from "@/lib/tambo";
import { TamboProvider } from "@tambo-ai/react";
import { TamboMcpProvider } from "@tambo-ai/react/mcp";

/**
 * Home page component that renders the Tambo chat interface.
 *
 * @remarks
 * The `NEXT_PUBLIC_TAMBO_URL` environment variable specifies the URL of the Tambo server.
 * You do not need to set it if you are using the default Tambo server.
 * It is only required if you are running the API server locally.
 *
 * @see {@link https://github.com/tambo-ai/tambo/blob/main/CONTRIBUTING.md} for instructions on running the API server locally.
 */
export default function Home() {
  // Load MCP server configurations from localStorage (for user-added servers)
  const userMcpServers = useMcpServers();
  
  // Combine predefined servers with user-configured servers
  const allMcpServers = [...mcpServers, ...userMcpServers];

  return (
    <TamboProvider
      apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
      components={components}
      tools={tools}
      tamboUrl={process.env.NEXT_PUBLIC_TAMBO_URL}
      mcpServers={allMcpServers}
    >
      <TamboMcpProvider>
        <div className="h-screen flex flex-col">
          <div className="flex-shrink-0 p-4">
            <LinearAuthHelper />
          </div>
          <div className="flex-1">
            <MessageThreadFull />
          </div>
        </div>
      </TamboMcpProvider>
    </TamboProvider>
  );
}
