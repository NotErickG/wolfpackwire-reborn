# 🧠 NC State Sports Hub - Multi-Agent Development Environment

**Production-Grade Multi-Agent System for Building Real Applications**

This repository contains a complete multi-agent development environment that coordinates AI agents to build, test, and deploy a real NC State Sports Hub website. The system uses Claude as the Senior Developer Agent to orchestrate Gemini CLI interns and Cursor MCP agents.

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- Cursor IDE
- Node.js 20+
- Git
- AWS CLI configured
- GitHub CLI (optional)

### Setup

1. **Clone and enter the repository:**
   ```bash
   git clone https://github.com/NotErickG/nc-state-sports-hub.git
   cd nc-state-sports-hub
   ```

2. **Configure API keys:**
   ```bash
   # Edit the environment file
   cp .env.example ~/.gemini/.env
   # Add your API keys to ~/.gemini/.env
   ```

3. **Start the multi-agent environment:**
   ```bash
   chmod +x setup-interns.sh
   ./setup-interns.sh
   ```

4. **Launch Cursor with MCP agents:**
   ```bash
   cursor .
   ```

## 🏗️ Architecture

### Agent Hierarchy

```
🧠 Claude (Senior Developer Agent)
├── 🐳 Gemini CLI Interns (Docker)
│   ├── frontend-intern    (React, TypeScript, Tailwind)
│   ├── backend-intern     (Amplify, DynamoDB, GraphQL)
│   ├── auth-intern        (Cognito, Auth Flows)
│   └── devops-intern      (CI/CD, Deployment)
├── 🎯 Cursor MCP Agents
│   ├── cursor-doc-agent      (Documentation)
│   ├── cursor-review-agent   (Code Review)
│   └── cursor-refactor-agent (Refactoring)
└── 📊 Task Manager (Node.js Orchestrator)
```

### System Components

1. **Senior Developer Agent (Claude)**
   - Orchestrates all agents
   - Reviews and approves code
   - Writes complex features
   - Manages project architecture

2. **Gemini CLI Interns (Docker)**
   - Execute coding tasks
   - Work in isolated environments
   - Specialize in different areas
   - Auto-commit and push changes

3. **Cursor MCP Agents**
   - Handle multi-file operations
   - Generate documentation
   - Perform code reviews
   - Refactor existing code

4. **Task Manager**
   - Routes tasks to appropriate agents
   - Monitors agent health
   - Manages task queues
   - Provides status reports

## 📋 Task Management

### Task Queue Format

Tasks are managed in `.gemini/task-queue.json`:

```json
{
  "tasks": [
    {
      "id": "frontend-nav",
      "intern": "frontend-intern",
      "task": "Create responsive navigation component with NC State branding",
      "branch": "feature/navigation",
      "priority": "high",
      "status": "pending",
      "created": "2025-07-07T00:00:00Z"
    }
  ]
}
```

### Task Dispatch

```bash
# Process all pending tasks
./scripts/dispatch-tasks.sh

# Process specific task
./scripts/dispatch-tasks.sh task-id

# Monitor agents
./scripts/monitor-agents.sh
```

## 🛠️ Development Workflow

### 1. Planning Phase
- Claude analyzes requirements
- Breaks down into agent-specific tasks
- Populates task queue
- Assigns priorities

### 2. Execution Phase
- Task Manager dispatches tasks
- Agents execute in parallel
- Auto-commits to feature branches
- Continuous integration runs

### 3. Review Phase
- Claude reviews all changes
- Cursor agents provide feedback
- Code is merged or rejected
- Tests are run automatically

### 4. Deployment Phase
- DevOps intern handles deployment
- AWS costs are monitored
- Performance is validated
- Production rollout

## 🎯 Agent Specializations

### Frontend Intern
- **Focus:** React, TypeScript, Tailwind CSS, UI/UX
- **Tasks:** Components, styling, responsive design
- **Output:** Feature branches with UI components

### Backend Intern
- **Focus:** AWS Amplify, DynamoDB, GraphQL, APIs
- **Tasks:** Server logic, database schemas, API endpoints
- **Output:** Backend services and data models

### Auth Intern
- **Focus:** AWS Cognito, authentication flows, security
- **Tasks:** User management, login/logout, permissions
- **Output:** Complete auth system

### DevOps Intern
- **Focus:** CI/CD, deployment, monitoring, cost optimization
- **Tasks:** GitHub Actions, AWS deployment, monitoring
- **Output:** Production infrastructure

### Cursor Agents
- **Doc Agent:** Generates comprehensive documentation
- **Review Agent:** Performs code quality reviews
- **Refactor Agent:** Improves code structure and performance

## 📊 Monitoring and Control

### Agent Health Checks
```bash
# Check all agents
./scripts/monitor-agents.sh

# View logs
tail -f logs/task-manager.log
tail -f logs/dispatch.log
```

### Cost Monitoring
```bash
# Check AWS costs
aws ce get-cost-and-usage \
  --time-period Start=2025-07-01,End=2025-07-31 \
  --granularity MONTHLY \
  --metrics BlendedCost
```

### Performance Metrics
- Task completion rates
- Agent utilization
- Error rates
- Cost per feature

## 🔧 Configuration

### Environment Variables

```bash
# ~/.gemini/.env
GEMINI_API_KEY=your_key_here
AWS_ACCESS_KEY_ID=your_key_here
AWS_SECRET_ACCESS_KEY=your_key_here
GITHUB_TOKEN=your_token_here
```

### Agent Configuration

```json
// .cursor/mcp.json
{
  "mcpServers": {
    "cursor-doc-agent": {
      "command": "npx",
      "args": ["@cursor/mcp-docgen", "serve"]
    }
  }
}
```

## 🚀 Production Deployment

### AWS Amplify Gen 2
- **Main Branch:** Production environment
- **Staging Branch:** Testing environment  
- **Feature Branches:** Development previews
- **Cost Target:** Under $5/month

### CI/CD Pipeline
- Automated testing on all PRs
- Lighthouse performance checks
- Security scanning
- Cost estimation

## 🏆 Success Metrics

- **Functionality:** All features working correctly
- **Performance:** Lighthouse scores > 90
- **Cost:** AWS bills under $5/month
- **Quality:** 100% test coverage
- **Speed:** Features delivered in hours, not days

## 📞 Support

### Troubleshooting

1. **Agents not responding:**
   ```bash
   docker-compose restart
   ./scripts/monitor-agents.sh
   ```

2. **Task queue stuck:**
   ```bash
   # Reset task queue
   cp .gemini/task-queue.json.backup .gemini/task-queue.json
   ```

3. **Cursor MCP issues:**
   ```bash
   # Restart Cursor with MCP
   cursor --enable-mcp .
   ```

### Getting Help

- Check logs in `logs/` directory
- Review task queue status
- Monitor agent health
- Consult Claude for complex issues

## 🎉 Next Steps

1. **Customize the agents** for your specific needs
2. **Add more interns** for specialized tasks
3. **Integrate with other tools** (Linear, Slack, etc.)
4. **Scale up** with more powerful AI models
5. **Deploy to production** with confidence

---

**Built with ❤️ by AI agents, for AI agents.**

*This is the future of software development - autonomous, intelligent, and incredibly fast.*