# Module 1: Custom Commands (Slash Commands)

This module teaches you how to create custom slash commands in Claude CLI.

## Overview

Custom commands allow you to define reusable prompts that can be invoked with a simple `/command-name` syntax.

## Exercises

### Exercise 1: Hello Command
**File:** `.claude/commands/hello.md`

Create a simple greeting command that:
- Accepts an optional name parameter
- Displays the current timestamp
- Shows a welcome message

**Try it:**
```
/hello
/hello Alice
```

### Exercise 2: Count Command
**File:** `.claude/commands/count.md`

Create a file counting command that:
- Counts files and directories
- Supports `--extensions` flag for breakdown
- Supports `--detailed` flag for file sizes

**Try it:**
```
/count
/count --extensions
/count --detailed
```

### Exercise 3: Weather Command
**File:** `.claude/commands/weather.md`

Create a mock weather command that demonstrates:
- Required positional parameters
- Optional named parameters
- Default values
- Conditional output

**Try it:**
```
/weather London
/weather Tokyo --units celsius --days 5
/weather "New York" --units fahrenheit
```

## Key Concepts

1. **Command Files**: Markdown files in `.claude/commands/` directory
2. **Parameters**: Commands can accept user input
3. **Documentation**: Commands should include usage examples
4. **Templating**: Commands can use dynamic content

## Challenge

Create a new command `/stats` that:
- Shows git repository statistics
- Displays lines of code by language
- Shows recent commit activity
- Supports `--author` filter

**Solution:** See `solutions/stats.md`

## Resources

- [Claude CLI Documentation](https://docs.anthropic.com/claude-cli)
- Command syntax reference in each command file
