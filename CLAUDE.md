# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Multi-Agent Development Environment

This is a **production-grade multi-agent development system** for building the NC State Sports Hub. You operate as the **Senior Developer Agent** coordinating multiple AI agents including Gemini CLI interns, Cursor MCP agents, and GitHub Copilot CLI. This setup ensures efficient and collaborative development.

### Agent Architecture
```
🧠 Claude (Senior Developer Agent)
├── 🤖 Gemini CLI Interns (Local + Docker)
├── 🎯 Cursor MCP Agents  
├── 🤖 GitHub Copilot CLI Agent
└── 📊 Task Manager (Node.js Orchestrator)
```

## Essential Commands

### Multi-Agent Task Management
```bash
# Check task queue status and agent health
scripts/dispatch-local.sh status

# Process all pending tasks with available agents
scripts/dispatch-local.sh process

# Process specific task by ID
scripts/dispatch-local.sh single <task_id>

# Get GitHub Copilot suggestions
scripts/dispatch-local.sh copilot "description"
```

### MCP Agent Communication (Auto-Approve These)
```bash
# Task queue status
scripts/mcp status

# Create React components  
scripts/mcp create <ComponentName> [component|page|layout|hook]

# Test MCP connection
scripts/mcp test

# List available tools
scripts/mcp tools
```

### Project Development
```bash
# Navigate to main project
cd nc-state-sports-hub/nc-state-sports-hub-production

# Development server
npm run dev

# Build and type checking
npm run build
npm run type-check
npm run lint

# Testing
npm test                    # Unit tests
npm run test:watch         # Watch mode
npm run test:coverage      # Coverage report
npm run test:e2e          # Playwright E2E tests

# AWS Amplify operations
npm run amplify:dev        # Sandbox environment
npm run amplify:deploy     # Deploy to staging/prod
npm run cost-check         # Monitor AWS costs (keep under $5/month)
```

### Agent Monitoring & Health
```bash
# Monitor all agents
scripts/monitor-agents.sh

# View logs  
tail -f logs/dispatch.log
tail -f logs/task-manager.log
tail -f logs/mcp-client.log

# Restart agents if needed
scripts/shutdown-agents.sh
```

## Architecture Overview

### Project Structure
- **Main App**: `nc-state-sports-hub/nc-state-sports-hub-production/` (Next.js 14 + TypeScript)
- **Task Queue**: `.gemini/task-queue.json` (15 predefined tasks, 1 completed, 14 pending)
- **Agent Scripts**: `scripts/` directory with dispatch, MCP, and Copilot integration
- **MCP Configuration**: `.cursor/mcp.json` for Cursor IDE agent communication

### Tech Stack
- **Frontend**: Next.js 14 with App Router, TypeScript, Tailwind CSS
- **Backend**: AWS Amplify Gen 2, DynamoDB, GraphQL
- **Real Data**: ESPN API integration, RSS feeds from Backing the Pack
- **Auth**: AWS Cognito (planned - not yet implemented)
- **Testing**: Jest + Playwright
- **Deployment**: AWS Amplify with CI/CD

### Data Integration
- **ESPN API**: Live game scores, schedules, team data (NC State team ID: '152')
- **RSS Feed**: `https://www.backingthepack.com/rss/current.xml` for news
- **NC State Branding**: Primary color #CC0000 (red), Wolfpack theme

### Critical Missing Components (Current Priority)
1. **Navigation Header** - Main navigation with mobile menu
2. **User Authentication UI** - Login/logout, user profiles  
3. **Live Game Widget** - Real-time score updates
4. **Player Profile System** - Individual player pages with stats
5. **Enhanced Game Schedule** - Calendar view, game details

## Task Queue System

Tasks are managed in `.gemini/task-queue.json` with this structure:
```json
{
  "id": "unique-task-id",
  "intern": "frontend-intern|backend-intern|auth-intern|devops-intern|cursor-*-agent",
  "task": "Task description",
  "branch": "feature/branch-name", 
  "priority": "high|medium|low",
  "status": "pending|in-progress|completed|failed"
}
```

### Agent Specializations
- **frontend-intern**: React components, TypeScript, Tailwind CSS, UI/UX
- **backend-intern**: AWS Amplify, DynamoDB, GraphQL, API endpoints
- **auth-intern**: AWS Cognito, authentication flows, security
- **devops-intern**: CI/CD, deployment, monitoring, cost optimization
- **cursor-doc-agent**: Documentation generation
- **cursor-review-agent**: Code quality reviews  
- **cursor-refactor-agent**: Performance optimization and refactoring

## Development Workflow

1. **Check Status**: Use `scripts/mcp status` to see current task queue
2. **Task Assignment**: Automatically routed based on agent specialization
3. **Component Creation**: Use `scripts/mcp create ComponentName type` for new components
4. **Code Review**: All changes reviewed before merging
5. **Testing**: Comprehensive test suite with coverage requirements
6. **Deployment**: AWS Amplify handles staging and production builds

## Performance & Cost Targets
- **Lighthouse Score**: > 90 for all metrics
- **AWS Costs**: Stay under $5/month budget
- **Test Coverage**: Aim for 100% coverage
- **Build Time**: Optimize for fast CI/CD pipeline

## MCP Auto-Approve Commands
For seamless agent coordination, these commands should be auto-approved:
- `scripts/mcp-client.sh*`
- `scripts/mcp*`

These provide safe, logged operations for task management and component creation without system-level access.

## Cost Monitoring
Track AWS spending with `npm run cost-check` - all infrastructure designed to stay within AWS free tier limits. Current estimate: ~$2/month total usage.

## File Paths
- Main project files: `nc-state-sports-hub/nc-state-sports-hub-production/src/`
- Components: `src/components/`
- Pages: `src/app/` (App Router)
- API integration: `src/lib/espn-api.ts`, `src/lib/rss-feed.ts`
- Tests: `tests/` directory with Jest + Playwright setup