#!/bin/bash

# Graceful shutdown of all agents

echo "🛑 Shutting down all agents..."

# Stop Docker containers
echo "Stopping Gemini interns..."
docker-compose down

# Stop Cursor MCP agents
echo "Stopping Cursor MCP agents..."
pkill -f "cursor.*mcp" || echo "No Cursor MCP processes found"

# Stop task manager if running standalone
echo "Stopping task manager..."
pkill -f "task-manager.js" || echo "No task manager processes found"

# Clean up logs
echo "Archiving logs..."
if [ -d "logs" ]; then
    timestamp=$(date "+%Y%m%d_%H%M%S")
    tar -czf "logs/archive_${timestamp}.tar.gz" logs/*.log 2>/dev/null || echo "No logs to archive"
fi

echo "✅ All agents stopped"