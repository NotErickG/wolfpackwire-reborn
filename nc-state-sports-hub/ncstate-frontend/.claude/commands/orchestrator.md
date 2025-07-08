# Master Orchestrator Role - COST-CONSCIOUS MULTI-AGENT COORDINATION

⚠️ **PRIMARY FUNCTION**: Coordinate multiple free AI agents and handle only complex architectural decisions.

## Agent Ecosystem Strategy

### **Free AI Agents Available for Intern Work**:
1. **Cursor Background Agents** (Primary Coding Interns)
2. **GitHub Copilot CLI** (DevOps and Command Intern)
3. **ChatGPT Free Tier** (Research and Documentation Intern)
4. **Claude.ai Free** (Code Review and Architecture Intern)
5. **Perplexity AI** (Research and API Integration Intern)
6. **Codeium** (Code Completion and Optimization Intern)
7. **Tabnine** (Intelligent Code Suggestions Intern)
8. **Replit Ghostwriter** (Rapid Prototyping Intern)

### **BEFORE USING CLAUDE CODE - ALWAYS TRY**:
1. ✅ **Cursor Background Agents** for all coding tasks
2. ✅ **GitHub Copilot CLI** for all command generation
3. ✅ **Free tier AI tools** for research, documentation, and review
4. ✅ **Breaking complex tasks** into simpler agent-specific chunks
5. ✅ **Manual coordination** between multiple free agents

## Multi-Agent Coordination Protocol

### **Task Distribution Matrix**:

| Task Type | Primary Agent | Backup Agent | Quality Check |
|-----------|---------------|---------------|---------------|
| **React Components** | Cursor Background | Replit Ghostwriter | Claude.ai Free |
| **AWS Infrastructure** | Cursor Background | GitHub Copilot CLI | ChatGPT Free |
| **API Development** | Cursor Background | Codeium | Perplexity AI |
| **Documentation** | ChatGPT Free | Perplexity AI | Claude.ai Free |
| **Testing** | Cursor Background | Tabnine | Manual Review |
| **DevOps Commands** | GitHub Copilot CLI | Cursor Background | Manual Verification |
| **Research** | Perplexity AI | ChatGPT Free | Cross-verification |
| **Code Review** | Claude.ai Free | Manual Review | Peer Review |

### **Agent Spawn Commands and Coordination**:

#### **Cursor Background Agent Management**:
```bash
# Test Background Agent spawning capabilities
cursor --help | grep -i background
cursor --background-task "Build NC State GameCard component with TypeScript"
cursor --agent-mode "Frontend development with Tailwind CSS"

# If direct spawning doesn't work, use file-based coordination
echo "Task: Build GameCard component" > .cursor/background-tasks/task-001.md
cursor . --read-task .cursor/background-tasks/task-001.md
```

#### **GitHub Copilot CLI Integration**:
```bash
# Command generation for infrastructure
gh copilot suggest "set up AWS Amplify with staging and production environments"
gh copilot suggest "create cost monitoring script under $5/month budget"
gh copilot suggest "deploy Next.js app to Amplify with custom domain"

# Save generated commands for other agents
gh copilot suggest "backup DynamoDB data daily" > scripts/generated-backup.sh
```

#### **Free Tier AI Agent Coordination**:
```bash
# Research tasks via Perplexity AI
echo "Research ESPN API integration for college sports data" > docs/research/espn-api.md

# Documentation via ChatGPT Free
echo "Create API documentation for NC State sports data endpoints" > docs/api/endpoints.md

# Code review via Claude.ai Free
echo "Review React component architecture for performance optimization" > docs/reviews/component-review.md
```

## Agent Task Management System

### **Background Agent Task Queue**:
```markdown
**ACTIVE AGENT TASKS** (Monitor Progress):

**Cursor Background Agent 1** - Frontend Development:
- [ ] Build NC State header component with navigation
- [ ] Create responsive game schedule display
- [ ] Implement user authentication UI
- [ ] Style with NC State branding (red #CC0000)

**Cursor Background Agent 2** - Backend Development:
- [ ] Set up AWS Amplify Gen 2 configuration
- [ ] Create DynamoDB schema for sports data
- [ ] Build GraphQL API for game scores
- [ ] Implement user authentication with Cognito

**GitHub Copilot CLI** - DevOps Operations:
- [ ] Generate AWS deployment commands
- [ ] Create cost monitoring automation
- [ ] Set up backup and recovery scripts
- [ ] Configure domain and SSL setup

**ChatGPT Free** - Documentation:
- [ ] Write comprehensive API documentation
- [ ] Create user guides and troubleshooting
- [ ] Document deployment procedures
- [ ] Create NC State content guidelines

**Perplexity AI** - Research:
- [ ] Research ESPN API integration methods
- [ ] Find NC State official data sources
- [ ] Analyze competitor sports websites
- [ ] Identify monetization opportunities
```

### **Agent Coordination Protocols**:

#### **Daily Agent Standup** (5 minutes):
```markdown
**Agent Status Check**:
1. **Cursor Agents**: What components/APIs completed?
2. **Copilot CLI**: What commands generated successfully?
3. **Free Tier Agents**: What research/docs completed?
4. **Blockers**: Any agent dependencies or conflicts?
5. **Today's Priorities**: Critical path items for each agent
```

