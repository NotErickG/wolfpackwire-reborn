#!/usr/bin/env node

/**
 * Simple MCP Server for NC State Sports Hub
 * Provides basic task management tools to Cursor
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PROJECT_ROOT = '/home/erick/amplify/wolfpackwire-reborn';
const TASK_QUEUE_FILE = path.join(PROJECT_ROOT, '.gemini/task-queue.json');

// Simple MCP protocol implementation
class SimpleMCPServer {
  constructor() {
    this.requestId = 0;
  }

  sendResponse(id, result) {
    const response = {
      jsonrpc: '2.0',
      id,
      result,
    };
    console.log(JSON.stringify(response));
  }

  sendError(id, code, message) {
    const response = {
      jsonrpc: '2.0',
      id,
      error: { code, message },
    };
    console.log(JSON.stringify(response));
  }

  handleRequest(request) {
    const { method, params, id } = request;

    try {
      switch (method) {
        case 'initialize':
          this.sendResponse(id, {
            protocolVersion: '0.1.0',
            capabilities: {
              tools: {},
              resources: {},
            },
            serverInfo: {
              name: 'nc-state-sports-hub',
              version: '1.0.0',
            },
          });
          break;

        case 'tools/list':
          this.sendResponse(id, {
            tools: [
              {
                name: 'get_tasks',
                description: 'Get current task queue status',
                inputSchema: {
                  type: 'object',
                  properties: {},
                },
              },
              {
                name: 'create_component',
                description: 'Create a new React component',
                inputSchema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    type: { type: 'string' },
                  },
                  required: ['name'],
                },
              },
            ],
          });
          break;

        case 'tools/call':
          this.handleToolCall(id, params);
          break;

        default:
          this.sendError(id, -32601, `Method not found: ${method}`);
      }
    } catch (error) {
      this.sendError(id, -32603, `Internal error: ${error.message}`);
    }
  }

  handleToolCall(id, params) {
    const { name, arguments: args } = params;

    switch (name) {
      case 'get_tasks':
        this.sendResponse(id, this.getTasks());
        break;
      
      case 'create_component':
        this.sendResponse(id, this.createComponent(args));
        break;
      
      default:
        this.sendError(id, -32601, `Tool not found: ${name}`);
    }
  }

  getTasks() {
    try {
      if (!fs.existsSync(TASK_QUEUE_FILE)) {
        return {
          content: [
            {
              type: 'text',
              text: 'No task queue found. Creating new queue...',
            },
          ],
        };
      }

      const taskQueue = JSON.parse(fs.readFileSync(TASK_QUEUE_FILE, 'utf8'));
      const stats = {
        total: taskQueue.tasks.length,
        pending: taskQueue.tasks.filter(t => t.status === 'pending').length,
        completed: taskQueue.tasks.filter(t => t.status === 'completed').length,
      };

      return {
        content: [
          {
            type: 'text',
            text: `📊 Task Queue Status:
Total: ${stats.total}
Pending: ${stats.pending} 
Completed: ${stats.completed}

Next Pending Tasks:
${taskQueue.tasks
  .filter(t => t.status === 'pending')
  .slice(0, 3)
  .map(t => `• ${t.id}: ${t.task}`)
  .join('\n')}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error reading tasks: ${error.message}`,
          },
        ],
      };
    }
  }

  createComponent(args) {
    try {
      const { name, type = 'component' } = args;
      const componentPath = path.join(
        PROJECT_ROOT,
        'nc-state-sports-hub/nc-state-sports-hub-production/src/components',
        `${name}.tsx`
      );

      const template = `import React from 'react';

interface ${name}Props {
  // Add props here
}

/**
 * ${name} Component for NC State Sports Hub
 * TODO: Implement component functionality
 */
export default function ${name}(props: ${name}Props) {
  return (
    <div className="nc-state-component">
      <h2 className="text-xl font-bold text-red-600">
        ${name}
      </h2>
      <p className="text-gray-600">
        Component ready for implementation
      </p>
    </div>
  );
}
`;

      // Ensure directory exists
      const dir = path.dirname(componentPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(componentPath, template);

      return {
        content: [
          {
            type: 'text',
            text: `✅ Component created successfully!
File: ${componentPath}
Ready for development in Cursor IDE.`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `❌ Error creating component: ${error.message}`,
          },
        ],
      };
    }
  }

  start() {
    console.error('NC State MCP Server starting...');
    
    process.stdin.on('data', (data) => {
      const lines = data.toString().trim().split('\n');
      
      for (const line of lines) {
        if (line.trim()) {
          try {
            const request = JSON.parse(line);
            this.handleRequest(request);
          } catch (error) {
            console.error('Error parsing request:', error.message);
          }
        }
      }
    });

    process.stdin.on('end', () => {
      console.error('NC State MCP Server shutting down...');
      process.exit(0);
    });
  }
}

// Start the server
if (require.main === module) {
  const server = new SimpleMCPServer();
  server.start();
}

module.exports = SimpleMCPServer;