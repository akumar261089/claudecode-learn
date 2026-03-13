# Module 3: Agents

This module teaches you how to create and use custom agents in Claude CLI.

## Overview

Agents are specialized AI assistants with custom system prompts and tool access. They can be invoked by name to perform specific tasks.

## Exercises

### Exercise 1: Code Reviewer Agent
**File:** `.claude/agents/code-reviewer.json`

An expert code reviewer that:
- Analyzes code for quality and bugs
- Suggests performance improvements
- Identifies security issues
- Follows best practices

**Try it:**
```
@code-reviewer review src/utils.js
@code-reviewer analyze the authentication module
@code-reviewer check src/app.js for security issues
```

### Exercise 2: Documentation Agent
**File:** `.claude/agents/doc-writer.json`

A documentation specialist that:
- Generates comprehensive documentation
- Creates API references
- Writes tutorials and guides
- Maintains consistent style

**Try it:**
```
@doc-writer generate README for this project
@doc-writer document the API in src/api.js
@doc-writer create a quick start guide
```

### Exercise 3: Test Generator Agent
**File:** `.claude/agents/test-generator.json`

A testing specialist that:
- Generates unit tests
- Covers edge cases
- Mocks dependencies
- Achieves high coverage

**Try it:**
```
@test-generator create tests for src/calculator.js
@test-generator generate tests using Jest
@test-generator add edge case tests for utils.js
```

## Key Concepts

1. **Agent Configuration** (`*.json`):
   - `name`: Unique identifier for invocation
   - `description`: What the agent specializes in
   - `model`: Claude model to use
   - `system_prompt`: Agent's persona and instructions
   - `tools`: Available tools
   - `config`: Agent-specific settings

2. **Agent Invocation**:
   - Use `@agent-name` to invoke
   - Pass context after the mention
   - Agent has its own system prompt

3. **Agent Design**:
   - Clear, specific purpose
   - Detailed system prompt
   - Appropriate tool selection
   - Relevant configuration

## Challenge

Create a `performance-optimizer` agent that:
- Analyzes code for performance bottlenecks
- Suggests algorithmic improvements
- Identifies memory leaks
- Recommends caching strategies
- Compares different approaches

**Solution:** See `solutions/performance-optimizer.json`

## Resources

- [Claude CLI Agents Documentation](https://docs.anthropic.com/claude-cli/agents)
- Model selection guide
- System prompt engineering best practices