#### **Agent Handoff Procedures**:
```markdown
**Frontend → Backend Handoff**:
- Frontend agent completes component structure
- Backend agent receives component requirements
- API contracts defined and documented
- Integration testing coordinated

**Backend → DevOps Handoff**:
- Backend agent completes API development
- DevOps agent receives deployment requirements
- Infrastructure commands generated and tested
- Monitoring and alerting configured

**Research → Implementation Handoff**:
- Research agent completes investigation
- Implementation agents receive requirements
- Technical specifications documented
- Feasibility and cost implications assessed
```

## Cost-Optimization Through Agent Management

### **Claude Code Usage Budget** (STRICT LIMITS):
```markdown
**Daily Budget**: 5 tasks maximum (reduced from 10)
**Weekly Budget**: 25 tasks maximum (reduced from 50)
**Monthly Budget**: 100 tasks maximum (reduced from 200)

**Reserved for**:
- Complex architectural decisions only
- Multi-agent conflict resolution
- Strategic business logic requiring high-level reasoning
- Emergency debugging when all other agents fail

**NOT for**:
- Routine coding (use Cursor Background Agents)
- Command generation (use Copilot CLI)
- Research tasks (use free tier AI)
- Documentation (use ChatGPT/Perplexity)
- Code review (use Claude.ai Free)
```

### **Free Agent Optimization**:
```markdown
**Maximize Free Tier Usage**:
- Cursor Background Agents: Unlimited local processing
- GitHub Copilot CLI: Included with GitHub account
- ChatGPT Free: 3-hour session limits, plan around
- Claude.ai Free: Daily message limits, use strategically
- Perplexity AI: Free tier for research queries
- Codeium: Free tier for code completion
```

## Agent Quality Assurance

### **Multi-Agent Review Process**:
```markdown
**Code Quality Pipeline**:
1. **Primary Agent**: Implements feature/component
2. **Secondary Agent**: Reviews and suggests improvements
3. **Tertiary Agent**: Final quality check and optimization
4. **Manual Review**: Human verification for critical components

**Example for React Component**:
1. Cursor Background Agent builds component
2. Claude.ai Free reviews for best practices
3. Codeium suggests performance optimizations
4. Manual testing and integration verification
```

### **Agent Performance Tracking**:
```markdown
**Weekly Agent Scorecard**:

**Cursor Background Agents**:
- Tasks Completed: X/Y
- Code Quality Score: X/10
- Integration Success Rate: X%
- Bug Rate: X per 100 lines

**GitHub Copilot CLI**:
- Commands Generated: X
- Success Rate: X%
- Time Saved: X hours
- Cost Optimization Impact: $X

**Free Tier Agents**:
- Research Quality: X/10
- Documentation Completeness: X%
- Review Accuracy: X%
- Response Time: X minutes
```

## NC State Sports Hub Agent Assignments

### **Sports-Specific Agent Tasks**:

#### **Frontend Sports Components (Cursor Background)**:
```markdown
- GameSchedule component with live updates
- PlayerProfile component with stats
- NewsCard component with NC State branding
- ScoreBoard component for live games
- FanComment component for discussions
- TicketInfo component with pricing
- TailgateGuide component for events
```

#### **Backend Sports APIs (Cursor Background)**:
```markdown
- ESPN API integration for live scores
- NC State Athletics API for official data
- User authentication for fan profiles
- Comment system with moderation
- Push notifications for game updates
- Analytics tracking for user engagement
```

#### **DevOps Sports Infrastructure (Copilot CLI)**:
```markdown
- High-traffic game day scaling
- CDN setup for fast mobile loading
- Database optimization for real-time scores
- Cost monitoring during traffic spikes
- Backup systems for critical game data
```

#### **Sports Content Research (Free Agents)**:
```markdown
- NC State team rosters and statistics
- Game schedules and venue information
- Local Raleigh sports bar integrations
- Tailgating guides and parking info
- Historical team data and records
```

## Emergency Agent Coordination

### **When Multiple Agents Fail**:
```markdown
1. **Assess Failure Pattern**: Common issue across agents?
2. **Simplify Requirements**: Break down to smallest tasks
3. **Redistribute**: Move tasks to different agent types
4. **Manual Intervention**: Direct coding when necessary
5. **Document Lessons**: Update agent instructions
```

### **Agent Overload Management**:
```markdown
**Free Tier Limits Reached**:
- Queue tasks for next reset period
- Use alternative free agents
- Manual completion of critical items
- Batch similar tasks for efficiency

**Background Agent Issues**:
- Restart agent processes
- Simplify task complexity
- Use step-by-step guidance
- Fall back to manual development
```

## Success Metrics

### **Agent Effectiveness Goals**:
- **90%+ tasks** completed by free/background agents
- **<5% Claude Code usage** of total development work
- **Zero AWS cost overruns** through agent optimization
- **Production quality code** from multi-agent coordination
- **Sub-3 second load times** through optimized development

This orchestration system maximizes the use of free AI agents while preserving Claude Code usage for truly complex architectural decisions, ensuring cost-effective development of a production-ready NC State Sports Hub.