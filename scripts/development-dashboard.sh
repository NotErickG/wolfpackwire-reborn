#!/bin/bash

# Real-time development dashboard for NC State Sports Hub
LOG_DIR="/home/erick/amplify/wolfpackwire-reborn/logs"
TASK_QUEUE="/home/erick/amplify/wolfpackwire-reborn/.gemini/task-queue.json"

show_dashboard() {
    clear
    echo "🐺 NC STATE SPORTS HUB - DEVELOPMENT DASHBOARD"
    echo "=============================================="
    echo "$(date)"
    echo ""
    
    # Task Status
    echo "📊 TASK STATUS:"
    COMPLETED=$(grep -c '"status": "completed"' "$TASK_QUEUE" 2>/dev/null || echo "0")
    IN_PROGRESS=$(grep -c '"status": "in-progress"' "$TASK_QUEUE" 2>/dev/null || echo "0") 
    PENDING=$(grep -c '"status": "pending"' "$TASK_QUEUE" 2>/dev/null || echo "0")
    TOTAL=$((COMPLETED + IN_PROGRESS + PENDING))
    
    echo "  ✅ Completed: $COMPLETED"
    echo "  🔄 In Progress: $IN_PROGRESS"
    echo "  ⏳ Pending: $PENDING"
    echo "  📝 Total: $TOTAL"
    echo ""
    
    # Progress Bar
    if [ $TOTAL -gt 0 ]; then
        PROGRESS=$((COMPLETED * 100 / TOTAL))
        echo "📈 PROGRESS: $PROGRESS% [$COMPLETED/$TOTAL]"
        echo -n "  "
        for i in $(seq 1 50); do
            if [ $((i * 2)) -le $PROGRESS ]; then
                echo -n "█"
            else
                echo -n "░"
            fi
        done
        echo ""
        echo ""
    fi
    
    # Active Tasks
    echo "🚀 ACTIVE TASKS:"
    grep -A 3 '"status": "in-progress"' "$TASK_QUEUE" 2>/dev/null | grep '"task":' | sed 's/.*"task": "/  • /' | sed 's/",$//' | head -5
    echo ""
    
    # Production Status
    echo "🌐 PRODUCTION STATUS:"
    PROD_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://master.d3m9i7e7z8i0yo.amplifyapp.com 2>/dev/null || echo "ERR")
    RESPONSE_TIME=$(curl -s -o /dev/null -w "%{time_total}" https://master.d3m9i7e7z8i0yo.amplifyapp.com 2>/dev/null || echo "0")
    
    if [ "$PROD_STATUS" = "200" ]; then
        echo "  ✅ Site Online (${RESPONSE_TIME}s response)"
    else
        echo "  ❌ Site Issue (Status: $PROD_STATUS)"
    fi
    echo "  🔗 URL: https://master.d3m9i7e7z8i0yo.amplifyapp.com"
    echo ""
    
    # System Health
    echo "⚙️ SYSTEM HEALTH:"
    MONITOR_PID=$(pgrep -f "monitor-intern-progress.sh" | head -1)
    TESTING_PID=$(pgrep -f "continuous-testing.sh" | head -1)
    DEPLOY_PID=$(pgrep -f "feature-deployment-pipeline.sh" | head -1)
    
    if [ -n "$MONITOR_PID" ]; then
        echo "  ✅ Progress Monitor Running (PID: $MONITOR_PID)"
    else
        echo "  ❌ Progress Monitor Stopped"
    fi
    
    if [ -n "$TESTING_PID" ]; then
        echo "  ✅ Continuous Testing Running (PID: $TESTING_PID)"
    else
        echo "  ❌ Continuous Testing Stopped"
    fi
    
    if [ -n "$DEPLOY_PID" ]; then
        echo "  ✅ Deployment Pipeline Running (PID: $DEPLOY_PID)"
    else
        echo "  ❌ Deployment Pipeline Stopped"
    fi
    echo ""
    
    # Recent Activity
    echo "📝 RECENT ACTIVITY:"
    if [ -f "$LOG_DIR/monitor-progress.log" ]; then
        tail -3 "$LOG_DIR/monitor-progress.log" 2>/dev/null | sed 's/^/  /'
    fi
    echo ""
    
    # Next Auto-Resume
    echo "🕐 NEXT AUTO-RESUME: Every hour (cron: 0 * * * *)"
    echo "🔄 DASHBOARD REFRESH: Every 30 seconds"
    echo ""
    echo "Press Ctrl+C to exit dashboard"
}

# Main dashboard loop
while true; do
    show_dashboard
    sleep 30
done