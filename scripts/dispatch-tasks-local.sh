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

# Function to dispatch to local Gemini
dispatch_to_gemini() {
    local role="$1"
    local task="$2"
    local branch="$3"
    
    log_message "Dispatching to Gemini ($role): $task"
    log_message "Branch: $branch"
    
    # Create or switch to branch
    git checkout -b "$branch" 2>/dev/null || git checkout "$branch"
    
    # Create role-specific prompt
    local prompt="You are a $role specialist working on the NC State Sports Hub project. 

Task: $task

Please implement this task following these guidelines:
- Use TypeScript with strict typing
- Follow NC State branding (#CC0000 red)
- Ensure mobile-first responsive design
- Add proper error handling
- Include comments for complex logic
- Follow existing project patterns

Current project structure:
- Frontend: Next.js 14 with App Router
- Styling: Tailwind CSS
- Backend: AWS Amplify Gen 2
- Real data: ESPN API + RSS feeds

Complete the task and provide the implementation."

    # Execute with local Gemini
    echo "$prompt" | gemini --no-stream
    
    # Auto-commit if changes detected
    if ! git diff --quiet; then
        git add .
        git commit -m "feat($role): $task" || echo "No changes to commit"
        git push origin "$branch" 2>/dev/null || echo "Could not push to remote"
        log_message "✅ Task completed and committed"
    else
        log_message "⚠️ No changes detected"
    fi
}

# Function to dispatch to Cursor MCP agent
dispatch_to_cursor() {
    local agent="$1"
    local task="$2"
    
    log_message "Dispatching to Cursor MCP agent: $agent"
    log_message "Task: $task"
    
    # Use Cursor MCP to execute task
    cursor mcp call "$agent" "$task" 2>/dev/null || log_message "⚠️ Cursor MCP not available, skipping"
}

# Main dispatcher logic
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
    
    # Extract role from intern name
    local role=$(echo "$intern" | sed 's/-intern$//')
    
    # Route based on agent type
    case "$intern" in
        *-intern)
            dispatch_to_gemini "$role" "$task" "$branch"
            ;;
        cursor-*)
            dispatch_to_cursor "$intern" "$task"
            ;;
        *)
            log_message "❌ Unknown agent type: $intern"
            return 1
            ;;
    esac
    
    # Update task status in queue
    jq "(.tasks[] | select(.id == \"$task_id\") | .status) = \"completed\"" "$TASK_QUEUE" > tmp.json && mv tmp.json "$TASK_QUEUE"
    log_message "✅ Task $task_id marked as completed"
}

# Process all pending tasks
process_queue() {
    log_message "🚀 Processing task queue with local Gemini..."
    
    local pending_tasks=$(jq -r '.tasks[] | select(.status == "pending") | .id' "$TASK_QUEUE")
    
    if [ -z "$pending_tasks" ]; then
        log_message "📋 No pending tasks found"
        return 0
    fi
    
    for task_id in $pending_tasks; do
        log_message "🔄 Processing task: $task_id"
        dispatch_task "$task_id"
        echo "---"
    done
    
    log_message "🎉 All pending tasks processed!"
}

# Show queue status
show_status() {
    if [ ! -f "$TASK_QUEUE" ]; then
        log_message "❌ Task queue not found"
        return 1
    fi
    
    local total=$(jq -r '.tasks | length' "$TASK_QUEUE")
    local pending=$(jq -r '.tasks[] | select(.status == "pending") | .id' "$TASK_QUEUE" | wc -l)
    local completed=$(jq -r '.tasks[] | select(.status == "completed") | .id' "$TASK_QUEUE" | wc -l)
    
    echo "📊 Task Queue Status:"
    echo "   Total: $total"
    echo "   Pending: $pending" 
    echo "   Completed: $completed"
    echo ""
    
    if [ "$pending" -gt 0 ]; then
        echo "🔄 Pending Tasks:"
        jq -r '.tasks[] | select(.status == "pending") | "   - \(.id): \(.task)"' "$TASK_QUEUE"
    fi
}

# Main execution
case "${1:-process}" in
    "process")
        process_queue
        ;;
    "status")
        show_status
        ;;
    *)
        dispatch_task "$1"
        ;;
esac