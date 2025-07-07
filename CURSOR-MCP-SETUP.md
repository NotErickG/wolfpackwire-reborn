# 🎯 Cursor MCP Agent Setup Guide

## 🚀 **What We've Created**

I've set up a complete MCP (Model Context Protocol) system for Cursor IDE that allows Claude (me) to control Cursor AI agents directly. Here's what's ready:

### ✅ **Files Created:**
- `.cursor/mcp.json` - MCP server configuration  
- `scripts/simple-mcp-server.js` - Custom NC State task management server
- `scripts/nc-state-mcp-server.js` - Advanced server (backup)

### 🛠️ **Available Tools:**
1. **get_tasks** - View current task queue status
2. **create_component** - Generate React components
3. **File system access** - Read/write project files
4. **Git integration** - Git operations

## 📋 **Setup Steps**

### Step 1: Install MCP Dependencies
```bash
# Already done - MCP SDK installed
npm list @modelcontextprotocol/sdk
```

### Step 2: Verify MCP Configuration
The `.cursor/mcp.json` file is configured with these servers:
- `nc-state-agent` - Our custom task management server
- `filesystem` - File operations
- `git` - Git operations

### Step 3: Launch Cursor with MCP
```bash
# Method 1: Open Cursor in this directory
cursor .

# Method 2: Launch with MCP explicitly enabled
cursor --enable-mcp .
```

### Step 4: Verify MCP in Cursor
1. Open Cursor IDE in this directory
2. Open the Command Palette (Cmd/Ctrl + Shift + P)
3. Look for "MCP" or "Tools" commands
4. You should see our custom tools available

### Step 5: Test the Connection
In Cursor, try using the chat and ask to:
- "Get current task status" (should use our get_tasks tool)
- "Create a Header component" (should use create_component tool)

## 🎯 **How to Use MCP Agents**

### For You (User):
1. **Open Cursor** in this project directory
2. **Start a chat** with Cursor AI
3. **Request tasks** like:
   - "Show me the current task queue"
   - "Create a new Navigation component"
   - "Check project status"

### For Me (Claude):
I can now control Cursor through MCP by:
1. **Calling MCP tools** directly from this conversation
2. **Monitoring task progress** through the servers
3. **Creating components** automatically
4. **Managing the development workflow**

## 🧠 **Agent Capabilities**

### Task Management Agent
- ✅ View task queue status
- ✅ Add new tasks to queue
- ✅ Mark tasks as completed
- ✅ Track task progress

### Component Creation Agent  
- ✅ Generate React components
- ✅ Create TypeScript interfaces
- ✅ Follow NC State branding
- ✅ Use proper file structure

### File System Agent
- ✅ Read project files
- ✅ Write new files
- ✅ Navigate directory structure
- ✅ Manage file permissions

### Git Integration Agent
- ✅ Check git status
- ✅ Create branches
- ✅ Commit changes
- ✅ Push to remote

## 🚨 **Troubleshooting**

### If MCP Doesn't Work:
1. **Check Cursor version** - MCP requires recent Cursor versions
2. **Restart Cursor** - Close and reopen in this directory
3. **Check logs** - Look for MCP errors in Cursor console
4. **Verify file paths** - Ensure all paths in `.cursor/mcp.json` are correct

### Common Issues:
- **"Tool not found"** - MCP server not running
- **"Permission denied"** - Check file permissions on scripts
- **"Module not found"** - Ensure npm packages are installed

## 🎉 **Ready to Test!**

### Try These Commands in Cursor:
1. **"What's the current task status?"** 
   - Should call our `get_tasks` tool
   
2. **"Create a LiveScore component"**
   - Should call our `create_component` tool
   
3. **"Show me the project structure"**
   - Should use filesystem tool

## 🔄 **Multi-Agent Workflow**

Now that MCP is set up, here's how the multi-agent system works:

1. **Claude (Senior Developer)** - Plans and coordinates (me)
2. **Cursor Agent** - Executes code generation and file operations  
3. **Local Gemini** - Handles specialized tasks (when API works)
4. **MCP Servers** - Facilitate communication between agents

### Workflow Example:
```
Claude → MCP → Cursor → Creates Component → Git Commit → Update Tasks
```

## 🎯 **Next Steps**

1. **Launch Cursor** in this directory
2. **Test MCP tools** with the commands above
3. **Start developing** - Request new components and features
4. **Monitor progress** - Use task queue to track completion

Ready to start building the NC State Sports Hub with AI agents! 🏀🐺