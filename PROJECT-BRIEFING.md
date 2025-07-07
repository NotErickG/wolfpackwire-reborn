# NC State Sports Hub - Expert Project Briefing

## Project Overview

You are working on the **NC State Sports Hub**, a production-grade multi-agent development environment for building a comprehensive sports platform for NC State University's Wolfpack athletics. This is an advanced Next.js 14 application with TypeScript that integrates real-time sports data and operates within a sophisticated AI agent ecosystem.

## Key Project Characteristics

### 🏗️ **Multi-Agent Development Architecture**
- **You are the Senior Developer Agent** - responsible for complex/advanced features and monitoring intern work
- **Intern Agents**: Cursor MCP agents, GitHub Copilot CLI, and potentially Gemini CLI agents
- **Agent Management**: User will handle starting/stopping intern agents - your role is to monitor their changes
- **Delegation Ratio**: Maintain 10:1 ratio (interns produce 10 features for every 1 senior dev feature)
- **Task Coordination**: Monitor intern outputs and integrate their work into the main project

### 🎯 **Primary Technology Stack**
- **Frontend**: Next.js 14 with App Router, TypeScript, Tailwind CSS
- **Backend**: AWS Amplify Gen 2, DynamoDB, GraphQL APIs
- **Real Data Sources**: 
  - ESPN API (NC State team ID: 152)
  - RSS feeds from Backing the Pack (`https://www.backingthepack.com/rss/current.xml`)
- **Testing**: Jest + Playwright with 100% coverage target
- **Deployment**: AWS Amplify with CI/CD pipeline
- **Cost Target**: Stay under $5/month AWS budget

### 🎨 **NC State Branding Requirements**
- **Primary Color**: `#CC0000` (NC State red)
- **Secondary Colors**: `#990000` (dark red), `#FF3333` (light red)
- **Theme**: Wolfpack athletics with professional sports hub aesthetic
- **Responsive**: Mobile-first design with accessibility compliance

### 📊 **Core Features to Implement**
1. **Live Score Widgets** - Real-time ESPN API integration with 30-second updates
2. **Game Schedule** - Calendar view with comprehensive game details
3. **Player Profiles** - Individual player pages with statistics and photos
4. **News Feed** - RSS integration with Backing the Pack articles
5. **Team Roster** - Complete player directory with searchable interface
6. **Stats Dashboard** - Advanced analytics and historical data
7. **Navigation System** - Mobile-responsive header with search functionality
8. **Real-time Updates** - WebSocket connections for live game data

### 🔧 **Development Workflow**
1. **Task Management**: Use TodoWrite/TodoRead tools extensively for tracking
2. **Senior Dev Focus**: Build difficult/advanced features while monitoring intern work
3. **Intern Monitoring**: Review and integrate intern-produced components and features
4. **Code Quality**: Run `npm run build`, `npm run lint`, `npm run type-check` before commits
5. **Testing**: Implement comprehensive test coverage with `npm test`
6. **Commit Pattern**: Frequent commits with descriptive messages and co-authoring
7. **Branch Strategy**: Feature branches with descriptive names

### 📁 **Project Structure**
```
/home/erick/amplify/wolfpackwire-reborn/
├── src/
│   ├── app/                 # Next.js 14 App Router
│   ├── components/          # React components
│   ├── lib/                 # API integrations (ESPN, RSS)
│   ├── hooks/               # Custom React hooks
│   └── utils/               # Utility functions
├── scripts/                 # Agent coordination scripts
├── tests/                   # Jest + Playwright tests
├── CLAUDE.md               # Detailed project documentation
└── package.json            # Dependencies and scripts
```

### 🚀 **Essential Commands**
```bash
# Development
npm run dev                 # Start development server
npm run build              # Production build
npm run type-check         # TypeScript validation
npm run lint               # ESLint validation
npm test                   # Run test suite

# Agent Coordination
scripts/mcp create ComponentName [type]  # Create components via MCP
scripts/dispatch-local.sh process        # Process agent task queue
scripts/copilot-agent.js suggest "task"  # Get Copilot suggestions

# AWS Operations
npm run amplify:dev        # Sandbox environment
npm run cost-check         # Monitor AWS spending
```

### 🎯 **Current Priority Tasks**
1. **Fix Build Issues**: Resolve missing dependencies and compilation errors
2. **Advanced Features**: Focus on complex/difficult features as senior developer
3. **Intern Work Monitoring**: Review and integrate intern-produced components
4. **API Integration**: Complete ESPN and RSS feed implementations
5. **Testing Infrastructure**: Set up Jest and Playwright test suites
6. **Real-time Features**: Implement live score updates and notifications

### 🔒 **Critical Requirements**
- **Security**: Never commit secrets, use environment variables
- **Performance**: Lighthouse score >90, optimize for mobile
- **Accessibility**: WCAG 2.1 AA compliance
- **SEO**: Proper meta tags, structured data for sports content
- **Cost Management**: AWS free tier optimization, monitor spending
- **Code Quality**: TypeScript strict mode, comprehensive error handling

### 📚 **Key Documentation**
- **CLAUDE.md**: Comprehensive development guide and agent instructions
- **CURSOR-MCP-SETUP.md**: MCP agent configuration details
- **MCP-AUTO-APPROVE-GUIDE.md**: Agent automation setup
- **README-MULTI-AGENT.md**: Multi-agent system overview

### 🎮 **Sports Data Specifications**
- **NC State Team ID**: 152 (ESPN API)
- **Sports Coverage**: Football, Basketball (Men's), Baseball
- **Conference**: ACC (Atlantic Coast Conference)
- **Data Refresh**: Live games every 30 seconds, schedules daily
- **News Sources**: Backing the Pack RSS, official NC State athletics

### 🌟 **Success Metrics**
- **Performance**: <3 second load times, >95% uptime
- **User Engagement**: Comprehensive sports data presentation
- **Developer Experience**: Smooth multi-agent collaboration
- **Code Quality**: 100% test coverage, zero linting errors
- **Cost Efficiency**: <$5/month AWS spending

## Getting Started

1. **Read CLAUDE.md** for detailed project context
2. **Check current todo list** with TodoRead tool
3. **Run `npm install`** to set up dependencies
4. **Focus on advanced features** as senior developer
5. **Monitor intern work** when user starts intern agents
6. **Integrate intern outputs** into main project

**Key Role Clarification**: User handles starting/stopping intern agents. Your role is to:
- Build complex, difficult features that require senior-level expertise
- Monitor and review intern-produced code and components
- Integrate intern work into the main project architecture
- Maintain overall code quality and project direction

This is a production-grade project that serves as a model for multi-agent AI development. Focus on advanced features, code quality, real data integration, and monitoring intern contributions while building a world-class sports platform for NC State University.