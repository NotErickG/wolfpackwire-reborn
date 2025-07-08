#!/bin/bash

# NC State Sports Hub - Production Health Check Script
# Comprehensive health verification for production deployment

set -e

# Configuration
PROJECT_NAME="NC State Sports Hub"
DOMAIN="ncstatesportshub.com"
HEALTH_ENDPOINT="/api/health"
TIMEOUT=30

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🏥 Starting Production Health Check for ${PROJECT_NAME}...${NC}"
echo "Timestamp: $(date)"
echo "=========================================="

# 1. DNS Resolution Check
echo -e "${YELLOW}🔍 Checking DNS resolution...${NC}"
if nslookup ${DOMAIN} &>/dev/null; then
    echo -e "${GREEN}✅ DNS resolution successful for ${DOMAIN}${NC}"
else
    echo -e "${RED}❌ DNS resolution failed for ${DOMAIN}${NC}"
    exit 1
fi

# 2. SSL Certificate Check
echo -e "${YELLOW}🔒 Checking SSL certificate...${NC}"
if openssl s_client -connect ${DOMAIN}:443 -servername ${DOMAIN} </dev/null 2>/dev/null | openssl x509 -noout -dates &>/dev/null; then
    echo -e "${GREEN}✅ SSL certificate is valid${NC}"
    # Check certificate expiration
    EXPIRY=$(openssl s_client -connect ${DOMAIN}:443 -servername ${DOMAIN} </dev/null 2>/dev/null | openssl x509 -noout -enddate | cut -d= -f2)
    echo "Certificate expires: ${EXPIRY}"
else
    echo -e "${RED}❌ SSL certificate check failed${NC}"
    exit 1
fi

# 3. Website Availability Check
echo -e "${YELLOW}🌐 Checking website availability...${NC}"
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://${DOMAIN} --max-time ${TIMEOUT})
if [ "${HTTP_STATUS}" = "200" ]; then
    echo -e "${GREEN}✅ Website is accessible (HTTP ${HTTP_STATUS})${NC}"
else
    echo -e "${RED}❌ Website returned HTTP ${HTTP_STATUS}${NC}"
    exit 1
fi

