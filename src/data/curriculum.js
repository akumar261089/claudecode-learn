// ────────────────────────────────────────────────────────────────────────────
// VERIFIED & EXPANDED — All content cross-checked against official Claude Code
// docs and ecosystem coverage as of March 2026 (v2.1.72)
//
// MAJOR CHANGES FROM v1:
//  • Module 4: Corrected CLI flags (-f removed, -c/--continue added, -p clarified)
//  • Module 7: Split into two modules — Hooks/MCP stay, NEW Module 7a = Skills
//  • NEW Module: Subagents (was conflated with MCP in old version)
//  • NEW Module: Plugins & the Skill Ecosystem
//  • NEW Module: Agent Teams (launched Feb 2026 with Opus 4.6)
//  • Exercises: All 7 exercises corrected with real file paths and frontmatter
//  • NEW Exercise: Agent Teams
//  • Updated all /status → /context references
//  • Fixed Exercise 3: subagent files are .md with YAML frontmatter, not .json
// ────────────────────────────────────────────────────────────────────────────

export const curriculum = [
  {
    module: "Module 1",
    title: "Introduction to Claude Code",
    color: "#FF6B35",
    icon: "⚡",
    duration: "~2 hours",
    topics: [
      {
        title: "What is Claude Code?",
        subtopics: [
          "Overview: AI-powered agentic coding assistant by Anthropic (launched Feb 2025)",
          "How Claude Code differs from autocomplete tools (GitHub Copilot, Cursor, Codeium)",
          "The agentic paradigm — autonomous multi-step task execution across files",
          "Core philosophy: working directly in your terminal with full filesystem access",
          "Supported use cases: debugging, refactoring, writing, CI/CD, documentation",
          "Who benefits most: solo devs, teams, DevOps, and enterprise engineering orgs",
          "Growth in 2025–2026: ~4% of all public GitHub commits attributed to Claude Code",
        ],
      },
      {
        title: "Architecture & How It Works",
        subtopics: [
          "CLI-based interface — why terminal-first is the right abstraction for code",
          "How Claude Code reads and traverses your codebase (directory scan + CLAUDE.md)",
          "Context window management, file selection, and token budgeting",
          "The core loop: Understand → Plan → Act → Verify",
          "Integration with shell, git, MCP servers, and the file system",
          "How tool calling works under the hood (structured JSON schemas)",
          "The five core systems: configuration, permissions, hooks, MCP, subagents",
        ],
      },
      {
        title: "System Requirements & Compatibility",
        subtopics: [
          "Node.js version requirements (Node 18+)",
          "Operating system support: macOS, Linux, Windows (WSL)",
          "Terminal emulator recommendations for best experience",
          "Network requirements, API access, and proxy configuration",
          "Hardware considerations for large codebases",
          "Authentication: ANTHROPIC_API_KEY env var OR `claude auth login` (v2.1.41+)",
        ],
      },
      {
        title: "Key Terminology & Concepts",
        subtopics: [
          "What is an 'agent' vs an 'assistant'? — autonomy, tool calls, verification loops",
          "Tools and tool calls explained: Read, Write, Bash, Glob, Grep, Task",
          "What is a 'context window' and why it determines quality",
          "Understanding tokens and API cost tiers (Haiku vs Sonnet vs Opus pricing)",
          "The 7 extensibility primitives: CLAUDE.md, Commands, Skills, Subagents, MCP, Hooks, Plugins",
        ],
      },
    ],
  },
  {
    module: "Module 2",
    title: "Installation & Setup",
    color: "#4ECDC4",
    icon: "🔧",
    duration: "~1.5 hours",
    topics: [
      {
        title: "Installing Claude Code",
        subtopics: [
          "Installing via npm: `npm install -g @anthropic-ai/claude-code` (requires Node 18+)",
          "Verifying installation: `claude --version` and `claude doctor`",
          "Updating to the latest version: `claude update` (in-tool) or `npm update -g @anthropic-ai/claude-code`",
          "Uninstalling and reinstalling cleanly",
          "Troubleshooting common install errors (EACCES, PATH issues, Node version mismatch)",
          "Installing behind a corporate proxy",
        ],
      },
      {
        title: "Authentication & API Keys",
        subtopics: [
          "Method 1: `claude auth login` — browser-based login (v2.1.41+), recommended",
          "Method 2: `export ANTHROPIC_API_KEY=sk-ant-xxxx` — env var method",
          "Claude.ai Pro/Max plan: no separate API key needed, billed through subscription",
          "Using .env files for project-level keys",
          "Key rotation and security best practices",
          "Using different keys for dev vs production (org API keys vs personal)",
        ],
      },
      {
        title: "First Run & Configuration",
        subtopics: [
          "Running `claude` for the first time — interactive onboarding",
          "Understanding the full directory structure: ~/.claude/ (global) and .claude/ (project)",
          "Using `/init` to auto-generate a starter CLAUDE.md for your project",
          "Project-level vs global configuration hierarchy",
          "Setting default behaviors in .claude/settings.json",
          "Running `claude doctor` to diagnose configuration issues",
        ],
      },
      {
        title: "Full Directory Structure After Install",
        subtopics: [
          "~/.claude/ — global config: CLAUDE.md, settings.json, agents/, commands/, skills/",
          ".claude/ — project config: same structure, takes precedence over global",
          ".claude/commands/ — custom slash commands (user-triggered)",
          ".claude/skills/ — agent skills (auto-invoked or slash-invoked)",
          ".claude/agents/ — subagent definitions with YAML frontmatter",
          ".claude/settings.json — permissions, model, hooks, MCP server config",
          ".claudeignore — file exclusion patterns (same syntax as .gitignore)",
          ".mcp.json — MCP server config (alternative to settings.json for MCP)",
        ],
      },
    ],
  },
  {
    module: "Module 3",
    title: "Core Features & Capabilities",
    color: "#A855F7",
    icon: "🚀",
    duration: "~4 hours",
    topics: [
      {
        title: "Interactive Chat Mode",
        subtopics: [
          "Starting a fresh session: `claude`",
          "Continuing the most recent session: `claude -c` (short for --continue)",
          "Picking a past session to resume: `claude --resume` / `claude -r`",
          "Asking questions about your codebase in natural language",
          "Multi-turn conversations with persistent context across turns",
          "Naming sessions with /rename for easy future retrieval",
        ],
      },
      {
        title: "File Operations",
        subtopics: [
          "Reading and analyzing existing files (Read, Glob, Grep tools)",
          "Creating new files from descriptions",
          "Editing files with targeted, diff-based changes",
          "Previewing changes with /diff before committing",
          "Batch file operations across directories",
          "Rolling back incorrect edits using git",
        ],
      },
      {
        title: "Code Understanding & Navigation",
        subtopics: [
          "Explaining unfamiliar codebases from first principles",
          "Finding functions, classes, and usage patterns with Grep/Glob",
          "Dependency analysis and import tracing",
          "Identifying code smells, anti-patterns, and tech debt",
          "Generating architecture diagrams in Mermaid or text format",
          "Understanding third-party library usage in your codebase",
        ],
      },
      {
        title: "Bash & Shell Execution",
        subtopics: [
          "Running shell commands through Claude Code (Bash tool)",
          "Build scripts, test runners, linters, formatters",
          "Package manager operations (npm, pip, cargo, brew, etc.)",
          "Scoping Bash with `--allowedTools \"Bash(git *)\"` for safety",
          "Piping stdout back to Claude for analysis and iteration",
          "Using --sandbox flag for isolated, safe execution",
        ],
      },
      {
        title: "Git Integration",
        subtopics: [
          "Analyzing git history, blame, and diff",
          "Generating commit messages: `claude -p \"write a commit message for: $(git diff --staged)\"`",
          "Creating branch names and pull request descriptions from diffs",
          "Resolving merge conflicts with AI understanding of code intent",
          "Reviewing all changes made this session with /diff",
          "Generating changelogs from `git log` output",
        ],
      },
      {
        title: "Web Search & External Data",
        subtopics: [
          "Using the web search tool to look up documentation in real time",
          "Fetching API specs and library changelogs",
          "Looking up error messages and StackOverflow solutions",
          "Combining web data with your local codebase in a single session",
          "Fetching URLs directly with the WebFetch tool in slash commands",
        ],
      },
    ],
  },
  {
    module: "Module 4",
    title: "Claude Code CLI Deep Dive",
    color: "#22C55E",
    icon: "💻",
    duration: "~3 hours",
    topics: [
      {
        title: "CLI Modes of Operation",
        subtopics: [
          "Interactive REPL mode: `claude`",
          "Continue most recent session: `claude -c` or `claude --continue`",
          "Resume any session by picker or ID: `claude --resume` / `claude -r <id>`",
          "One-shot non-interactive mode: `claude -p \"task\"` (alias: --print)",
          "Piping stdin into Claude: `cat error.log | claude -p \"explain this\"`",
          "When to use interactive vs headless (-p) mode",
        ],
      },
      {
        title: "Key CLI Flags Reference",
        subtopics: [
          "`-p` / `--print` — non-interactive output, ideal for scripts and CI",
          "`-c` / `--continue` — resume most recent session",
          "`-r` / `--resume [id]` — session picker or resume by ID",
          "`--model` — specify model (claude-sonnet-4-6, claude-opus-4-6, claude-haiku-4-5)",
          "`--allowedTools \"Read,Write,Bash(git *)\"` — whitelist tools (capitalized names)",
          "`--disallowedTools \"Bash\"` — blacklist tools",
          "`--output-format json` — structured JSON output for scripting",
          "`--sandbox` — isolated execution, no real filesystem writes",
          "`--max-turns N` — cap agentic steps (essential for CI loops)",
          "`--dangerously-skip-permissions` — skip prompts (trusted CI only)",
          "`--system-prompt` and `--append-system-prompt` — custom system prompts",
        ],
      },
      {
        title: "Context Loading & File Scope",
        subtopics: [
          "How Claude Code scans and understands repositories on session start",
          "Directory traversal and dependency discovery heuristics",
          "Excluding files and directories via .claudeignore",
          "Manually scoping context with explicit file paths in prompts",
          "Handling large monorepos: partition by subdirectory CLAUDE.md files",
          "MCP Tool Search: lazy loading MCPs reduces context by up to 95%",
        ],
      },
      {
        title: "Automation & Scripting",
        subtopics: [
          "Using `claude -p` inside shell scripts for automation",
          "Capping agentic turns with `--max-turns` in CI environments",
          "Capturing session output with `tee` and shell redirection",
          "Using `--output-format json` for machine-readable logs",
          "Building nightly automation tasks (dependency updates, changelogs)",
          "Using `--dangerously-skip-permissions` safely — containers only",
        ],
      },
      {
        title: "In-Session Slash Commands Reference",
        subtopics: [
          "`/help` — show all built-in and custom commands",
          "`/clear` — wipe context, start fresh on a new task",
          "`/compact [focus instructions]` — compress history, free context window",
          "`/context` — check how full the context window is (replaces /status)",
          "`/cost` — show token usage and session cost",
          "`/model` — switch model mid-session without restarting",
          "`/diff` — show all changes Claude made this session",
          "`/rename <name>` — name this session for easy future --resume",
          "`/agents` — view, create, and manage subagents",
          "`/hooks` — interactively configure hooks",
          "`/init` — generate a CLAUDE.md for the current project",
          "`/batch <instruction>` — orchestrate large-scale parallel changes",
          "`/simplify` — run parallel review agents and apply cleanup",
        ],
      },
    ],
  },
  {
    module: "Module 5",
    title: "IDE Extensions & Editor Integration",
    color: "#3B82F6",
    icon: "🧠",
    duration: "~2 hours",
    topics: [
      {
        title: "Supported IDE Integrations",
        subtopics: [
          "Visual Studio Code — official extension with inline suggestions",
          "JetBrains IDEs (IntelliJ, PyCharm, WebStorm) — plugin support",
          "Neovim — claude-code.nvim for seamless terminal integration",
          "Emacs — claude-code.el and claude-code-ide.el with ediff-based diffs",
          "Cursor — AI-first VS Code fork with native MCP support",
          "When to use terminal vs IDE extension: full agentic vs quick assist",
        ],
      },
      {
        title: "Inline Code Generation",
        subtopics: [
          "Generating functions and modules from natural language comments",
          "Context-aware suggestions based on surrounding code",
          "Working with selected code blocks for targeted edits",
          "Inline docstring and type annotation generation",
          "Generating entire modules from a spec",
        ],
      },
      {
        title: "IDE Chat Panels & Debugging",
        subtopics: [
          "Explaining code inside the editor",
          "Debugging stack traces interactively",
          "Asking architecture questions within your IDE context",
          "Refactoring with conversational prompts",
          "Tracing execution paths through call stacks",
          "Performance optimization and memory leak guidance",
        ],
      },
      {
        title: "Navigation & Refactoring",
        subtopics: [
          "Renaming variables and functions across a codebase",
          "Semantic find-and-replace across multiple files",
          "Splitting monolithic files into focused modules",
          "Updating multiple files automatically with one command",
          "Refactoring large React components into smaller ones",
        ],
      },
    ],
  },
  {
    module: "Module 6",
    title: "CLAUDE.md — Project Memory System",
    color: "#EC4899",
    icon: "📝",
    duration: "~2 hours",
    topics: [
      {
        title: "What CLAUDE.md Is and Why It Matters",
        subtopics: [
          "CLAUDE.md acts as Claude's 'constitution' for your project",
          "Read at the start of every session — zero manual re-explaining",
          "Hierarchical: ~/.claude/CLAUDE.md (global) → root CLAUDE.md → subdirectory CLAUDE.md",
          "Subdirectory CLAUDE.md scopes rules to that folder only",
          "Auto-generate a starter file with `/init`",
          "Treat CLAUDE.md as living documentation — update it as the project evolves",
        ],
      },
      {
        title: "Writing Effective CLAUDE.md Files",
        subtopics: [
          "Section: Project overview — stack, purpose, key constraints",
          "Section: Code conventions — formatting, naming, patterns to follow",
          "Section: Testing strategy — how and when to run tests",
          "Section: Common commands — build, test, lint, deploy commands",
          "Section: Architecture decisions — key design patterns in use",
          "Linking to reference files: 'See ./docs/architecture.md for details'",
          "Keep it focused: too much context degrades quality — only include what Claude needs",
        ],
      },
      {
        title: "CLAUDE.md Templates by Stack",
        subtopics: [
          "Node.js/TypeScript project template",
          "Python/FastAPI project template",
          "Next.js full-stack project template",
          "Monorepo with multiple services template",
          "DevOps/infrastructure project template",
          "Open-source library template",
        ],
      },
      {
        title: "Team-Level CLAUDE.md Strategy",
        subtopics: [
          "Committing CLAUDE.md to git for team-wide consistency",
          "New developer onboarding: clone + claude = instant context",
          "Separating personal preferences (global) from project rules (project-level)",
          "Preventing CLAUDE.md from growing too large — use reference file links",
          "Using CLAUDE.md as system prompt for subagents",
          "Version-controlling CLAUDE.md alongside the codebase it describes",
        ],
      },
    ],
  },
  {
    module: "Module 7",
    title: "Agent Skills",
    color: "#F59E0B",
    icon: "⚡",
    duration: "~3 hours",
    topics: [
      {
        title: "What Are Skills?",
        subtopics: [
          "Skills: reusable instruction sets stored as SKILL.md files in .claude/skills/",
          "Two invocation modes: explicit slash command (/skillname) or auto-invoked by Claude",
          "Skills vs commands: same slash invocation, but skills add auto-invocation + bundled files",
          "Skills vs subagents: skills are instruction playbooks; subagents are isolated AI workers",
          "Skills load on demand — only relevant SKILL.md enters the context window",
          "Open standard (agentskills.io) — works across Claude Code, Codex CLI, Gemini CLI",
          "Bundled skills ship with Claude Code by default (e.g., /simplify, /batch, /claude-api)",
        ],
      },
      {
        title: "SKILL.md File Structure",
        subtopics: [
          "Folder-based: each skill is a directory with a SKILL.md inside",
          "YAML frontmatter: `name`, `description`, `allowed-tools`, `version`, `invocation`",
          "`invocation: manual` — only triggered by slash command",
          "`invocation: auto` — Claude decides when to invoke based on context",
          "Markdown body: instructions, examples, guidelines Claude follows",
          "Bundled assets: /scripts (Python/Bash), /references (additional .md), /assets",
          "Scripts are executed, not loaded — only their output enters context",
          "Progressive disclosure: SKILL.md → reference files → scripts as needed",
        ],
      },
      {
        title: "Creating Your Own Skills",
        subtopics: [
          "Project skills: `.claude/skills/<skill-name>/SKILL.md`",
          "Personal skills (all projects): `~/.claude/skills/<skill-name>/SKILL.md`",
          "Using the bundled skill-creator skill to scaffold new skills",
          "Installing via npm: `npx skills add <org>/<repo> --skill <name>`",
          "Example: a /code-review skill with bundled linting scripts",
          "Example: a /deep-research skill that forks an Explore subagent",
          "Parameterized skills: using `$ARGUMENTS` in SKILL.md",
        ],
      },
      {
        title: "Built-In Bundled Skills",
        subtopics: [
          "`/simplify` — spawns 3 parallel review agents (reuse, quality, efficiency) then fixes",
          "`/batch <instruction>` — decomposes task into 5–30 units, spawns parallel agents per unit",
          "`/claude-api` — loads Claude API reference for your project's language automatically",
          "Auto-activation example: /claude-api activates when code imports `@anthropic-ai/sdk`",
          "Viewing all available skills with /help",
        ],
      },
      {
        title: "context:fork — Skills That Spawn Agents",
        subtopics: [
          "`context: fork` frontmatter key launches the skill in an isolated subagent",
          "`agent: Explore` — read-only agent for deep codebase research",
          "`agent: Plan` — planning agent for architecture research",
          "Results are summarized and returned to your main conversation",
          "Use case: /deep-research that doesn't pollute your main context window",
          "Difference from Agent Teams: context:fork is one-shot, Agent Teams are collaborative",
        ],
      },
      {
        title: "The Skills Ecosystem",
        subtopics: [
          "Official Anthropic skills repository: github.com/anthropics/skills",
          "Installing via plugins: `/plugin install document-skills@anthropic-agent-skills`",
          "Community skills marketplace: skillsmp.com — 1,234+ community skills",
          "Installing the Antigravity library: `npx antigravity-awesome-skills --claude`",
          "Creating and sharing skills with your team via plugins",
          "Security: treat skills like installed software — review SKILL.md before trusting",
        ],
      },
    ],
  },
  {
    module: "Module 8",
    title: "Subagents",
    color: "#8B5CF6",
    icon: "🤖",
    duration: "~3 hours",
    topics: [
      {
        title: "What Are Subagents?",
        subtopics: [
          "Subagents: specialized AI workers Claude spawns via the Task tool",
          "Each subagent runs in an isolated context — no shared conversation history",
          "Up to 7 subagents can run simultaneously in parallel",
          "Subagents report back to the parent; they cannot talk to each other (use Agent Teams for that)",
          "Built-in subagents: Explore (read-only codebase scan), Plan (architecture research), General-purpose",
          "Custom subagents defined in .claude/agents/<name>.md with YAML frontmatter",
          "Viewing all subagents with /agents",
        ],
      },
      {
        title: "Subagent File Structure",
        subtopics: [
          "Location: .claude/agents/<name>.md (project) or ~/.claude/agents/<name>.md (global)",
          "YAML frontmatter fields: name, description, tools, disallowedTools, model, permissionMode, hooks, maxTurns",
          "`model: haiku` for cheap exploration subagents; `model: opus` for complex reasoning",
          "Markdown body = the subagent's system prompt",
          "Creating via /agents command with guided setup",
          "Auto-loaded at session start; use /agents to reload after manual creation",
          "Correct example: `--- name: code-reviewer description: Reviews code tools: Read, Glob, Grep model: sonnet ---`",
        ],
      },
      {
        title: "Invoking and Using Subagents",
        subtopics: [
          "Explicit invocation: `@agent-name do this task`",
          "Claude invokes via Task tool automatically when appropriate",
          "Background mode: launch a subagent and keep working with Ctrl+B",
          "Subagent picks up context via its system prompt (markdown body) and CLAUDE.md",
          "PreToolUse hooks inside subagents for per-operation validation",
          "Memory instructions in subagent .md for persistent institutional knowledge",
        ],
      },
      {
        title: "Model Tiering with Subagents",
        subtopics: [
          "Route cheap exploration to Haiku (~5x cheaper than Opus, faster)",
          "Use Sonnet for general implementation work (default, balanced)",
          "Reserve Opus for genuine architectural reasoning and complex tasks",
          "Typical session cost: Haiku $0.10–0.45; Opus $0.50–2.25 per session",
          "Setting model per subagent in frontmatter: `model: haiku`",
          "Cost control: combine --max-turns with cheap subagent models",
        ],
      },
      {
        title: "Subagent Design Patterns",
        subtopics: [
          "Explorer pattern: read-only Haiku agent maps the codebase, returns findings",
          "Reviewer pattern: Sonnet agent checks code quality in isolation",
          "Tester pattern: agent runs tests and reports failures to parent",
          "Scoped-bash pattern: PreToolUse hook restricts Bash to read-only DB queries only",
          "Memory-building pattern: agent updates its own .md file with institutional knowledge",
          "Subagent vs Agent Team: subagent for isolated work, Agent Team for cross-agent collaboration",
        ],
      },
    ],
  },
  {
    module: "Module 9",
    title: "MCP — Model Context Protocol",
    color: "#10B981",
    icon: "🔌",
    duration: "~3 hours",
    topics: [
      {
        title: "What is MCP?",
        subtopics: [
          "Open standard by Anthropic: connects Claude Code to any external service",
          "Analogous to USB-C for AI: one protocol, thousands of integrations",
          "MCP vs Bash: Bash runs local commands; MCP talks to external APIs and systems",
          "MCP server types: stdio (local process) and HTTP/SSE (remote)",
          "Context cost warning: enabling too many MCPs shrinks your context window",
          "Best practice: keep under 10 MCPs active with under 80 total tools",
        ],
      },
      {
        title: "Adding and Configuring MCP Servers",
        subtopics: [
          "Adding a server: `claude mcp add --transport http notion https://mcp.notion.com/mcp`",
          "Local stdio server: `claude mcp add my-tool -- node ./my-mcp-server.js`",
          "Config lives in .claude/settings.json or .mcp.json (project root)",
          "Global MCPs in ~/.claude/settings.json",
          "MCP Tool Search: lazy loading reduces context usage by up to 95%",
          "Listing available MCP tools: `claude mcp list`",
        ],
      },
      {
        title: "Popular MCP Integrations",
        subtopics: [
          "GitHub MCP: create PRs, comment on issues, read repo data",
          "PostgreSQL/databases: query and update databases directly from Claude",
          "Slack MCP: post summaries, read channels, send notifications",
          "Jira/Linear MCP: create and link tickets to PRs",
          "Sentry MCP: query error traces, link errors to code",
          "Notion MCP: read/write pages, search workspace",
          "50+ curated MCP servers available at the Claude Code MCP directory",
        ],
      },
      {
        title: "Building Custom MCP Servers",
        subtopics: [
          "MCP server structure: tool definitions with JSON Schema parameters",
          "Building with Node.js using `@modelcontextprotocol/sdk`",
          "Building with Python using `mcp` library",
          "Local development: stdio transport for quick iteration",
          "Deploying as a remote HTTP server for team-wide access",
          "Security: MCP servers run with your system's permissions — trust matters",
        ],
      },
      {
        title: "MCP in Subagents and Agent Teams",
        subtopics: [
          "Subagents inherit parent's MCP connections by default",
          "Override per-subagent via `mcpServers` frontmatter field",
          "Agent Teams can also share MCP connections with teammates",
          "Combining MCP + hooks: validate MCP tool calls before execution",
          "Debugging MCP failures: check server logs and use `claude mcp list`",
        ],
      },
    ],
  },
  {
    module: "Module 10",
    title: "Hooks",
    color: "#EF4444",
    icon: "🪝",
    duration: "~2.5 hours",
    topics: [
      {
        title: "What Are Hooks and Why They Matter",
        subtopics: [
          "Hooks = deterministic scripts that fire at lifecycle events",
          "Key principle: prompts suggest; hooks guarantee — use hooks for anything that MUST run",
          "Hook events: PreToolUse, PostToolUse, SessionStart, SessionEnd, Notification",
          "Hooks vs instructions in CLAUDE.md: hooks are not optional",
          "Think of hooks as git hooks, but for Claude Code events",
          "Hooks are configured in .claude/settings.json or via /hooks interactively",
        ],
      },
      {
        title: "Hook Configuration Syntax",
        subtopics: [
          "Structure: event → matcher → array of hook commands",
          "Exit code 0: success, let Claude proceed",
          "Exit code 1: log warning, Claude continues",
          "Exit code 2: block the operation, feed error message back to Claude",
          "Hook receives JSON via stdin: tool_input, tool_name, session info",
          "Example: PostToolUse Write matcher auto-runs `npm run lint $FILE_PATH`",
        ],
      },
      {
        title: "Common Hook Patterns",
        subtopics: [
          "Auto-format: PostToolUse → Write → run `prettier --write $FILE`",
          "Block dangerous Bash: PreToolUse → Bash → validate-readonly-query.sh",
          "Auto-test: PostToolUse → Write(*.test.*) → run test suite",
          "Audit logging: PostToolUse → log every tool call to audit.log",
          "Desktop notifications: Notification event → send OS notification on task complete",
          "Session initialization: SessionStart → load team environment variables",
        ],
      },
      {
        title: "Hooks Inside Subagents",
        subtopics: [
          "Subagents can have their own hooks in their YAML frontmatter",
          "Example: db-reader subagent with PreToolUse hook that validates read-only queries",
          "Hooks inside subagents only fire for that subagent's tool calls",
          "Combining subagent-level hooks with project-level hooks for layered control",
        ],
      },
      {
        title: "Advanced Hook Patterns",
        subtopics: [
          "Multi-file hooks: write hook scripts in Bash, Python, or Node.js",
          "Notification hooks for long-running tasks (get alerted when Claude is done)",
          "Validation hooks that enforce team code standards automatically",
          "Cost control hooks: alert when session exceeds token threshold",
          "Using /hooks to configure and test hooks interactively",
        ],
      },
    ],
  },
  {
    module: "Module 11",
    title: "Plugins",
    color: "#06B6D4",
    icon: "📦",
    duration: "~2 hours",
    topics: [
      {
        title: "What Are Plugins?",
        subtopics: [
          "Plugins: distributable bundles of commands, skills, agents, hooks, and MCP servers",
          "Think of plugins as npm packages for Claude Code configuration",
          "Solve the sharing problem: before plugins, sharing agents required manual file copying",
          "Launched October 2025; plugin marketplaces launched alongside",
          "Plugin registry: install from GitHub repos or official Anthropic registry",
          "Types: project plugins (.claude/) and user plugins (~/.claude/)",
        ],
      },
      {
        title: "Installing and Using Plugins",
        subtopics: [
          "Install from registry: `/plugin install <name>@<marketplace>`",
          "Install Anthropic skills: `/plugin install document-skills@anthropic-agent-skills`",
          "Install example skills: `/plugin install example-skills@anthropic-agent-skills`",
          "List installed plugins: `/plugin list`",
          "Update a plugin: `/plugin update <name>`",
          "Remove a plugin: `/plugin remove <name>`",
        ],
      },
      {
        title: "Building and Publishing Plugins",
        subtopics: [
          "Plugin structure: metadata file + bundled commands, skills, agents, hooks",
          "Creating a plugin for your team's workflow (e.g., company code review standards)",
          "Publishing to a private registry for internal team distribution",
          "Versioning plugins alongside your codebase",
          "Using plugins to enforce team standards without manual setup",
          "Security considerations: only install plugins from trusted sources",
        ],
      },
      {
        title: "Notable Plugin Ecosystems",
        subtopics: [
          "Official Anthropic skills plugin: document, PDF, PPTX, XLSX skills",
          "Community marketplace: claude-plugins.dev and skillsmp.com",
          "ClaudeFast Code Kit: production-ready 18-agent system + MCP configs",
          "Anthropic skills repo (github.com/anthropics/skills): open-source reference",
          "Team-internal plugin registries for enterprise organizations",
        ],
      },
    ],
  },
  {
    module: "Module 12",
    title: "Agent Teams",
    color: "#F97316",
    icon: "🧩",
    duration: "~3 hours",
    topics: [
      {
        title: "What Are Agent Teams?",
        subtopics: [
          "Agent Teams: multiple independent Claude sessions that coordinate with each other",
          "Launched February 5, 2026 alongside Claude Opus 4.6",
          "Lead agent + teammates — teammates can talk to each other directly",
          "Real demo: 16 agents built a 100,000-line C compiler in Rust over two weeks (~$20k tokens)",
          "Subagents vs Agent Teams: subagents report to parent; teammates are peers",
          "Agent Teams are the most token-intensive feature — use only when parallelism genuinely helps",
        ],
      },
      {
        title: "How Agent Teams Work",
        subtopics: [
          "Configured through the prompt itself — no separate config file",
          "Lead agent handles orchestration and task delegation",
          "Teammates inherit lead's permissions and MCP connections",
          "Fine-tune teammate behavior via hooks or teams.json",
          "Teammates can self-assign tasks from a shared task list",
          "Teammates can challenge each other's findings for higher accuracy",
          "Use Ctrl+B to send an agent to background while you continue working",
        ],
      },
      {
        title: "Agent Team Design Patterns",
        subtopics: [
          "Parallel exploration: multiple teammates explore different parts of the codebase",
          "Cross-checking: two agents independently solve the same problem, then reconcile",
          "Specialist squad: frontend agent + backend agent + test agent work in parallel",
          "Research + implement: one agent researches, another implements, third reviews",
          "Mass migration: /batch uses agent teams to migrate entire codebases in parallel git worktrees",
          "Cost consideration: teams consume 3–10x more tokens than single sessions",
        ],
      },
      {
        title: "When to Use Agent Teams vs Subagents",
        subtopics: [
          "Use subagents when: you need isolated, parallel execution reporting back to you",
          "Use agent teams when: tasks require genuine cross-agent communication and collaboration",
          "Agent teams for: complex refactors, large migrations, multi-perspective research",
          "Subagents for: parallel file analysis, running tests, generating reports",
          "Cost rule: prefer subagents; escalate to agent teams only for truly collaborative work",
          "The /batch command is a good gateway to understand agent team patterns",
        ],
      },
      {
        title: "Agent SDK — Programmatic Agent Control",
        subtopics: [
          "Agent SDK: run Claude Code programmatically in TypeScript or Python",
          "Designed for CI/CD and automation where you control the agent from code",
          "Supports all features: skills, subagents, MCP, hooks, permissions",
          "Setting `settingSources: ['project']` to load .claude/ config from code",
          "Use case: build your own AI-powered code review bot, deployment agent, etc.",
          "Difference from CLI: SDK gives full programmatic control over each turn",
        ],
      },
    ],
  },
  {
    module: "Module 13",
    title: "Trust, Permissions & Safety",
    color: "#EF4444",
    icon: "🔒",
    duration: "~2 hours",
    topics: [
      {
        title: "Permission System Deep Dive",
        subtopics: [
          "Permission modes: default (ask per action), acceptEdits, bypassPermissions",
          "`--allowedTools \"Read,Write,Bash(git *)\"` — whitelist with capitalized tool names",
          "`--disallowedTools \"Bash(rm *)\"` — blacklist specific dangerous patterns",
          "Folder-level deny: `\"deny\": [\"Write(./production.config.*)\"]` in settings.json",
          "`--sandbox` flag: truly isolated execution — no real filesystem writes",
          "Audit trail: /diff shows all changes made in the current session",
        ],
      },
      {
        title: "Prompt Injection & Security",
        subtopics: [
          "Prompt injection: malicious instructions embedded in files Claude reads",
          "Never let Claude read untrusted user-submitted content without sandboxing",
          "MCP security: MCP servers run with your system's permissions",
          "Skills security: treat SKILL.md like installed software — review before trusting",
          "Data exposure risk: skills that fetch external URLs can receive malicious instructions",
          "Network access restrictions via .claudeignore and --disallowedTools",
        ],
      },
      {
        title: "Data Privacy",
        subtopics: [
          "What data is sent to Anthropic's API (conversation content, not credentials if ignored)",
          "Using .claudeignore to prevent sensitive files from entering context",
          "Enterprise data retention policies and API data agreements",
          "Handling PII and secrets: never let Claude read .env in production",
          "Using `deny: [\"Read(./.env)\"]` in settings.json as a hard block",
          "Running models on-premises via Bedrock or Vertex AI integrations",
        ],
      },
      {
        title: "Safe Automation Practices",
        subtopics: [
          "Always run /diff and review before committing AI changes",
          "Use git as the safety net for all AI edits — every change is reversible",
          "Pair --dangerously-skip-permissions with --sandbox in CI containers",
          "Set --max-turns to prevent runaway agentic loops in automation",
          "Keep humans in the loop for irreversible actions (deploys, deletes)",
          "Pre-commit hooks as a last line of defense before AI changes are committed",
        ],
      },
    ],
  },
  {
    module: "Module 14",
    title: "Advanced Usage & Workflows",
    color: "#F59E0B",
    icon: "🔥",
    duration: "~4 hours",
    topics: [
      {
        title: "Agentic & Autonomous Tasks",
        subtopics: [
          "Multi-step task execution without interruptions using -p mode",
          "Chaining tasks in shell scripts with claude -p",
          "Setting appropriate scope with --max-turns and --allowedTools",
          "Building fully automated engineering workflows (nightly runs, CI bots)",
          "When full autonomy is safe vs when to keep humans in the loop",
          "Cost management for long-running agentic workflows",
        ],
      },
      {
        title: "Session Management",
        subtopics: [
          "Naming sessions: /rename <name> for future --resume",
          "Resuming by ID: claude -r <session-name-or-id>",
          "Background agents: Ctrl+B to run an agent while you continue typing",
          "Exporting session history for documentation or postmortems",
          "Managing multiple concurrent Claude sessions for parallel workstreams",
          "Clearing stale context: /clear vs /compact — when to use which",
        ],
      },
      {
        title: "Custom Workflows with All Features Combined",
        subtopics: [
          "A complete PR workflow: code → test → /diff → commit message → PR description",
          "A complete bug fix workflow: reproduce → fix → regression test → /diff → commit",
          "Large migration: /batch decomposes → parallel agents in git worktrees → PRs per chunk",
          "Nightly quality run: CI hook triggers claude -p to run /simplify on changed files",
          "Combining skills + subagents + MCP for end-to-end feature delivery",
        ],
      },
      {
        title: "Prompt Engineering for Agentic Tasks",
        subtopics: [
          "Plan-first pattern: 'Plan how to X, then implement step by step'",
          "Constraint-first: define limits before the task ('only modify src/api/')",
          "Scope explicitly: 'list all files you will modify before changing anything'",
          "Adversarial pattern: 'find flaws in your own implementation before finishing'",
          "Incremental build: one feature at a time with test verification between steps",
          "Rubber duck debugging: 'explain the error step by step before attempting a fix'",
        ],
      },
    ],
  },
  {
    module: "Module 15",
    title: "Real-World Use Cases",
    color: "#10B981",
    icon: "💡",
    duration: "~4 hours",
    topics: [
      {
        title: "Full-Stack Development",
        subtopics: [
          "Scaffolding a full-stack app from a natural language spec",
          "Frontend: React/Vue/Svelte component generation with tests",
          "Backend: REST API and GraphQL endpoint creation",
          "Database schema design and Prisma/SQLAlchemy migrations",
          "End-to-end feature implementation with /batch for large features",
          "Generating API client SDKs from OpenAPI specs",
        ],
      },
      {
        title: "Debugging & Bug Fixing",
        subtopics: [
          "Stack trace analysis: paste error → root cause + fix in one shot",
          "Describing a bug in natural language and letting Claude find the cause",
          "Reproducing bugs with minimal test cases",
          "Applying and verifying fixes with automated test runs",
          "Writing regression tests with '/test <function>' skill",
          "Debugging flaky tests by running them many times and analyzing output",
        ],
      },
      {
        title: "Refactoring & Code Quality",
        subtopics: [
          "Using /simplify to run parallel quality review agents automatically",
          "Extracting functions and modules from monolithic files",
          "Updating deprecated APIs (callbacks → async/await)",
          "Large-scale refactoring with /batch — parallel agents per module",
          "Applying design patterns consistently across a codebase",
          "Enforcing consistent coding style with PostToolUse hooks + linters",
        ],
      },
      {
        title: "Testing & QA",
        subtopics: [
          "Generating unit tests for existing functions",
          "Integration and end-to-end test creation",
          "Test coverage analysis and filling gaps",
          "Mocking, stubbing, and test doubles for isolated unit tests",
          "Running tests automatically via PostToolUse hooks after every write",
          "Property-based and fuzz testing strategies",
        ],
      },
      {
        title: "Documentation Generation",
        subtopics: [
          "Auto-generating README files from codebase scan",
          "JSDoc / docstring generation with the /claude-api skill",
          "OpenAPI/Swagger spec generation from routes",
          "Architecture decision records (ADRs) from discussion",
          "Onboarding guides that Claude maintains as the project evolves",
          "Generating CHANGELOG.md: `claude -p \"write changelog from: $(git log v1.0..HEAD)\"`",
        ],
      },
      {
        title: "DevOps & Infrastructure",
        subtopics: [
          "Writing Dockerfiles and docker-compose configs",
          "CI/CD pipeline configuration (GitHub Actions, GitLab CI) generation",
          "Infrastructure as Code (Terraform, Pulumi)",
          "Kubernetes manifests and Helm chart generation",
          "Security scanning via --allowedTools Read audit mode",
          "Automated environment setup scripts",
        ],
      },
      {
        title: "Security & Compliance",
        subtopics: [
          "Scanning for hardcoded secrets: `claude --allowedTools Read 'scan for secrets'`",
          "Identifying OWASP Top 10 vulnerabilities",
          "Dependency vulnerability analysis and auto-patching",
          "Generating security audit reports as JSON with --output-format json",
          "Enforcing security policies via CLAUDE.md rules",
          "Writing secure coding guidelines for your team",
        ],
      },
    ],
  },
  {
    module: "Module 16",
    title: "Team & Enterprise Usage",
    color: "#6366F1",
    icon: "🏢",
    duration: "~2.5 hours",
    topics: [
      {
        title: "Multi-Developer Workflows",
        subtopics: [
          "Sharing CLAUDE.md, commands, skills, and agents via git",
          "Standardizing AI workflows across teams with plugins",
          "Code review assistance: AI first pass before human review",
          "Pair programming with Claude as a second developer",
          "Onboarding new developers: clone + claude + /init = instant context",
          "Documenting team conventions in CLAUDE.md for all-team consistency",
        ],
      },
      {
        title: "CI/CD Integration",
        subtopics: [
          "Running claude -p in GitHub Actions / GitLab CI",
          "Automated code review on every PR using Agent SDK",
          "Auto-fix lint errors: `claude --max-turns 5 -p 'fix all lint errors'`",
          "Generating release notes: `claude -p 'write release notes from: $(git log)'`",
          "Security scanning as part of CI pipeline with --allowedTools Read",
          "Always pair --dangerously-skip-permissions with --sandbox in CI",
        ],
      },
      {
        title: "Cost Management & Monitoring",
        subtopics: [
          "Check session cost: /cost",
          "Model tiering strategy: Haiku for exploration, Sonnet for general, Opus for hard problems",
          "MCP context cost: keep under 10 MCPs, under 80 tools active",
          "Token cost per session by tier: Haiku $0.10–0.45, Opus $0.50–2.25",
          "Monitoring with cc-usage CLI or ccflare dashboard",
          "Organization-level usage reporting via Anthropic Console",
        ],
      },
      {
        title: "Governance & Policy",
        subtopics: [
          "Creating an AI usage policy for your engineering team",
          "Defining which tasks are AI-appropriate vs need human judgment",
          "Audit trails: /diff, --output-format json, git history of all AI edits",
          "IP and licensing: AI-generated code is owned by the developer, not Anthropic",
          "Training developers to review AI output before committing",
          "Enterprise data agreements and API data retention policies",
        ],
      },
    ],
  },
  {
    module: "Module 17",
    title: "Tips, Tricks & Best Practices",
    color: "#EC4899",
    icon: "✨",
    duration: "~2 hours",
    topics: [
      {
        title: "Writing Effective Prompts",
        subtopics: [
          "Be specific: provide file paths, expected output, and constraints",
          "Break large tasks into smaller verifiable steps",
          "Use 'plan first, then implement' — ask for a plan before code",
          "Paste the exact error message — don't paraphrase",
          "Scope explicitly: 'only modify files in src/api/'",
          "Adversarial check: 'find flaws in your own implementation'",
        ],
      },
      {
        title: "Performance Optimization",
        subtopics: [
          "Keep CLAUDE.md focused and concise — too much context degrades quality",
          "Use /compact before switching to a new task to free context window",
          "Check context usage with /context — compact when over 80%",
          "Limit file scanning scope with .claudeignore",
          "Batching related tasks in one session reduces overhead",
          "Use Haiku-powered subagents for exploration, Sonnet for implementation",
        ],
      },
      {
        title: "Common Pitfalls to Avoid",
        subtopics: [
          "Vague or underspecified tasks — Claude guesses and guesses wrong",
          "Not reviewing /diff before committing AI changes",
          "Over-trusting output on security-sensitive code",
          "Ignoring CLAUDE.md — Claude has no project context",
          "Running with excessive permissions when Read is enough",
          "Letting context grow too large without /compact — quality degrades",
          "Not using .claudeignore — causes slow scans and context pollution",
          "Enabling too many MCP servers — can reduce context window by 60%",
        ],
      },
      {
        title: "Power User Shortcuts",
        subtopics: [
          "Ctrl+C — interrupt and redirect Claude mid-task",
          "Ctrl+B — send agent to background, continue working",
          "Enter twice — submit a multi-line prompt",
          "Arrow keys — navigate command history in interactive mode",
          "Pipe any command output into claude: `npm test 2>&1 | claude -p 'fix these failures'`",
          "Quick model switch: /model mid-session without losing context",
        ],
      },
      {
        title: "Comparison with Other Tools",
        subtopics: [
          "Claude Code vs GitHub Copilot: full agentic control vs autocomplete suggestions",
          "Claude Code vs Cursor: terminal-first/whole-codebase vs IDE-first/open-file",
          "Claude Code vs Aider: similar philosophy, different UX and extensibility",
          "Claude Code vs Devin: Claude Code is dev-controlled, Devin is more autonomous",
          "Claude Code vs Claude.ai web chat: full filesystem + tool access vs conversation only",
          "When to use Claude.ai vs Claude Code: Claude.ai for writing/research; Code for execution",
        ],
      },
    ],
  },
  {
    module: "Module 18",
    title: "Debugging Claude Code Itself",
    color: "#EAB308",
    icon: "🔍",
    duration: "~2 hours",
    topics: [
      {
        title: "When Claude Code Gets It Wrong",
        subtopics: [
          "Recognizing hallucinated code (functions that don't exist in your repo)",
          "When Claude misunderstands the task — how to redirect without re-explaining everything",
          "Dealing with incomplete or truncated outputs — split into smaller steps",
          "Handling cases where Claude gets stuck in a loop — Ctrl+C and reframe",
          "When to start a new session (/clear) vs continue (/compact)",
        ],
      },
      {
        title: "Troubleshooting Common Errors",
        subtopics: [
          "API authentication errors (401, 403) — check `claude auth status`",
          "Rate limit errors (429) — add --max-turns, switch to Haiku",
          "Context window exceeded — use /compact immediately",
          "Tool permission denied — check settings.json and --allowedTools",
          "MCP server connection failures — `claude mcp list` and check server logs",
          "Node version mismatch — run `claude doctor`",
        ],
      },
      {
        title: "Improving Output Quality",
        subtopics: [
          "Iterating on bad output with corrective prompts",
          "Using /compact with focus instructions to refresh context quality",
          "Adding more explicit context to improve accuracy",
          "Switching to Opus for genuinely hard architectural problems",
          "Splitting large tasks into smaller sub-tasks with verification steps",
          "Providing explicit success criteria: 'this is done when all tests pass'",
        ],
      },
      {
        title: "Logging & Debugging Sessions",
        subtopics: [
          "Capturing session output: `claude | tee session.log`",
          "Using `--output-format json` for machine-readable audit logs",
          "Using /diff to review all changes at any point in the session",
          "Comparing outputs across model versions to diagnose regressions",
          "Using `claude doctor` to diagnose install and auth issues",
          "Reporting bugs to Anthropic with reproducible examples",
        ],
      },
    ],
  },
  {
    module: "Module 19",
    title: "Building Your Own AI Coding CLI",
    color: "#10B981",
    icon: "🛠",
    duration: "~5 hours",
    topics: [
      {
        title: "Designing an AI Coding Assistant",
        subtopics: [
          "Defining goals: what workflows does your agent replace or enhance?",
          "Understanding developer workflows to design the right abstraction",
          "Choosing between CLI, IDE plugin, or web UI for your use case",
          "Designing intuitive command syntax for your target users",
          "Handling multi-turn instructions and maintaining conversation state",
        ],
      },
      {
        title: "Building the CLI Interface",
        subtopics: [
          "Node.js CLI tools with Commander.js or yargs",
          "Python CLI tools with Click or Typer",
          "Streaming responses from Anthropic API in real time",
          "Rendering markdown and code output in the terminal",
          "Maintaining interactive sessions with conversation history",
        ],
      },
      {
        title: "Implementing Tool Use",
        subtopics: [
          "Defining custom tools with JSON Schema for Claude to call",
          "Allowing the AI to read and write files safely",
          "Running shell commands with sandboxing and allow/deny lists",
          "Executing git operations programmatically",
          "Applying code patches via diff/patch tools",
        ],
      },
      {
        title: "Building a Minimal Agentic Loop",
        subtopics: [
          "Planning tasks from natural language prompts",
          "Executing tool calls step by step and handling results",
          "Monitoring tool outputs and adjusting the plan dynamically",
          "Handling errors gracefully with retries and fallbacks",
          "Defining clear stopping conditions (all tests pass, file created, etc.)",
          "Testing and debugging your custom agent end-to-end",
        ],
      },
      {
        title: "Using the Claude Agent SDK",
        subtopics: [
          "Agent SDK overview: TypeScript and Python libraries for agentic control",
          "Loading .claude/ project settings with `settingSources: ['project']`",
          "Configuring subagents, MCP servers, and hooks programmatically",
          "Permission modes: acceptEdits, bypassPermissions for automated flows",
          "Building a CI code review bot using the Agent SDK",
          "Testing Agent SDK apps with promptfoo for automated evaluation",
        ],
      },
    ],
  },
  {
    module: "Module 20",
    title: "Prompt Engineering for Developers",
    color: "#F43F5E",
    icon: "✍️",
    duration: "~3 hours",
    topics: [
      {
        title: "Prompt Engineering Fundamentals",
        subtopics: [
          "What makes a good prompt for coding tasks: specificity + constraints + examples",
          "Zero-shot vs few-shot: when to provide examples",
          "Chain-of-thought for complex problems: 'think step by step'",
          "Role prompting in CLAUDE.md: 'You are a senior TypeScript engineer at Anthropic'",
          "Negative prompting: tell Claude what NOT to do to prevent bad defaults",
          "Meta-prompting: ask Claude to write a better prompt for itself",
        ],
      },
      {
        title: "Prompt Templates for Common Tasks",
        subtopics: [
          "Bug fix template: problem + error + expected behavior + constraints",
          "Feature implementation template: what + acceptance criteria + constraints + test requirement",
          "Code review template: goals + severity levels + output format",
          "Refactoring template: what to improve + what to preserve + scope",
          "Test generation template: function + edge cases + mocking requirements",
          "Documentation template: audience + format + level of detail",
        ],
      },
      {
        title: "Advanced Prompting Patterns",
        subtopics: [
          "Plan-execute-verify: 'Plan → show plan → wait for approval → execute'",
          "Adversarial: 'Implement X, then find every way your implementation could fail'",
          "Constraint-first: 'Rules: TypeScript strict, no external libraries, tests required'",
          "Scope-explicit: 'List every file you'll modify before touching anything'",
          "Incremental: 'Build and test one feature at a time, wait for my OK each time'",
          "Rubber duck: 'Explain the bug step by step before attempting to fix it'",
        ],
      },
      {
        title: "Prompt Libraries & Reuse",
        subtopics: [
          "Building a personal skill library in ~/.claude/skills/",
          "Team-shared prompt libraries committed to .claude/commands/ and .claude/skills/",
          "Using --append-system-prompt for session-level prompt injection",
          "Versioning prompt templates alongside your codebase",
          "Evaluating prompt quality with test cases and expected outputs",
          "Using the bundled skill-creator skill to scaffold new templates",
        ],
      },
    ],
  },
  {
    module: "Module 21",
    title: "Claude Code for Specific Languages & Frameworks",
    color: "#0EA5E9",
    icon: "🌐",
    duration: "~4 hours",
    topics: [
      {
        title: "JavaScript & TypeScript",
        subtopics: [
          "Generating typed React components with props and hooks",
          "Writing Node.js APIs with Express or Fastify",
          "TypeScript strict mode and type inference patterns",
          "Next.js App Router patterns and server components",
          "Testing with Jest, Vitest, and Playwright end-to-end",
        ],
      },
      {
        title: "Python",
        subtopics: [
          "FastAPI and Django REST framework patterns",
          "Type annotations and Pydantic models",
          "Async Python with asyncio and aiohttp",
          "Testing with pytest, fixtures, and factories",
          "Data science: Pandas, NumPy, and Jupyter notebook generation",
        ],
      },
      {
        title: "Go, Rust & Systems Languages",
        subtopics: [
          "Go module structure and idiomatic patterns",
          "Rust ownership, borrowing, and lifetimes explained",
          "Writing concurrent Go with goroutines and channels",
          "Building Rust CLI tools with Clap",
          "Memory safety analysis in C/C++ codebases",
        ],
      },
      {
        title: "DevOps & Infrastructure Languages",
        subtopics: [
          "Terraform HCL best practices and module generation",
          "Helm chart generation for Kubernetes deployments",
          "GitHub Actions YAML workflow generation",
          "Ansible playbook creation and idempotency patterns",
          "Bash scripting for robust automation with error handling",
        ],
      },
      {
        title: "Databases & Query Languages",
        subtopics: [
          "SQL query optimization with AI-driven EXPLAIN analysis",
          "Writing complex JOINs, CTEs, and window functions",
          "MongoDB aggregation pipeline generation",
          "Schema design, normalization, and index strategy",
          "Database migration script generation with rollback",
        ],
      },
    ],
  },
  {
    module: "Module 22",
    title: "Hands-On Projects",
    color: "#14B8A6",
    icon: "🛠️",
    duration: "~8 hours",
    topics: [
      {
        title: "Project 1: Build a REST API from Scratch",
        subtopics: [
          "Spec the API in natural language with CLAUDE.md",
          "Scaffold Node.js/Express or FastAPI project",
          "Generate routes, models, validation, and OpenAPI docs",
          "Add JWT authentication with tests",
          "Set up GitHub Actions CI pipeline",
          "Use /batch for parallel implementation of endpoints",
        ],
      },
      {
        title: "Project 2: Refactor a Legacy Codebase",
        subtopics: [
          "Load and analyze a messy legacy project with /simplify",
          "Identify and prioritize code smells",
          "Modernize deprecated patterns (callbacks → async/await)",
          "Add missing tests to reach 80% coverage with parallel test generation",
          "Document the refactored codebase with /claude-api skill",
        ],
      },
      {
        title: "Project 3: Automate a DevOps Pipeline",
        subtopics: [
          "Write a GitHub Actions workflow from scratch",
          "Dockerize an application with multi-stage builds",
          "Set up automated testing and quality gates in CI",
          "Generate deployment scripts and monitoring configs",
          "Add a PostToolUse hook that auto-validates infra changes",
        ],
      },
      {
        title: "Project 4: Build a Complete Skill + Subagent System",
        subtopics: [
          "Design a custom /code-review skill with bundled linting scripts",
          "Create a code-reviewer subagent with restricted permissions",
          "Create a test-generator subagent specialized for your framework",
          "Wire them together with a custom /full-review command",
          "Package everything as a plugin for team distribution",
        ],
      },
      {
        title: "Project 5: AI-Powered PR Review Bot",
        subtopics: [
          "Set up Claude Code in a GitHub Actions pipeline via Agent SDK",
          "Trigger reviews on every pull request automatically",
          "Post inline review comments to the PR via GitHub MCP",
          "Configure review rules in CLAUDE.md and a reviewer subagent",
          "Test with sample PRs and tune the review quality",
        ],
      },
      {
        title: "Project 6: Large-Scale Migration with Agent Teams",
        subtopics: [
          "Use /batch to decompose a codebase migration into parallel units",
          "Each agent implements one module in an isolated git worktree",
          "Each agent runs tests and opens a PR for its module",
          "Lead agent reviews and merges PRs after all pass tests",
          "Post a summary to Slack via MCP when migration is complete",
        ],
      },
    ],
  },
  {
    module: "Module 23",
    title: "The Future of AI-Assisted Development",
    color: "#8B5CF6",
    icon: "🔮",
    duration: "~1 hour",
    topics: [
      {
        title: "Where Claude Code is Heading",
        subtopics: [
          "Longer context, smarter planning, cheaper models (Sonnet 4.6 = 1M token context beta)",
          "Agent Teams as a first-class development paradigm",
          "Deeper IDE integrations and VS Code extension evolution",
          "MCP ecosystem growth: 3,000+ integrations and counting",
          "Moving toward fully autonomous multi-day coding sessions",
          "AI as a first-class engineering team member — not just a tool",
        ],
      },
      {
        title: "Responsible AI Coding",
        subtopics: [
          "Keeping humans in the loop for critical, irreversible decisions",
          "Code ownership and attribution in AI-assisted projects",
          "License compliance: AI-generated code inherits your project's license",
          "Building teams that use AI responsibly with clear review processes",
          "Avoiding over-reliance: AI is brilliant on day one but misses project-specific wisdom",
          "Staying current as models rapidly improve — skills and workflows will evolve",
        ],
      },
      {
        title: "The Evolving Developer Role",
        subtopics: [
          "From writing code to directing AI agents — new mental model required",
          "High-level architecture thinking becomes more valuable, not less",
          "Prompt engineering and CLAUDE.md authoring as core developer skills",
          "Reviewing AI output instead of writing from scratch — still requires deep expertise",
          "The importance of staying hands-on with fundamentals to catch AI mistakes",
          "90% of Anthropic's own code is AI-written (March 2026) — the shift is real",
        ],
      },
    ],
  },
];


