#!/bin/bash

# NC State Sports Hub - AWS Cost Monitoring Script
# This script checks AWS costs and sends alerts if thresholds are exceeded

set -e

# Configuration
BUDGET_LIMIT=5.00
ALERT_THRESHOLD_1=3.00
ALERT_THRESHOLD_2=4.50
PROJECT_NAME="NC State Sports Hub"

# Colors for output
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}AWS CLI is not installed. Please install it first.${NC}"
    exit 1
fi

# Get current month's costs
echo "Checking AWS costs for ${PROJECT_NAME}..."
echo "Budget limit: $${BUDGET_LIMIT}"
echo "Alert thresholds: $${ALERT_THRESHOLD_1} (60%), $${ALERT_THRESHOLD_2} (90%)"
echo "----------------------------------------"

# Get cost data (requires AWS CLI to be configured)
CURRENT_MONTH=$(date +%Y-%m)
NEXT_MONTH=$(date -d "next month" +%Y-%m)

# Get current month costs
COST_DATA=$(aws ce get-cost-and-usage \
    --time-period Start=${CURRENT_MONTH}-01,End=${NEXT_MONTH}-01 \
    --granularity MONTHLY \
    --metrics BlendedCost \
    --query 'ResultsByTime[0].Total.BlendedCost.Amount' \
    --output text 2>/dev/null || echo "0.00")

if [ "$COST_DATA" = "0.00" ]; then
    echo -e "${YELLOW}Warning: Could not retrieve cost data. Check AWS CLI configuration.${NC}"
    exit 1
fi

# Convert to numbers for comparison
CURRENT_COST=$(echo "$COST_DATA" | cut -d'.' -f1,2)
CURRENT_COST_FLOAT=$(printf "%.2f" "$CURRENT_COST")

echo "Current month costs: $${CURRENT_COST_FLOAT}"

# Check thresholds
if (( $(echo "$CURRENT_COST_FLOAT > $BUDGET_LIMIT" | bc -l) )); then
    echo -e "${RED}🚨 BUDGET EXCEEDED! Current: $${CURRENT_COST_FLOAT}, Budget: $${BUDGET_LIMIT}${NC}"
    echo "IMMEDIATE ACTION REQUIRED:"
    echo "1. Review AWS Cost Explorer for anomalies"
    echo "2. Check for unexpected resource usage"
    echo "3. Implement emergency cost reduction measures"
    echo "4. Consider pausing non-essential services"
    
elif (( $(echo "$CURRENT_COST_FLOAT > $ALERT_THRESHOLD_2" | bc -l) )); then
    echo -e "${RED}⚠️  HIGH COST ALERT (90%): $${CURRENT_COST_FLOAT}${NC}"
    echo "Action required: Review and optimize resource usage"
    echo "Remaining budget: $$(echo "$BUDGET_LIMIT - $CURRENT_COST_FLOAT" | bc -l)"
    
elif (( $(echo "$CURRENT_COST_FLOAT > $ALERT_THRESHOLD_1" | bc -l) )); then
    echo -e "${YELLOW}⚠️  COST WARNING (60%): $${CURRENT_COST_FLOAT}${NC}"
    echo "Monitor closely. Consider cost optimization measures."
    echo "Remaining budget: $$(echo "$BUDGET_LIMIT - $CURRENT_COST_FLOAT" | bc -l)"
    
else
    echo -e "${GREEN}✅ Costs within budget: $${CURRENT_COST_FLOAT}${NC}"
    echo "Remaining budget: $$(echo "$BUDGET_LIMIT - $CURRENT_COST_FLOAT" | bc -l)"
fi

# Get cost breakdown by service
echo ""
echo "Cost breakdown by service:"
echo "-------------------------"

aws ce get-cost-and-usage \
    --time-period Start=${CURRENT_MONTH}-01,End=${NEXT_MONTH}-01 \
    --granularity MONTHLY \
    --metrics BlendedCost \
    --group-by Type=DIMENSION,Key=SERVICE \
    --query 'ResultsByTime[0].Groups[?Total.BlendedCost.Amount != `0.00`].[Keys[0], Total.BlendedCost.Amount]' \
    --output table 2>/dev/null || echo "Could not retrieve service breakdown"

echo ""
echo "Cost monitoring completed at $(date)"
echo "Next check recommended: $(date -d 'tomorrow')"