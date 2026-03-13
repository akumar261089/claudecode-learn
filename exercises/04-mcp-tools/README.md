# Module 4: Tools & MCP (Model Context Protocol)

This module teaches you how to create custom tools and work with MCP (Model Context Protocol) in Claude CLI.

## Overview

MCP allows Claude to connect to external services and custom tools, extending its capabilities beyond built-in functionality.

## Exercises

### Exercise 1: Filesystem MCP Server
**File:** `mcp-config.json`

Configure MCP servers to connect to external services:
- Filesystem server for file operations
- GitHub server for repository management
- PostgreSQL server for database queries

**Try it:**
```
# The filesystem MCP server is configured to serve ./exercises/04-mcp-tools
# It provides tools like:
# - read_file: Read file contents
# - write_file: Write/modify files
# - list_directory: List directory contents
# - search_files: Search file contents
```

### Exercise 2: File Analyzer Tool
**File:** `src/tools/file-analyzer.js`

A custom tool that analyzes files for:
- Line counts (total, code, blank, comments)
- Word counts and unique words
- Character statistics
- Complexity metrics
- Language detection

**Try it:**
```bash
# Analyze a file
node src/tools/file-analyzer.js --path src/app.js --metrics lines,words,complexity

# Output includes:
# - File metadata (size, timestamps)
# - Line breakdown
# - Complexity score
# - Language-specific metrics
```

### Exercise 3: Mock API Tool
**File:** `src/tools/mock-api.js`

A custom tool for creating and managing mock APIs:
- Create mock endpoints
- List configured endpoints
- Delete endpoints
- Start/stop mock server

**Try it:**
```bash
# Create a mock endpoint
node src/tools/mock-api.js --action create --endpoint /api/users --method GET --response '{"users":[]}'

# List all endpoints
node src/tools/mock-api.js --action list

# Start the mock server
node src/tools/mock-api.js --action start

# Test the mock
curl http://localhost:3456/api/users
```

### Exercise 4: Code Metrics Tool
**File:** `src/tools/code-metrics.js`

A comprehensive code quality analyzer:
- Cyclomatic complexity
- Maintainability index
- File statistics
- Code health grading
- Recommendations

**Try it:**
```bash
# Analyze a directory
node src/tools/code-metrics.js --path ./src --language js

# Output includes:
# - File counts by extension
# - Line statistics
# - Complexity metrics
# - Maintainability grade
# - Improvement recommendations
```

## Key Concepts

1. **MCP Server Configuration** (`mcp-config.json`):
   - Define MCP server connections
   - Set environment variables
   - Enable/disable servers

2. **Custom Tool Registration**:
   - Define tool schema
   - Specify script location
   - Configure parameters

3. **Tool Execution**:
   - Tools run as separate processes
   - Communicate via JSON
   - Can access file system and network

4. **Security Considerations**:
   - Tools run with user permissions
   - Review tool code before use
   - Be careful with destructive operations

## Challenge

Create a `git-insights` MCP tool that:
- Analyzes git repository history
- Shows commit statistics by author
- Identifies code churn (files changed most)
- Calculates time-to-fix for issues
- Generates contributor leaderboard

**Solution:** See `solutions/git-insights.js`

## Resources

- [MCP Documentation](https://modelcontextprotocol.io)
- [Anthropic MCP Servers](https://github.com/anthropics/anthropic-cookbook/tree/main/mcp)
- Custom tool development guide
