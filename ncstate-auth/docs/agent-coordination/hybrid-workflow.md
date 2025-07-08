# Hybrid Multi-Agent Coordination Workflow

## Agent Priority System (Cost-Aware)

### **🎯 Primary Rule: Preserve Claude Code Usage**
- **First Try**: Cursor Agent Mode or GitHub Copilot CLI
- **Second Try**: Simplify tasks for the same agents  
- **Last Resort**: Use Claude Code only when other agents fail

## Agent Specialization Matrix

| Task Type | 1st Choice | 2nd Choice | Last Resort |
|-----------|------------|------------|-------------|
| **Frontend Coding** | Cursor (Frontend) | Simplified Task | Claude Code |
| **Backend Development** | Cursor (Backend) | Simplified Task | Claude Code |
| **AWS Commands** | Copilot CLI | Manual Commands | Claude Code |
| **Deployment Scripts** | Copilot CLI | Cursor (Backend) | Claude Code |
| **Architecture Decisions** | Try Simplified | Document Requirements | Claude Code |
| **Cross-System Integration** | Individual Agents | Break Down Steps | Claude Code |

## Task Delegation Decision Tree

```
📝 New Task Arrives
    ↓
🤔 Can this be broken into smaller parts?
    ↓ YES                          ↓ NO
Break into subtasks          Assign to primary agent
    ↓                              ↓
Assign each to best agent    Agent attempts task
    ↓                              ↓
Multiple agents work         ✅ Success? → Done
    ↓                              ↓ ❌ Failed
Integrate results            Simplify requirements
    ↓                              ↓
✅ Success? → Done           Try again with same agent
    ↓ ❌ Failed                     ↓
Escalate to Claude Code      ✅ Success? → Done
                                  ↓ ❌ Failed
                            Try different agent
                                  ↓
                            ✅ Success? → Done
                                  ↓ ❌ Failed
                            📊 Document failure reasons
                                  ↓
                            🚨 Escalate to Claude Code
```

## Agent Communication Protocols

### Daily Standup Format
Each agent reports:
1. **Completed Tasks**: What was finished successfully
2. **In Progress**: Current work and expected completion
3. **Blockers**: What's preventing progress
4. **Help Needed**: Specific assistance required
5. **Cost Impact**: Any AWS resource usage implications

### Cross-Agent Dependencies

#### **Frontend ↔ Backend Integration**
```markdown
**Handoff Requirements:**
- API endpoint contracts (Backend → Frontend)
- Data model interfaces (Backend → Frontend)  
- Authentication flow (Backend → Frontend)
- Error handling patterns (Both)

**Communication Method:**
- Update docs/api-contracts.md after changes
- Test integration endpoints before handoff
- Document any breaking changes clearly
```

#### **Backend ↔ DevOps Integration**
```markdown
**Handoff Requirements:**
- Deployment configuration (Backend → DevOps)
- Environment variables (Backend → DevOps)
- Database migration scripts (Backend → DevOps)
- Monitoring requirements (Backend → DevOps)

**Communication Method:**
- Update deployment scripts after infrastructure changes
- Test deployment pipeline before production
- Monitor cost implications of all changes
```

#### **Frontend ↔ DevOps Integration**
```markdown
**Handoff Requirements:**
- Build configuration (Frontend → DevOps)
- Static asset optimization (Frontend → DevOps)
- Performance monitoring (DevOps → Frontend)
- CDN configuration (DevOps → Frontend)

**Communication Method:**
- Update build scripts after dependency changes
- Monitor performance metrics continuously
- Optimize based on real user data
```

## Cost-Conscious Coordination

### Claude Code Usage Tracking
Create `docs/claude-usage-log.md`:
```markdown
# Claude Code Usage Log

## Daily Usage Targets
- **Maximum**: 10 tasks per day
- **Preferred**: 5 tasks per day
- **Emergency**: 15 tasks per day (document reasons)

## Usage Categories
- **Architecture**: 30% of usage budget
- **Complex Integration**: 25% of usage budget
- **Problem Solving**: 25% of usage budget
- **Strategy**: 20% of usage budget

## Weekly Review
- Track which tasks succeeded with other agents
- Identify patterns in escalation needs
- Optimize agent instructions based on failures
```

### Agent Efficiency Optimization

#### **Cursor Agent Success Patterns**
- **Works Best For**: Incremental coding, component building, API endpoints
- **Struggles With**: Complex architecture, cross-system integration
- **Optimization**: Provide detailed examples and break complex tasks down

#### **Copilot CLI Success Patterns**
- **Works Best For**: Command generation, script automation, AWS operations
- **Struggles With**: Complex multi-step deployments, error handling
- **Optimization**: Provide step-by-step sequences and error recovery commands

## Agent Launch Coordination

### **Step 1: Main Architect (Claude Code) - Setup Only**
```bash
cd nc-state-sports-hub
claude
# Use /architect command for high-level planning only
# Delegate specific implementation to other agents
```

