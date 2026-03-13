#!/usr/bin/env node
/**
 * Claude CLI Learning Project - Integration Demo
 *
 * A mini CLI app that demonstrates combining commands, skills, and agents.
 *
 * Usage:
 *   node app.js --help
 *   node app.js init
 *   node app.js status
 *   node app.js deploy --env=production
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PROJECT_CONFIG_FILE = '.claude-project.json';

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function print(message, color = '') {
  console.log(`${color}${message}${colors.reset}`);
}

function printHeader(title) {
  console.log('');
  console.log(`${colors.cyan}${'═'.repeat(50)}${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}  ${title}${colors.reset}`);
  console.log(`${colors.cyan}${'═'.repeat(50)}${colors.reset}`);
  console.log('');
}

function loadConfig() {
  try {
    if (fs.existsSync(PROJECT_CONFIG_FILE)) {
      return JSON.parse(fs.readFileSync(PROJECT_CONFIG_FILE, 'utf8'));
    }
  } catch (e) {
    console.error('Error loading config:', e.message);
  }
  return null;
}

function saveConfig(config) {
  fs.writeFileSync(PROJECT_CONFIG_FILE, JSON.stringify(config, null, 2));
}

function isGitRepo() {
  try {
    execSync('git rev-parse --git-dir', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

function getGitInfo() {
  try {
    const branch = execSync('git branch --show-current', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
    const lastCommit = execSync('git log -1 --format="%h %s"', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
    const status = execSync('git status --porcelain', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
    const remoteUrl = execSync('git remote get-url origin 2>/dev/null || echo "no remote"', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();

    return {
      branch,
      lastCommit,
      hasUncommitted: status.length > 0,
      uncommittedFiles: status.split('\n').filter(l => l).length,
      remoteUrl: remoteUrl === 'no remote' ? null : remoteUrl
    };
  } catch (e) {
    return null;
  }
}

function getProjectStats() {
  const stats = {
    files: { total: 0, byExtension: {} },
    lines: { code: 0, comment: 0, blank: 0 },
    lastModified: null
  };

  function scanDir(dir) {
    try {
      const items = fs.readdirSync(dir);
      for (const item of items) {
        if (item.startsWith('.') || item === 'node_modules') continue;

        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          scanDir(fullPath);
        } else if (stat.isFile()) {
          stats.files.total++;
          const ext = path.extname(item) || 'no-extension';
          stats.files.byExtension[ext] = (stats.files.byExtension[ext] || 0) + 1;

          // Get last modified
          if (!stats.lastModified || stat.mtime > stats.lastModified) {
            stats.lastModified = stat.mtime;
          }

          // Count lines
          try {
            const content = fs.readFileSync(fullPath, 'utf8');
            const lines = content.split('\n');
            lines.forEach(line => {
              const trimmed = line.trim();
              if (!trimmed) {
                stats.lines.blank++;
              } else if (trimmed.startsWith('//') || trimmed.startsWith('#') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
                stats.lines.comment++;
              } else {
                stats.lines.code++;
              }
            });
          } catch (e) {}
        }
      }
    } catch (e) {}
  }

  scanDir('.');
  return stats;
}

// Commands
const commands = {
  init: function() {
    printHeader('Initializing Claude CLI Project');

    if (fs.existsSync(PROJECT_CONFIG_FILE)) {
      print(`Project already initialized at ${PROJECT_CONFIG_FILE}`, colors.yellow);
      return;
    }

    const config = {
      name: path.basename(process.cwd()),
      version: '1.0.0',
      description: 'A Claude CLI project',
      created: new Date().toISOString(),
      features: {
        commands: true,
        skills: true,
        agents: true,
        hooks: true
      },
      environments: {
        development: { autoConfirm: true },
        staging: { autoConfirm: false },
        production: { autoConfirm: false }
      }
    };

    saveConfig(config);
    print(`✅ Created ${PROJECT_CONFIG_FILE}`, colors.green);
    print('');
    print('Project initialized successfully!', colors.green);
    print(`Name: ${config.name}`, colors.dim);
    print(`Version: ${config.version}`, colors.dim);
  },

  status: function() {
    printHeader('Project Status');

    const config = loadConfig();
    if (!config) {
      print('❌ Project not initialized. Run: node app.js init', colors.red);
      return;
    }

    // Project info
    print('📁 Project Info:', colors.bright);
    print(`   Name: ${config.name}`);
    print(`   Version: ${config.version}`);
    print(`   Description: ${config.description}`);
    print(`   Created: ${new Date(config.created).toLocaleDateString()}`);
    print('');

    // Git info
    if (isGitRepo()) {
      const gitInfo = getGitInfo();
      print('📦 Git Repository:', colors.bright);
      print(`   Branch: ${gitInfo.branch}`);
      print(`   Last Commit: ${gitInfo.lastCommit}`);
      print(`   Remote: ${gitInfo.remoteUrl || 'none'}`);
      if (gitInfo.hasUncommitted) {
        print(`   ⚠️  ${gitInfo.uncommittedFiles} uncommitted file(s)`, colors.yellow);
      } else {
        print('   ✅ All changes committed', colors.green);
      }
      print('');
    }

    // File stats
    const stats = getProjectStats();
    print('📊 Project Statistics:', colors.bright);
    print(`   Files: ${stats.files.total}`);
    print(`   Lines of Code: ${stats.lines.code.toLocaleString()}`);
    print(`   Comments: ${stats.lines.comment.toLocaleString()}`);
    print(`   Blank Lines: ${stats.lines.blank.toLocaleString()}`);
    print(`   Last Modified: ${stats.lastModified ? stats.lastModified.toLocaleString() : 'N/A'}`);

    // File breakdown
    const topExtensions = Object.entries(stats.files.byExtension)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    if (topExtensions.length > 0) {
      print('');
      print('   File Breakdown:', colors.dim);
      topExtensions.forEach(([ext, count]) => {
        print(`     ${ext}: ${count}`);
      });
    }

    // Features
    print('');
    print('🔧 Features:', colors.bright);
    Object.entries(config.features).forEach(([feature, enabled]) => {
      const status = enabled ? '✅' : '❌';
      print(`   ${status} ${feature}`);
    });
  },

  deploy: function(args) {
    printHeader('Deploy Project');

    const config = loadConfig();
    if (!config) {
      print('❌ Project not initialized. Run: node app.js init', colors.red);
      return;
    }

    const envFlag = args.find(a => a.startsWith('--env='));
    const environment = envFlag ? envFlag.split('=')[1] : 'development';

    // Check if valid environment
    if (!config.environments[environment]) {
      print(`❌ Unknown environment: ${environment}`, colors.red);
      print(`Available: ${Object.keys(config.environments).join(', ')}`, colors.dim);
      return;
    }

    // Pre-deploy checks
    print('🔍 Running pre-deploy checks...', colors.bright);

    // Check git status
    if (isGitRepo()) {
      const gitInfo = getGitInfo();
      if (gitInfo.hasUncommitted) {
        print('   ❌ Uncommitted changes detected', colors.red);
        if (!config.environments[environment].autoConfirm) {
          print('   Deployment blocked. Commit changes first.', colors.red);
          return;
        }
        print('   ⚠️  Proceeding with uncommitted changes (autoConfirm enabled)', colors.yellow);
      } else {
        print('   ✅ No uncommitted changes', colors.green);
      }
    }

    // Simulate deployment
    print('');
    print(`🚀 Deploying to ${environment.toUpperCase()}...`, colors.bright);
    print(`   Environment config:`, colors.dim);
    print(`     autoConfirm: ${config.environments[environment].autoConfirm}`);

    // Deployment steps
    const steps = [
      'Building assets...',
      'Running tests...',
      'Packing distribution...',
      'Uploading to server...',
      'Verifying deployment...'
    ];

    steps.forEach((step, i) => {
      print(`   ${i + 1}/${steps.length} ${step}`);
      // Simulate work
      const start = Date.now();
      while (Date.now() - start < 500) {} // Block for 500ms
    });

    print('');
    print(`✅ Deployment to ${environment.toUpperCase()} complete!`, colors.green);
    print(`   Deployed at: ${new Date().toISOString()}`);
    print(`   Version: ${config.version}`);
  },

  features: function() {
    printHeader('Claude CLI Features Demo');

    print('This project demonstrates Claude CLI features:', colors.bright);
    print('');

    print('1️⃣  Custom Commands', colors.cyan);
    print('   Defined in .claude/commands/');
    print('   Try: /hello, /count, /weather');
    print('');

    print('2️⃣  Skills', colors.cyan);
    print('   JavaScript modules for reusable functionality');
    print('   Try: /todo, /commit, /refactor');
    print('');

    print('3️⃣  Agents', colors.cyan);
    print('   Specialized AI assistants');
    print('   Try: @code-reviewer, @doc-writer, @test-generator');
    print('');

    print('4️⃣  MCP Tools', colors.cyan);
    print('   External tool integration');
    print('   Try: File Analyzer, Mock API');
    print('');

    print('5️⃣  Hooks', colors.cyan);
    print('   Lifecycle event handlers');
    print('   Pre/post command hooks');
    print('');

    print('6️⃣  Configuration', colors.cyan);
    print('   Settings in .claude/settings.json');
    print('   Auto-loaded context in .claude/context.md');
    print('');

    print('🔗 Run "node app.js --help" for more commands', colors.dim);
  },

  help: function() {
    printHeader('Claude CLI Project - Help');

    print('Usage: node app.js <command> [options]\n', colors.bright);

    print('Commands:', colors.bright);
    print('  init                    Initialize a new project');
    print('  status                  Show project status');
    print('  deploy --env=<env>    Deploy to environment');
    print('  features                Show feature overview');
    print('  help                    Show this help message');
    print('');

    print('Options:', colors.bright);
    print('  --env=<environment>    Target environment (development, staging, production)');
    print('  --dry-run              Simulate without making changes');
    print('');

    print('Examples:', colors.bright);
    print('  node app.js init');
    print('  node app.js status');
    print('  node app.js deploy --env=production');
  }
};

// Main
function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'help';

  if (commands[command]) {
    commands[command](args.slice(1));
  } else {
    print(`Unknown command: ${command}`, colors.red);
    print('Run "node app.js help" for usage', colors.dim);
    process.exit(1);
  }
}

main();
