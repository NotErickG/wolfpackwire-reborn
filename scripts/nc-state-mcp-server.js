#!/usr/bin/env node

/**
 * NC State Sports Hub - Custom MCP Server
 * Provides task management and agent coordination capabilities to Cursor IDE
 */

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const TASK_QUEUE_FILE = '.gemini/task-queue.json';
const PROJECT_ROOT = '/home/erick/amplify/wolfpackwire-reborn';

class NCStateMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'nc-state-sports-hub',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    this.setupResourceHandlers();
  }

  setupToolHandlers() {
    // Task Management Tools
    this.server.setRequestHandler('tools/list', async () => ({
      tools: [
        {
          name: 'get_task_status',
          description: 'Get current status of all tasks in the queue',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
        {
          name: 'add_task',
          description: 'Add a new task to the queue',
          inputSchema: {
            type: 'object',
            properties: {
              id: { type: 'string', description: 'Unique task ID' },
              intern: { type: 'string', description: 'Agent type (e.g., frontend-intern)' },
              task: { type: 'string', description: 'Task description' },
              priority: { type: 'string', enum: ['high', 'medium', 'low'] },
              branch: { type: 'string', description: 'Git branch name' },
            },
            required: ['id', 'intern', 'task'],
          },
        },
        {
          name: 'complete_task',
          description: 'Mark a task as completed',
          inputSchema: {
            type: 'object',
            properties: {
              taskId: { type: 'string', description: 'Task ID to complete' },
              completedBy: { type: 'string', description: 'Agent that completed the task' },
              deliverables: { type: 'string', description: 'What was delivered' },
            },
            required: ['taskId'],
          },
        },
        {
          name: 'create_component',
          description: 'Create a new React component for NC State Sports Hub',
          inputSchema: {
            type: 'object',
            properties: {
              name: { type: 'string', description: 'Component name (e.g., Header, PlayerCard)' },
              type: { type: 'string', enum: ['page', 'component', 'layout', 'hook'] },
              description: { type: 'string', description: 'What the component does' },
              props: { type: 'array', description: 'Component props', items: { type: 'string' } },
            },
            required: ['name', 'type'],
          },
        },
        {
          name: 'run_build_check',
          description: 'Run build and type checking for the project',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
        {
          name: 'deploy_to_staging',
          description: 'Deploy current changes to staging environment',
          inputSchema: {
            type: 'object',
            properties: {
              branch: { type: 'string', description: 'Branch to deploy' },
            },
          },
        },
      ],
    }));

    // Tool execution handlers
    this.server.setRequestHandler('tools/call', async (request) => {
      const { name, arguments: args } = request.params;

      switch (name) {
        case 'get_task_status':
          return this.getTaskStatus();
        
        case 'add_task':
          return this.addTask(args);
        
        case 'complete_task':
          return this.completeTask(args);
        
        case 'create_component':
          return this.createComponent(args);
        
        case 'run_build_check':
          return this.runBuildCheck();
        
        case 'deploy_to_staging':
          return this.deployToStaging(args);
        
        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    });
  }

  setupResourceHandlers() {
    this.server.setRequestHandler('resources/list', async () => ({
      resources: [
        {
          uri: 'task-queue://current',
          name: 'Current Task Queue',
          description: 'Live view of all tasks and their status',
          mimeType: 'application/json',
        },
        {
          uri: 'project://structure',
          name: 'Project Structure',
          description: 'Current project file structure and components',
          mimeType: 'text/plain',
        },
        {
          uri: 'audit://frontend',
          name: 'Frontend Audit Report',
          description: 'Latest frontend audit findings and recommendations',
          mimeType: 'text/markdown',
        },
      ],
    }));

    this.server.setRequestHandler('resources/read', async (request) => {
      const uri = request.params.uri;
      
      switch (uri) {
        case 'task-queue://current':
          return this.getTaskQueueResource();
        
        case 'project://structure':
          return this.getProjectStructure();
        
        case 'audit://frontend':
          return this.getFrontendAudit();
        
        default:
          throw new Error(`Unknown resource: ${uri}`);
      }
    });
  }

  // Task Management Methods
  async getTaskStatus() {
    try {
      const taskQueue = this.loadTaskQueue();
      const stats = {
        total: taskQueue.tasks.length,
        pending: taskQueue.tasks.filter(t => t.status === 'pending').length,
        inProgress: taskQueue.tasks.filter(t => t.status === 'in-progress').length,
        completed: taskQueue.tasks.filter(t => t.status === 'completed').length,
        failed: taskQueue.tasks.filter(t => t.status === 'failed').length,
      };

      return {
        content: [
          {
            type: 'text',
            text: `📊 NC State Sports Hub - Task Queue Status\n\n` +
                  `Total Tasks: ${stats.total}\n` +
                  `✅ Completed: ${stats.completed}\n` +
                  `🔄 In Progress: ${stats.inProgress}\n` +
                  `⏳ Pending: ${stats.pending}\n` +
                  `❌ Failed: ${stats.failed}\n\n` +
                  `Next 5 Pending Tasks:\n` +
                  taskQueue.tasks
                    .filter(t => t.status === 'pending')
                    .slice(0, 5)
                    .map(t => `• ${t.id}: ${t.task}`)
                    .join('\n'),
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to get task status: ${error.message}`);
    }
  }

  async addTask(args) {
    try {
      const taskQueue = this.loadTaskQueue();
      const newTask = {
        id: args.id,
        intern: args.intern,
        task: args.task,
        priority: args.priority || 'medium',
        status: 'pending',
        created: new Date().toISOString(),
        branch: args.branch || `feature/${args.id}`,
      };

      taskQueue.tasks.push(newTask);
      this.saveTaskQueue(taskQueue);

      return {
        content: [
          {
            type: 'text',
            text: `✅ Task added successfully!\n\nID: ${newTask.id}\nAssigned to: ${newTask.intern}\nTask: ${newTask.task}\nPriority: ${newTask.priority}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to add task: ${error.message}`);
    }
  }

  async completeTask(args) {
    try {
      const taskQueue = this.loadTaskQueue();
      const task = taskQueue.tasks.find(t => t.id === args.taskId);
      
      if (!task) {
        throw new Error(`Task ${args.taskId} not found`);
      }

      task.status = 'completed';
      task.completed = new Date().toISOString();
      task.completedBy = args.completedBy || 'Cursor Agent';
      task.deliverables = args.deliverables;

      this.saveTaskQueue(taskQueue);

      return {
        content: [
          {
            type: 'text',
            text: `🎉 Task ${args.taskId} marked as completed!\n\nCompleted by: ${task.completedBy}\nDeliverables: ${task.deliverables || 'None specified'}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to complete task: ${error.message}`);
    }
  }

  async createComponent(args) {
    try {
      const componentTemplate = this.generateComponentTemplate(args);
      const filePath = this.getComponentPath(args);
      
      // Create component file
      fs.writeFileSync(filePath, componentTemplate);

      return {
        content: [
          {
            type: 'text',
            text: `✅ Component created successfully!\n\nFile: ${filePath}\nType: ${args.type}\nDescription: ${args.description || 'No description provided'}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to create component: ${error.message}`);
    }
  }

  async runBuildCheck() {
    try {
      process.chdir(path.join(PROJECT_ROOT, 'nc-state-sports-hub', 'nc-state-sports-hub-production'));
      
      const buildOutput = execSync('npm run build', { encoding: 'utf8', timeout: 60000 });
      
      return {
        content: [
          {
            type: 'text',
            text: `✅ Build successful!\n\n${buildOutput}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `❌ Build failed!\n\n${error.message}`,
          },
        ],
      };
    }
  }

  // Resource Methods
  async getTaskQueueResource() {
    const taskQueue = this.loadTaskQueue();
    return {
      contents: [
        {
          uri: 'task-queue://current',
          mimeType: 'application/json',
          text: JSON.stringify(taskQueue, null, 2),
        },
      ],
    };
  }

  async getProjectStructure() {
    try {
      const structure = execSync('find nc-state-sports-hub -type f -name "*.tsx" -o -name "*.ts" -o -name "*.json" | head -20', 
        { encoding: 'utf8', cwd: PROJECT_ROOT });
      
      return {
        contents: [
          {
            uri: 'project://structure',
            mimeType: 'text/plain',
            text: `NC State Sports Hub - Project Structure\n\n${structure}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to get project structure: ${error.message}`);
    }
  }

  // Utility Methods
  loadTaskQueue() {
    const filePath = path.join(PROJECT_ROOT, TASK_QUEUE_FILE);
    if (!fs.existsSync(filePath)) {
      return { tasks: [] };
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }

  saveTaskQueue(taskQueue) {
    const filePath = path.join(PROJECT_ROOT, TASK_QUEUE_FILE);
    fs.writeFileSync(filePath, JSON.stringify(taskQueue, null, 2));
  }

  generateComponentTemplate(args) {
    const { name, type, description, props = [] } = args;
    
    const propsInterface = props.length > 0 
      ? `interface ${name}Props {\n  ${props.map(p => `${p}: string;`).join('\n  ')}\n}\n\n`
      : '';

    const propsParam = props.length > 0 ? `{ ${props.join(', ')} }: ${name}Props` : '';

    return `import React from 'react';

${propsInterface}/**
 * ${name} Component
 * ${description || 'NC State Sports Hub component'}
 */
export default function ${name}(${propsParam}) {
  return (
    <div className="nc-state-component">
      {/* TODO: Implement ${name} component */}
      <h1 className="text-2xl font-bold text-red-600">
        ${name}
      </h1>
      <p className="text-gray-600">
        ${description || 'Component implementation needed'}
      </p>
    </div>
  );
}
`;
  }

  getComponentPath(args) {
    const { name, type } = args;
    const basePath = path.join(PROJECT_ROOT, 'nc-state-sports-hub', 'nc-state-sports-hub-production', 'src');
    
    switch (type) {
      case 'page':
        return path.join(basePath, 'app', `${name.toLowerCase()}.tsx`);
      case 'component':
        return path.join(basePath, 'components', `${name}.tsx`);
      case 'layout':
        return path.join(basePath, 'components', 'layout', `${name}.tsx`);
      case 'hook':
        return path.join(basePath, 'hooks', `use${name}.ts`);
      default:
        return path.join(basePath, 'components', `${name}.tsx`);
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('NC State MCP server running on stdio');
  }
}

// Run the server
if (require.main === module) {
  const server = new NCStateMCPServer();
  server.run().catch(console.error);
}

module.exports = NCStateMCPServer;