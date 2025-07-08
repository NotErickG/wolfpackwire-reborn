#!/bin/bash

# 🧠 Senior Developer Agent - Multi-Agent Environment Setup
# This script initializes Gemini CLI interns and Cursor MCP agents

set -e

echo "🚀 Setting up NC State Sports Hub Multi-Agent Development Environment..."

# Check if required commands exist
command -v docker >/dev/null 2>&1 || { echo "❌ Docker is required but not installed. Aborting." >&2; exit 1; }
command -v docker-compose >/dev/null 2>&1 || { echo "❌ Docker Compose is required but not installed. Aborting." >&2; exit 1; }
command -v cursor >/dev/null 2>&1 || { echo "❌ Cursor IDE is required but not installed. Aborting." >&2; exit 1; }

# Create directory structure
echo "📁 Creating multi-agent directory structure..."
mkdir -p .gemini .cursor .github/workflows docs/agents scripts

# Create Gemini environment file
echo "🔑 Setting up Gemini API configuration..."
if [ ! -f ~/.gemini/.env ]; then
    mkdir -p ~/.gemini
    cat > ~/.gemini/.env << 'EOF'
# Gemini API Configuration
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-pro-latest
GEMINI_TEMPERATURE=0.2
GEMINI_MAX_TOKENS=8192

# AWS Configuration
AWS_ACCESS_KEY_ID=your_aws_access_key_here
AWS_SECRET_ACCESS_KEY=your_aws_secret_key_here
AWS_DEFAULT_REGION=us-east-1

# GitHub Configuration
GITHUB_TOKEN=your_github_token_here
GITHUB_REPO=NotErickG/nc-state-sports-hub
EOF
    echo "⚠️  Please edit ~/.gemini/.env and add your API keys"
fi

# Create Docker Compose configuration for Gemini interns
echo "🐳 Creating Docker configuration for Gemini interns..."
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  frontend-intern:
    image: google/gemini-cli:latest
    container_name: frontend-intern
    volumes:
      - ./:/workspace
      - ~/.gemini/.env:/app/.env
    working_dir: /workspace
    environment:
      - INTERN_ROLE=frontend
      - INTERN_FOCUS=react,typescript,tailwind,ui-ux
    networks:
      - nc-state-dev
    restart: unless-stopped

  backend-intern:
    image: google/gemini-cli:latest
    container_name: backend-intern
    volumes:
      - ./:/workspace
      - ~/.gemini/.env:/app/.env
    working_dir: /workspace
    environment:
      - INTERN_ROLE=backend
      - INTERN_FOCUS=amplify,dynamodb,graphql,api
    networks:
      - nc-state-dev
    restart: unless-stopped

  auth-intern:
    image: google/gemini-cli:latest
    container_name: auth-intern
    volumes:
      - ./:/workspace
      - ~/.gemini/.env:/app/.env
    working_dir: /workspace
    environment:
      - INTERN_ROLE=auth
      - INTERN_FOCUS=cognito,auth-flows,security
    networks:
      - nc-state-dev
    restart: unless-stopped

  devops-intern:
    image: google/gemini-cli:latest
    container_name: devops-intern
    volumes:
      - ./:/workspace
      - ~/.gemini/.env:/app/.env
    working_dir: /workspace
    environment:
      - INTERN_ROLE=devops
      - INTERN_FOCUS=ci-cd,deployment,monitoring,cost-optimization
    networks:
      - nc-state-dev
    restart: unless-stopped

networks:
  nc-state-dev:
    driver: bridge
EOF

# Create Cursor MCP configuration
echo "🎯 Creating Cursor MCP agent configuration..."
cat > .cursor/mcp.json << 'EOF'
{
  "mcpServers": {
    "cursor-doc-agent": {
      "command": "npx",
      "args": ["@cursor/mcp-docgen", "serve"],
      "env": {
        "AGENT_ROLE": "documentation",
        "AGENT_FOCUS": "readme,api-docs,code-comments"
      }
    },
    "cursor-review-agent": {
      "command": "npx",
      "args": ["@cursor/mcp-reviewer", "serve"],
      "env": {
        "AGENT_ROLE": "code-review",
        "AGENT_FOCUS": "bugs,patterns,best-practices,security"
      }
    },
    "cursor-refactor-agent": {
      "command": "npx",
      "args": ["@cursor/mcp-refactor", "serve"],
      "env": {
        "AGENT_ROLE": "refactoring",
        "AGENT_FOCUS": "architecture,performance,maintainability"
      }
    }
  }
}
EOF

# Create initial task queue
echo "📋 Creating initial task queue..."
cat > .gemini/task-queue.json << 'EOF'
{
  "tasks": [
    {
      "id": "initial-setup",
      "intern": "frontend-intern",
      "task": "Audit existing Next.js application structure and identify missing components",
      "branch": "feature/frontend-audit",
      "priority": "high",
      "status": "pending",
      "created": "2025-07-07T00:00:00Z"
    },
    {
      "id": "backend-setup",
      "intern": "backend-intern",
      "task": "Review AWS Amplify configuration and optimize DynamoDB schemas",
      "branch": "feature/backend-optimization",
      "priority": "high",
      "status": "pending",
      "created": "2025-07-07T00:00:00Z"
    },
    {
      "id": "auth-flow",
      "intern": "auth-intern",
      "task": "Implement complete AWS Cognito authentication flow with user profiles",
      "branch": "feature/auth-system",
      "priority": "medium",
      "status": "pending",
      "created": "2025-07-07T00:00:00Z"
    },
    {
      "id": "ci-cd-setup",
      "intern": "devops-intern",
      "task": "Set up GitHub Actions workflows for testing and deployment",
      "branch": "feature/ci-cd",
      "priority": "medium",
      "status": "pending",
      "created": "2025-07-07T00:00:00Z"
    }
  ]
}
EOF

