// Zeus Office - Agent Workforce Management

const AGENTS = [
    { name: 'ATHENA', symbol: '⚔️', role: 'Architect & Strategist', personality: 'Calm, methodical' },
    { name: 'ANALYST', symbol: '📊', role: 'Data Analyst', personality: 'Sharp, data-driven' },
    { name: 'DEVELOPER', symbol: '💻', role: 'Developer', personality: 'Hands-on, pragmatic' },
    { name: 'HEPHAESTUS', symbol: '⚒️', role: 'Builder & Engineer', personality: 'Gruff, efficient' },
    { name: 'HERMES', symbol: '⚡', role: 'Connector', personality: 'Fast, witty' },
    { name: 'APOLLO', symbol: '🌟', role: 'Creative Designer', personality: 'Elegant, imaginative' },
    { name: 'ARES', symbol: '🛡️', role: 'Tester & Security', personality: 'Aggressive, paranoid' },
];

const AGENT_STATUS = {
    IDLE: 'idle',
    WORKING: 'working',
    COMPLETE: 'complete',
    ERROR: 'error',
};

let agentStates = {};
let currentProject = '';
let isRunning = false;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initAgents();
    startClock();
});

function initAgents() {
    AGENTS.forEach(agent => {
        agentStates[agent.name] = AGENT_STATUS.IDLE;
    });
}

function startClock() {
    setInterval(() => {
        const now = new Date();
        const time = now.toLocaleTimeString('en-US', { hour12: false });
        document.getElementById('officeClock').textContent = time;
    }, 1000);
}

// Modal Functions
function openTaskModal() {
    document.getElementById('taskModal').classList.remove('hidden');
}

function closeTaskModal() {
    document.getElementById('taskModal').classList.add('hidden');
    document.getElementById('projectGoal').value = '';
}

// Project Assignment
function assignProject() {
    const goal = document.getElementById('projectGoal').value.trim();
    if (!goal) {
        alert('Please enter a project goal!');
        return;
    }
    
    currentProject = goal;
    document.getElementById('currentProject').querySelector('.project-name').textContent = goal;
    closeTaskModal();
    
    addActivity('🏢', `New project assigned: "${goal}"`);
    executeProject(goal);
}

async function executeProject(goal) {
    if (isRunning) return;
    isRunning = true;
    
    // Generate tasks based on goal
    const tasks = generateTasks(goal);
    
    // Reset all agents
    AGENTS.forEach(agent => {
        updateAgentStatus(agent.name, AGENT_STATUS.IDLE);
    });
    
    // Execute tasks in sequence
    for (const task of tasks) {
        const agent = task.agent;
        
        // Show task bubble
        showTaskBubble(agent, task.description);
        
        // Update status to working
        updateAgentStatus(agent, AGENT_STATUS.WORKING);
        addActivity(agent, `Starting: ${task.description}`);
        
        // Simulate work (random duration between 1-3 seconds)
        await sleep(1500 + Math.random() * 1500);
        
        // Update status to complete
        updateAgentStatus(agent, AGENT_STATUS.COMPLETE);
        addActivity(agent, `Completed: ${task.description}`);
        
        // Hide task bubble
        hideTaskBubble(agent);
    }
    
    addActivity('🏢', `Project complete! All agents finished.`);
    isRunning = false;
}

function generateTasks(goal) {
    const goalLower = goal.toLowerCase();
    const tasks = [];
    
    // Always start with Athena (planning)
    tasks.push({ agent: 'ATHENA', description: 'Analyzing requirements & creating project plan' });
    
    // Add Analyst for data/market/analytics
    if (goalLower.includes('data') || goalLower.includes('market') || goalLower.includes('analytics')) {
        tasks.push({ agent: 'ANALYST', description: 'Researching market data & creating projections' });
    }
    
    // Add Developer/ Hephaestus for building
    if (goalLower.includes('build') || goalLower.includes('api') || goalLower.includes('backend')) {
        tasks.push({ agent: 'HEPHAESTUS', description: 'Building backend infrastructure' });
        tasks.push({ agent: 'DEVELOPER', description: 'Implementing core features' });
    }
    
    // Add Hermes for integration
    if (goalLower.includes('integrat') || goalLower.includes('connect') || goalLower.includes('api')) {
        tasks.push({ agent: 'HERMES', description: 'Integrating external services' });
    }
    
    // Add Apollo for design/UI
    if (goalLower.includes('ui') || goalLower.includes('design') || goalLower.includes('web') || goalLower.includes('dashboard')) {
        tasks.push({ agent: 'APOLLO', description: 'Designing user interface' });
    }
    
    // Always end with Ares (testing)
    tasks.push({ agent: 'ARES', description: 'Running tests & security audit' });
    
    return tasks;
}

// Status Updates
function updateAgentStatus(agentName, status) {
    agentStates[agentName] = status;
    
    const monitor = document.querySelector(`[data-agent="${agentName}"] .monitor`);
    const desk = document.querySelector(`[data-agent="${agentName}"]`);
    
    if (monitor && desk) {
        const statusEl = monitor.querySelector('.agent-status');
        statusEl.textContent = status.toUpperCase();
        statusEl.className = `agent-status ${status}`;
        
        // Update desk styling
        desk.classList.remove('working', 'complete');
        if (status === AGENT_STATUS.WORKING) {
            desk.classList.add('working');
        } else if (status === AGENT_STATUS.COMPLETE) {
            desk.classList.add('complete');
        }
    }
}

function showTaskBubble(agentName, task) {
    const bubble = document.getElementById(`task-${agentName}`);
    if (bubble) {
        bubble.textContent = task;
        bubble.classList.remove('hidden');
    }
}

function hideTaskBubble(agentName) {
    const bubble = document.getElementById(`task-${agentName}`);
    if (bubble) {
        bubble.classList.add('hidden');
    }
}

// Activity Feed
function addActivity(agent, message) {
    const feed = document.getElementById('activityFeed');
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { hour12: false });
    
    const agentInfo = AGENTS.find(a => a.name === agent) || { symbol: '🏢' };
    const symbol = agent === '🏢' ? '🏢' : agentInfo.symbol;
    
    const item = document.createElement('div');
    item.className = 'activity-item';
    item.innerHTML = `
        <span class="time">${time}</span>
        <span class="msg">${symbol} ${message}</span>
    `;
    
    feed.appendChild(item);
    feed.scrollTop = feed.scrollHeight;
}

// Utility
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Make functions global
window.openTaskModal = openTaskModal;
window.closeTaskModal = closeTaskModal;
window.assignProject = assignProject;
