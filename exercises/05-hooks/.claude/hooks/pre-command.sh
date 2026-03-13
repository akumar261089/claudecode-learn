#!/bin/bash
#
# Pre-Command Hook
#
# Executed before each command is run.
# Logs command usage for analytics and debugging.
#
# Environment Variables:
#   CLAUDE_COMMAND - The command being executed
#   CLAUDE_ARGS - Arguments passed to the command
#   CLAUDE_WORKDIR - Current working directory
#

LOG_FILE="$HOME/.claude/command-history.log"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# Create log directory if it doesn't exist
mkdir -p "$(dirname "$LOG_FILE")"

# Log the command
{
    echo "{"
    echo "  \"timestamp\": \"$TIMESTAMP\","
    echo "  \"command\": \"${CLAUDE_COMMAND:-unknown}\","
    echo "  \"args\": \"${CLAUDE_ARGS}\","
    echo "  \"working_dir\": \"${CLAUDE_WORKDIR:-$(pwd)}\","
    echo "  \"user\": \"${USER:-unknown}\","
    echo "  \"session\": \"${CLAUDE_SESSION_ID:-unknown}\""
    echo "}"
} >> "$LOG_FILE"

# Output info (optional - visible to user)
echo "📝 Logging command: ${CLAUDE_COMMAND:-unknown}"

# Can be used for:
# - Command analytics
# - Usage tracking
# - Session restoration
# - Performance monitoring