// ─────────────────────────────────────────────────────────────────────────────
// EXERCISES — Verified, corrected, and expanded
//
// KEY FIXES FROM v1:
//  • Exercise 2: Skills renamed from .json to SKILL.md with correct frontmatter
//  • Exercise 3: Subagents are .md files with YAML frontmatter, NOT .json files
//    The old "agents" in .json format was never correct
//  • Exercise 4: MCP config is .mcp.json not mcp-config.json
//  • Added Exercise 8: Plugins
//  • Added Exercise 9: Agent Teams + /batch
// ─────────────────────────────────────────────────────────────────────────────

export const exercises = [
  {
    module: "Exercise 1",
    title: "Slash Commands",
    color: "#FF6B35",
    icon: "/",
    duration: "~30 min",
    path: "exercises/01-commands",
    description: "Create reusable slash commands in .claude/commands/. Commands are Markdown files with YAML frontmatter that become /commandname invocations.",
    commands: [
      {
        name: "/hello",
        file: ".claude/commands/hello.md",
        desc: "Greeting command with optional $ARGUMENTS parameter",
      },
      {
        name: "/catchup",
        file: ".claude/commands/catchup.md",
        desc: "Summarize all files changed in current branch vs main",
      },
      {
        name: "/pr",
        file: ".claude/commands/pr.md",
        desc: "Stage changes, generate commit message, and draft PR description",
      },
    ],
    try: [
      "/hello",
      "/hello Abhinav",
      "/catchup",
      "/pr",
    ],
    challenge: "Create a /stats command that uses the GitHub MCP to show open PRs and recent commits",
    solution: "solutions/01-commands/",
    notes: "Commands live in .claude/commands/<name>.md. Use $ARGUMENTS to pass text after the command name. Frontmatter fields: description, allowed-tools.",
  },
  {
    module: "Exercise 2",
    title: "Agent Skills",
    color: "#4ECDC4",
    icon: "⚡",
    duration: "~45 min",
    path: "exercises/02-skills",
    description: "Build SKILL.md files — instruction playbooks Claude loads on demand. Skills can be slash-invoked or auto-triggered. Each skill is a folder with SKILL.md inside.",
    commands: [
      {
        name: "/deep-research",
        file: ".claude/skills/deep-research/SKILL.md",
        desc: "Forks an Explore subagent to research a topic without polluting main context. Uses context: fork, agent: Explore frontmatter.",
      },
      {
        name: "/explain-code",
        file: ".claude/skills/explain-code/SKILL.md",
        desc: "Explains code using diagrams and analogies. Auto-invoked when user asks how something works.",
      },
      {
        name: "/commit",
        file: ".claude/skills/commit/SKILL.md",
        desc: "Bundles a commit-message.sh script that formats conventional commits. Demonstrates script bundling.",
      },
    ],
    try: [
      "/deep-research async/await patterns in JavaScript",
      "/explain-code (then ask: 'how does the auth middleware work?')",
      "/commit",
      "Ask: 'how does this function work?' — watch /explain-code auto-trigger",
    ],
    challenge: "Create a /lint skill that bundles a language-specific linting script and auto-triggers after any file write",
    solution: "solutions/02-skills/",
    notes: "Frontmatter: name, description, allowed-tools, version, invocation (manual|auto). context: fork + agent: Explore for isolated research. Scripts in /scripts/ are executed, not loaded into context.",
  },
  {
    module: "Exercise 3",
    title: "Subagents",
    color: "#A855F7",
    icon: "🤖",
    duration: "~40 min",
    path: "exercises/03-subagents",
    description: "Create specialized subagents as .md files with YAML frontmatter. Subagents run in isolated contexts. Up to 7 can run in parallel. The markdown body is the subagent's system prompt.",
    commands: [
      {
        name: "@code-reviewer",
        file: ".claude/agents/code-reviewer.md",
        desc: "Reviews code for quality and security. tools: Read, Glob, Grep. model: sonnet. Read-only — no Bash or Write.",
      },
      {
        name: "@doc-writer",
        file: ".claude/agents/doc-writer.md",
        desc: "Documentation specialist. tools: Read, Write, Glob. Writes README and JSDoc. model: sonnet.",
      },
      {
        name: "@test-generator",
        file: ".claude/agents/test-generator.md",
        desc: "Testing specialist. tools: Read, Write, Bash. Writes and runs tests. model: haiku (cheap).",
      },
    ],
    try: [
      "@code-reviewer review src/app.js",
      "@doc-writer generate README for this project",
      "@test-generator create tests for the UserService class",
      "Use /agents to inspect and create agents interactively",
    ],
    challenge: "Create a @performance-optimizer subagent (model: haiku) that reads files, profiles bottlenecks, and writes a report — never modifies source files",
    solution: "solutions/03-subagents/",
    notes: "Subagent files: .claude/agents/<name>.md — NOT .json. YAML frontmatter fields: name, description, tools, disallowedTools, model, permissionMode, hooks, maxTurns. Invoke with @name or let Claude use Task tool automatically.",
  },
  {
    module: "Exercise 4",
    title: "MCP Tools",
    color: "#F59E0B",
    icon: "🔧",
    duration: "~50 min",
    path: "exercises/04-mcp",
    description: "Add MCP servers to connect Claude to external systems. Configure in .mcp.json or .claude/settings.json. Each MCP server exposes tools Claude can call during a session.",
    commands: [
      {
        name: "GitHub MCP",
        file: ".mcp.json",
        desc: "Connect to GitHub to read issues, create PRs, and comment. Add with: claude mcp add --transport http github https://mcp.githubcopilot.com/mcp",
      },
      {
        name: "Custom file-analyzer",
        file: "src/mcp-servers/file-analyzer.js",
        desc: "Local stdio MCP server that exposes a analyze_file tool. Demonstrates building a custom MCP server with @modelcontextprotocol/sdk.",
      },
      {
        name: "Custom code-metrics",
        file: "src/mcp-servers/code-metrics.js",
        desc: "Exposes a get_metrics tool returning cyclomatic complexity and line counts. JSON Schema parameters for tool definition.",
      },
    ],
    try: [
      "claude mcp add --transport http github https://mcp.githubcopilot.com/mcp",
      "node src/mcp-servers/file-analyzer.js (start local server)",
      "claude mcp add --transport stdio file-analyzer -- node ./src/mcp-servers/file-analyzer.js",
      "Ask Claude: 'analyze the complexity of src/app.js'",
      "claude mcp list (verify servers are registered)",
    ],
    challenge: "Build a git-insights MCP server that exposes tools for: top contributors, commit frequency by day, and most changed files",
    solution: "solutions/04-mcp/",
    notes: "Config file: .mcp.json (project root) or .claude/settings.json mcpServers section. Keep under 10 MCPs active — too many shrink your context window by up to 60%.",
  },
  {
    module: "Exercise 5",
    title: "Hooks",
    color: "#10B981",
    icon: "🪝",
    duration: "~35 min",
    path: "exercises/05-hooks",
    description: "Configure deterministic lifecycle hooks in .claude/settings.json. Hooks guarantee execution — use them for linting, formatting, security checks, and notifications that MUST run regardless of model behavior.",
    commands: [
      {
        name: "PostToolUse auto-format",
        file: ".claude/settings.json",
        desc: "Runs prettier after every Write tool call: PostToolUse → matcher: 'Write' → command: 'npx prettier --write $FILE_PATH'",
      },
      {
        name: "PreToolUse bash validator",
        file: "scripts/validate-bash.sh",
        desc: "Blocks dangerous bash commands (rm -rf, curl | bash). Exit code 2 blocks the call and feeds error back to Claude.",
      },
      {
        name: "Notification hook",
        file: ".claude/settings.json",
        desc: "Fires on Notification events (task complete, needs input). Sends desktop OS notification so you know when Claude is done.",
      },
    ],
    try: [
      "Configure in .claude/settings.json or run /hooks interactively",
      "Ask Claude to write a file — watch prettier auto-run",
      "Ask Claude to run rm -rf — watch the hook block it",
      "Start a long task, walk away — get a notification when done",
    ],
    challenge: "Create a PostToolUse Write hook that runs your test suite when a *.test.* file is modified, then reports pass/fail back to Claude via exit code 2 on failure",
    solution: "solutions/05-hooks/",
    notes: "Exit codes: 0 = success/continue, 1 = warn + continue, 2 = block + feed error to Claude. Configure via /hooks interactively or edit .claude/settings.json directly.",
  },
  {
    module: "Exercise 6",
    title: "CLAUDE.md & Settings",
    color: "#3B82F6",
    icon: "⚙️",
    duration: "~25 min",
    path: "exercises/06-config",
    description: "Master CLAUDE.md project memory and .claude/settings.json for permissions, model defaults, and hooks. These are the foundation of all Claude Code customization.",
    commands: [
      {
        name: "CLAUDE.md",
        file: "CLAUDE.md",
        desc: "Project memory: stack, conventions, test commands, architecture decisions. Auto-generated with /init.",
      },
      {
        name: "settings.json",
        file: ".claude/settings.json",
        desc: "Permissions (allow/deny lists), default model, hook configuration, MCP servers.",
      },
      {
        name: "Subdirectory CLAUDE.md",
        file: "src/api/CLAUDE.md",
        desc: "Scoped rules: stricter conventions for the API layer only. Overrides root CLAUDE.md for sessions in that directory.",
      },
    ],
    try: [
      "/init  (auto-generate a CLAUDE.md for the project)",
      "Edit CLAUDE.md to add your team's conventions",
      "Add deny rules in settings.json: 'deny': ['Read(./.env)', 'Write(./production.config.*)']",
      "Create src/api/CLAUDE.md with API-specific rules",
      "claude doctor  (verify configuration is valid)",
    ],
    challenge: "Build a complete CLAUDE.md template for a Next.js + Prisma + PostgreSQL project including conventions, testing strategy, and deploy commands",
    solution: "solutions/06-config/CLAUDE.md",
    notes: "Hierarchy: ~/.claude/CLAUDE.md (global) → root CLAUDE.md → subdirectory CLAUDE.md. settings.json controls hard permissions — these override CLAUDE.md instructions.",
  },
  {
    module: "Exercise 7",
    title: "Plugins",
    color: "#EC4899",
    icon: "📦",
    duration: "~40 min",
    path: "exercises/07-plugins",
    description: "Install community plugins and build your own. Plugins bundle commands, skills, agents, hooks, and MCP servers into a single installable package for team distribution.",
    commands: [
      {
        name: "Install Anthropic skills",
        file: "Plugin registry",
        desc: "/plugin install document-skills@anthropic-agent-skills — installs PDF, PPTX, XLSX, DOCX skills",
      },
      {
        name: "Install example skills",
        file: "Plugin registry",
        desc: "/plugin install example-skills@anthropic-agent-skills — installs creative and technical example skills",
      },
      {
        name: "Build a team plugin",
        file: ".claude/plugin.json",
        desc: "Package your commands, skills, and agents into a distributable plugin for your organization",
      },
    ],
    try: [
      "/plugin install document-skills@anthropic-agent-skills",
      "/plugin list  (see installed plugins)",
      "Ask Claude to create a PDF report — watch the PDF skill auto-activate",
      "/plugin install example-skills@anthropic-agent-skills",
      "Browse skill catalog: /help",
    ],
    challenge: "Package the command + skill + subagent you built in Exercises 1–3 into a plugin. Write a plugin.json with metadata and publish to a GitHub repo.",
    solution: "solutions/07-plugins/",
    notes: "Plugin file structure: plugin.json (metadata) + commands/, skills/, agents/, hooks/ subdirectories. Install with /plugin install or claude plugin install from CLI.",
  },
  {
    module: "Exercise 8",
    title: "Agent Teams & /batch",
    color: "#F97316",
    icon: "🧩",
    duration: "~60 min",
    path: "exercises/08-agent-teams",
    description: "Orchestrate large-scale parallel work using Agent Teams and /batch. The /batch command decomposes your task, spawns one agent per unit in an isolated git worktree, runs tests, and opens a PR per unit.",
    commands: [
      {
        name: "/batch migration",
        file: "In-session command",
        desc: "Migrate all CommonJS require() calls to ESM import syntax across src/. Claude decomposes into units, spawns parallel agents, each opens a PR.",
      },
      {
        name: "/simplify",
        file: "In-session command",
        desc: "Spawns 3 parallel review agents (code reuse, quality, efficiency), aggregates findings, applies fixes. Run after any feature implementation.",
      },
      {
        name: "Manual Agent Team",
        file: "Prompt-based setup",
        desc: "Describe a multi-agent team in your prompt: lead + specialists. Teammates communicate and can self-assign from a shared task list.",
      },
    ],
    try: [
      "/batch add TypeScript strict type annotations to all files in src/",
      "/simplify  (run after implementing any feature)",
      "/batch migrate all .js files to .ts with full type inference",
      "Manual team: 'Use a team: one agent researches, one implements, one reviews'",
    ],
    challenge: "Use /batch to migrate a 10+ file Express app to TypeScript strict mode. Each agent handles one route file, runs tests, and opens a PR. Merge all PRs after all tests pass.",
    solution: "solutions/08-agent-teams/",
    notes: "Agent Teams require a git repository (for isolated worktrees). Teams consume 3–10x more tokens than single sessions. /batch is the safest entry point — it asks for approval before spawning agents.",
  },
  {
    module: "Exercise 9",
    title: "Full Integration Project",
    color: "#14B8A6",
    icon: "🚀",
    duration: "~90 min",
    path: "exercises/09-integration",
    description: "Build a complete AI-assisted development workflow combining all features: CLAUDE.md + commands + skills + subagents + MCP + hooks + plugins. Simulate a real production engineering workflow.",
    commands: [
      {
        name: "Full workflow",
        file: "All .claude/ files",
        desc: "CLAUDE.md → /pr command → code-reviewer subagent → PostToolUse format hook → GitHub MCP for PR creation",
      },
      {
        name: "/feature <name>",
        file: ".claude/commands/feature.md",
        desc: "End-to-end feature command: plan → implement → test → /simplify → /diff → /pr. Full cycle in one command.",
      },
      {
        name: "CI bot via Agent SDK",
        file: "scripts/ci-review.ts",
        desc: "TypeScript Agent SDK script that triggers on PR webhooks, runs @code-reviewer, and posts review comments via GitHub MCP.",
      },
    ],
    try: [
      "Set up a complete .claude/ directory with all config",
      "/feature add-user-profile-endpoint",
      "Watch: it plans → implements → tests → reviews → PRs",
      "Push to GitHub → CI bot auto-reviews the PR",
    ],
    challenge: "Build a complete development environment for a new team member to clone and immediately have AI-assisted workflows: CLAUDE.md, 3 skills, 2 subagents, 2 hooks, GitHub MCP, and a /feature command that does the full cycle.",
    solution: "solutions/09-integration/",
    notes: "This exercise combines everything. Suggested order: CLAUDE.md first → settings.json permissions → hooks → MCP → commands → skills → subagents. Test each piece independently before combining.",
  },
];