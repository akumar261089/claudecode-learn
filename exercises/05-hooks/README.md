# Module 5: Hooks

This module teaches you how to create hooks in Claude CLI.

## Overview

Hooks are shell scripts that execute at specific points during Claude CLI operation, allowing you to customize behavior and add validations.

## Exercises

### Exercise 1: Pre-Command Hook
**File:** `.claude/hooks/pre-command.sh`

Executed before each command runs. Demonstrates:
- Logging command usage
- Accessing command environment variables
- Writing to log files
- Session tracking

**Try it:**
```bash
# The hook runs automatically before each command
# Check the log file after running commands:
cat ~/.claude/command-history.log
```

### Exercise 2: Post-Command Hook
**File:** `.claude/hooks/post-command.sh`

Executed after each command completes. Demonstrates:
- Calculating execution time
- Showing command summaries
- Performance warnings
- Exit code handling

**Try it:**
```bash
# The hook shows timing after each command
# Check the timing log:
cat ~/.claude/command-timing.log
```

### Exercise 3: User Prompt Hook
**File:** `.claude/hooks/user-prompt.sh`

Executed when the user submits a prompt. Demonstrates:
- Input validation
- Dangerous command detection
- Secret detection warnings
- Helpful suggestions

**Try it:**
```bash
# Try prompts with various content
# - Very long prompts (>10K chars)
# - Vague queries like "fix this"
# - Commands containing "rm -rf"
```

## Key Concepts

1. **Hook Types**:
   - `pre-command`: Before command execution
   - `post-command`: After command execution
   - `user-prompt`: When user submits input

2. **Environment Variables**:
   - `CLAUDE_COMMAND`: Command name
   - `CLAUDE_ARGS`: Command arguments
   - `CLAUDE_WORKDIR`: Working directory
   - `CLAUDE_START_TIME`: Start timestamp
   - `CLAUDE_EXIT_CODE`: Exit status
   - `CLAUDE_USER_PROMPT`: User input
   - `CLAUDE_PROMPT_LENGTH`: Input length

3. **Hook Behavior**:
   - Exit 0: Allow command to proceed
   - Exit non-0: Block command (user-prompt only)
   - Output to stdout: Visible to user
   - Output to stderr: Logged

4. **Best Practices**:
   - Keep hooks fast (don't slow down commands)
   - Use for validation/logging, not heavy processing
   - Handle missing environment variables gracefully
   - Make hooks portable (POSIX-compliant)

## Challenge

Create additional hooks:

1. **pre-file-edit**: Warn before editing sensitive files
2. **post-commit**: Send commit notifications
3. **pre-tool-use**: Validate tool parameters

**Solution:** See `solutions/` directory

## Resources

- [Claude CLI Hooks Documentation](https://docs.anthropic.com/claude-cli/hooks)
- Bash scripting best practices
- POSIX shell compatibility
