#!/usr/bin/env node

/**
 * Task Manager - Orchestrates multi-agent task execution
 * Manages task queue, agent coordination, and status tracking
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const TASK_QUEUE_FILE = '.gemini/task-queue.json';
const LOG_FILE = 'logs/task-manager.log';

// Ensure directories exist
if (!fs.existsSync('logs')) {
    fs.mkdirSync('logs', { recursive: true });
}

class TaskManager {
    constructor() {
        this.agents = new Map();
        this.activeTasks = new Map();
        this.taskQueue = this.loadTaskQueue();
        
        this.initializeAgents();
        this.startTaskProcessor();
    }

    log(message) {
        const timestamp = new Date().toISOString();
        const logMessage = `${timestamp} - ${message}\n`;
        
        console.log(logMessage.trim());
        fs.appendFileSync(LOG_FILE, logMessage);
    }

    loadTaskQueue() {
        try {
            if (fs.existsSync(TASK_QUEUE_FILE)) {
                const data = fs.readFileSync(TASK_QUEUE_FILE, 'utf8');
                return JSON.parse(data);
            }
        } catch (error) {
            this.log(`Error loading task queue: ${error.message}`);
        }
        
        return { tasks: [] };
    }

    saveTaskQueue() {
        try {
            fs.writeFileSync(TASK_QUEUE_FILE, JSON.stringify(this.taskQueue, null, 2));
        } catch (error) {
            this.log(`Error saving task queue: ${error.message}`);
        }
    }

    initializeAgents() {
        const agentConfigs = [
            { name: 'frontend-intern', type: 'gemini', specialties: ['react', 'typescript', 'tailwind', 'ui-ux'] },
            { name: 'backend-intern', type: 'gemini', specialties: ['amplify', 'dynamodb', 'graphql', 'api'] },
            { name: 'auth-intern', type: 'gemini', specialties: ['cognito', 'auth-flows', 'security'] },
            { name: 'devops-intern', type: 'gemini', specialties: ['ci-cd', 'deployment', 'monitoring', 'cost-optimization'] },
            { name: 'cursor-doc-agent', type: 'cursor', specialties: ['documentation', 'readme', 'api-docs'] },
            { name: 'cursor-review-agent', type: 'cursor', specialties: ['code-review', 'bugs', 'patterns'] },
            { name: 'cursor-refactor-agent', type: 'cursor', specialties: ['refactoring', 'architecture', 'performance'] }
        ];

        agentConfigs.forEach(config => {
            this.agents.set(config.name, {
                ...config,
                status: 'idle',
                currentTask: null,
                tasksCompleted: 0,
                lastActivity: null
            });
        });

        this.log(`Initialized ${this.agents.size} agents`);
    }

    async checkAgentHealth() {
        for (const [name, agent] of this.agents) {
            if (agent.type === 'gemini') {
                try {
                    execSync(`docker exec ${name} echo "Health check"`, { stdio: 'pipe' });
                    agent.status = 'healthy';
                } catch (error) {
                    agent.status = 'unhealthy';
                    this.log(`Agent ${name} is unhealthy: ${error.message}`);
                }
            }
        }
    }

    selectBestAgent(task) {
        // Simple agent selection based on specialties and availability
        const availableAgents = Array.from(this.agents.entries())
            .filter(([name, agent]) => agent.status === 'idle' || agent.status === 'healthy')
            .map(([name, agent]) => ({
                name,
                agent,
                score: this.calculateAgentScore(agent, task)
            }))
            .sort((a, b) => b.score - a.score);

        return availableAgents.length > 0 ? availableAgents[0].name : null;
    }

    calculateAgentScore(agent, task) {
        let score = 0;
        const taskLower = task.task.toLowerCase();
        
        // Score based on specialties
        agent.specialties.forEach(specialty => {
            if (taskLower.includes(specialty.toLowerCase())) {
                score += 10;
            }
        });

        // Prefer less busy agents
        score -= agent.tasksCompleted * 0.1;

        // Prefer agents that have been idle longer
        if (agent.lastActivity) {
            const timeSinceActivity = Date.now() - new Date(agent.lastActivity).getTime();
            score += timeSinceActivity / (1000 * 60 * 60); // Hours since last activity
        }

        return score;
    }

    async executeTask(agentName, task) {
        const agent = this.agents.get(agentName);
        if (!agent) {
            this.log(`Agent ${agentName} not found`);
            return false;
        }

        this.log(`Executing task ${task.id} with agent ${agentName}`);
        
        agent.status = 'busy';
        agent.currentTask = task.id;
        this.activeTasks.set(task.id, {
            agent: agentName,
            startTime: new Date().toISOString(),
            task: task
        });

        try {
            if (agent.type === 'gemini') {
                await this.executeGeminiTask(agentName, task);
            } else if (agent.type === 'cursor') {
                await this.executeCursorTask(agentName, task);
            }

            // Mark task as completed
            this.completeTask(task.id, agentName);
            return true;
        } catch (error) {
            this.log(`Task ${task.id} failed: ${error.message}`);
            this.failTask(task.id, error.message);
            return false;
        }
    }

    async executeGeminiTask(agentName, task) {
        const branch = task.branch || 'main';
        
        const command = `
            docker exec ${agentName} bash -c "
                cd /workspace &&
                git checkout -b '${branch}' 2>/dev/null || git checkout '${branch}' &&
                echo 'Executing task: ${task.task}' &&
                gemini '${task.task}' &&
                git add . &&
                git commit -m 'feat: ${task.task}' || echo 'No changes to commit' &&
                git push origin '${branch}' || echo 'Failed to push'
            "
        `;

        this.log(`Executing Gemini task: ${command}`);
        execSync(command, { stdio: 'pipe' });
    }

    async executeCursorTask(agentName, task) {
        const command = `cursor mcp call ${agentName} "${task.task}"`;
        
        this.log(`Executing Cursor task: ${command}`);
        execSync(command, { stdio: 'pipe' });
    }

    completeTask(taskId, agentName) {
        const agent = this.agents.get(agentName);
        if (agent) {
            agent.status = 'idle';
            agent.currentTask = null;
            agent.tasksCompleted++;
            agent.lastActivity = new Date().toISOString();
        }

        this.activeTasks.delete(taskId);
        
        // Update task status in queue
        const task = this.taskQueue.tasks.find(t => t.id === taskId);
        if (task) {
            task.status = 'completed';
            task.completedAt = new Date().toISOString();
            task.completedBy = agentName;
        }

        this.saveTaskQueue();
        this.log(`Task ${taskId} completed by ${agentName}`);
    }

    failTask(taskId, error) {
        const activeTask = this.activeTasks.get(taskId);
        if (activeTask) {
            const agent = this.agents.get(activeTask.agent);
            if (agent) {
                agent.status = 'idle';
                agent.currentTask = null;
            }
        }

        this.activeTasks.delete(taskId);
        
        // Update task status in queue
        const task = this.taskQueue.tasks.find(t => t.id === taskId);
        if (task) {
            task.status = 'failed';
            task.failedAt = new Date().toISOString();
            task.error = error;
        }

        this.saveTaskQueue();
        this.log(`Task ${taskId} failed: ${error}`);
    }

    async processPendingTasks() {
        const pendingTasks = this.taskQueue.tasks.filter(task => task.status === 'pending');
        
        for (const task of pendingTasks) {
            const bestAgent = this.selectBestAgent(task);
            
            if (bestAgent) {
                task.status = 'in-progress';
                task.assignedTo = bestAgent;
                task.startedAt = new Date().toISOString();
                
                this.saveTaskQueue();
                
                // Execute task asynchronously
                this.executeTask(bestAgent, task)
                    .catch(error => {
                        this.log(`Failed to execute task ${task.id}: ${error.message}`);
                    });
            } else {
                this.log(`No available agent for task ${task.id}`);
            }
        }
    }

    startTaskProcessor() {
        this.log('Starting task processor...');
        
        // Process tasks every 30 seconds
        setInterval(() => {
            this.processPendingTasks();
        }, 30000);

        // Health check every 5 minutes
        setInterval(() => {
            this.checkAgentHealth();
        }, 300000);

        // Status report every 10 minutes
        setInterval(() => {
            this.generateStatusReport();
        }, 600000);

        // Initial processing
        this.processPendingTasks();
    }

    generateStatusReport() {
        const report = {
            timestamp: new Date().toISOString(),
            agents: Object.fromEntries(this.agents),
            activeTasks: Object.fromEntries(this.activeTasks),
            taskQueue: {
                total: this.taskQueue.tasks.length,
                pending: this.taskQueue.tasks.filter(t => t.status === 'pending').length,
                inProgress: this.taskQueue.tasks.filter(t => t.status === 'in-progress').length,
                completed: this.taskQueue.tasks.filter(t => t.status === 'completed').length,
                failed: this.taskQueue.tasks.filter(t => t.status === 'failed').length
            }
        };

        this.log('Status Report: ' + JSON.stringify(report, null, 2));
    }

    addTask(task) {
        const newTask = {
            id: task.id || `task-${Date.now()}`,
            task: task.task,
            priority: task.priority || 'medium',
            status: 'pending',
            createdAt: new Date().toISOString(),
            branch: task.branch,
            ...task
        };

        this.taskQueue.tasks.push(newTask);
        this.saveTaskQueue();
        this.log(`Added new task: ${newTask.id}`);
    }
}

// Initialize and start task manager
const taskManager = new TaskManager();

// Handle graceful shutdown
process.on('SIGINT', () => {
    taskManager.log('Shutting down task manager...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    taskManager.log('Shutting down task manager...');
    process.exit(0);
});

// Export for use in other modules
module.exports = TaskManager;