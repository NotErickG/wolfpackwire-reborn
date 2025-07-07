#!/bin/bash

# Local Task Dispatcher for Multi-Agent System
# Routes tasks to local Gemini CLI and Cursor MCP agents

set -e

TASK_QUEUE=".gemini/task-queue.json"
LOG_FILE="logs/dispatch.log"

# Create logs directory
mkdir -p logs

# Function to log messages
log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_FILE"
}

# Function to get Copilot CLI suggestion
get_copilot_suggestion() {
    local task_description="$*"
    
    log_message "🤖 Getting GitHub Copilot suggestion for: $task_description"
    
    # Use our Copilot agent wrapper
    if node scripts/copilot-agent.js suggest "$task_description" 2>/dev/null; then
        log_message "✅ Copilot suggestion generated"
    else
        log_message "⚠️ Copilot CLI not available, providing manual approach"
        echo ""
        echo "💡 Manual approach for: $task_description"
        echo "1. Break down the task into smaller components"
        echo "2. Research relevant documentation and examples"
        echo "3. Implement following NC State branding guidelines"
        echo "4. Test thoroughly with real data"
        echo "5. Optimize for performance and accessibility"
    fi
}

# Function to dispatch to Cursor MCP agent
dispatch_to_cursor() {
    local agent="$1"
    local task="$2"
    
    log_message "🎯 Dispatching to Cursor MCP agent: $agent"
    log_message "📝 Task: $task"
    
    # Use our custom MCP server
    echo "{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"tools/call\",\"params\":{\"name\":\"get_tasks\",\"arguments\":{}}}" | node scripts/simple-mcp-server.js | head -1
}

# Function to dispatch to local Gemini
dispatch_to_gemini() {
    local role="$1"
    local task="$2"
    local branch="$3"
    local task_id="$4"
    
    log_message "🤖 Dispatching to Gemini ($role): $task"
    log_message "📝 Branch: $branch"
    
    # Navigate to working directory
    cd nc-state-sports-hub/nc-state-sports-hub-production || {
        log_message "❌ Could not navigate to project directory"
        return 1
    }
    
    # Create or switch to branch
    git checkout -b "$branch" 2>/dev/null || git checkout "$branch"
    
    # Create role-specific prompt
    local prompt="You are a $role specialist working on the NC State Sports Hub project. 

🎯 TASK: $task

📋 GUIDELINES:
- Use TypeScript with strict typing
- Follow NC State branding (#CC0000 red)
- Ensure mobile-first responsive design  
- Add proper error handling
- Include comments for complex logic
- Follow existing project patterns

🏗️ PROJECT STRUCTURE:
- Frontend: Next.js 14 with App Router
- Styling: Tailwind CSS
- Backend: AWS Amplify Gen 2
- Real data: ESPN API + RSS feeds

📁 CURRENT FILES:
$(find src -type f -name "*.tsx" -o -name "*.ts" | head -10)

🚀 Please implement this task and provide working code that integrates with the existing codebase."

    log_message "🧠 Sending task to Gemini..."
    
    # Execute with local Gemini and capture output
    local gemini_output
    gemini_output=$(echo "$prompt" | gemini 2>&1)
    
    log_message "✅ Gemini response received"
    echo "$gemini_output"
    
    # Check for changes and commit
    if ! git diff --quiet || [ -n "$(git status --porcelain)" ]; then
        git add .
        git commit -m "feat($role): $task

Task ID: $task_id
Completed by: Gemini $role specialist

🤖 Generated with Gemini AI" || log_message "⚠️ Commit failed"
        
        log_message "✅ Task completed and committed to branch: $branch"
    else
        log_message "ℹ️ No file changes detected - Gemini may have provided guidance only"
    fi
    
    # Return to parent directory  
    cd ../..
}

# Function to show queue status
show_status() {
    if [ ! -f "$TASK_QUEUE" ]; then
        log_message "❌ Task queue not found at $TASK_QUEUE"
        return 1
    fi
    
    local total=$(jq -r '.tasks | length' "$TASK_QUEUE")
    local pending=$(jq -r '.tasks[] | select(.status == "pending") | .id' "$TASK_QUEUE" | wc -l)
    local completed=$(jq -r '.tasks[] | select(.status == "completed") | .id' "$TASK_QUEUE" | wc -l)
    local in_progress=$(jq -r '.tasks[] | select(.status == "in-progress") | .id' "$TASK_QUEUE" | wc -l)
    
    echo "📊 NC State Sports Hub - Task Queue Status"
    echo "=========================================="
    echo "   📝 Total Tasks: $total"
    echo "   ⏳ Pending: $pending" 
    echo "   🔄 In Progress: $in_progress"
    echo "   ✅ Completed: $completed"
    echo ""
    
    if [ "$pending" -gt 0 ]; then
        echo "🔄 Next Pending Tasks:"
        jq -r '.tasks[] | select(.status == "pending") | "   🎯 \(.id): \(.task)"' "$TASK_QUEUE" | head -5
        if [ "$pending" -gt 5 ]; then
            echo "   ... and $((pending - 5)) more"
        fi
        echo ""
    fi
    
    if [ "$in_progress" -gt 0 ]; then
        echo "🚀 Currently Working On:"
        jq -r '.tasks[] | select(.status == "in-progress") | "   ⚡ \(.id): \(.task)"' "$TASK_QUEUE"
        echo ""
    fi
}

# Function to dispatch single task
dispatch_task() {
    local task_id="$1"
    
    # Read task from queue
    local task_data=$(jq -r ".tasks[] | select(.id == \"$task_id\")" "$TASK_QUEUE")
    
    if [ -z "$task_data" ]; then
        log_message "❌ Task $task_id not found in queue"
        return 1
    fi
    
    local intern=$(echo "$task_data" | jq -r '.intern')
    local task=$(echo "$task_data" | jq -r '.task')
    local branch=$(echo "$task_data" | jq -r '.branch // "main"')
    
    # Mark task as in-progress
    jq "(.tasks[] | select(.id == \"$task_id\") | .status) = \"in-progress\"" "$TASK_QUEUE" > tmp.json && mv tmp.json "$TASK_QUEUE"
    
    # Extract role from intern name
    local role=$(echo "$intern" | sed 's/-intern$//')
    
    # Route based on agent type
    case "$intern" in
        *-intern)
            dispatch_to_gemini "$role" "$task" "$branch" "$task_id"
            ;;
        cursor-*)
            log_message "🎯 Dispatching to Cursor MCP agent: $intern"
            dispatch_to_cursor "$intern" "$task"
            ;;
        *)
            log_message "❌ Unknown agent type: $intern"
            return 1
            ;;
    esac
    
    # Mark task as completed
    jq "(.tasks[] | select(.id == \"$task_id\") | .status) = \"completed\"" "$TASK_QUEUE" > tmp.json && mv tmp.json "$TASK_QUEUE"
    log_message "🎉 Task $task_id marked as completed"
}

