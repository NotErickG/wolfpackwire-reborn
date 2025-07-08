# 🚀 Hybrid Multi-Agent Launch Guide

## Quick Start Overview

**Your hybrid development environment is ready!** This guide will walk you through launching all four AI agents in the correct order for maximum efficiency and cost savings.

## Pre-Launch Checklist

### ✅ Environment Setup
- [ ] Git worktrees created successfully
- [ ] AWS CLI configured with appropriate permissions
- [ ] Node.js 18+ installed
- [ ] Cursor IDE installed and updated
- [ ] GitHub CLI installed for Copilot integration
- [ ] All agent instruction files created

### ✅ Cost Controls
- [ ] AWS budget set to $5/month with alerts at $3 and $4.50
- [ ] Claude Code usage tracking system in place
- [ ] Agent task delegation rules understood
- [ ] Emergency cost controls documented

## Agent Launch Sequence

### **Phase 1: Project Architect (Claude Code) - CURRENT SESSION**
```bash
# You're already here! This is the main project directory
pwd  # Should show: /home/erick/amplify/wolfpackwire-reborn/nc-state-sports-hub
```

**Role**: Strategic planning and high-level architecture decisions only
**Usage**: Minimize - save for complex architecture decisions
**Commands**: Use `/architect` command for strategic guidance

### **Phase 2: Frontend Development (Cursor Agent)**
```bash
# Navigate to frontend worktree
cd /home/erick/amplify/wolfpackwire-reborn/ncstate-frontend

# Launch Cursor IDE
cursor .

# In Cursor, activate Agent Mode:
# 1. Press Ctrl+Shift+P (or Cmd+Shift+P on Mac)
# 2. Type "Agent Mode" and select it
# 3. Load the instruction file: .cursor/agent-instructions/frontend-agent.md
```

**Agent Configuration in Cursor:**
```markdown
System Prompt: Load the frontend-agent.md instructions

Context: You are the primary frontend development agent for NC State Sports Hub. 
Priority: Handle ALL frontend coding tasks before escalating to Claude Code.
Focus: React components, Tailwind styling, mobile-first design, NC State branding.
Cost-Saving: Attempt 2-3 simplified approaches before escalation.

Working Directory: /ncstate-frontend
Branch: frontend-development
```

### **Phase 3: Backend Development (Cursor Agent)**
```bash
# Open new terminal window/tab
cd /home/erick/amplify/wolfpackwire-reborn/ncstate-backend

# Launch Cursor IDE (new window)
cursor .

# In Cursor, activate Agent Mode:
# 1. Load backend-agent.md instructions
# 2. Set working context for AWS Amplify development
```

**Agent Configuration in Cursor:**
```markdown
System Prompt: Load the backend-agent.md instructions

Context: You are the primary backend development agent for NC State Sports Hub.
Priority: Handle ALL backend/AWS tasks before escalating to Claude Code.
Focus: AWS Amplify Gen 2, DynamoDB, authentication, cost optimization.
Cost-Saving: Start with basic CRUD, build incrementally.

Working Directory: /ncstate-backend  
Branch: backend-amplify
```

### **Phase 4: DevOps Operations (GitHub Copilot CLI)**
```bash
# Open new terminal window/tab
cd /home/erick/amplify/wolfpackwire-reborn/ncstate-infrastructure

# Verify GitHub Copilot CLI is available
gh copilot --help

# Load DevOps instructions context
cat .copilot-instructions/devops-agent.md
```

**Usage Examples:**
```bash
# Generate AWS deployment commands
gh copilot suggest "deploy amplify app with cost optimization under $5/month"

# Create monitoring setup
gh copilot suggest "set up CloudWatch monitoring for NC State sports app"

# Generate backup automation
gh copilot suggest "create automated DynamoDB backup script"
```

## Agent Coordination Workflow

### **Daily Startup Routine (5 minutes)**

#### **1. Morning Planning (Claude Code - 2 minutes)**
```bash
# In main project directory
cd /home/erick/amplify/wolfpackwire-reborn/nc-state-sports-hub

# Start Claude Code session
claude

# Use architect command for high-level planning
/architect

# Review agent progress and assign new tasks
```

