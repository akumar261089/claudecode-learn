import { useState } from "react";
import { curriculum, exercises } from "./data/curriculum";

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`
        : "255,255,255";
}

// ─── ALL CONTENT VERIFIED AGAINST OFFICIAL DOCS (March 2026, v2.1.72) ───────

const commands = [
    {
        category: "Installation & Setup",
        color: "#4ECDC4",
        icon: "🔧",
        items: [
            {
                cmd: "npm install -g @anthropic-ai/claude-code",
                desc: "Install Claude Code globally on your system. Requires Node.js 18+.",
                examples: [
                    { label: "Install latest", code: "npm install -g @anthropic-ai/claude-code" },
                    { label: "Update to latest", code: "npm update -g @anthropic-ai/claude-code" },
                    // FIX: added 'claude update' which is the in-tool update command
                    { label: "Update from within Claude Code", code: "claude update" },
                    { label: "Verify install & diagnose", code: "claude doctor" },
                    { label: "Check version", code: "claude --version" },
                ],
            },
            {
                cmd: "export ANTHROPIC_API_KEY=sk-...",
                desc: "Set your Anthropic API key as an environment variable. Required before first launch.",
                examples: [
                    { label: "Set in terminal session", code: "export ANTHROPIC_API_KEY=sk-ant-xxxx" },
                    { label: "Add to .bashrc permanently", code: "echo 'export ANTHROPIC_API_KEY=sk-ant-xxxx' >> ~/.bashrc" },
                    { label: "Add to .zshrc permanently", code: "echo 'export ANTHROPIC_API_KEY=sk-ant-xxxx' >> ~/.zshrc" },
                    { label: "Use a .env file", code: "echo 'ANTHROPIC_API_KEY=sk-ant-xxxx' > .env" },
                ],
            },
            {
                // FIX: added claude auth login as the modern login method (v2.1.41+)
                cmd: "claude auth login",
                desc: "Log in to your Anthropic account directly from the CLI (v2.1.41+). Alternative to the API key env var.",
                examples: [
                    { label: "Login via browser", code: "claude auth login" },
                    { label: "Logout", code: "claude auth logout" },
                    { label: "Check auth status", code: "claude auth status" },
                ],
            },
        ],
    },
    {
        category: "Starting Sessions",
        color: "#A855F7",
        icon: "⚡",
        items: [
            {
                cmd: "claude",
                desc: "Start an interactive REPL session in your current directory. Every new run is a fresh session.",
                examples: [
                    { label: "Start fresh session", code: "claude" },
                    { label: "Start in a specific directory", code: "cd my-project && claude" },
                    { label: "Start with initial prompt (seeds context)", code: 'claude "explain this codebase to me"' },
                ],
            },
            {
                // FIX: -c / --continue is the correct flag for "most recent session"
                cmd: "claude -c",
                desc: "Continue (resume) the most recent conversation. Short for --continue. Picks up right where you left off.",
                examples: [
                    { label: "Continue most recent session", code: "claude -c" },
                    { label: "Continue and add a prompt immediately", code: 'claude -c "now write the tests for what we just built"' },
                ],
            },
            {
                // FIX: --resume / -r is for picking a specific session, not "most recent"
                cmd: "claude --resume",
                desc: "Open an interactive session picker to resume any past session. Use -r <id> to jump directly to a session by ID.",
                examples: [
                    { label: "Open session picker", code: "claude --resume" },
                    { label: "Resume specific session by ID (short flag)", code: 'claude -r "auth-refactor" "continue from where we left off"' },
                    // FIX: sessions are stored in ~/.claude/projects/ — no --list-sessions flag exists
                    { label: "Find old sessions manually", code: "ls ~/.claude/projects/" },
                    { label: "Name a session for easy retrieval later (in-session)", code: "/rename auth-refactor" },
                ],
            },
        ],
    },
    {
        category: "Output & Automation",
        color: "#F59E0B",
        icon: "🤖",
        items: [
            {
                // FIX: correct short flag is -p, not --print (though --print also works)
                cmd: "claude -p",
                desc: "Print mode: send a query and exit non-interactively. Ideal for scripts, CI pipelines, and shell piping. Alias: --print",
                examples: [
                    { label: "Get explanation as text", code: 'claude -p "summarize src/index.js"' },
                    { label: "Pipe stdin into Claude", code: 'cat error.log | claude -p "explain this error"' },
                    { label: "Pipe output into a file", code: 'claude -p "generate a changelog" > CHANGELOG.md' },
                    { label: "Use in bash variable", code: 'SUMMARY=$(claude -p "summarize this PR diff")' },
                    { label: "Chain with grep", code: 'claude -p "list all TODO comments" | grep "URGENT"' },
                    // FIX: --max-turns prevents runaway loops in automation
                    { label: "Cap agentic turns in CI", code: 'claude --max-turns 5 -p "fix lint errors"' },
                ],
            },
            {
                cmd: "claude --output-format json",
                desc: "Output the full response as structured JSON. Best combined with -p for scripting.",
                examples: [
                    { label: "JSON output", code: 'claude -p --output-format json "list all exported functions"' },
                    { label: "Extract session ID for chaining", code: "session_id=$(claude -p --output-format json \"start review\" | jq -r '.session_id')" },
                    { label: "Pipe to jq", code: "claude -p --output-format json \"audit dependencies\" | jq '.issues'" },
                    { label: "Save JSON report", code: 'claude -p --output-format json "security scan" > report.json' },
                ],
            },
            {
                // FIX: removed the -f flag (not documented). Correct approach is --append-system-prompt or --system-prompt
                cmd: "claude --system-prompt",
                desc: "Replace the default system prompt for this session. Use --append-system-prompt to add to it instead.",
                examples: [
                    { label: "Replace system prompt", code: 'claude --system-prompt "You are a security-focused code reviewer"' },
                    { label: "Append to existing system prompt", code: 'claude --append-system-prompt "Always suggest tests for any code you write"' },
                    // Workaround for prompt files: pipe them in
                    { label: "Load a prompt from a file (workaround)", code: 'claude -p --append-system-prompt "$(cat prompts/refactor.md)" "refactor the auth module"' },
                ],
            },
        ],
    },
    {
        category: "Model Selection",
        color: "#10B981",
        icon: "🧠",
        items: [
            {
                cmd: "claude --model",
                desc: "Specify which Claude model to use. Accepts full model strings or short aliases like 'sonnet', 'haiku', 'opus'.",
                examples: [
                    // FIX: updated model strings to current (March 2026)
                    { label: "Use Sonnet (default, best balance)", code: "claude --model claude-sonnet-4-6" },
                    { label: "Use Opus (most capable, use sparingly)", code: "claude --model claude-opus-4-6" },
                    // FIX: corrected Haiku model string
                    { label: "Use Haiku (fastest, most token-efficient)", code: "claude --model claude-haiku-4-5" },
                    { label: "Short alias — model picker", code: "claude --model haiku" },
                    { label: "One-shot with Opus for complex task", code: 'claude --model opus "architect a new payments service"' },
                    // FIX: added /model in-session command
                    { label: "Switch model mid-session (in-session command)", code: "/model" },
                ],
            },
        ],
    },
    {
        category: "Permissions & Safety",
        color: "#EF4444",
        icon: "🔒",
        items: [
            {
                cmd: "claude --allowedTools",
                desc: "Whitelist only specific tools Claude is permitted to use. Tool names are capitalized. Bash commands can be scoped.",
                examples: [
                    // FIX: tool names are capitalized: Read, Write, Bash — not lowercase
                    { label: "Allow only file reads", code: 'claude --allowedTools "Read"' },
                    { label: "Allow bash and write", code: 'claude --allowedTools "Read,Write,Bash"' },
                    { label: "Scope Bash to git only (safe)", code: 'claude --allowedTools "Read,Write,Bash(git *)"' },
                    { label: "Read-only audit mode", code: 'claude --allowedTools "Read" -p "audit this codebase for security issues"' },
                ],
            },
            {
                cmd: "claude --disallowedTools",
                desc: "Blacklist specific tools, allowing everything else. Useful for safe review or analysis sessions.",
                examples: [
                    { label: "Prevent bash execution", code: 'claude --disallowedTools "Bash"' },
                    { label: "Block writes and bash", code: 'claude --disallowedTools "Write,Bash"' },
                    // FIX: prevent deleting files specifically with bash scope
                    { label: "Block destructive bash commands only", code: 'claude --disallowedTools "Bash(rm *)"' },
                    { label: "Safe review mode", code: 'claude --disallowedTools "Bash,Write" "review my code and suggest improvements"' },
                ],
            },
            {
                cmd: "claude --dangerously-skip-permissions",
                desc: "Skip all permission prompts. Only use in fully trusted, automated environments like CI containers.",
                examples: [
                    { label: "CI pipeline usage", code: 'claude --dangerously-skip-permissions -p "fix lint errors"' },
                    { label: "Automated refactor with turn cap", code: 'claude --dangerously-skip-permissions --max-turns 10 -p "apply nightly refactor"' },
                ],
            },
            {
                // FIX: added --sandbox flag (available on Linux/macOS) — important safety feature
                cmd: "claude --sandbox",
                desc: "Run in an isolated sandbox — restricts Bash to a safe environment so it cannot modify your real filesystem.",
                examples: [
                    { label: "Start sandboxed session", code: "claude --sandbox" },
                    { label: "Sandboxed one-shot task", code: 'claude --sandbox -p "run the test suite and report failures"' },
                ],
            },
        ],
    },
    {
        category: "In-Session Slash Commands",
        color: "#6366F1",
        icon: "💬",
        items: [
            {
                cmd: "/help",
                desc: "Show all available slash commands including custom commands from .claude/commands/ and connected MCP servers.",
                examples: [{ label: "Show help", code: "/help" }],
            },
            {
                cmd: "/clear",
                desc: "Wipe conversation history and start fresh context. Use when switching to a completely unrelated task.",
                examples: [
                    { label: "Clear context", code: "/clear" },
                    { label: "Clear then start new task", code: "/clear\nNow help me build a login form" },
                ],
            },
            {
                cmd: "/compact",
                desc: "Compress conversation history to free context window space. Optionally pass focus instructions to control what survives.",
                examples: [
                    { label: "Compact with no focus", code: "/compact" },
                    { label: "Compact, retain specific context", code: "/compact keep the database schema and error handling patterns" },
                    { label: "Compact, focus on auth module", code: "/compact retain the authentication flow and test results" },
                ],
            },
            {
                // FIX: /cost is real; /status is gone — replaced by /context and /model
                cmd: "/cost",
                desc: "Display estimated token usage and cost for the current session. Essential for budget-aware development.",
                examples: [{ label: "Check session cost", code: "/cost" }],
            },
            {
                // FIX: /context is the command for checking context window usage (replaces the old /status)
                cmd: "/context",
                desc: "Show current context window usage — how full your conversation buffer is. Use before deciding to /compact or /clear.",
                examples: [
                    { label: "Check context usage", code: "/context" },
                    { label: "Typical workflow", code: "# Check usage\n/context\n# If over 80%, compact\n/compact retain the key decisions" },
                ],
            },
            {
                cmd: "/model",
                desc: "Switch the Claude model mid-session without restarting. Opens an interactive model picker.",
                examples: [
                    { label: "Open model picker", code: "/model" },
                    { label: "When to switch to Opus", code: "# Use Opus for complex architecture decisions\n/model\n# Pick claude-opus-4-6" },
                ],
            },
            {
                cmd: "/resume",
                desc: "Open a session picker inside an active session to jump to a past conversation. Alias: /continue",
                examples: [
                    { label: "Open session picker", code: "/resume" },
                    { label: "Resume then immediately ask a question", code: "/resume\n# Select your session from the list" },
                ],
            },
            {
                cmd: "/rename",
                desc: "Give the current session a human-readable name so it's easy to find with --resume later.",
                examples: [
                    { label: "Name current session", code: "/rename auth-refactor" },
                    { label: "Name a debugging session", code: "/rename orders-500-debug" },
                ],
            },
            {
                cmd: "/init",
                desc: "Scan the current project and generate a starter CLAUDE.md file with detected conventions.",
                examples: [{ label: "Initialize project memory", code: "/init" }],
            },
            {
                cmd: "/diff",
                desc: "Show a diff of all changes made by Claude in the current session. Use before committing to review Claude's work.",
                examples: [
                    { label: "Review all session changes", code: "/diff" },
                    { label: "Typical pre-commit workflow", code: "/diff\n# Review changes\ngit add . && git commit -m 'feat: ...' " },
                ],
            },
        ],
    },
    {
        category: "Git & Version Control",
        color: "#FF6B35",
        icon: "🌿",
        items: [
            {
                cmd: "claude (git commit messages)",
                desc: "Ask Claude to generate meaningful commit messages based on your staged diff.",
                examples: [
                    { label: "Generate commit message", code: 'claude -p "write a commit message for my staged changes: $(git diff --staged)"' },
                    { label: "Conventional commit format", code: 'claude -p "write a conventional commit (feat/fix/chore) for: $(git diff --staged)"' },
                    { label: "Pipe into git commit", code: 'claude -p "write a git commit message for $(git diff --staged)" | git commit -F -' },
                ],
            },
            {
                cmd: "claude (PR descriptions)",
                desc: "Generate pull request titles and descriptions from your branch diff.",
                examples: [
                    { label: "Generate PR description", code: 'claude -p "write a PR description for: $(git diff main...HEAD)"' },
                    { label: "Structured PR with checklist", code: 'claude -p "write a PR description with: summary, list of changes, and testing checklist for: $(git diff main...HEAD)"' },
                ],
            },
            {
                cmd: "claude (merge conflict resolution)",
                desc: "Resolve merge conflicts intelligently using AI understanding of code intent.",
                examples: [
                    { label: "Resolve all conflicts", code: 'claude "resolve the merge conflicts in src/ keeping the newer logic"' },
                    { label: "Explain conflicts first", code: 'claude "explain the merge conflicts in auth.js before resolving them"' },
                ],
            },
        ],
    },
    {
        category: "Configuration Files",
        color: "#EC4899",
        icon: "📄",
        items: [
            {
                cmd: "CLAUDE.md",
                desc: "Project memory file — Claude reads this at the start of every session. Acts as a 'constitution' for your codebase.",
                examples: [
                    { label: "Auto-generate with /init", code: "/init" },
                    { label: "Sample CLAUDE.md content", code: "# Project: MyApp\nStack: Next.js, Prisma, PostgreSQL\nConventions: Arrow functions, no semicolons, Vitest for tests\nValidate API responses with Zod\nTest: Run `npm test` before committing" },
                    { label: "Scope to a subdirectory", code: "# Place a CLAUDE.md in src/api/ to scope rules to that folder only" },
                ],
            },
            {
                // FIX: updated custom commands to include proper frontmatter (the correct format)
                cmd: ".claude/commands/",
                desc: "Directory for custom slash commands shared across your team via git. Each .md file becomes a /commandname command.",
                examples: [
                    { label: "Create a /catchup command", code: "mkdir -p .claude/commands\ncat > .claude/commands/catchup.md << 'EOF'\n---\ndescription: Summarize all changed files in the current git branch\n---\nRead all files changed in the current branch vs main and write a brief summary of what changed and why.\nEOF" },
                    { label: "Parameterized command (use $ARGUMENTS)", code: "cat > .claude/commands/test.md << 'EOF'\n---\ndescription: Write tests for a given class or file\n---\nWrite comprehensive unit tests for: $ARGUMENTS\nInclude edge cases and error conditions.\nEOF\n# Usage: /test UserService" },
                    { label: "Scoped to user only (not committed)", code: "# Personal commands go in ~/.claude/commands/ instead\nmkdir -p ~/.claude/commands" },
                ],
            },
            {
                cmd: ".claude/settings.json",
                desc: "Project-level settings file for permissions, allowed tools, hooks, and model configuration.",
                examples: [
                    { label: "Sample settings.json", code: '{\n  "model": "claude-sonnet-4-6",\n  "permissions": {\n    "allow": [\n      "Read",\n      "Write",\n      "Bash(git *)"\n    ],\n    "deny": [\n      "Read(./.env)",\n      "Write(./production.config.*)"\n    ]\n  }\n}' },
                    { label: "Add a PostToolUse hook (auto-format on write)", code: '{\n  "hooks": {\n    "PostToolUse": [{\n      "matcher": "Write(*.py)",\n      "hooks": [{\n        "type": "command",\n        "command": "python -m black $FILE_PATH"\n      }]\n    }]\n  }\n}' },
                ],
            },
            {
                cmd: ".claudeignore",
                desc: "Tell Claude which files and folders to skip — same syntax as .gitignore.",
                examples: [
                    { label: "Sample .claudeignore", code: "node_modules/\ndist/\n.env\n*.log\ncoverage/\n.next/" },
                    { label: "Ignore secrets and keys", code: "**/*.pem\n**/*.key\nsecrets/\n.env*" },
                ],
            },
        ],
    },
];

const advantages = [
    {
        title: "Truly Agentic",
        icon: "🤖",
        color: "#FF6B35",
        desc: "Unlike simple autocomplete tools, Claude Code executes full multi-step tasks autonomously — it reads files, runs tests, makes edits, and verifies results all in one flow.",
        flow: [
            "You: 'Add input validation to all API routes'",
            "Claude reads all route files to understand existing patterns",
            "Claude identifies missing validation cases in each route",
            "Claude writes and applies changes to each file",
            "Claude runs the test suite to verify nothing broke",
            "Claude reports a summary of what changed and why",
        ],
        prompts: [
            'claude "Add rate limiting to all public API endpoints"',
            'claude "Migrate all callbacks in src/ to async/await"',
            'claude "Find and fix all TypeScript type errors in the project"',
        ],
    },
    {
        title: "Whole-Codebase Context",
        icon: "📁",
        color: "#4ECDC4",
        desc: "Claude Code reads your entire repository before responding — not just the open file. Suggestions are accurate, consistent, and aware of your project's real conventions.",
        flow: [
            "You open a new session in your project root",
            "Claude scans directory structure and key files",
            "Claude reads CLAUDE.md for project rules and conventions",
            "Claude builds a mental model of your architecture",
            "All answers reference real code and real imports in your repo",
            "No hallucinated function names or wrong import paths",
        ],
        prompts: [
            '"What design patterns are used across this codebase?"',
            '"Where is user authentication handled and how does it flow?"',
            '"Are there any circular dependencies in the module structure?"',
        ],
    },
    {
        title: "Terminal-Native",
        icon: "⌨️",
        color: "#A855F7",
        desc: "Claude Code lives in your terminal — the same place you run builds, tests, and deploys. No IDE switching, no browser tabs, no copy-paste. It fits naturally into every developer workflow.",
        flow: [
            "You're already in the terminal running tests",
            "A test fails — you ask Claude to explain and fix it",
            "Claude edits the file directly in your filesystem",
            "You re-run tests in the same terminal window",
            "Everything stays in one environment — zero context switching",
        ],
        prompts: [
            '"The test `auth.test.js:42` is failing — fix it"',
            '"My build is failing with this error: [paste error]"',
            '"Run the linter and fix all auto-fixable issues"',
        ],
    },
    {
        title: "MCP Extensibility",
        icon: "🔌",
        color: "#F59E0B",
        desc: "The Model Context Protocol connects Claude Code to any external service — databases, GitHub, Jira, Slack, and more — turning it into a full engineering workflow assistant.",
        flow: [
            "You add a GitHub MCP server: claude mcp add github <url>",
            "Claude can now read/create GitHub issues and PRs",
            "You ask: 'Create a PR for my feature branch'",
            "Claude pushes the branch and creates a PR with a description",
            "You add a Jira MCP server and Claude links relevant tickets",
            "Full workflow automation without leaving the terminal",
        ],
        prompts: [
            '"Create a GitHub PR for this branch with a detailed description"',
            '"Query the database and show me the top 10 slowest queries"',
            '"Post a summary of today\'s changes to the #dev-updates Slack channel"',
        ],
    },
    {
        title: "Custom Slash Commands",
        icon: "⚡",
        color: "#10B981",
        desc: "Define reusable workflows as slash commands in .claude/commands/ and commit them. Every developer on your team gets the same AI-powered shortcuts automatically.",
        flow: [
            "Team lead creates .claude/commands/catchup.md",
            "File contains a structured prompt with frontmatter",
            "Developer runs /catchup from any machine after cloning",
            "Claude reads all changed files and summarizes the branch",
            "Consistent, repeatable AI workflow for the whole team",
            "Commands evolve in git alongside the codebase",
        ],
        prompts: [
            "/catchup — Summarize all changed files vs main",
            "/pr — Stage, clean up, and draft a PR description",
            "/test UserService — Write tests for the UserService class",
        ],
    },
    {
        title: "Safety by Design",
        icon: "🛡️",
        color: "#EF4444",
        desc: "Every tool call Claude makes is visible, confirmable, and reversible. You control exactly what Claude can read, write, and execute — with fine-grained permission scoping.",
        flow: [
            "Claude proposes a file change",
            "You see a clear diff before it's applied",
            "You approve or reject each action interactively",
            'Use --allowedTools "Read,Bash(git *)" to scope permissions',
            "Use --sandbox to prevent any real filesystem writes",
            "Git history preserves every AI-made change for audit",
        ],
        prompts: [
            'claude --allowedTools "Read" "audit this codebase for secrets"',
            'claude --disallowedTools "Bash,Write" "refactor the database module"',
            'claude --sandbox "run the test suite and report failures"',
        ],
    },
    {
        title: "Automated Testing & Verification",
        icon: "✅",
        color: "#22C55E",
        desc: "Claude Code doesn't just write code — it verifies its own work by running your test suite, linters, and type checkers, then iterates until everything passes.",
        flow: [
            "You ask Claude to implement a new feature",
            "Claude implements the feature across relevant files",
            "Claude runs your test suite automatically",
            "Tests fail — Claude reads the error output and fixes them",
            "Claude re-runs tests until all pass",
            "Claude reports the final clean test output to you",
        ],
        prompts: [
            '"Implement pagination for the /users endpoint, then make all tests pass"',
            '"Add the new feature and write tests that cover edge cases"',
            '"Fix any failing tests in the auth module"',
        ],
    },
    {
        title: "Team Knowledge Sharing",
        icon: "🤝",
        color: "#6366F1",
        desc: "CLAUDE.md acts as living documentation that teaches Claude your team's conventions. New developers onboard faster, and AI assistance is consistent across every team member.",
        flow: [
            "Senior dev writes a detailed CLAUDE.md with project rules",
            "New developer joins and clones the repo",
            "They run 'claude' and instantly get context-aware help",
            "Claude knows the stack, patterns, testing strategy, and rules",
            "Consistent AI assistance for every team member",
            "CLAUDE.md is updated in git as the project evolves",
        ],
        prompts: [
            '"Explain the architecture of this project to a new developer"',
            '"What conventions should I follow when adding a new API endpoint?"',
            '"What\'s the testing strategy for this project?"',
        ],
    },
];

const sampleWorkflows = [
    {
        title: "🐛 Bug Fix Workflow",
        color: "#EF4444",
        steps: [
            { prompt: 'claude "there\'s a 500 error on POST /api/orders — find and fix the root cause"', note: "Describe the bug precisely" },
            { prompt: 'claude "write a regression test that would have caught the orders bug"', note: "Prevent recurrence" },
            { prompt: '/diff', note: "Review all changes before committing" },
            { prompt: 'claude -p "write a conventional commit message for: $(git diff --staged)"', note: "Document the fix" },
        ],
    },
    {
        title: "🚀 New Feature Workflow",
        color: "#10B981",
        steps: [
            { prompt: 'claude "plan how to add OAuth login to this Express app — list files to create or modify"', note: "Plan before coding" },
            { prompt: 'claude "implement the plan step by step, starting with the OAuth middleware"', note: "Execute the plan" },
            { prompt: 'claude "write integration tests for the full OAuth login flow"', note: "Test thoroughly" },
            { prompt: 'claude -p "write a PR description for: $(git diff main...HEAD)"', note: "Document for review" },
        ],
    },
    {
        title: "♻️ Refactoring Workflow",
        color: "#A855F7",
        steps: [
            { prompt: 'claude --allowedTools "Read" "list every file that imports from UserAPI"', note: "Audit first, read-only" },
            { prompt: 'claude "migrate all UserAPI usages to the new UserService interface"', note: "Execute migration" },
            { prompt: 'claude "run the test suite and fix anything that broke during migration"', note: "Verify integrity" },
            { prompt: 'claude "update the README architecture section to reflect UserService"', note: "Keep docs current" },
        ],
    },
    {
        title: "🔍 Code Review Workflow",
        color: "#F59E0B",
        steps: [
            { prompt: 'claude --allowedTools "Read" "review staged changes for logic bugs and edge cases"', note: "Safe read-only review" },
            { prompt: 'claude --allowedTools "Read" "check the diff for security vulnerabilities or secrets"', note: "Security audit" },
            { prompt: '/diff', note: "Final visual check before commit" },
        ],
    },
];

export default function ClaudeCodeCurriculum() {
    const [activeModule, setActiveModule] = useState(null);
    const [activeTopic, setActiveTopic] = useState(null);
    const [activeCommand, setActiveCommand] = useState(null);
    const [activeAdvantage, setActiveAdvantage] = useState(null);
    const [activeExercise, setActiveExercise] = useState(null);
    const [activeSection, setActiveSection] = useState("curriculum");

    const totalTopics = curriculum.reduce((sum, m) => sum + m.topics.length, 0);
    const totalSubtopics = curriculum.reduce(
        (sum, m) => sum + m.topics.reduce((s, t) => s + t.subtopics.length, 0), 0
    );

    const navItems = [
        { id: "curriculum", label: "📚 Curriculum" },
        { id: "exercises", label: "🧩 Exercises" },
        { id: "commands", label: "⚡ Commands" },
        { id: "advantages", label: "★ Advantages" },
        { id: "workflows", label: "🔄 Workflows" },
    ];

    return (
        <div style={{ fontFamily: "'Georgia', 'Times New Roman', serif", background: "#0A0A0F", minHeight: "100vh", color: "#E8E8F0", padding: "0", overflowX: "hidden" }}>

            {/* Header */}
            <div style={{ background: "linear-gradient(135deg, #0D0D1A 0%, #1A0A2E 50%, #0D0D1A 100%)", borderBottom: "1px solid #2A2A4A", padding: "50px 40px 40px", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: "-40px", right: "10%", width: "300px", height: "300px", background: "radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
                <div style={{ position: "absolute", bottom: "-60px", left: "5%", width: "250px", height: "250px", background: "radial-gradient(circle, rgba(78,205,196,0.1) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />

                <div style={{ position: "relative", maxWidth: "1100px", margin: "0 auto" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(168,85,247,0.15)", border: "1px solid rgba(168,85,247,0.4)", borderRadius: "20px", padding: "6px 16px", marginBottom: "20px", fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", color: "#C084FC" }}>
                        ◆ Complete Tutorial Curriculum
                    </div>
                    <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: "800", lineHeight: "1.1", margin: "0 0 12px", background: "linear-gradient(135deg, #FFFFFF 0%, #C084FC 50%, #4ECDC4 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "-1px" }}>
                        Claude Code
                    </h1>
                    <p style={{ fontSize: "1.2rem", color: "#9090C0", margin: "0 0 8px", fontStyle: "italic" }}>
                        From Zero to Agentic AI Developer — The Definitive Guide
                    </p>
                    <p style={{ fontSize: "0.75rem", color: "#404060", margin: "0 0 32px", letterSpacing: "0.5px" }}>
                        ✓ All commands verified against official docs · v2.1.72 · March 2026
                    </p>

                    <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
                        {[
                            { label: "Modules", value: curriculum.length, color: "#C084FC" },
                            { label: "Topics", value: totalTopics, color: "#4ECDC4" },
                            { label: "Subtopics", value: totalSubtopics, color: "#F59E0B" },
                            { label: "Exercises", value: exercises.length, color: "#6366F1" },
                            { label: "Commands", value: commands.reduce((s, c) => s + c.items.length, 0), color: "#10B981" },
                            { label: "Total Hours", value: "~55", color: "#EF4444" },
                        ].map(stat => (
                            <div key={stat.label} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "14px 20px", textAlign: "center", minWidth: "90px" }}>
                                <div style={{ fontSize: "1.8rem", fontWeight: "900", color: stat.color, lineHeight: 1 }}>{stat.value}</div>
                                <div style={{ fontSize: "0.7rem", color: "#606080", letterSpacing: "1px", marginTop: "4px" }}>{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Nav Tabs */}
            <div style={{ background: "#0D0D18", borderBottom: "1px solid #1E1E30", position: "sticky", top: 0, zIndex: 100 }}>
                <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 40px", display: "flex", gap: "4px" }}>
                    {navItems.map(nav => (
                        <button key={nav.id} onClick={() => setActiveSection(nav.id)} style={{ background: activeSection === nav.id ? "rgba(168,85,247,0.15)" : "transparent", border: "none", borderBottom: activeSection === nav.id ? "2px solid #C084FC" : "2px solid transparent", color: activeSection === nav.id ? "#C084FC" : "#606080", padding: "16px 20px", cursor: "pointer", fontSize: "0.85rem", fontFamily: "inherit", fontWeight: "600", letterSpacing: "0.5px", transition: "all 0.2s", whiteSpace: "nowrap" }}>
                            {nav.label}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px" }}>

                {/* CURRICULUM SECTION */}
                {activeSection === "curriculum" && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
                        {curriculum.map((mod, mi) => {
                            const isActive = activeModule === mi;
                            return (
                                <div key={mi} style={{ background: isActive ? `linear-gradient(135deg, rgba(${hexToRgb(mod.color)},0.12) 0%, #141420 100%)` : "#111118", border: `1px solid ${isActive ? mod.color + "60" : "#1E1E30"}`, borderRadius: "16px", overflow: "hidden", cursor: "pointer", transition: "all 0.25s ease", transform: isActive ? "translateY(-2px)" : "translateY(0)", boxShadow: isActive ? `0 8px 32px rgba(${hexToRgb(mod.color)},0.15)` : "none" }} onClick={() => setActiveModule(isActive ? null : mi)}>
                                    <div style={{ padding: "20px 24px", borderBottom: `1px solid ${isActive ? mod.color + "40" : "#1A1A28"}`, display: "flex", alignItems: "flex-start", gap: "16px" }}>
                                        <div style={{ width: "44px", height: "44px", background: `rgba(${hexToRgb(mod.color)},0.15)`, border: `1px solid rgba(${hexToRgb(mod.color)},0.3)`, borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0 }}>
                                            {mod.icon}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontSize: "10px", letterSpacing: "2px", color: mod.color, textTransform: "uppercase", marginBottom: "4px" }}>{mod.module}</div>
                                            <div style={{ fontSize: "1rem", fontWeight: "700", color: "#E8E8F8", lineHeight: 1.3 }}>{mod.title}</div>
                                            <div style={{ fontSize: "11px", color: "#505070", marginTop: "6px" }}>{mod.duration} · {mod.topics.length} topics</div>
                                        </div>
                                        <div style={{ color: mod.color, fontSize: "18px", transform: isActive ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s", flexShrink: 0, marginTop: "4px" }}>›</div>
                                    </div>
                                    {isActive && (
                                        <div style={{ padding: "16px 24px 20px" }}>
                                            {mod.topics.map((topic, ti) => {
                                                const topicKey = `${mi}-${ti}`;
                                                const topicActive = activeTopic === topicKey;
                                                return (
                                                    <div key={ti} style={{ marginBottom: "10px" }}>
                                                        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", background: topicActive ? `rgba(${hexToRgb(mod.color)},0.1)` : "rgba(255,255,255,0.03)", borderRadius: "8px", cursor: "pointer", border: `1px solid ${topicActive ? mod.color + "40" : "transparent"}`, transition: "all 0.15s" }} onClick={(e) => { e.stopPropagation(); setActiveTopic(topicActive ? null : topicKey); }}>
                                                            <span style={{ width: "22px", height: "22px", background: `rgba(${hexToRgb(mod.color)},0.2)`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", color: mod.color, fontWeight: "800", flexShrink: 0 }}>{ti + 1}</span>
                                                            <span style={{ fontSize: "0.875rem", fontWeight: "600", color: "#D0D0E8", flex: 1 }}>{topic.title}</span>
                                                            <span style={{ fontSize: "11px", color: "#404060", background: "rgba(255,255,255,0.05)", padding: "2px 8px", borderRadius: "10px" }}>{topic.subtopics.length}</span>
                                                            <span style={{ color: "#505070", fontSize: "12px", transform: topicActive ? "rotate(90deg)" : "none", transition: "0.15s" }}>›</span>
                                                        </div>
                                                        {topicActive && (
                                                            <ul style={{ margin: "8px 0 0 0", padding: "14px 18px", background: "rgba(0,0,0,0.3)", borderRadius: "8px", borderLeft: `2px solid ${mod.color}60`, listStyle: "none" }}>
                                                                {topic.subtopics.map((sub, si) => (
                                                                    <li key={si} style={{ fontSize: "0.82rem", color: "#9090B8", padding: "5px 0", borderBottom: si < topic.subtopics.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", display: "flex", alignItems: "flex-start", gap: "8px", lineHeight: 1.5 }}>
                                                                        <span style={{ color: mod.color, fontSize: "8px", marginTop: "5px", flexShrink: 0 }}>◆</span>
                                                                        <span>
                                                                            {sub.split(/(`[^`]+`)/g).map((part, pi) =>
                                                                                part.startsWith("`") && part.endsWith("`")
                                                                                    ? <code key={pi} style={{ background: `rgba(${hexToRgb(mod.color)},0.12)`, color: mod.color, padding: "1px 6px", borderRadius: "4px", fontFamily: "monospace", fontSize: "0.78rem" }}>{part.slice(1, -1)}</code>
                                                                                    : part
                                                                            )}
                                                                        </span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* EXERCISES SECTION */}
                {activeSection === "exercises" && (
                    <div>
                        <p style={{ color: "#606080", marginBottom: "32px", fontSize: "0.9rem" }}>
                            Hands-on exercises with recipes, challenges, and starter files to build your Claude Code skills.
                        </p>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
                            {exercises.map((ex, ei) => {
                                const isOpen = activeExercise === ei;
                                return (
                                    <div key={ei} onClick={() => setActiveExercise(isOpen ? null : ei)} style={{ background: isOpen ? "rgba(255,255,255,0.06)" : "#111118", border: `1px solid ${isOpen ? "rgba(255,255,255,0.24)" : "#1E1E30"}`, borderRadius: "16px", overflow: "hidden", cursor: "pointer", transition: "all 0.25s ease", transform: isOpen ? "translateY(-2px)" : "translateY(0)", boxShadow: isOpen ? "0 12px 30px rgba(0,0,0,0.4)" : "none" }}>
                                        <div style={{ padding: "20px 24px", display: "flex", alignItems: "center", gap: "16px" }}>
                                            <div style={{ width: "44px", height: "44px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", flexShrink: 0 }}>
                                                {ex.icon}
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ fontSize: "10px", letterSpacing: "2px", color: "#C0C0E8", textTransform: "uppercase", marginBottom: "4px" }}>{ex.module}</div>
                                                <div style={{ fontSize: "1rem", fontWeight: "700", color: "#E8E8F8", lineHeight: 1.3 }}>{ex.title}</div>
                                                <div style={{ fontSize: "11px", color: "#505070", marginTop: "6px" }}>{ex.duration} · {ex.commands.length} commands</div>
                                            </div>
                                            <div style={{ color: "#C084FC", fontSize: "18px", transform: isOpen ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s", flexShrink: 0, marginTop: "4px" }}>›</div>
                                        </div>
                                        {isOpen && (
                                            <div style={{ padding: "16px 24px 20px" }} onClick={e => e.stopPropagation()}>
                                                <p style={{ color: "#9090B8", marginBottom: "16px", fontSize: "0.9rem" }}>{ex.description}</p>
                                                <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", marginBottom: "18px" }}>
                                                    <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "10px 14px", fontSize: "0.75rem", color: "#C0C0E8" }}><strong>Path:</strong> {ex.path}</div>
                                                    {ex.solution && (
                                                        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "10px 14px", fontSize: "0.75rem", color: "#C0C0E8" }}><strong>Solution:</strong> {ex.solution}</div>
                                                    )}
                                                </div>
                                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "12px" }}>
                                                    {ex.commands.map((cmd, ci) => (
                                                        <div key={ci} style={{ background: "rgba(0,0,0,0.35)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "12px" }}>
                                                            <div style={{ fontSize: "0.75rem", fontWeight: "700", color: "#C0D0E8", marginBottom: "6px" }}>{cmd.name}</div>
                                                            <div style={{ fontSize: "0.75rem", color: "#9090B8", marginBottom: "10px" }}>{cmd.desc}</div>
                                                            <div style={{ fontSize: "0.75rem", color: "#A0A8CC", wordBreak: "break-all" }}><code>{cmd.file}</code></div>
                                                        </div>
                                                    ))}
                                                </div>
                                                {ex.try?.length > 0 && (
                                                    <div style={{ marginTop: "18px" }}>
                                                        <div style={{ fontSize: "0.75rem", fontWeight: "700", color: "#C0D0E8", marginBottom: "8px" }}>Try</div>
                                                        <ul style={{ margin: 0, padding: "0 0 0 18px", color: "#9090B8", fontSize: "0.78rem", lineHeight: 1.6 }}>
                                                            {ex.try.map((t, ti) => (
                                                                <li key={ti} style={{ marginBottom: "6px" }}>{t}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                                {ex.challenge && (
                                                    <div style={{ marginTop: "18px" }}>
                                                        <div style={{ fontSize: "0.75rem", fontWeight: "700", color: "#C0D0E8", marginBottom: "8px" }}>Challenge</div>
                                                        <div style={{ fontSize: "0.82rem", color: "#9090B8" }}>{ex.challenge}</div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* COMMANDS SECTION */}
                {activeSection === "commands" && (
                    <div>
                        <p style={{ color: "#606080", marginBottom: "32px", fontSize: "0.9rem" }}>
                            Click any command to expand examples. All commands verified against official docs (v2.1.72, March 2026).
                        </p>
                        {commands.map((cat, ci) => (
                            <div key={ci} style={{ marginBottom: "40px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                                    <span style={{ fontSize: "20px" }}>{cat.icon}</span>
                                    <h2 style={{ fontSize: "1rem", fontWeight: "700", color: cat.color, letterSpacing: "1px", textTransform: "uppercase", margin: 0 }}>{cat.category}</h2>
                                    <div style={{ flex: 1, height: "1px", background: `linear-gradient(to right, ${cat.color}40, transparent)` }} />
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                    {cat.items.map((item, ii) => {
                                        const key = `${ci}-${ii}`;
                                        const isOpen = activeCommand === key;
                                        return (
                                            <div key={ii} style={{ background: isOpen ? `rgba(${hexToRgb(cat.color)},0.06)` : "#111118", border: `1px solid ${isOpen ? cat.color + "50" : "#1E1E30"}`, borderRadius: "12px", overflow: "hidden", transition: "all 0.2s" }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px 20px", cursor: "pointer" }} onClick={() => setActiveCommand(isOpen ? null : key)}>
                                                    <code style={{ color: cat.color, fontSize: "0.85rem", fontFamily: "monospace", flex: 1, wordBreak: "break-all" }}>{item.cmd}</code>
                                                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                                                        <span style={{ fontSize: "10px", color: "#404060", background: "rgba(255,255,255,0.05)", padding: "2px 8px", borderRadius: "10px" }}>{item.examples.length} examples</span>
                                                        <span style={{ color: cat.color, fontSize: "16px", transform: isOpen ? "rotate(90deg)" : "none", transition: "0.2s" }}>›</span>
                                                    </div>
                                                </div>
                                                <div style={{ padding: "0 20px 4px", marginTop: "-8px" }}>
                                                    <p style={{ fontSize: "0.82rem", color: "#707090", margin: "0 0 12px" }}>{item.desc}</p>
                                                </div>
                                                {isOpen && (
                                                    <div style={{ padding: "0 20px 20px", borderTop: `1px solid ${cat.color}20` }}>
                                                        <p style={{ fontSize: "0.75rem", color: "#404060", letterSpacing: "1px", textTransform: "uppercase", margin: "16px 0 10px" }}>Examples</p>
                                                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                                            {item.examples.map((ex, ei) => (
                                                                <div key={ei} style={{ background: "rgba(0,0,0,0.4)", borderRadius: "8px", padding: "12px 14px", border: `1px solid ${cat.color}20` }}>
                                                                    <div style={{ fontSize: "10px", color: cat.color, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px" }}>{ex.label}</div>
                                                                    <code style={{ display: "block", fontSize: "0.82rem", color: "#C0C0E0", fontFamily: "monospace", whiteSpace: "pre-wrap", wordBreak: "break-all" }}>{ex.code}</code>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* ADVANTAGES SECTION */}
                {activeSection === "advantages" && (
                    <div>
                        <p style={{ color: "#606080", marginBottom: "32px", fontSize: "0.9rem" }}>
                            Click any advantage to see real execution flows and sample prompts you can use today.
                        </p>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
                            {advantages.map((adv, ai) => {
                                const isOpen = activeAdvantage === ai;
                                return (
                                    <div key={ai} onClick={() => setActiveAdvantage(isOpen ? null : ai)} style={{ background: isOpen ? `rgba(${hexToRgb(adv.color)},0.07)` : "#111118", border: `1px solid ${isOpen ? adv.color + "60" : "#1E1E30"}`, borderTop: `3px solid ${adv.color}`, borderRadius: "12px", padding: "20px", cursor: "pointer", transition: "all 0.25s", transform: isOpen ? "translateY(-2px)" : "none", boxShadow: isOpen ? `0 8px 24px rgba(${hexToRgb(adv.color)},0.12)` : "none" }}>
                                        <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "12px" }}>
                                            <span style={{ fontSize: "24px" }}>{adv.icon}</span>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontSize: "0.95rem", fontWeight: "700", color: "#E8E8F8", marginBottom: "6px" }}>{adv.title}</div>
                                                <div style={{ fontSize: "0.82rem", color: "#707090", lineHeight: 1.6 }}>{adv.desc}</div>
                                            </div>
                                            <span style={{ color: adv.color, fontSize: "16px", transform: isOpen ? "rotate(90deg)" : "none", transition: "0.2s", flexShrink: 0 }}>›</span>
                                        </div>
                                        {isOpen && (
                                            <div onClick={e => e.stopPropagation()}>
                                                <div style={{ marginTop: "16px", padding: "14px", background: "rgba(0,0,0,0.4)", borderRadius: "8px", borderLeft: `2px solid ${adv.color}60` }}>
                                                    <p style={{ fontSize: "0.72rem", color: adv.color, letterSpacing: "1.5px", textTransform: "uppercase", margin: "0 0 10px", fontWeight: "700" }}>⟶ Execution Flow</p>
                                                    {adv.flow.map((step, si) => (
                                                        <div key={si} style={{ display: "flex", gap: "10px", padding: "5px 0", borderBottom: si < adv.flow.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                                                            <span style={{ color: adv.color, fontSize: "10px", fontWeight: "800", minWidth: "16px", marginTop: "2px" }}>{si + 1}.</span>
                                                            <span style={{ fontSize: "0.8rem", color: "#9090B8", lineHeight: 1.5 }}>{step}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div style={{ marginTop: "12px" }}>
                                                    <p style={{ fontSize: "0.72rem", color: "#505070", letterSpacing: "1.5px", textTransform: "uppercase", margin: "0 0 8px", fontWeight: "700" }}>💬 Sample Prompts</p>
                                                    {adv.prompts.map((prompt, pi) => (
                                                        <div key={pi} style={{ background: `rgba(${hexToRgb(adv.color)},0.08)`, border: `1px solid ${adv.color}30`, borderRadius: "6px", padding: "8px 12px", marginBottom: "6px" }}>
                                                            <code style={{ fontSize: "0.78rem", color: "#C0D0E8", fontFamily: "monospace" }}>{prompt}</code>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* WORKFLOWS SECTION */}
                {activeSection === "workflows" && (
                    <div>
                        <p style={{ color: "#606080", marginBottom: "32px", fontSize: "0.9rem" }}>
                            Real end-to-end workflows showing how to chain Claude Code prompts for common development tasks.
                        </p>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(460px, 1fr))", gap: "24px" }}>
                            {sampleWorkflows.map((wf, wi) => (
                                <div key={wi} style={{ background: "#111118", border: `1px solid #1E1E30`, borderTop: `3px solid ${wf.color}`, borderRadius: "14px", padding: "24px" }}>
                                    <h3 style={{ fontSize: "1rem", fontWeight: "700", color: "#E8E8F8", margin: "0 0 20px" }}>{wf.title}</h3>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                        {wf.steps.map((step, si) => (
                                            <div key={si} style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                                                    <div style={{ width: "24px", height: "24px", background: `rgba(${hexToRgb(wf.color)},0.2)`, border: `1px solid ${wf.color}60`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", color: wf.color, fontWeight: "800" }}>{si + 1}</div>
                                                    {si < wf.steps.length - 1 && <div style={{ width: "1px", height: "100%", minHeight: "20px", background: `${wf.color}30`, margin: "4px 0" }} />}
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontSize: "10px", color: wf.color, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "4px" }}>{step.note}</div>
                                                    <code style={{ display: "block", fontSize: "0.8rem", color: "#C0C0E0", fontFamily: "monospace", background: "rgba(0,0,0,0.4)", padding: "10px 12px", borderRadius: "6px", wordBreak: "break-all" }}>{step.prompt}</code>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Prompt Tips */}
                        <div style={{ marginTop: "40px", background: "linear-gradient(135deg, #0D1A2E 0%, #1A0D2E 100%)", border: "1px solid #2A2A4A", borderRadius: "16px", padding: "32px" }}>
                            <h2 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#E8E8F8", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                                <span style={{ color: "#F59E0B" }}>💡</span> Prompt Writing Tips
                            </h2>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "14px" }}>
                                {[
                                    { tip: "Be specific about file paths", example: '"fix the bug in src/auth/middleware.js line 42"', color: "#4ECDC4" },
                                    { tip: "Specify expected output format", example: '"generate a JSON schema for the User model"', color: "#A855F7" },
                                    { tip: "Include constraints", example: '"refactor using TypeScript, no external libraries"', color: "#F59E0B" },
                                    { tip: "Paste the exact error message", example: '"fix: TypeError: Cannot read property \'id\' of undefined at UserService.js:88"', color: "#10B981" },
                                    { tip: "Ask for a plan before action", example: '"plan how to add caching, then implement it"', color: "#FF6B35" },
                                    { tip: "Scope the task explicitly", example: '"only modify files in the src/api/ directory"', color: "#EF4444" },
                                ].map((t, i) => (
                                    <div key={i} style={{ background: "rgba(0,0,0,0.4)", borderRadius: "8px", padding: "14px", borderLeft: `2px solid ${t.color}` }}>
                                        <div style={{ fontSize: "0.82rem", fontWeight: "700", color: "#D0D0E8", marginBottom: "8px" }}>✓ {t.tip}</div>
                                        <code style={{ fontSize: "0.75rem", color: t.color, fontFamily: "monospace" }}>{t.example}</code>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div style={{ marginTop: "48px", padding: "24px", borderTop: "1px solid #1E1E30", textAlign: "center", color: "#404060", fontSize: "0.8rem" }}>
                    Claude Code — by Abhinav · Verified against official docs v2.1.72 · docs.claude.com
                </div>
            </div>
        </div>
    );
}