# Process all pending tasks  
process_queue() {
    log_message "🚀 Processing task queue with local Gemini..."
    
    local pending_tasks=$(jq -r '.tasks[] | select(.status == "pending") | .id' "$TASK_QUEUE")
    
    if [ -z "$pending_tasks" ]; then
        log_message "📋 No pending tasks found"
        show_status
        return 0
    fi
    
    echo "🔄 Found $(echo "$pending_tasks" | wc -w) pending tasks"
    echo ""
    
    for task_id in $pending_tasks; do
        echo "════════════════════════════════════════════════"
        log_message "🎯 Processing task: $task_id"
        dispatch_task "$task_id"
        echo "════════════════════════════════════════════════"
        echo ""
        sleep 2  # Brief pause between tasks
    done
    
    log_message "🎉 All pending tasks processed!"
    show_status
}

# Main execution
case "${1:-status}" in
    "process")
        process_queue
        ;;
    "status")
        show_status
        ;;
    "single")
        if [ -z "$2" ]; then
            echo "Usage: $0 single <task_id>"
            exit 1
        fi
        dispatch_task "$2"
        ;;
    "copilot")
        if [ -z "$2" ]; then
            echo "Usage: $0 copilot <description>"
            exit 1
        fi
        get_copilot_suggestion "${@:2}"
        ;;
    *)
        echo "🧠 NC State Sports Hub - Multi-Agent Task Dispatcher"
        echo "=================================================="
        echo ""
        echo "Usage:"
        echo "  $0 status           Show current task queue status"
        echo "  $0 process          Process all pending tasks"
        echo "  $0 single <task_id> Process specific task"
        echo "  $0 copilot <desc>   Get GitHub Copilot suggestion"
        echo ""
        show_status
        ;;
esac