# Create task dispatcher script
echo "⚡ Creating task dispatcher script..."
cat > scripts/dispatch-tasks.sh << 'EOF'
#!/bin/bash

# Task Dispatcher for Multi-Agent System
# Routes tasks to appropriate agents based on task type

set -e

TASK_QUEUE=".gemini/task-queue.json"
LOG_FILE="logs/dispatch.log"

# Create logs directory
mkdir -p logs

# Function to log messages
log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_FILE"
}

# Function to dispatch to Gemini intern
dispatch_to_gemini() {
    local intern="$1"
    local task="$2"
    local branch="$3"
    
    log_message "Dispatching to Gemini intern: $intern"
    log_message "Task: $task"
    log_message "Branch: $branch"
    
    # Check if container is running
    if ! docker ps | grep -q "$intern"; then
        log_message "Starting $intern container..."
        docker-compose up -d "$intern"
        sleep 5
    fi
    
    # Execute task
    docker exec "$intern" bash -c "
        source /app/.env
        git checkout -b '$branch' || git checkout '$branch'
        gemini '$task'
        git add .
        git commit -m 'feat: $task' || echo 'No changes to commit'
        git push origin '$branch' || echo 'Failed to push'
    "
}

# Function to dispatch to Cursor MCP agent
dispatch_to_cursor() {
    local agent="$1"
    local task="$2"
    
    log_message "Dispatching to Cursor MCP agent: $agent"
    log_message "Task: $task"
    
    # Use Cursor MCP to execute task
    cursor mcp call "$agent" "$task"
}

# Main dispatcher logic
dispatch_task() {
    local task_id="$1"
    
    # Read task from queue
    local task_data=$(jq -r ".tasks[] | select(.id == \"$task_id\")" "$TASK_QUEUE")
    
    if [ -z "$task_data" ]; then
        log_message "Task $task_id not found in queue"
        return 1
    fi
    
    local intern=$(echo "$task_data" | jq -r '.intern')
    local task=$(echo "$task_data" | jq -r '.task')
    local branch=$(echo "$task_data" | jq -r '.branch // "main"')
    
    # Route based on agent type
    case "$intern" in
        *-intern)
            dispatch_to_gemini "$intern" "$task" "$branch"
            ;;
        cursor-*)
            dispatch_to_cursor "$intern" "$task"
            ;;
        *)
            log_message "Unknown agent type: $intern"
            return 1
            ;;
    esac
    
    # Update task status
    jq "(.tasks[] | select(.id == \"$task_id\") | .status) = \"in-progress\"" "$TASK_QUEUE" > tmp.json && mv tmp.json "$TASK_QUEUE"
}

# Process all pending tasks
process_queue() {
    log_message "Processing task queue..."
    
    local pending_tasks=$(jq -r '.tasks[] | select(.status == "pending") | .id' "$TASK_QUEUE")
    
    for task_id in $pending_tasks; do
        dispatch_task "$task_id"
    done
}

# Main execution
if [ $# -eq 0 ]; then
    process_queue
else
    dispatch_task "$1"
fi
EOF

chmod +x scripts/dispatch-tasks.sh

# Create agent monitoring script
echo "📊 Creating agent monitoring script..."
cat > scripts/monitor-agents.sh << 'EOF'
#!/bin/bash

# Agent Monitoring Script
# Monitors status of all agents and provides health checks

set -e

echo "🔍 Multi-Agent System Status Report"
echo "=================================="

# Check Docker containers
echo "🐳 Docker Containers:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep -E "(frontend-intern|backend-intern|auth-intern|devops-intern)" || echo "No Gemini interns running"

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

# Check AWS costs
echo -e "\n💰 AWS Cost Check:"
aws ce get-cost-and-usage \
    --time-period Start=2025-07-01,End=2025-07-31 \
    --granularity MONTHLY \
    --metrics BlendedCost \
    --query 'ResultsByTime[0].Total.BlendedCost.Amount' \
    --output text 2>/dev/null || echo "Unable to retrieve AWS costs"

echo -e "\n✅ Monitoring complete"
EOF

chmod +x scripts/monitor-agents.sh

# Create shutdown script
echo "🛑 Creating shutdown script..."
cat > scripts/shutdown-agents.sh << 'EOF'
#!/bin/bash

# Graceful shutdown of all agents

echo "🛑 Shutting down all agents..."

# Stop Docker containers
echo "Stopping Gemini interns..."
docker-compose down

# Stop Cursor MCP agents
echo "Stopping Cursor MCP agents..."
pkill -f "cursor.*mcp" || echo "No Cursor MCP processes found"

echo "✅ All agents stopped"
EOF

chmod +x scripts/shutdown-agents.sh

# Start the agents
echo "🚀 Starting multi-agent environment..."
docker-compose up -d

# Wait for containers to start
echo "⏳ Waiting for agents to initialize..."
sleep 10

# Check status
echo "📊 Agent Status:"
docker ps --format "table {{.Names}}\t{{.Status}}"

echo ""
echo "🎉 Multi-Agent Environment Setup Complete!"
echo ""
echo "Next steps:"
echo "1. Edit ~/.gemini/.env with your API keys"
echo "2. Run 'scripts/dispatch-tasks.sh' to start processing tasks"
echo "3. Use 'scripts/monitor-agents.sh' to check system status"
echo "4. Launch Cursor IDE with MCP agents: 'cursor .'"
echo ""
echo "🔗 Repository: https://github.com/NotErickG/nc-state-sports-hub"
echo "📖 Documentation: See README.md for detailed instructions"