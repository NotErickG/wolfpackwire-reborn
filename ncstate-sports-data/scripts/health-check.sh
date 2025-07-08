#!/bin/bash

# NC State Sports Hub - Health Check Script
# This script performs comprehensive health checks on the application

set -e

# Configuration
PROJECT_NAME="NC State Sports Hub"
HEALTH_CHECK_URL="https://your-domain.com/api/health"  # Update with actual URL
MAX_RESPONSE_TIME=3000  # 3 seconds in milliseconds

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Starting health check for ${PROJECT_NAME}...${NC}"
echo "Timestamp: $(date)"
echo "=========================================="

# 1. Check if required tools are installed
echo -e "${YELLOW}Checking required tools...${NC}"
TOOLS_OK=true

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    TOOLS_OK=false
fi

if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    TOOLS_OK=false
fi

if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ AWS CLI is not installed${NC}"
    TOOLS_OK=false
fi

if $TOOLS_OK; then
    echo -e "${GREEN}✅ All required tools are installed${NC}"
else
    echo -e "${RED}❌ Some required tools are missing${NC}"
fi

# 2. Check Node.js and npm versions
echo -e "${YELLOW}Checking Node.js and npm versions...${NC}"
NODE_VERSION=$(node --version)
NPM_VERSION=$(npm --version)
echo "Node.js version: ${NODE_VERSION}"
echo "npm version: ${NPM_VERSION}"

# Check if Node.js version is >= 18
NODE_MAJOR=$(echo $NODE_VERSION | sed 's/v\([0-9]*\).*/\1/')
if [ "$NODE_MAJOR" -ge 18 ]; then
    echo -e "${GREEN}✅ Node.js version is compatible${NC}"
else
    echo -e "${RED}❌ Node.js version should be >= 18${NC}"
fi

# 3. Check project dependencies
echo -e "${YELLOW}Checking project dependencies...${NC}"
if [ -f "package.json" ]; then
    echo -e "${GREEN}✅ package.json exists${NC}"
    
    # Check if node_modules exists
    if [ -d "node_modules" ]; then
        echo -e "${GREEN}✅ node_modules directory exists${NC}"
        
        # Check for audit issues
        AUDIT_RESULT=$(npm audit --audit-level=high 2>/dev/null || echo "audit-failed")
        if [ "$AUDIT_RESULT" = "audit-failed" ]; then
            echo -e "${YELLOW}⚠️  npm audit check failed or has issues${NC}"
        else
            echo -e "${GREEN}✅ No high-severity security vulnerabilities found${NC}"
        fi
    else
        echo -e "${RED}❌ node_modules directory missing - run 'npm install'${NC}"
    fi
else
    echo -e "${RED}❌ package.json not found${NC}"
fi

# 4. Check TypeScript configuration
echo -e "${YELLOW}Checking TypeScript configuration...${NC}"
if [ -f "tsconfig.json" ]; then
    echo -e "${GREEN}✅ tsconfig.json exists${NC}"
    
    # Try to run TypeScript check
    if command -v npx &> /dev/null; then
        if npx tsc --noEmit --skipLibCheck 2>/dev/null; then
            echo -e "${GREEN}✅ TypeScript compilation check passed${NC}"
        else
            echo -e "${RED}❌ TypeScript compilation check failed${NC}"
        fi
    fi
else
    echo -e "${RED}❌ tsconfig.json not found${NC}"
fi

# 5. Check Amplify configuration
echo -e "${YELLOW}Checking AWS Amplify configuration...${NC}"
if [ -d "amplify" ]; then
    echo -e "${GREEN}✅ amplify directory exists${NC}"
    
    # Check for required Amplify files
    if [ -f "amplify/backend.ts" ]; then
        echo -e "${GREEN}✅ Amplify backend configuration exists${NC}"
    else
        echo -e "${RED}❌ amplify/backend.ts not found${NC}"
    fi
    
    if [ -f "amplify/auth/resource.ts" ]; then
        echo -e "${GREEN}✅ Amplify auth configuration exists${NC}"
    else
        echo -e "${RED}❌ amplify/auth/resource.ts not found${NC}"
    fi
    
    if [ -f "amplify/data/resource.ts" ]; then
        echo -e "${GREEN}✅ Amplify data configuration exists${NC}"
    else
        echo -e "${RED}❌ amplify/data/resource.ts not found${NC}"
    fi
else
    echo -e "${RED}❌ amplify directory not found${NC}"
fi

