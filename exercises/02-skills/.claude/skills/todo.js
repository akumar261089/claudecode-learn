#!/usr/bin/env node
/**
 * Todo Skill - Task Management for Claude CLI
 *
 * Commands:
 *   /todo add "Task description" - Add a new task
 *   /todo list - List all tasks
 *   /todo done <id> - Mark task as complete
 *   /todo delete <id> - Delete a task
 *   /todo clear - Clear all completed tasks
 */

const fs = require('fs');
const path = require('path');

const TODO_FILE = '.claude/todos.json';

function loadTodos() {
  try {
    if (fs.existsSync(TODO_FILE)) {
      return JSON.parse(fs.readFileSync(TODO_FILE, 'utf8'));
    }
  } catch (e) {
    console.error('Error loading todos:', e.message);
  }
  return { tasks: [], lastId: 0 };
}

function saveTodos(todos) {
  try {
    fs.mkdirSync(path.dirname(TODO_FILE), { recursive: true });
    fs.writeFileSync(TODO_FILE, JSON.stringify(todos, null, 2));
  } catch (e) {
    console.error('Error saving todos:', e.message);
  }
}

function addTask(description) {
  const todos = loadTodos();
  todos.lastId++;
  const task = {
    id: todos.lastId,
    description,
    createdAt: new Date().toISOString(),
    completed: false
  };
  todos.tasks.push(task);
  saveTodos(todos);
  console.log(`✅ Added task #${task.id}: ${description}`);
}

function listTasks() {
  const todos = loadTodos();
  if (todos.tasks.length === 0) {
    console.log('📋 No tasks found. Add one with /todo add "task"');
    return;
  }

  console.log('\n📋 Task List:\n');
  const pending = todos.tasks.filter(t => !t.completed);
  const completed = todos.tasks.filter(t => t.completed);

  if (pending.length > 0) {
    console.log('⏳ Pending:');
    pending.forEach(task => {
      console.log(`  [${task.id}] ${task.description}`);
    });
  }

  if (completed.length > 0) {
    console.log('\n✅ Completed:');
    completed.forEach(task => {
      console.log(`  [${task.id}] ~~${task.description}~~`);
    });
  }

  console.log(`\n📊 ${pending.length} pending, ${completed.length} completed`);
}

function completeTask(id) {
  const todos = loadTodos();
  const task = todos.tasks.find(t => t.id === parseInt(id));
  if (!task) {
    console.log(`❌ Task #${id} not found`);
    return;
  }
  task.completed = true;
  task.completedAt = new Date().toISOString();
  saveTodos(todos);
  console.log(`✅ Completed task #${id}: ${task.description}`);
}

function deleteTask(id) {
  const todos = loadTodos();
  const index = todos.tasks.findIndex(t => t.id === parseInt(id));
  if (index === -1) {
    console.log(`❌ Task #${id} not found`);
    return;
  }
  const task = todos.tasks[index];
  todos.tasks.splice(index, 1);
  saveTodos(todos);
  console.log(`🗑️  Deleted task #${id}: ${task.description}`);
}

function clearCompleted() {
  const todos = loadTodos();
  const completedCount = todos.tasks.filter(t => t.completed).length;
  todos.tasks = todos.tasks.filter(t => !t.completed);
  saveTodos(todos);
  console.log(`🧹 Cleared ${completedCount} completed tasks`);
}

// Main execution
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case 'add':
    if (!args[1]) {
      console.log('Usage: /todo add "task description"');
      process.exit(1);
    }
    addTask(args.slice(1).join(' '));
    break;

  case 'list':
    listTasks();
    break;

  case 'done':
    if (!args[1]) {
      console.log('Usage: /todo done <id>');
      process.exit(1);
    }
    completeTask(args[1]);
    break;

  case 'delete':
    if (!args[1]) {
      console.log('Usage: /todo delete <id>');
      process.exit(1);
    }
    deleteTask(args[1]);
    break;

  case 'clear':
    clearCompleted();
    break;

  default:
    console.log('Todo Skill - Available commands:');
    console.log('  /todo add "task"    - Add a new task');
    console.log('  /todo list          - List all tasks');
    console.log('  /todo done <id>     - Mark task complete');
    console.log('  /todo delete <id>   - Delete a task');
    console.log('  /todo clear         - Clear completed tasks');
}
