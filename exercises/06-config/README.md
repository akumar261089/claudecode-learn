# Module 6: Configuration & Settings

This module teaches you how to configure Claude CLI using settings files.

## Overview

The `.claude/settings.json` file controls Claude CLI behavior, from model selection to feature flags.

## Exercises

### Exercise 1: Settings Configuration
**File:** `.claude/settings.json`

A comprehensive settings file demonstrating:
- Model configuration (claude-sonnet-4-6)
- Editor preferences (line numbers, tab size)
- Command behavior (auto-confirm, tool display)
- Agent settings (max concurrent, timeout)
- MCP server configuration
- Hook configuration
- Logging settings
- Custom shortcuts
- Auto-loaded context files

### Exercise 2: Context File
**File:** `.claude/context.md`

An auto-loaded context file that:
- Provides project overview
- Lists available commands/skills/agents
- Documents project structure
- Outlines learning path
- Lists resources

## Key Concepts

1. **Settings Hierarchy**:
   - Global: `~/.claude/settings.json`
   - Project: `./.claude/settings.json`
   - Project settings override global

2. **Configuration Sections**:
   - `claude`: Model and generation settings
   - `editor`: Code editing preferences
   - `commands`: Command behavior
   - `agents`: Agent-specific settings
   - `skills`: Skill loading and display
   - `mcp`: MCP server configuration
   - `hooks`: Hook enablement and paths
   - `logging`: Log levels and files
   - `shortcuts`: Custom command shortcuts
   - `context`: Auto-loaded context

3. **Environment Variables**:
   - Use `${env.VAR_NAME}` syntax
   - For secrets like API keys
   - Keeps sensitive data out of config

## Challenge

Create environment-specific configurations:

1. **Development** (`.claude/settings.development.json`)
2. **Production** (`.claude/settings.production.json`)

**Solution:** See `solutions/` directory

## Resources

- [Claude CLI Configuration](https://docs.anthropic.com/claude-cli/configuration)
