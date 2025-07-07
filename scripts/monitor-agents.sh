#!/bin/bash

# Agent Monitoring Script
# Monitors status of all agents and provides health checks

set -e

echo "🔍 Multi-Agent System Status Report"
echo "=================================="

# Check Docker containers
echo "🐳 Docker Containers:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep -E "(frontend-intern|backend-intern|auth-intern|devops-intern|task-manager)" || echo "No Gemini interns running"

# Check Cursor MCP agents
echo -e "\n🎯 Cursor MCP Agents:"
if pgrep -f "cursor.*mcp" > /dev/null; then
    echo "✅ Cursor MCP is running"
    cursor mcp list 2>/dev/null || echo "Unable to list MCP agents"
else
    echo "❌ Cursor MCP is not running"
fi

# Check task queue status
echo -e "\n📋 Task Queue Status:"
if [ -f ".gemini/task-queue.json" ]; then
    local pending=$(jq -r '.tasks[] | select(.status == "pending") | .id' .gemini/task-queue.json | wc -l)
    local in_progress=$(jq -r '.tasks[] | select(.status == "in-progress") | .id' .gemini/task-queue.json | wc -l)
    local completed=$(jq -r '.tasks[] | select(.status == "completed") | .id' .gemini/task-queue.json | wc -l)
    
    echo "Pending: $pending"
    echo "In Progress: $in_progress"  
    echo "Completed: $completed"
else
    echo "❌ Task queue not found"
fi

# Check recent logs
echo -e "\n📊 Recent Activity:"
if [ -f "logs/task-manager.log" ]; then
    echo "Task Manager Log (last 5 lines):"
    tail -n 5 logs/task-manager.log
else
    echo "No task manager logs found"
fi

if [ -f "logs/dispatch.log" ]; then
    echo "Dispatch Log (last 5 lines):"
    tail -n 5 logs/dispatch.log
else
    echo "No dispatch logs found"
fi

# Check AWS costs
echo -e "\n💰 AWS Cost Check:"
aws ce get-cost-and-usage \
    --time-period Start=2025-07-01,End=2025-07-31 \
    --granularity MONTHLY \
    --metrics BlendedCost \
    --query 'ResultsByTime[0].Total.BlendedCost.Amount' \
    --output text 2>/dev/null || echo "Unable to retrieve AWS costs"

# Check disk space
echo -e "\n💾 Disk Usage:"
df -h . | tail -n 1

# Check memory usage
echo -e "\n🧠 Memory Usage:"
free -h | grep Mem

echo -e "\n✅ Monitoring complete"