**Tasks for Claude Code:**
- Review previous day's progress across all agents
- Identify any architectural blockers or decisions needed
- Assign priority tasks to appropriate agents
- Update cost tracking and usage monitoring

#### **2. Frontend Agent Activation (1 minute)**
```bash
# Switch to frontend workspace
cd ../ncstate-frontend
cursor . --agent-mode

# Load today's task list
# Focus on: UI components, styling, user experience
```

#### **3. Backend Agent Activation (1 minute)**
```bash
# Switch to backend workspace  
cd ../ncstate-backend
cursor . --agent-mode

# Load today's task list
# Focus on: APIs, database, authentication, cost optimization
```

#### **4. DevOps Agent Ready (1 minute)**
```bash
# Switch to infrastructure workspace
cd ../ncstate-infrastructure

# Ready for command generation as needed
gh copilot suggest "show me today's AWS cost summary"
```

### **Task Assignment Flow**

#### **New Task Arrives → Decision Tree**
```markdown
1. **Is this a frontend coding task?**
   ✅ YES → Assign to Cursor Frontend Agent
   ❌ NO → Continue

2. **Is this a backend/AWS task?**
   ✅ YES → Assign to Cursor Backend Agent
   ❌ NO → Continue

3. **Is this a command/script generation task?**
   ✅ YES → Use GitHub Copilot CLI
   ❌ NO → Continue

4. **Is this architectural or strategic?**
   ✅ YES → Use Claude Code (log usage)
   ❌ NO → Break down into simpler tasks for other agents
```

#### **Example Task Assignments**

**Frontend Tasks → Cursor Frontend Agent:**
```markdown
✅ "Create a GameCard component showing NC State vs opponent"
✅ "Build responsive navigation with mobile hamburger menu"
✅ "Style the news feed with NC State red/white theme"
✅ "Implement user login form with validation"
✅ "Create player profile page layout"
```

**Backend Tasks → Cursor Backend Agent:**
```markdown
✅ "Set up Amplify authentication with email verification"
✅ "Create DynamoDB table for storing game scores"
✅ "Build GraphQL API for fetching team rosters"
✅ "Implement cost-optimized caching for sports data"
✅ "Connect to ESPN API for live score updates"
```

**DevOps Tasks → GitHub Copilot CLI:**
```markdown
✅ gh copilot suggest "deploy to production with zero downtime"
✅ gh copilot suggest "set up automated cost monitoring alerts"
✅ gh copilot suggest "create backup script for user data"
✅ gh copilot suggest "generate security audit commands"
✅ gh copilot suggest "optimize AWS resources for cost"
```

## Cost Management During Development

### **Claude Code Usage Tracking**
```bash
# Create daily usage log
echo "$(date): Claude Code tasks used: X/10" >> docs/claude-usage-log.md

# Monitor usage throughout day
tail -f docs/claude-usage-log.md
```

### **AWS Cost Monitoring**
```bash
# Run cost check (via Copilot CLI)
gh copilot suggest "check current AWS spending for this month"

# Run automated cost monitor script
./scripts/cost-monitor.sh
```

### **Agent Efficiency Tracking**
```markdown
**Daily Agent Performance Log**:
- Cursor Frontend: X tasks completed, Y escalations
- Cursor Backend: X tasks completed, Y escalations  
- Copilot CLI: X commands generated, Y successful
- Claude Code: X tasks used out of 10 daily limit
```

## Integration and Sync Points

### **Mid-Day Sync (10 minutes)**

#### **1. Integration Check**
```bash
# Check if all agents are using compatible APIs
cd /home/erick/amplify/wolfpackwire-reborn/nc-state-sports-hub
grep -r "API" docs/api-specs/

# Verify data models are consistent
grep -r "interface" src/types/
```

#### **2. Cost Check**
```bash
# Quick AWS cost verification
./scripts/cost-monitor.sh

# Check if any agent work is causing cost spikes
aws cloudwatch get-metric-statistics --metric-name EstimatedCharges --namespace AWS/Billing
```

#### **3. Progress Coordination**
```markdown
**Quick Sync Questions**:
- Are frontend and backend APIs aligned?
- Any blockers between agents?
- Cost staying under daily budget targets?
- Any tasks need to be escalated to Claude Code?
```

### **End-of-Day Review (15 minutes)**

