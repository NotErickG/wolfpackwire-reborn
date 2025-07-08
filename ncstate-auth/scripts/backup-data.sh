#!/bin/bash

# NC State Sports Hub - Data Backup Script
# This script creates backups of critical data and configurations

set -e

# Configuration
PROJECT_NAME="NC State Sports Hub"
BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_PATH="${BACKUP_DIR}/backup_${TIMESTAMP}"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "Starting backup for ${PROJECT_NAME}..."
echo "Backup timestamp: ${TIMESTAMP}"
echo "Backup location: ${BACKUP_PATH}"
echo "----------------------------------------"

# Create backup directory
mkdir -p "${BACKUP_PATH}"

# 1. Backup configuration files
echo -e "${YELLOW}Backing up configuration files...${NC}"
cp -r amplify/ "${BACKUP_PATH}/amplify/"
cp package.json "${BACKUP_PATH}/"
cp tsconfig.json "${BACKUP_PATH}/"
cp tailwind.config.js "${BACKUP_PATH}/"
cp next.config.js "${BACKUP_PATH}/"
cp .claude/ "${BACKUP_PATH}/.claude/" -r
echo -e "${GREEN}✅ Configuration files backed up${NC}"

# 2. Backup documentation
echo -e "${YELLOW}Backing up documentation...${NC}"
cp -r docs/ "${BACKUP_PATH}/docs/"
cp README.md "${BACKUP_PATH}/"
echo -e "${GREEN}✅ Documentation backed up${NC}"

# 3. Backup source code
echo -e "${YELLOW}Backing up source code...${NC}"
cp -r src/ "${BACKUP_PATH}/src/"
echo -e "${GREEN}✅ Source code backed up${NC}"

# 4. Backup git information
echo -e "${YELLOW}Backing up git information...${NC}"
git log --oneline -10 > "${BACKUP_PATH}/git_history.txt"
git branch -a > "${BACKUP_PATH}/git_branches.txt"
git worktree list > "${BACKUP_PATH}/git_worktrees.txt"
echo -e "${GREEN}✅ Git information backed up${NC}"

# 5. Create backup manifest
echo -e "${YELLOW}Creating backup manifest...${NC}"
cat > "${BACKUP_PATH}/manifest.txt" << EOF
NC State Sports Hub Backup
==========================
Timestamp: ${TIMESTAMP}
Project: ${PROJECT_NAME}
Backup Type: Full Configuration and Source Code Backup

Contents:
- amplify/          # AWS Amplify configuration
- src/              # Next.js source code
- docs/             # Project documentation
- .claude/          # Claude Code configuration
- package.json      # Node.js dependencies
- tsconfig.json     # TypeScript configuration
- tailwind.config.js # Tailwind CSS configuration
- next.config.js    # Next.js configuration
- README.md         # Project documentation
- git_history.txt   # Recent git commits
- git_branches.txt  # Git branches
- git_worktrees.txt # Git worktrees

Created: $(date)
EOF

echo -e "${GREEN}✅ Backup manifest created${NC}"

# 6. Calculate backup size
BACKUP_SIZE=$(du -sh "${BACKUP_PATH}" | cut -f1)
echo ""
echo "Backup completed successfully!"
echo "Backup size: ${BACKUP_SIZE}"
echo "Location: ${BACKUP_PATH}"

# 7. Cleanup old backups (keep last 5)
echo -e "${YELLOW}Cleaning up old backups...${NC}"
cd "${BACKUP_DIR}"
ls -t | tail -n +6 | xargs -r rm -rf
echo -e "${GREEN}✅ Old backups cleaned up (kept last 5)${NC}"

# 8. Verify backup integrity
echo -e "${YELLOW}Verifying backup integrity...${NC}"
if [ -f "${BACKUP_PATH}/manifest.txt" ] && [ -d "${BACKUP_PATH}/amplify" ] && [ -d "${BACKUP_PATH}/src" ]; then
    echo -e "${GREEN}✅ Backup integrity verified${NC}"
else
    echo -e "${RED}❌ Backup integrity check failed${NC}"
    exit 1
fi

echo ""
echo "Backup completed successfully at $(date)"
echo "Next backup recommended: $(date -d 'next week')"