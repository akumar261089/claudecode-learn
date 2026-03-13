# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Claude CLI Learning Project** - a hands-on curriculum for mastering Claude Code features. It consists of:

1. **A React web application** (`src/`) that serves as an interactive curriculum interface, deployed to GitHub Pages
2. **Seven exercise modules** (`exercises/`) covering Claude CLI features: Custom Commands, Skills, Agents, MCP Tools, Hooks, Configuration, and Integration

## Build Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Deploy to GitHub Pages
npm run deploy
```

## Project Structure

### Web Application (`src/`)

- `App.jsx` - Main React component containing curriculum data and UI
- `main.jsx` - Application entry point
- `data/curriculum.js` - Curriculum content (imported by App.jsx)

The web app displays Claude CLI commands organized by category (Installation, Starting Sessions, Output & Automation, etc.).

### Exercise Modules (`exercises/`)

Each module is self-contained with its own `.claude/` configuration:

| Module | Path | Feature | Files |
|--------|------|---------|-------|
| 01 | `exercises/01-custom-commands/` | Slash Commands | `.claude/commands/*.md` |
| 02 | `exercises/02-skills/` | JavaScript Skills | `.claude/skills/*.{json,js}` |
| 03 | `exercises/03-agents/` | AI Agents | `.claude/agents/*.json` |
| 04 | `exercises/04-mcp-tools/` | MCP & Custom Tools | `src/tools/*.js`, `mcp-config.json` |
| 05 | `exercises/05-hooks/` | Lifecycle Hooks | `.claude/hooks/*.sh` |
| 06 | `exercises/06-config/` | Configuration | `.claude/settings.json`, `context.md` |
| 07 | `exercises/07-integration/` | Integration | Combined commands + skills |

## Claude CLI Configuration Patterns

### Custom Commands (Module 01)
Commands are Markdown files in `.claude/commands/`:
```markdown
---
name: command-name
description: What this command does
---

# Prompt template here...
```

### Skills (Module 02)
Skills require both JSON config and JS implementation:
- `.claude/skills/{name}.json` - Configuration (name, description, version, tools, entry_point)
- `.claude/skills/{name}.js` - Node.js executable implementing the skill

### Agents (Module 03)
Agents are JSON configuration files in `.claude/agents/`:
```json
{
  "name": "agent-name",
  "description": "Agent purpose",
  "model": "claude-sonnet-4-6",
  "system_prompt": "...",
  "tools": [...],
  "config": {...}
}
```

### MCP Tools (Module 04)
MCP configuration is in `mcp-config.json`:
```json
{
  "mcpServers": {
    "server-name": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "./path"]
    }
  }
}
```

### Hooks (Module 05)
Hooks are shell scripts in `.claude/hooks/`:
- `pre-command.sh` - Runs before each command
- `post-command.sh` - Runs after each command
- `user-prompt.sh` - Runs when user submits input

Hooks receive environment variables: `CLAUDE_COMMAND`, `CLAUDE_ARGS`, `CLAUDE_WORKDIR`, `CLAUDE_EXIT_CODE`, `CLAUDE_USER_PROMPT`, etc.

### Configuration (Module 06)
- `.claude/settings.json` - Repository-specific settings
- `.claude/context.md` - Context added to all conversations

## Deployment

The project uses **GitHub Pages** for hosting:

- **Source Branch**: `main` (deploys automatically on push via GitHub Actions)
- **Base URL**: `/claudecode-learn/` (configured in `vite.config.js`)
- **Workflow**: `.github/workflows/deploy.yml`
- **Homepage**: `https://akumar261089.github.io/claudecode-learn/`

The GitHub Actions workflow:
1. Triggers on pushes to `main` branch
2. Installs Node.js 20 and runs `npm ci`
3. Builds the app with `npm run build`
4. Deploys the `dist/` folder to GitHub Pages

**Note**: The old `jekyll-gh-pages.yml` and `static.yml` workflows (targeting `gh-pages` branch) are deprecated.

## Key Files

- `vite.config.js` - Vite config with React plugin and base URL
- `package.json` - Scripts and dependencies (React 18, Vite 5, gh-pages)
- `.github/workflows/jekyll-gh-pages.yml` - GitHub Pages deployment workflow
- `index.html` - Entry HTML file

## Development Notes

- The web app and exercises are independent; you can work on them separately
- Exercise modules don't require building - they're configuration examples
- When adding new exercises, follow the existing directory structure (`exercises/NN-name/` with `.claude/` subdirectory)
- Solutions go in `exercises/NN-name/solutions/`
- Each exercise module has its own README with usage instructions
