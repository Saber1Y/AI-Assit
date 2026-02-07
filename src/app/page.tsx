import Image from "next/image";

const KeyFilesSection = () => (
  <div className="bg-white px-8 py-4">
    <h2 className="text-xl font-semibold mb-4">How it works:</h2>
    <ul className="space-y-4 text-gray-600">
      <li className="flex items-start gap-2">
        <span>📄</span>
        <span>
          <code className="font-medium">src/app/layout.tsx</code> - Main layout
          with TamboProvider
        </span>
      </li>
      <li className="flex items-start gap-2">
        <span>📄</span>
        <span>
          <code className="font-medium font-mono">src/app/chat/page.tsx</code> -
          Chat page with TamboProvider and MCP integration
        </span>
      </li>
      <li className="flex items-start gap-2">
        <span>📄</span>
        <span>
          <code className="font-medium font-mono">
            src/app/interactables/page.tsx
          </code>{" "}
          - Interactive demo page with tools and components
        </span>
      </li>
      <li className="flex items-start gap-2">
        <span>📄</span>
        <span>
          <code className="font-medium font-mono">
            src/components/tambo/message-thread-full.tsx
          </code>{" "}
          - Chat UI
        </span>
      </li>
      <li className="flex items-start gap-2">
        <span>📄</span>
        <span>
          <code className="font-medium font-mono">
            src/components/tambo/graph.tsx
          </code>{" "}
          - A generative graph component
        </span>
      </li>
      <li className="flex items-start gap-2">
        <span>📄</span>
        <span>
          <code className="font-medium font-mono">
            src/services/population-stats.ts
          </code>{" "}
          - Example tool implementation with mock population data
        </span>
      </li>
      <li className="flex items-start gap-2">
        <span className="text-blue-500">📄</span>
        <span>
          <code className="font-medium font-mono">src/lib/tambo.ts</code> -
          Component and tool registration
        </span>
      </li>
      <li className="flex items-start gap-2">
        <span className="text-blue-500">📄</span>
        <span>
          <code className="font-medium font-mono">README.md</code> - For more
          details check out the README
        </span>
      </li>
    </ul>
    <div className="flex gap-4 flex-wrap mt-4">
      <a
        href="/projects"
        className="px-6 py-3 rounded-md font-medium transition-colors text-lg mt-4 bg-[#7FFFC3] hover:bg-[#72e6b0] text-gray-800"
      >
        🎯 AI Project Manager →
      </a>
      <a
        href="/chat"
        className="px-6 py-3 rounded-md font-medium transition-colors text-lg mt-4 bg-[#FFE17F] hover:bg-[#f5d570] text-gray-800"
      >
        💬 General Chat →
      </a>
      <a
        href="/analytics"
        className="px-6 py-3 rounded-md font-medium transition-colors text-lg mt-4 bg-[#E0E7FF] hover:bg-[#c7d2fe] text-gray-800"
      >
        📊 Analytics Dashboard →
      </a>
        <a
        href="/interactables"
        className="px-6 py-3 rounded-md font-medium transition-colors text-lg mt-4 bg-[#E0E7FF] hover:bg-[#c7d2fe] text-gray-800"
      >
        🎨 Component Demo →
      </a>
    </div>
    
    <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">✨ New Integrations</h3>
      <div className="space-y-3 text-sm text-gray-700">
        <div>
          <strong>🔗 Linear MCP Integration:</strong> Connect to Linear for real-time project management with OAuth authentication.
        </div>
        <div>
          <strong>🎯 AI Project Manager:</strong> Complete project management UI with kanban boards, team workload, and interactive components.
        </div>
      </div>
      <div className="mt-4">
        <a 
          href="/projects" 
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          Try AI Project Manager
        </a>
      </div>
    </div>
  </div>
);

export default function Home() {
  return (
    <div className="min-h-screen p-8 flex flex-col items-center justify-center font-[family-name:var(--font-geist-sans)]">
      <main className="max-w-2xl w-full space-y-8">
        <div className="flex flex-col items-center">
          <a href="https://tambo.co" target="_blank" rel="noopener noreferrer">
            <Image
              src="/Octo-Icon.svg"
              alt="Tambo AI Logo"
              width={80}
              height={80}
              className="mb-4"
            />
          </a>
          <h1 className="text-4xl text-center">Generative Analytics Dashboard</h1>
          <p className="text-lg text-muted-foreground text-center mt-2">
            AI-powered data visualization and business intelligence
          </p>
        </div>

        <div className="w-full space-y-8">
          <div className="bg-white px-8 py-4">
            <h2 className="text-xl font-semibold mb-4">Explore Features</h2>
            <div className="flex gap-4 flex-wrap">
              <a
                href="/analytics"
                className="px-6 py-3 rounded-md font-medium shadow-sm transition-colors text-lg mt-4 bg-[#7FFFC3] hover:bg-[#72e6b0] text-gray-800"
              >
                Analytics Dashboard →
              </a>
              <a
                href="/chat"
                className="px-6 py-3 rounded-md font-medium shadow-sm transition-colors text-lg mt-4 bg-[#FFE17F] hover:bg-[#f5d570] text-gray-800"
              >
                General Chat →
              </a>
              <a
                href="/interactables"
                className="px-6 py-3 rounded-md font-medium shadow-sm transition-colors text-lg mt-4 bg-[#E0E7FF] hover:bg-[#c7d2fe] text-gray-800"
              >
                Component Demo →
              </a>
            </div>
          </div>

          <KeyFilesSection />
        </div>
      </main>
    </div>
  );
}