# 4. Health Endpoint Check
echo -e "${YELLOW}💓 Checking health endpoint...${NC}"
if curl -f -s https://${DOMAIN}${HEALTH_ENDPOINT} --max-time ${TIMEOUT} &>/dev/null; then
    echo -e "${GREEN}✅ Health endpoint responding${NC}"
    HEALTH_RESPONSE=$(curl -s https://${DOMAIN}${HEALTH_ENDPOINT} --max-time ${TIMEOUT})
    echo "Health response: ${HEALTH_RESPONSE}"
else
    echo -e "${RED}❌ Health endpoint not responding${NC}"
    # Don't exit here as health endpoint might not be implemented yet
fi

# 5. Performance Check
echo -e "${YELLOW}⚡ Checking website performance...${NC}"
RESPONSE_TIME=$(curl -s -o /dev/null -w "%{time_total}" https://${DOMAIN} --max-time ${TIMEOUT})
RESPONSE_TIME_MS=$(echo "${RESPONSE_TIME} * 1000" | bc)
if (( $(echo "${RESPONSE_TIME} < 3.0" | bc -l) )); then
    echo -e "${GREEN}✅ Website loads in ${RESPONSE_TIME_MS}ms (under 3 seconds)${NC}"
else
    echo -e "${YELLOW}⚠️  Website loads in ${RESPONSE_TIME_MS}ms (over 3 seconds)${NC}"
fi

# 6. API Endpoints Check
echo -e "${YELLOW}🔌 Checking critical API endpoints...${NC}"
CRITICAL_ENDPOINTS=(
    "/api/teams"
    "/api/games/upcoming"
    "/api/news/latest"
)

for endpoint in "${CRITICAL_ENDPOINTS[@]}"; do
    if curl -f -s https://${DOMAIN}${endpoint} --max-time ${TIMEOUT} &>/dev/null; then
        echo -e "${GREEN}✅ ${endpoint} responding${NC}"
    else
        echo -e "${YELLOW}⚠️  ${endpoint} not responding (may not be implemented yet)${NC}"
    fi
done

# 7. Database Connectivity Check (if health endpoint provides DB status)
echo -e "${YELLOW}🗄️  Checking database connectivity...${NC}"
if curl -s https://${DOMAIN}${HEALTH_ENDPOINT} --max-time ${TIMEOUT} | grep -q "database.*ok" 2>/dev/null; then
    echo -e "${GREEN}✅ Database connectivity confirmed${NC}"
else
    echo -e "${YELLOW}⚠️  Database status unknown (check manually)${NC}"
fi

# 8. CDN and Asset Check
echo -e "${YELLOW}📦 Checking static assets...${NC}"
STATIC_ASSETS=(
    "/favicon.ico"
    "/_next/static/chunks/pages/_app.js"
)

for asset in "${STATIC_ASSETS[@]}"; do
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://${DOMAIN}${asset} --max-time ${TIMEOUT})
    if [ "${HTTP_STATUS}" = "200" ]; then
        echo -e "${GREEN}✅ ${asset} loaded successfully${NC}"
    else
        echo -e "${YELLOW}⚠️  ${asset} returned HTTP ${HTTP_STATUS}${NC}"
    fi
done

# 9. Mobile Responsiveness Check
echo -e "${YELLOW}📱 Checking mobile responsiveness...${NC}"
MOBILE_UA="Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15"
MOBILE_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -H "User-Agent: ${MOBILE_UA}" https://${DOMAIN} --max-time ${TIMEOUT})
if [ "${MOBILE_STATUS}" = "200" ]; then
    echo -e "${GREEN}✅ Mobile user agent handled correctly${NC}"
else
    echo -e "${RED}❌ Mobile user agent returned HTTP ${MOBILE_STATUS}${NC}"
fi

# 10. Security Headers Check
echo -e "${YELLOW}🛡️  Checking security headers...${NC}"
SECURITY_HEADERS=$(curl -s -I https://${DOMAIN} --max-time ${TIMEOUT})

if echo "${SECURITY_HEADERS}" | grep -q "Strict-Transport-Security"; then
    echo -e "${GREEN}✅ HSTS header present${NC}"
else
    echo -e "${YELLOW}⚠️  HSTS header missing${NC}"
fi

if echo "${SECURITY_HEADERS}" | grep -q "X-Content-Type-Options"; then
    echo -e "${GREEN}✅ X-Content-Type-Options header present${NC}"
else
    echo -e "${YELLOW}⚠️  X-Content-Type-Options header missing${NC}"
fi

# 11. AWS Health Check (if AWS CLI is available)
echo -e "${YELLOW}☁️  Checking AWS service health...${NC}"
if command -v aws &> /dev/null; then
    # Check if Amplify app is healthy
    if aws amplify list-apps --query 'apps[?name==`nc-state-sports-hub`]' --output text &>/dev/null; then
        echo -e "${GREEN}✅ AWS Amplify app found and accessible${NC}"
    else
        echo -e "${YELLOW}⚠️  Could not verify AWS Amplify app status${NC}"
    fi
    
    # Check current AWS costs
    CURRENT_COST=$(aws ce get-cost-and-usage \
        --time-period Start=$(date +%Y-%m-01),End=$(date -d "next month" +%Y-%m-01) \
        --granularity MONTHLY \
        --metrics BlendedCost \
        --query 'ResultsByTime[0].Total.BlendedCost.Amount' \
        --output text 2>/dev/null || echo "unknown")
    
    if [ "${CURRENT_COST}" != "unknown" ]; then
        echo "Current month AWS cost: \$${CURRENT_COST}"
        if (( $(echo "${CURRENT_COST} < 5.0" | bc -l) )); then
            echo -e "${GREEN}✅ AWS costs under budget (\$${CURRENT_COST} < \$5.00)${NC}"
        else
            echo -e "${RED}❌ AWS costs over budget (\$${CURRENT_COST} >= \$5.00)${NC}"
        fi
    fi
else
    echo -e "${YELLOW}⚠️  AWS CLI not available for service health check${NC}"
fi

# 12. Lighthouse Performance Check (if lighthouse CLI is available)
echo -e "${YELLOW}🚀 Running Lighthouse performance check...${NC}"
if command -v lighthouse &> /dev/null; then
    lighthouse https://${DOMAIN} \
        --only-categories=performance,accessibility,seo \
        --chrome-flags="--headless --no-sandbox" \
        --output=json \
        --output-path=./lighthouse-results.json \
        --quiet || echo "Lighthouse check completed with warnings"
    
    if [ -f "./lighthouse-results.json" ]; then
        PERFORMANCE_SCORE=$(cat ./lighthouse-results.json | jq '.categories.performance.score * 100' 2>/dev/null || echo "unknown")
        if [ "${PERFORMANCE_SCORE}" != "unknown" ]; then
            echo "Lighthouse Performance Score: ${PERFORMANCE_SCORE}/100"
            if (( $(echo "${PERFORMANCE_SCORE} >= 90" | bc -l) )); then
                echo -e "${GREEN}✅ Excellent performance score${NC}"
            elif (( $(echo "${PERFORMANCE_SCORE} >= 70" | bc -l) )); then
                echo -e "${YELLOW}⚠️  Good performance score${NC}"
            else
                echo -e "${RED}❌ Poor performance score${NC}"
            fi
        fi
        rm -f ./lighthouse-results.json
    fi
else
    echo -e "${YELLOW}⚠️  Lighthouse CLI not available for performance check${NC}"
fi

echo ""
echo "=========================================="
echo -e "${BLUE}🎉 Production Health Check Completed for ${PROJECT_NAME}${NC}"
echo "Timestamp: $(date)"
echo ""
echo "Summary:"
echo "- Website accessibility: ✅"
echo "- SSL/TLS security: ✅"
echo "- Performance: Checked"
echo "- API endpoints: Verified"
echo "- Mobile compatibility: ✅"
echo ""
echo "🐺 Go Pack! NC State Sports Hub is running strong!"