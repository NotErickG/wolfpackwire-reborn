#!/bin/bash

# Auto-resume script for NC State Sports Hub development
# To schedule: crontab -e
# Add line: 0 1 * * * /home/erick/amplify/wolfpackwire-reborn/scripts/auto-resume.sh

LOGFILE="/home/erick/amplify/wolfpackwire-reborn/logs/auto-resume.log"
CONTEXT_FILE="/home/erick/amplify/wolfpackwire-reborn/.auto-restart-config.json"
PROMPT_FILE="/tmp/claude-auto-resume-prompt.txt"

echo "$(date): Auto-resume triggered" >> $LOGFILE

if [ -f "$CONTEXT_FILE" ]; then
    echo "$(date): Context file found, checking if enabled..." >> $LOGFILE
    
    # Check if enabled in config
    ENABLED=$(grep '"enabled": true' "$CONTEXT_FILE")
    
    if [ ! -z "$ENABLED" ]; then
        echo "$(date): Auto-resume enabled, starting Claude Code..." >> $LOGFILE
        
        # Create resume prompt
        cat > "$PROMPT_FILE" << 'EOF'
Resume NC State Sports Hub development as Senior Developer Agent. 

CURRENT STATUS:
- Production URL working: https://master.d3m9i7e7z8i0yo.amplifyapp.com
- AWS Amplify app ID: d3m9i7e7z8i0yo
- GitHub repo: https://github.com/noterickg/wolfpackwire-reborn.git
- GitHub CI/CD: Working automatically on push to master

CURRENT FOCUS: 
Continue building features via Gemini agents while minimizing Claude usage to save tokens.

ACTIVE GEMINI TASKS:
1. Live Score Widget - ESPN API integration with auto-refresh
2. Team Roster System - Multi-sport player cards with search/filtering  
3. News Feed System - RSS integration with infinite scroll/search

NEXT ACTIONS:
- Check Gemini agent progress on the 3 active tasks
- Deploy completed features to production
- Minimize Claude usage by delegating to agents
- Continue multi-agent development workflow

Please continue where we left off with minimal Claude involvement.
EOF

        echo "$(date): Starting Claude Code with auto-resume prompt..." >> $LOGFILE
        
        # Change to project directory
        cd /home/erick/amplify/wolfpackwire-reborn
        
        # Start Claude Code with the resume prompt
        if command -v claude &> /dev/null; then
            echo "$(date): Using claude CLI to start session..." >> $LOGFILE
            claude < "$PROMPT_FILE" >> $LOGFILE 2>&1 &
        elif command -v npx &> /dev/null && npm list -g @anthropic/claude-code &> /dev/null; then
            echo "$(date): Using npx to start claude-code..." >> $LOGFILE
            npx claude-code < "$PROMPT_FILE" >> $LOGFILE 2>&1 &
        else
            echo "$(date): Claude CLI not found, opening browser..." >> $LOGFILE
            
            # Copy prompt to clipboard if available
            if command -v xclip &> /dev/null; then
                cat "$PROMPT_FILE" | xclip -selection clipboard
                echo "$(date): Resume prompt copied to clipboard" >> $LOGFILE
            elif command -v pbcopy &> /dev/null; then
                cat "$PROMPT_FILE" | pbcopy
                echo "$(date): Resume prompt copied to clipboard (macOS)" >> $LOGFILE
            fi
            
            # Open Claude Code in browser
            if command -v xdg-open &> /dev/null; then
                xdg-open "https://claude.ai/code" >> $LOGFILE 2>&1
            elif command -v open &> /dev/null; then
                open "https://claude.ai/code" >> $LOGFILE 2>&1
            fi
            
            # Send notification with prompt
            if command -v notify-send &> /dev/null; then
                notify-send "Claude Code Auto-Resume" "Browser opened. Prompt copied to clipboard. Paste it to resume NC State Sports Hub development."
            fi
        fi
        
        echo "$(date): Auto-resume process completed" >> $LOGFILE
        
    else
        echo "$(date): Auto-resume disabled in config" >> $LOGFILE
    fi
else
    echo "$(date): No context file found" >> $LOGFILE
fi

# Clean up prompt file
rm -f "$PROMPT_FILE"