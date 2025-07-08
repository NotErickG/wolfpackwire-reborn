# Cost-Conscious Task Delegation System

## Agent Capability Matrix

| Task Category | Cursor Frontend | Cursor Backend | Copilot CLI | Claude Code |
|---------------|----------------|----------------|-------------|-------------|
| **React Components** | 🟢 Excellent | 🔴 No | 🔴 No | 🟡 Expensive |
| **API Development** | 🔴 No | 🟢 Excellent | 🔴 No | 🟡 Expensive |
| **AWS Commands** | 🔴 No | 🟡 Basic | 🟢 Excellent | 🟡 Expensive |
| **Database Design** | 🔴 No | 🟢 Excellent | 🔴 No | 🟢 Strategic |
| **Styling/CSS** | 🟢 Excellent | 🔴 No | 🔴 No | 🔴 Avoid |
| **Deployment Scripts** | 🔴 No | 🟡 Basic | 🟢 Excellent | 🔴 Avoid |
| **Architecture Decisions** | 🔴 No | 🔴 No | 🔴 No | 🟢 Required |
| **Bug Debugging** | 🟡 Component-level | 🟡 API-level | 🟡 Infrastructure | 🟢 Complex Issues |
| **Performance Optimization** | 🟡 Frontend | 🟡 Backend | 🟡 Infrastructure | 🟢 System-wide |

## Task Delegation Rules

### **🟢 First Choice Assignments**

#### **Cursor Frontend Agent - Primary For:**
- Building React components and pages
- Implementing responsive layouts with Tailwind CSS
- Creating user interfaces and interactions
- Handling forms and user input
- Implementing authentication UI
- Sports data visualization components
- Mobile-first responsive design

**Example Tasks:**
```markdown
✅ "Create a GameCard component for displaying NC State game scores"
✅ "Build a responsive navigation menu with mobile hamburger"
✅ "Implement user login form with validation"
✅ "Create a player profile page layout"
✅ "Style the news feed with NC State branding"
```

#### **Cursor Backend Agent - Primary For:**
- AWS Amplify configuration and setup
- DynamoDB table design and queries
- GraphQL API development
- Authentication with AWS Cognito
- Data processing and transformation
- External API integration (ESPN, etc.)

**Example Tasks:**
```markdown
✅ "Set up Amplify auth with email verification"
✅ "Create DynamoDB table for storing game data"
✅ "Build GraphQL resolver for fetching team rosters"
✅ "Implement user registration with custom attributes"
✅ "Create API endpoint for sports data sync"
```

#### **Copilot CLI - Primary For:**
- AWS deployment command generation
- Infrastructure automation scripts
- Monitoring and alerting setup
- Backup and recovery procedures
- Security scanning commands
- Cost monitoring automation

**Example Tasks:**
```markdown
✅ "Generate commands to deploy Amplify app to production"
✅ "Create script to monitor AWS costs daily"
✅ "Set up CloudWatch alarms for API errors"
✅ "Generate backup commands for DynamoDB tables"
✅ "Create security audit automation script"
```

### **🟡 Fallback Assignments (When Primary Agent Struggles)**

#### **Task Simplification Strategies:**

**Complex Frontend Task → Simplified Approach:**
```markdown
❌ Complex: "Build a real-time sports dashboard with live scores, user comments, and social sharing"

✅ Simplified Step 1: "Create a basic dashboard layout with placeholder content"
✅ Simplified Step 2: "Add static sports data display components"  
✅ Simplified Step 3: "Connect to API for dynamic data"
✅ Simplified Step 4: "Add real-time updates functionality"
```

**Complex Backend Task → Simplified Approach:**
```markdown
❌ Complex: "Build a comprehensive sports data aggregation system with real-time updates and caching"

✅ Simplified Step 1: "Create basic CRUD operations for sports data"
✅ Simplified Step 2: "Add simple data validation and error handling"
✅ Simplified Step 3: "Implement basic caching with TTL"
✅ Simplified Step 4: "Add real-time subscription features"
```

**Complex DevOps Task → Simplified Approach:**
```markdown
❌ Complex: "Set up comprehensive CI/CD pipeline with multi-environment deployment and automated testing"

✅ Simplified Step 1: "Generate basic deployment commands for dev environment"
✅ Simplified Step 2: "Create simple health check script"
✅ Simplified Step 3: "Add automated backup commands"
✅ Simplified Step 4: "Implement production deployment workflow"
```

### **🔴 Claude Code Escalation Criteria**

#### **Automatic Escalation Triggers:**
1. **Three Agent Failure**: Same task fails with 3 different approaches
2. **Architecture Impact**: Decision affects overall system design
3. **Cost Implications**: Single decision could impact >$1 AWS costs
4. **Cross-System Integration**: Requires coordination between multiple services
5. **Strategic Business Logic**: Core business rules and workflows
6. **Security Architecture**: High-level security strategy decisions

#### **Escalation Documentation Template:**
```markdown
**ESCALATION REQUEST**

**Task**: [Specific task description]
**Primary Agent Tried**: [Cursor Frontend/Backend/Copilot CLI]
**Attempts Made**: [Number and description of attempts]
**Failure Reasons**: 
- Attempt 1: [What went wrong]
- Attempt 2: [What went wrong]  
- Attempt 3: [What went wrong]

**Simplification Tried**: [How task was broken down]
**Alternative Agents Tried**: [Other agents attempted]

**Cost Impact**: [Potential AWS cost implications]
**Timeline**: [How urgent is this task]
**Architecture Impact**: [Does this affect system design]

**Requested Claude Code Involvement**:
- [ ] Guidance only (preferred)
- [ ] High-level design  
- [ ] Detailed implementation (last resort)

**Success Criteria**: [How to know when this is resolved]
```

