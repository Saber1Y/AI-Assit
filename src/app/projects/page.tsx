"use client";

import { useState } from "react";
import {
  MessageInput,
  MessageInputSubmitButton,
  MessageInputTextarea,
} from "@/components/tambo/message-input";
import { ScrollableMessageContainer } from "@/components/tambo/scrollable-message-container";
import { ThreadContent, ThreadContentMessages } from "@/components/tambo/thread-content";
import { components, tools, mcpServers } from "@/lib/tambo";
import { TamboProvider } from "@tambo-ai/react";
import { TamboMcpProvider } from "@tambo-ai/react/mcp";
import { Filter, BarChart3, Users, Settings, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Filter Panel Component - INTERACTABLE COMPONENT
 * This panel persists on screen and can be updated by AI or user interactions
 */
function FilterPanel({ isOpen, onClose, className }: { 
  isOpen: boolean; 
  onClose: () => void;
  className?: string;
}) {
  if (!isOpen) return null;

  return (
    <div className={cn(
      "fixed inset-0 bg-black bg-opacity-50 z-40 flex items-start justify-start",
      className
    )}>
      <div className="bg-white w-80 h-full shadow-xl border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Filter Content */}
        <div className="flex-1 p-4 space-y-6">
          {/* Assignees */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Assignees</h4>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                <span className="text-sm text-gray-700">Sarah Chen</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300" />
                <span className="text-sm text-gray-700">Mike Johnson</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300" />
                <span className="text-sm text-gray-700">Alex Kumar</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300" />
                <span className="text-sm text-gray-700">Eva Martinez</span>
              </label>
            </div>
          </div>

          {/* Priority */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Priority</h4>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                <span className="text-sm text-gray-700">🔴 Urgent</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300" />
                <span className="text-sm text-gray-700">🟠 High</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300" />
                <span className="text-sm text-gray-700">🟡 Medium</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300" />
                <span className="text-sm text-gray-700">🟢 Low</span>
              </label>
            </div>
          </div>

          {/* Status */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Status</h4>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                <span className="text-sm text-gray-700">🔵 All Tasks</span>
              </label>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="text-sm text-gray-600">
              <div className="flex justify-between mb-1">
                <span>Total Tasks:</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex justify-between mb-1">
                <span>Filtered:</span>
                <span className="font-medium">4</span>
              </div>
              <div className="flex justify-between">
                <span>High Priority:</span>
                <span className="font-medium text-orange-600">1</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Quick Stats Component for Side Panel
 */
function QuickStats() {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <h3 className="text-sm font-medium text-gray-900 mb-4">Quick Stats</h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Total Tasks</span>
          <span className="text-lg font-semibold text-gray-900">12</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">In Progress</span>
          <span className="text-lg font-semibold text-blue-600">3</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Overdue</span>
          <span className="text-lg font-semibold text-red-600">2</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">This Week</span>
          <span className="text-lg font-semibold text-green-600">5</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Projects List for Side Panel
 */
function ProjectsList() {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <h3 className="text-sm font-medium text-gray-900 mb-4">Projects</h3>
      <div className="space-y-2">
        <div className="p-2 bg-blue-50 border border-blue-200 rounded cursor-pointer hover:bg-blue-100 transition-colors">
          <div className="text-sm font-medium text-blue-900">Website Redesign</div>
          <div className="text-xs text-blue-700">3 active tasks</div>
        </div>
        <div className="p-2 bg-green-50 border border-green-200 rounded cursor-pointer hover:bg-green-100 transition-colors">
          <div className="text-sm font-medium text-green-900">Mobile App Launch</div>
          <div className="text-xs text-green-700">2 active tasks</div>
        </div>
        <div className="p-2 bg-gray-50 border border-gray-200 rounded cursor-pointer hover:bg-gray-100 transition-colors">
          <div className="text-sm font-medium text-gray-900">Backend Migration</div>
          <div className="text-xs text-gray-700">On hold</div>
        </div>
      </div>
    </div>
  );
}

/**
 * Main AI Project Manager Page
 * Following the exact UI/UX flow from your guide
 */
export default function AIProjectManagerPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <TamboProvider
      apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
      components={components}
      tools={tools}
      tamboUrl={process.env.NEXT_PUBLIC_TAMBO_URL}
      mcpServers={mcpServers}
    >
      <TamboMcpProvider>
        <div className="h-screen bg-gray-50 flex flex-col">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-gray-900">AI Project Manager 🎯</h1>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="h-4 w-4 text-gray-600" />
              </button>
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-gray-700">JD</span>
              </div>
            </div>
          </header>

          <div className="flex flex-1 overflow-hidden">
            {/* Side Panel */}
            <div
              className={cn(
                "bg-white border-r border-gray-200 flex flex-col transition-all duration-300",
                isSidebarOpen ? "w-80" : "w-0 overflow-hidden"
              )}
            >
              {/* Panel Toggle Button */}
              <div className="p-4 border-b border-gray-200">
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {isSidebarOpen ? (
                    <X className="h-4 w-4" />
                  ) : (
                    <Menu className="h-4 w-4" />
                  )}
                </button>
              </div>

              {isSidebarOpen && (
                <div className="flex-1 p-4 space-y-6 overflow-y-auto">
                  <QuickStats />
                  <ProjectsList />
                  
                  {/* Quick Actions */}
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-900 mb-4">Quick Actions</h3>
                    <div className="space-y-2">
                      <button 
                        onClick={() => setIsFilterOpen(true)}
                        className="w-full flex items-center gap-2 p-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left"
                      >
                        <Filter className="h-4 w-4" />
                        <span className="text-sm">Apply Filters</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Main Workspace */}
            <div className="flex-1 flex flex-col">
              {/* Main Workspace - AI Thread Content */}
              <div className="flex-1 relative">
                <ScrollableMessageContainer>
                  <ThreadContent variant="default">
                    <ThreadContentMessages />
                  </ThreadContent>
                </ScrollableMessageContainer>
              </div>

              {/* Chat Input Area */}
              <div className="border-t border-gray-200 bg-white p-4">
                <MessageInput className="border-gray-300">
                  <div className="flex justify-between">
                    <MessageInputTextarea placeholder="What do you want to see?" />
                    <MessageInputSubmitButton>Send →</MessageInputSubmitButton>
                  </div>
                </MessageInput>
              </div>
            </div>
          </div>

          {/* Filter Panel Overlay */}
          <FilterPanel 
            isOpen={isFilterOpen} 
            onClose={() => setIsFilterOpen(false)} 
          />
        </div>
      </TamboMcpProvider>
    </TamboProvider>
  );
}