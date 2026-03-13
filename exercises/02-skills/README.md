# Module 2: Skills

This module teaches you how to create custom skills in Claude CLI.

## Overview

Skills are JavaScript-based extensions that can perform complex tasks, interact with files, and provide reusable functionality.

## Exercises

### Exercise 1: Todo Skill
**Files:** `.claude/skills/todo.json`, `.claude/skills/todo.js`

A task management skill that demonstrates:
- JSON configuration files
- JavaScript skill implementation
- File I/O operations
- Command argument parsing
- State persistence

**Try it:**
```
/todo add "Learn about Claude CLI skills"
/todo list
/todo done 1
/todo delete 1
/todo clear
```

### Exercise 2: Commit Skill
**Files:** `.claude/skills/commit.json`, `.claude/skills/commit.js`

A commit message generator that demonstrates:
- Git integration
- Analyzing code changes
- Generating suggestions
- Conventional commit format

**Try it:**
```
# Stage some changes first
git add .

/commit
/commit suggest
/commit --type=feat
```

### Exercise 3: Refactor Skill
**Files:** `.claude/skills/refactor.json`, `.claude/skills/refactor.js`

A code refactoring assistant that demonstrates:
- Code analysis
- Pattern matching
- Providing actionable suggestions
- File inspection

**Try it:**
```
/refactor patterns
/refactor analyze src/app.js
/refactor extract-function app.js 10 20 calculateTotal
```

## Key Concepts

1. **Skill Configuration** (`*.json`):
   - `name`: Unique identifier
   - `description`: What the skill does
   - `version`: Semantic version
   - `tools`: Available Claude tools
   - `entry_point`: JavaScript file to execute

2. **Skill Implementation** (`*.js`):
   - Node.js executable script
   - Parse command line arguments
   - Interact with files/system
   - Output formatted results

3. **Skill Commands**:
   - Register skills automatically
   - Invoke with `/skill-name`
   - Pass arguments after command

## Challenge

Create a `lint` skill that:
- Analyzes JavaScript/TypeScript files
- Checks for style violations
- Suggests fixes
- Supports custom rules
- Generates a report

**Solution:** See `solutions/lint/` directory

## Resources

- [Claude CLI Skills Documentation](https://docs.anthropic.com/claude-cli/skills)
- Node.js `fs` module for file operations
- `child_process` for running shell commands
