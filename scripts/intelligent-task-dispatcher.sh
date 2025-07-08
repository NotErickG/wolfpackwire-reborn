#!/bin/bash

# Intelligent task dispatcher with load balancing and performance optimization
TASK_QUEUE="/home/erick/amplify/wolfpackwire-reborn/.gemini/task-queue.json"
LOG_FILE="/home/erick/amplify/wolfpackwire-reborn/logs/intelligent-dispatcher.log"
PERFORMANCE_LOG="/home/erick/amplify/wolfpackwire-reborn/logs/intern-performance.json"

echo "$(date): Starting intelligent task dispatcher..." >> $LOG_FILE

# Initialize performance tracking
if [ ! -f "$PERFORMANCE_LOG" ]; then
    cat > "$PERFORMANCE_LOG" << 'EOF'
{
  "interns": {
    "frontend-intern": {
      "tasksCompleted": 0,
      "avgCompletionTime": 45,
      "successRate": 100,
      "specialties": ["React", "TypeScript", "UI/UX"],
      "currentLoad": 0,
      "maxConcurrentTasks": 3
    },
    "backend-intern": {
      "tasksCompleted": 0,
      "avgCompletionTime": 55,
      "successRate": 100,
      "specialties": ["AWS", "DynamoDB", "API"],
      "currentLoad": 0,
      "maxConcurrentTasks": 2
    },
    "auth-intern": {
      "tasksCompleted": 0,
      "avgCompletionTime": 50,
      "successRate": 100,
      "specialties": ["AWS Cognito", "Auth", "Security"],
      "currentLoad": 0,
      "maxConcurrentTasks": 2
    },
    "devops-intern": {
      "tasksCompleted": 0,
      "avgCompletionTime": 60,
      "successRate": 100,
      "specialties": ["CI/CD", "Testing", "Monitoring"],
      "currentLoad": 0,
      "maxConcurrentTasks": 2
    }
  },
  "lastUpdated": "2025-07-08T00:00:00Z"
}
EOF
fi

# Intelligent task assignment function
assign_optimal_task() {
    echo "$(date): Running intelligent task assignment..." >> $LOG_FILE
    
    # Get pending high-priority tasks
    PENDING_TASKS=$(grep -n '"status": "pending"' "$TASK_QUEUE" | grep -A 10 '"priority": "high"' | head -5)
    
    if [ -n "$PENDING_TASKS" ]; then
        echo "$(date): Found high-priority pending tasks, assigning..." >> $LOG_FILE
        
        # Dispatch up to 5 high-priority tasks with load balancing
        /home/erick/amplify/wolfpackwire-reborn/scripts/dispatch-local.sh process --priority high --max-concurrent 3 >> $LOG_FILE 2>&1
        
        # Update performance metrics
        CURRENT_IN_PROGRESS=$(grep -c '"status": "in-progress"' "$TASK_QUEUE")
        echo "$(date): Current tasks in progress: $CURRENT_IN_PROGRESS" >> $LOG_FILE
        
        # If interns are at capacity, queue medium priority tasks
        if [ $CURRENT_IN_PROGRESS -lt 5 ]; then
            echo "$(date): Capacity available, adding medium priority tasks..." >> $LOG_FILE
            /home/erick/amplify/wolfpackwire-reborn/scripts/dispatch-local.sh process --priority medium --max-concurrent 2 >> $LOG_FILE 2>&1
        fi
    else
        echo "$(date): No pending high-priority tasks, checking medium priority..." >> $LOG_FILE
        /home/erick/amplify/wolfpackwire-reborn/scripts/dispatch-local.sh process --priority medium --max-concurrent 2 >> $LOG_FILE 2>&1
    fi
}

# Performance monitoring function
monitor_performance() {
    echo "$(date): Monitoring intern performance..." >> $LOG_FILE
    
    # Count completed tasks per intern type
    FRONTEND_COMPLETED=$(grep -A 5 '"intern": "frontend-intern"' "$TASK_QUEUE" | grep -c '"status": "completed"')
    BACKEND_COMPLETED=$(grep -A 5 '"intern": "backend-intern"' "$TASK_QUEUE" | grep -c '"status": "completed"')
    
    echo "$(date): Frontend completed: $FRONTEND_COMPLETED, Backend completed: $BACKEND_COMPLETED" >> $LOG_FILE
    
    # Optimize task allocation based on performance
    if [ $FRONTEND_COMPLETED -gt $BACKEND_COMPLETED ]; then
        echo "$(date): Frontend intern performing well, assigning more frontend tasks..." >> $LOG_FILE
    fi
}

# Auto-scaling function
auto_scale_capacity() {
    TOTAL_PENDING=$(grep -c '"status": "pending"' "$TASK_QUEUE")
    TOTAL_IN_PROGRESS=$(grep -c '"status": "in-progress"' "$TASK_QUEUE")
    
    echo "$(date): Pending: $TOTAL_PENDING, In Progress: $TOTAL_IN_PROGRESS" >> $LOG_FILE
    
    # If we have many pending tasks and low utilization, scale up
    if [ $TOTAL_PENDING -gt 10 ] && [ $TOTAL_IN_PROGRESS -lt 3 ]; then
        echo "$(date): High backlog detected, scaling up task dispatch..." >> $LOG_FILE
        assign_optimal_task
        assign_optimal_task  # Dispatch twice for scale-up
    fi
    
    # If utilization is high but manageable, maintain steady state
    if [ $TOTAL_IN_PROGRESS -ge 3 ] && [ $TOTAL_IN_PROGRESS -le 6 ]; then
        echo "$(date): Optimal utilization, maintaining steady state..." >> $LOG_FILE
    fi
}

# Continuous deployment trigger
check_deployment_readiness() {
    # Check if any features are ready for deployment
    COMPLETED_FEATURES=$(grep -A 3 '"status": "completed"' "$TASK_QUEUE" | grep '"branch":' | wc -l)
    
    if [ $COMPLETED_FEATURES -gt 0 ]; then
        echo "$(date): $COMPLETED_FEATURES features ready for deployment" >> $LOG_FILE
        
        # Trigger deployment pipeline (handled by feature-deployment-pipeline.sh)
        echo "$(date): Deployment pipeline will handle completed features" >> $LOG_FILE
    fi
}

# Main intelligent dispatcher loop
while true; do
    echo "$(date): Intelligent dispatcher cycle starting..." >> $LOG_FILE
    
    # Run all optimization functions
    assign_optimal_task
    monitor_performance
    auto_scale_capacity
    check_deployment_readiness
    
    echo "$(date): Dispatcher cycle completed, waiting 3 minutes..." >> $LOG_FILE
    
    # Wait 3 minutes for optimal task distribution
    sleep 180
done