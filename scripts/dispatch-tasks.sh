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