#### **1. Agent Status Updates**
```bash
# Frontend Agent Status
cd ../ncstate-frontend
git status  # Check what was completed
git diff    # Review changes made

# Backend Agent Status  
cd ../ncstate-backend
git status  # Check AWS infrastructure changes
git diff    # Review API changes

# DevOps Accomplishments
cd ../ncstate-infrastructure
ls -la scripts/  # Check new automation scripts
```

#### **2. Prepare Tomorrow's Tasks**
```markdown
**Task Queue for Tomorrow**:

**High Priority** (Claude Code if needed):
- [ ] Architecture decisions blocking other agents
- [ ] Cost optimization strategies
- [ ] Strategic business logic

**Medium Priority** (Cursor Agents):
- [ ] Component implementations
- [ ] API development
- [ ] Database optimizations

**Low Priority** (Copilot CLI):
- [ ] Monitoring improvements
- [ ] Backup automations
- [ ] Performance optimizations
```

## Troubleshooting Common Issues

### **When Cursor Agents Get Stuck**

#### **Frontend Agent Issues:**
```markdown
**Problem**: Component too complex
**Solution**: Break into smaller components

**Problem**: Styling not working  
**Solution**: Check Tailwind config, provide specific classes

**Problem**: TypeScript errors
**Solution**: Start with 'any' types, refine incrementally
```

#### **Backend Agent Issues:**
```markdown
**Problem**: AWS Amplify errors
**Solution**: Use step-by-step CLI commands

**Problem**: DynamoDB query issues
**Solution**: Start with simple queries, add complexity

**Problem**: Authentication not working
**Solution**: Follow AWS Cognito basic setup first
```

### **When to Escalate to Claude Code**

#### **Escalation Criteria:**
- ✅ Agent failed same task 3 times with different approaches
- ✅ Task affects overall system architecture
- ✅ Decision impacts AWS costs by >$1
- ✅ Cross-system integration requires design decisions
- ✅ Security or compliance requirements need strategic approach

#### **Escalation Process:**
1. **Document**: What agents tried and why they failed
2. **Simplify**: Can this be broken down further?
3. **Cost Check**: Will escalation stay within daily budget?
4. **Escalate**: Use Claude Code `/architect` command with context
5. **Implement**: Have appropriate agent implement the guidance

## Success Metrics

### **Daily Goals**
- **Frontend Agent**: 3-5 components or features completed
- **Backend Agent**: 2-3 API endpoints or configurations completed
- **Copilot CLI**: 5-10 useful commands generated
- **Claude Code**: <5 tasks used (save budget for complex decisions)

### **Weekly Goals**
- **Working MVP**: Basic sports news and scores functionality
- **User Authentication**: Registration and login working
- **Mobile Experience**: Responsive design tested on devices
- **AWS Costs**: Staying well under $5/month target
- **Agent Efficiency**: >80% tasks completed by non-Claude agents

### **Monthly Goals**
- **Production Ready**: Full NC State sports hub functionality
- **Performance**: <3 second load times on mobile
- **User Base**: Ready to handle 1000+ concurrent users
- **Monetization Ready**: Foundation for future revenue streams
- **Cost Optimized**: Sustainable operation under $5/month

## Emergency Procedures

### **If Claude Code Usage Limit Reached**
1. **Stop**: No new Claude Code tasks until quota resets
2. **Batch**: Collect architectural decisions for next period
3. **Simplify**: Break remaining tasks for other agents
4. **Manual**: Use documentation and examples for guidance

### **If AWS Costs Spike**
1. **Immediate**: Run emergency cost analysis
2. **Identify**: Which agent activities caused the spike
3. **Optimize**: Implement immediate cost reduction measures
4. **Adjust**: Modify agent instructions to prevent recurrence

### **If Agents Are Failing Frequently**
1. **Analyze**: Common failure patterns across agents
2. **Simplify**: Reduce task complexity systematically
3. **Training**: Update agent instructions with better examples
4. **Support**: Increase Claude Code support temporarily

---

🎯 **Ready to Launch!** Your hybrid multi-agent development environment is configured for maximum productivity and cost efficiency. Start with Phase 1 (this Claude Code session) for strategic planning, then launch the specialized agents as needed.

**Go Pack!** 🐺