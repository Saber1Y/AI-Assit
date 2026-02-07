"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-6xl font-bold tracking-tight text-gray-900 mb-6">
              AI Project Manager
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Manage your projects at the speed of thought with AI-powered
              intelligence
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                href="/projects"
                className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-offset-2"
              >
                Launch AI Project Manager
              </Link>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-8 bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="text-5xl mb-4">📋</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Smart Tasks
            </h3>
            <p className="text-gray-600">
              Create, update, and organize tasks with natural language
            </p>
            <div className="mt-4 text-sm text-blue-600 font-medium">
              → AI-powered task management
            </div>
          </div>

          <div className="text-center p-8 bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="text-5xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Visual Boards
            </h3>
            <p className="text-gray-600">
              Kanban boards, timelines, and team views
            </p>
            <div className="mt-4 text-sm text-purple-600 font-medium">
              → Interactive project workflows
            </div>
          </div>

          <div className="text-center p-8 bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="text-5xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Smart Analytics
            </h3>
            <p className="text-gray-600">
              AI-powered insights and data visualization
            </p>
            <div className="mt-4 text-sm text-green-600 font-medium">
              → Business intelligence dashboards
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>TypeScript & React 18+</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Secure & Private</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>AI-Powered Intelligence</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 pt-8">
          <div className="text-center text-sm text-gray-500">
            <p>Built with Tambo AI • Next.js 15 • TypeScript</p>
            <p className="mt-2">
              © 2025 AI Project Manager. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
