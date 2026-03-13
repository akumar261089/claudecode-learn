# Claude CLI Learning Project

A comprehensive, hands-on learning project for mastering Claude CLI features.

## Overview

This project provides interactive exercises for learning:
- **Custom Commands** (Slash Commands)
- **Skills**
- **Agents**
- **MCP Tools**
- **Hooks**
- **Configuration**
- **Integration Workflows**

The project includes both a web-based curriculum interface and hands-on exercises.

## Quick Start

### Prerequisites

- Node.js 18+ installed
- Claude Code CLI installed: `npm install -g @anthropic-ai/claude-code`
- Anthropic API key set as environment variable

### Web Application

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

### Exercises

1. **Explore the modules** in order (1-7)
2. **Read the README** in each exercise directory
3. **Try the examples** and challenges
4. **Check solutions** when needed

## Project Structure

```
├── README.md                 # This file
├── CLAUDE.md                 # Claude Code guidance for contributors
├── package.json              # Web app dependencies and scripts
├── vite.config.js            # Vite configuration
├── index.html                # Entry HTML file
├── src/                      # Web application source
│   ├── App.jsx               # Main curriculum interface
│   ├── main.jsx              # Application entry
│   └── data/                 # Curriculum data
├── exercises/                # Learning modules
│   ├── 01-custom-commands/   # Slash commands
│   ├── 02-skills/            # JavaScript skills
│   ├── 03-agents/            # AI agents
│   ├── 04-mcp-tools/         # MCP and custom tools
│   ├── 05-hooks/             # Lifecycle hooks
│   ├── 06-config/            # Configuration
│   └── 07-integration/       # Integration project
└── .github/workflows/        # CI/CD workflows
```

## Learning Path

### Module 1: Custom Commands
Learn to create reusable `/command` invocations.

**Try:** `/hello`, `/count`, `/weather London`

**Location:** `exercises/01-custom-commands/`

### Module 2: Skills
Build JavaScript skills for complex tasks.

**Try:** `/todo add "Learn skills"`, `/commit`, `/refactor patterns`

**Location:** `exercises/02-skills/`

### Module 3: Agents
Create specialized AI assistants.

**Try:** `@code-reviewer review src/app.js`, `@doc-writer generate README`

**Location:** `exercises/03-agents/`

### Module 4: MCP Tools
Set up MCP servers and create custom tools.

**Try:** File Analyzer, Mock API server

**Location:** `exercises/04-mcp-tools/`

### Module 5: Hooks
Customize workflow with lifecycle hooks.

**Try:** Pre/post command hooks, user prompt validation

**Location:** `exercises/05-hooks/`

### Module 6: Configuration
Master settings and context files.

**Try:** Edit `.claude/settings.json`, view `.claude/context.md`

**Location:** `exercises/06-config/`

### Module 7: Integration
Build complete workflows combining all features.

**Try:** `node src/app.js init`, `/deploy --env=production`

**Location:** `exercises/07-integration/`

## Development

### Local Development

```bash
# Clone the repository
git clone https://github.com/akumar261089/claudecode-learn.git
cd claudecode-learn

# Install dependencies
npm install

# Start development server (opens at http://localhost:5173)
npm run dev
```

### Building

```bash
# Create production build in dist/
npm run build

# Preview the production build locally
npm run preview
```

### Deployment

The web application automatically deploys to GitHub Pages on every push to the `main` branch via GitHub Actions (`.github/workflows/deploy.yml`).

**Live Site:** https://akumar261089.github.io/claudecode-learn/

The workflow will:
1. Install Node.js 20 and dependencies
2. Build the Vite app
3. Deploy the `dist/` folder to GitHub Pages

## Key Features Demonstrated

| Feature | Location | Example |
|---------|----------|---------|
| Commands | `exercises/01/` | `/hello`, `/count` |
| Skills | `exercises/02/` | `/todo`, `/commit` |
| Agents | `exercises/03/` | `@code-reviewer` |
| MCP Tools | `exercises/04/` | File Analyzer |
| Hooks | `exercises/05/` | Pre/post hooks |
| Config | `exercises/06/` | `settings.json` |
| Integration | `exercises/07/` | Deploy workflow |

## Verification Commands

Test each module:

```bash
# Module 1 - Commands
ls exercises/01-custom-commands/.claude/commands/

# Module 2 - Skills
ls exercises/02-skills/.claude/skills/

# Module 3 - Agents
ls exercises/03-agents/.claude/agents/

# Module 4 - Tools
node exercises/04-mcp-tools/src/tools/file-analyzer.js --path README.md

# Module 5 - Hooks
ls exercises/05-hooks/.claude/hooks/

# Module 6 - Config
cat exercises/06-config/.claude/settings.json

# Module 7 - Integration
node exercises/07-integration/src/app.js features
```

## Contributing

See [CLAUDE.md](./CLAUDE.md) for detailed guidance on:
- Project architecture and patterns
- How to add new exercises
- Build and deployment configuration
- Claude CLI configuration patterns

## Resources

- [Claude CLI Documentation](https://docs.anthropic.com/claude-cli)
- [MCP Specification](https://modelcontextprotocol.io)
- [Anthropic Cookbook](https://github.com/anthropics/anthropic-cookbook)

## License

MIT - For educational purposes
