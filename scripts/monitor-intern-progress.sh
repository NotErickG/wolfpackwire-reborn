#!/bin/bash

# Monitor intern progress and auto-deploy completed features
LOG_FILE="/home/erick/amplify/wolfpackwire-reborn/logs/monitor-progress.log"
TASK_QUEUE="/home/erick/amplify/wolfpackwire-reborn/.gemini/task-queue.json"

echo "$(date): Starting intern progress monitoring..." >> $LOG_FILE

while true; do
    # Check for completed tasks
    COMPLETED_TASKS=$(grep '"status": "completed"' "$TASK_QUEUE" | wc -l)
    IN_PROGRESS_TASKS=$(grep '"status": "in-progress"' "$TASK_QUEUE" | wc -l)
    
    echo "$(date): Completed: $COMPLETED_TASKS, In Progress: $IN_PROGRESS_TASKS" >> $LOG_FILE
    
    # Auto-deploy completed features
    if [ -d "nc-state-sports-hub/nc-state-sports-hub-production" ]; then
        cd nc-state-sports-hub/nc-state-sports-hub-production
        
        # Check for new code changes
        if git status --porcelain | grep -q "^M"; then
            echo "$(date): New changes detected, running tests..." >> $LOG_FILE
            
            # Run tests if available
            if npm run test --silent 2>/dev/null; then
                echo "$(date): Tests passed, committing changes..." >> $LOG_FILE
                
                git add -A
                git commit -m "feat: Auto-deploy intern completed features

$(date): Deployed latest completed tasks

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"
                
                # Push to trigger deployment
                git push origin master
                echo "$(date): Changes pushed to production" >> $LOG_FILE
            else
                echo "$(date): Tests failed, not deploying" >> $LOG_FILE
            fi
        fi
        
        cd - > /dev/null
    fi
    
    # Dispatch next pending task if capacity available
    if [ $IN_PROGRESS_TASKS -lt 3 ]; then
        echo "$(date): Capacity available, dispatching next task..." >> $LOG_FILE
        /home/erick/amplify/wolfpackwire-reborn/scripts/dispatch-local.sh process --max-concurrent 1 >> $LOG_FILE 2>&1
    fi
    
    # Wait 5 minutes before next check
    sleep 300
done