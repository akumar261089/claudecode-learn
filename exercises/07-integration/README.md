# Module 7: Integration Project

This module combines all previous modules into a complete workflow.

## Overview

Build a mini CLI application that demonstrates the integration of commands, skills, and agents.

## Project Structure

```
07-integration/
├── src/
│   └── app.js              # Main application
├── .claude/
│   ├── commands/
│   │   └── deploy.md       # Deployment command
│   └── skills/
│       ├── deploy-skill.json
│       └── deploy.js
└── README.md
```

## Exercises

### Exercise 1: Mini CLI App
**File:** `src/app.js`

A complete CLI application featuring:
- Project initialization (`init`)
- Status reporting (`status`)
- Deployment workflow (`deploy`)
- Feature showcase (`features`)
- Help system (`help`)

**Try it:**
```bash
cd exercises/07-integration

# Show help
node src/app.js help

# Initialize project
node src/app.js init

# Check status
node src/app.js status

# Deploy to development
node src/app.js deploy --env=development

# Simulate production deployment
node src/app.js deploy --env=production --dry-run

# Show features
node src/app.js features
```

### Exercise 2: Deploy Command
**File:** `.claude/commands/deploy.md`

A slash command definition for deployment:
- Documented usage
- Parameter examples
- Implementation guidance

### Exercise 3: Deploy Skill
**Files:** `.claude/skills/deploy-skill.json`, `.claude/skills/deploy.js`

A deployment skill that:
- Loads project configuration
- Runs pre-deploy checks
- Executes deployment steps
- Records deployment history
- Handles multiple environments

**Try it:**
```bash
/deploy --env=staging
/deploy --env=production --dry-run
```

## Key Concepts

1. **Application Architecture**:
   - Modular command structure
   - Configuration-driven behavior
   - Environment-specific settings

2. **Integration Patterns**:
   - Commands define user interface
   - Skills implement functionality
   - Agents provide expertise
   - Tools extend capabilities

3. **Best Practices**:
   - Separate concerns (UI, logic, config)
   - Use existing tools when available
   - Document everything
   - Handle errors gracefully

## Challenge

Extend the integration project:

1. **Add Health Check**:
   - Create `/health` command
   - Check project dependencies
   - Validate configuration

2. **Add Backup Skill**:
   - Create backup skill
   - Archive project files
   - Store with timestamps

3. **Add Release Agent**:
   - Create release agent
   - Generate changelogs
   - Create GitHub releases

**Solution:** See `solutions/` directory

## Resources

- [Claude CLI Integration Guide](https://docs.anthropic.com/claude-cli)
- Node.js CLI best practices
- Design patterns for CLI applications
