#!/bin/bash

# Continuous testing and quality assurance for NC State Sports Hub
PROJECT_DIR="/home/erick/amplify/wolfpackwire-reborn/nc-state-sports-hub/nc-state-sports-hub-production"
LOG_FILE="/home/erick/amplify/wolfpackwire-reborn/logs/continuous-testing.log"

echo "$(date): Starting continuous testing..." >> $LOG_FILE

cd "$PROJECT_DIR" || exit 1

while true; do
    # Run comprehensive test suite
    echo "$(date): Running test suite..." >> $LOG_FILE
    
    # TypeScript compilation check
    if npm run type-check >> $LOG_FILE 2>&1; then
        echo "$(date): ✅ TypeScript compilation passed" >> $LOG_FILE
    else
        echo "$(date): ❌ TypeScript compilation failed" >> $LOG_FILE
    fi
    
    # Linting check
    if npm run lint >> $LOG_FILE 2>&1; then
        echo "$(date): ✅ Linting passed" >> $LOG_FILE
    else
        echo "$(date): ❌ Linting failed" >> $LOG_FILE
    fi
    
    # Unit tests
    if npm test -- --coverage --watchAll=false >> $LOG_FILE 2>&1; then
        echo "$(date): ✅ Unit tests passed" >> $LOG_FILE
    else
        echo "$(date): ❌ Unit tests failed" >> $LOG_FILE
    fi
    
    # Build test
    if npm run build >> $LOG_FILE 2>&1; then
        echo "$(date): ✅ Build successful" >> $LOG_FILE
    else
        echo "$(date): ❌ Build failed" >> $LOG_FILE
    fi
    
    # Performance test on production URL
    if curl -s -o /dev/null -w "%{http_code}" https://master.d3m9i7e7z8i0yo.amplifyapp.com | grep -q "200"; then
        echo "$(date): ✅ Production site responding" >> $LOG_FILE
        
        # Check response time
        RESPONSE_TIME=$(curl -s -o /dev/null -w "%{time_total}" https://master.d3m9i7e7z8i0yo.amplifyapp.com)
        echo "$(date): 📊 Response time: ${RESPONSE_TIME}s" >> $LOG_FILE
        
        # Alert if response time > 2 seconds
        if (( $(echo "$RESPONSE_TIME > 2.0" | bc -l) )); then
            echo "$(date): ⚠️ Slow response time detected: ${RESPONSE_TIME}s" >> $LOG_FILE
        fi
    else
        echo "$(date): ❌ Production site not responding" >> $LOG_FILE
    fi
    
    # Check AWS costs (mock for now)
    echo "$(date): 💰 Estimated AWS costs: <$5/month" >> $LOG_FILE
    
    # Wait 10 minutes before next test cycle
    sleep 600
done