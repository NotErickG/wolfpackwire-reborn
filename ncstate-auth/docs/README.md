# NC State Sports Hub Documentation

## Project Overview
The NC State Sports Hub is a comprehensive fan website built with AWS Amplify Gen 2, providing real-time sports news, scores, and community features for NC State athletics.

## Architecture
- **Frontend**: Next.js 14 with TypeScript and Tailwind CSS
- **Backend**: AWS Amplify Gen 2 with DynamoDB
- **Authentication**: AWS Cognito
- **Storage**: S3 with lifecycle policies
- **API**: GraphQL with real-time subscriptions

## Development Workflow
This project uses a multi-agent development approach with specialized agents for different aspects:

### Agent Worktrees
- **Frontend**: `/ncstate-frontend` - UI/UX and React components
- **Backend**: `/ncstate-backend` - AWS infrastructure and APIs
- **Content**: `/ncstate-content` - Sports data and content management
- **Strategy**: `/ncstate-strategy` - Business development and monetization

### Agent Coordination
Each agent has specific responsibilities but must coordinate on:
- API contracts and data flow
- User experience and business requirements
- Performance and cost constraints
- Security and compliance standards

## Getting Started
1. **Choose Your Agent Role**: Navigate to the appropriate worktree
2. **Run Claude Code**: Launch Claude Code in the specific directory
3. **Use Slash Commands**: Utilize custom commands for your agent role
4. **Sync Regularly**: Use `/sync-agents` to coordinate with other agents

## Documentation Structure
- `/api-specs` - GraphQL schema and API documentation
- `/business-requirements` - User stories and business logic
- `/cost-tracking` - AWS cost monitoring and optimization
- `/deployment` - CI/CD and deployment procedures
- `/performance` - Performance requirements and optimization
- `/security` - Security policies and compliance

## Development Guidelines
- Follow NC State branding and style guidelines
- Maintain cost awareness (target: under $5/month)
- Prioritize mobile-first responsive design
- Implement proper error handling and logging
- Use TypeScript for type safety
- Follow accessibility best practices

## Quick Links
- [API Specifications](./api-specs/)
- [Business Requirements](./business-requirements/)
- [Cost Tracking](./cost-tracking/)
- [Deployment Guide](./deployment/)
- [Performance Standards](./performance/)
- [Security Policies](./security/)