# 6. Check Claude Code configuration
echo -e "${YELLOW}Checking Claude Code configuration...${NC}"
if [ -d ".claude" ]; then
    echo -e "${GREEN}✅ .claude directory exists${NC}"
    
    if [ -f ".claude/settings.json" ]; then
        echo -e "${GREEN}✅ Claude settings.json exists${NC}"
    else
        echo -e "${RED}❌ .claude/settings.json not found${NC}"
    fi
    
    if [ -d ".claude/commands" ]; then
        COMMAND_COUNT=$(ls -1 .claude/commands/*.md 2>/dev/null | wc -l)
        echo -e "${GREEN}✅ Claude commands directory exists (${COMMAND_COUNT} commands)${NC}"
    else
        echo -e "${RED}❌ .claude/commands directory not found${NC}"
    fi
else
    echo -e "${RED}❌ .claude directory not found${NC}"
fi

# 7. Check documentation
echo -e "${YELLOW}Checking documentation...${NC}"
if [ -d "docs" ]; then
    echo -e "${GREEN}✅ docs directory exists${NC}"
    
    DOC_COUNT=$(find docs -name "*.md" | wc -l)
    echo -e "${GREEN}✅ Found ${DOC_COUNT} documentation files${NC}"
else
    echo -e "${RED}❌ docs directory not found${NC}"
fi

# 8. Check git configuration
echo -e "${YELLOW}Checking git configuration...${NC}"
if [ -d ".git" ]; then
    echo -e "${GREEN}✅ Git repository initialized${NC}"
    
    # Check worktrees
    WORKTREE_COUNT=$(git worktree list | wc -l)
    echo -e "${GREEN}✅ Found ${WORKTREE_COUNT} git worktrees${NC}"
    
    # Check for uncommitted changes
    if [ -n "$(git status --porcelain)" ]; then
        echo -e "${YELLOW}⚠️  Uncommitted changes detected${NC}"
    else
        echo -e "${GREEN}✅ Working directory clean${NC}"
    fi
else
    echo -e "${RED}❌ Git repository not initialized${NC}"
fi

# 9. Check file permissions
echo -e "${YELLOW}Checking file permissions...${NC}"
if [ -f "scripts/cost-monitor.sh" ] && [ -x "scripts/cost-monitor.sh" ]; then
    echo -e "${GREEN}✅ cost-monitor.sh is executable${NC}"
else
    echo -e "${YELLOW}⚠️  cost-monitor.sh is not executable${NC}"
    chmod +x scripts/cost-monitor.sh 2>/dev/null && echo -e "${GREEN}✅ Fixed cost-monitor.sh permissions${NC}"
fi

if [ -f "scripts/backup-data.sh" ] && [ -x "scripts/backup-data.sh" ]; then
    echo -e "${GREEN}✅ backup-data.sh is executable${NC}"
else
    echo -e "${YELLOW}⚠️  backup-data.sh is not executable${NC}"
    chmod +x scripts/backup-data.sh 2>/dev/null && echo -e "${GREEN}✅ Fixed backup-data.sh permissions${NC}"
fi

# 10. Performance check (if running locally)
echo -e "${YELLOW}Checking local development server...${NC}"
if lsof -i :3000 &>/dev/null; then
    echo -e "${GREEN}✅ Development server is running on port 3000${NC}"
else
    echo -e "${YELLOW}⚠️  Development server is not running${NC}"
fi

# 11. AWS connectivity check
echo -e "${YELLOW}Checking AWS connectivity...${NC}"
if aws sts get-caller-identity &>/dev/null; then
    echo -e "${GREEN}✅ AWS CLI is configured and accessible${NC}"
else
    echo -e "${RED}❌ AWS CLI is not configured or inaccessible${NC}"
fi

# Summary
echo ""
echo "=========================================="
echo -e "${BLUE}Health check completed at $(date)${NC}"
echo ""
echo "Next steps:"
echo "1. Address any ❌ issues found above"
echo "2. Run 'npm install' if dependencies are missing"
echo "3. Run 'npm run dev' to start development server"
echo "4. Run './scripts/cost-monitor.sh' to check AWS costs"
echo "5. Run './scripts/backup-data.sh' to create backups"
echo ""
echo "For multi-agent development:"
echo "- cd ncstate-frontend && claude-code  # Frontend agent"
echo "- cd ncstate-backend && claude-code   # Backend agent"
echo "- cd ncstate-content && claude-code   # Content agent"
echo "- cd ncstate-strategy && claude-code  # Strategy agent"