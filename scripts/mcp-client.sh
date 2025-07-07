#!/bin/bash

# MCP Client Wrapper
# Clean interface for Claude to communicate with Cursor MCP servers
# Add this script to auto-approve for seamless agent coordination

set -e

MCP_SERVER_SCRIPT="scripts/simple-mcp-server.js"
LOG_FILE="logs/mcp-client.log"

# Ensure logs directory exists
mkdir -p logs

# Function to log messages
log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_FILE"
}

# Function to send MCP request
send_mcp_request() {
    local method="$1"
    local params="$2"
    local id="${3:-1}"
    
    local request="{\"jsonrpc\":\"2.0\",\"id\":$id,\"method\":\"$method\""
    
    if [ -n "$params" ]; then
        request="$request,\"params\":$params"
    fi
    
    request="$request}"
    
    log_message "📤 Sending MCP request: $method"
    echo "$request" | node "$MCP_SERVER_SCRIPT" 2>/dev/null | head -1
}

# Function to get task status
get_task_status() {
    log_message "📊 Getting task queue status"
    send_mcp_request "tools/call" '{"name":"get_tasks","arguments":{}}'
}

# Function to create component
create_component() {
    local name="$1"
    local type="${2:-component}"
    
    if [ -z "$name" ]; then
        echo "❌ Error: Component name required"
        return 1
    fi
    
    log_message "🛠️ Creating component: $name (type: $type)"
    send_mcp_request "tools/call" "{\"name\":\"create_component\",\"arguments\":{\"name\":\"$name\",\"type\":\"$type\"}}"
}

# Function to list available tools
list_tools() {
    log_message "🔧 Listing available MCP tools"
    send_mcp_request "tools/list"
}

# Function to initialize MCP connection
initialize_mcp() {
    log_message "🚀 Initializing MCP connection"
    send_mcp_request "initialize" '{"protocolVersion":"0.1.0","capabilities":{"tools":{}},"clientInfo":{"name":"claude-client","version":"1.0.0"}}'
}

# Main command interface
case "${1:-help}" in
    "status")
        get_task_status
        ;;
    "create")
        if [ -z "$2" ]; then
            echo "Usage: $0 create <component_name> [type]"
            echo "Types: component, page, layout, hook"
            exit 1
        fi
        create_component "$2" "$3"
        ;;
    "tools")
        list_tools
        ;;
    "init")
        initialize_mcp
        ;;
    "test")
        echo "🧪 Testing MCP connection..."
        initialize_mcp
        echo ""
        list_tools
        echo ""
        get_task_status
        ;;
    "help")
        echo "🤖 MCP Client - Cursor Agent Communication"
        echo "========================================"
        echo ""
        echo "Usage:"
        echo "  $0 status              Get current task queue status"
        echo "  $0 create <name> [type] Create a new component"
        echo "  $0 tools               List available MCP tools"
        echo "  $0 init                Initialize MCP connection"
        echo "  $0 test                Test full MCP communication"
        echo ""
        echo "Examples:"
        echo "  $0 status"
        echo "  $0 create Header component"
        echo "  $0 create LoginPage page"
        echo "  $0 create useAuth hook"
        ;;
    *)
        echo "❌ Unknown command: $1"
        echo "Run '$0 help' for usage information"
        exit 1
        ;;
esac