## Agent Communication Protocols

### **Daily Task Assignment Process**

#### **Morning Planning (10 minutes)**:
1. **Review Previous Day**: Check completion status of all agent tasks
2. **Identify Blockers**: Any tasks that failed or need escalation
3. **New Task Triage**: Classify new tasks by agent capability
4. **Dependency Mapping**: Identify tasks that depend on others
5. **Priority Assignment**: High/Medium/Low based on business impact

#### **Task Assignment Format**:
```markdown
**TASK ASSIGNMENT**

**To**: [Cursor Frontend/Backend/Copilot CLI]
**Priority**: [High/Medium/Low]
**Estimated Effort**: [Small/Medium/Large]
**Dependencies**: [What must be done first]

**Task Description**: [Clear, specific description]
**Acceptance Criteria**: [How to know when done]
**Examples/References**: [Links to similar implementations]

**If You Get Stuck**:
1. Try [specific simplification approach]
2. Break into these smaller pieces: [list]
3. Escalate with documentation if all approaches fail

**Cost Considerations**: [Any AWS cost implications]
**Integration Points**: [How this connects to other agent work]
```

### **Progress Tracking System**

#### **Agent Status Updates** (End of Day):
```markdown
**AGENT STATUS REPORT**

**Agent**: [Cursor Frontend/Backend/Copilot CLI]
**Date**: [YYYY-MM-DD]

**Tasks Completed**: 
- [Task 1] - ✅ Success
- [Task 2] - ✅ Success

**Tasks In Progress**:
- [Task 3] - 50% complete, expect to finish tomorrow
- [Task 4] - Blocked by [dependency]

**Tasks Failed**:
- [Task 5] - ❌ Failed due to [reason]
  - Simplification attempted: [description]
  - Alternative approach: [description]
  - Escalation recommended: [yes/no]

**Help Needed**:
- [Specific assistance required]
- [Questions for other agents]
- [Escalation requests]

**Tomorrow's Plan**:
- [Priority tasks for next day]
- [Dependencies to resolve]
```

## Cost Optimization Through Task Delegation

### **Claude Code Usage Budget**
```markdown
**Daily Budget**: 10 tasks maximum
**Weekly Budget**: 50 tasks maximum
**Monthly Budget**: 200 tasks maximum

**Usage Categories**:
- **Architecture**: 30% (Strategic decisions)
- **Problem Solving**: 25% (Complex debugging)
- **Integration**: 25% (Cross-system coordination)
- **Planning**: 20% (Business strategy)

**Cost Per Task Type**:
- Guidance/Direction: 0.5 task credits
- Design Decision: 1.0 task credits  
- Implementation Review: 1.5 task credits
- Full Problem Solving: 2.0 task credits
```

### **Agent Efficiency Optimization**

#### **Success Rate Tracking**:
```markdown
**Weekly Agent Performance**

**Cursor Frontend**:
- Tasks Assigned: 25
- Tasks Completed: 22 (88% success rate)
- Average Complexity: Medium
- Escalation Rate: 12%
- Top Success Areas: Component building, styling
- Improvement Areas: Complex state management

**Cursor Backend**:
- Tasks Assigned: 20
- Tasks Completed: 18 (90% success rate)
- Average Complexity: Medium-High
- Escalation Rate: 10%
- Top Success Areas: CRUD operations, API development
- Improvement Areas: Real-time features, optimization

**Copilot CLI**:
- Commands Generated: 15
- Commands Successful: 14 (93% success rate)
- Average Complexity: Medium
- Escalation Rate: 7%
- Top Success Areas: Deployment, monitoring
- Improvement Areas: Complex multi-step operations
```

#### **Instruction Optimization**:
Based on weekly performance, update agent instructions:
```markdown
**Agent Instruction Updates**

**Frontend Agent Improvements**:
- Add more examples for state management patterns
- Provide clearer component structure guidelines
- Include performance optimization checklist

**Backend Agent Improvements**:
- Add DynamoDB optimization patterns
- Include cost-conscious query examples
- Provide real-time implementation templates

**DevOps Agent Improvements**:
- Add error handling for complex commands
- Include rollback procedures for deployments
- Provide monitoring automation templates
```

## Emergency Procedures

### **Agent Overload Scenarios**

#### **When Multiple Agents Are Struggling**:
1. **Immediate**: Pause new task assignments
2. **Analyze**: Review common failure patterns
3. **Simplify**: Break all remaining tasks into smaller pieces
4. **Re-assign**: Distribute work based on agent strengths
5. **Document**: Record learnings to improve future assignments

#### **When Claude Code Budget Is Exhausted**:
1. **Stop**: No new Claude Code tasks until quota resets
2. **Batch**: Collect all escalation requests for next period
3. **Alternative**: Use manual problem-solving and documentation
4. **Plan**: Prioritize most critical architecture decisions for next period

This system ensures maximum development velocity while preserving Claude Code usage for the most valuable strategic and architectural decisions.