### **Step 2: Frontend Development (Cursor Agent)**
```bash
cd ../ncstate-frontend
cursor .
# Load .cursor/agent-instructions/frontend-agent.md
# Start with basic components and layouts
# Escalate only after 2-3 simplified attempts
```

### **Step 3: Backend Development (Cursor Agent)**
```bash
cd ../ncstate-backend  
cursor .
# Load .cursor/agent-instructions/backend-agent.md
# Start with basic CRUD operations
# Escalate only after trying simplified approaches
```

### **Step 4: DevOps Operations (Copilot CLI)**
```bash
cd ../ncstate-infrastructure
# Use GitHub Copilot CLI for all command generation
gh copilot suggest "deploy amplify app with cost optimization"
gh copilot suggest "set up AWS cost monitoring under $5/month"
gh copilot suggest "create database backup automation"
```

## Integration Checkpoints

### **Daily Integration Check** (End of Day)
1. **API Contracts**: Verify all agents using same interfaces
2. **Data Flow**: Ensure data moves correctly between systems
3. **Cost Monitoring**: Check AWS usage stays under budget
4. **Task Completion**: Review progress across all agents
5. **Blocker Resolution**: Address any cross-agent dependencies

### **Weekly Architecture Review** (Claude Code Only)
1. **System Design**: Review overall architecture decisions
2. **Performance**: Analyze system performance metrics
3. **Cost Optimization**: Review AWS costs and optimization opportunities
4. **Agent Effectiveness**: Analyze which agents handle which tasks best
5. **Strategic Planning**: Plan next week's priorities and agent assignments

## Escalation Protocols

### **When to Escalate to Claude Code**

#### **Automatic Escalation Triggers**
- Same task fails with 3 different agents
- Cross-system integration requires architectural changes
- Cost implications exceed $1 for any single decision
- Security or compliance issues arise
- Performance requirements can't be met with current approach

#### **Escalation Documentation Required**
```markdown
**Escalation Request Template**

**Task**: [Describe the specific task]
**Agents Tried**: [List which agents attempted this]
**Attempts Made**: [Number of simplified attempts]
**Failure Reasons**: [Why each attempt failed]
**Cost Impact**: [Potential AWS cost implications]
**Urgency**: [Timeline constraints]
**Architecture Impact**: [Does this affect system design?]

**Requested Solution Level**:
- [ ] Guidance only (prefer this)
- [ ] Detailed design
- [ ] Full implementation (last resort)
```

## Success Metrics and Optimization

### **Agent Performance Tracking**
```markdown
**Weekly Agent Scorecard**

**Cursor Frontend Agent**:
- Tasks Completed: X/Y
- Success Rate: X%
- Average Task Complexity: Simple/Medium/Complex
- Escalation Rate: X%

**Cursor Backend Agent**:
- Tasks Completed: X/Y  
- Success Rate: X%
- AWS Cost Impact: $X.XX
- Escalation Rate: X%

**Copilot CLI Agent**:
- Commands Generated: X
- Success Rate: X%
- Automation Scripts Created: X
- Escalation Rate: X%

**Claude Code Usage**:
- Tasks Handled: X
- Architecture Decisions: X
- Problem Resolution: X
- Strategic Planning: X
- Daily Average: X tasks
```

### **Continuous Improvement Process**
1. **Weekly Agent Retrospective**: What worked well, what didn't
2. **Instruction Optimization**: Update agent instructions based on learnings
3. **Task Delegation Refinement**: Improve task assignment decisions
4. **Cost Optimization Review**: Ensure AWS costs remain under budget
5. **Performance Monitoring**: Track system performance and user experience

## Emergency Procedures

### **Agent Failure Scenarios**

#### **Cursor Agent Unavailable**
1. **Fallback**: Use GitHub Copilot CLI for command-based tasks
2. **Alternative**: Break tasks into smaller Claude Code requests
3. **Documentation**: Record manual implementations for future automation

#### **Copilot CLI Unavailable**  
1. **Fallback**: Manual AWS CLI commands
2. **Alternative**: Use Cursor Agent for script generation
3. **Documentation**: Record manual commands for automation later

#### **Claude Code Usage Limit Reached**
1. **Immediate**: Stop all non-essential development
2. **Focus**: Only critical bug fixes and essential features
3. **Strategy**: Wait for quota reset and batch important decisions
4. **Optimization**: Use other agents for all possible tasks

### **Cost Control Emergency**
If AWS costs approach $4.50:
1. **Immediate**: Pause all non-essential services
2. **Review**: Check cost breakdown for anomalies
3. **Optimize**: Implement aggressive caching and resource cleanup
4. **Communication**: Inform all agents about cost constraints
5. **Planning**: Revise development approach to stay under budget

This hybrid coordination system ensures maximum efficiency while preserving Claude Code usage for the most valuable architectural and strategic decisions.