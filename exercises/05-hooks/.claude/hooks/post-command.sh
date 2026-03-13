#!/bin/bash
#
# Post-Command Hook
#
# Executed after each command completes.
# Shows execution time and command summary.
#
# Environment Variables:
#   CLAUDE_COMMAND - The command that was executed
#   CLAUDE_START_TIME - Start timestamp (seconds since epoch)
#   CLAUDE_EXIT_CODE - Exit code of the command
#

# Get current time
END_TIME=$(date +%s.%N)
START_TIME=${CLAUDE_START_TIME:-$END_TIME}

# Calculate duration
DURATION=$(echo "$END_TIME - $START_TIME" | bc -l 2>/dev/null || echo "0")
DURATION_MS=$(echo "$DURATION * 1000" | bc -l 2>/dev/null | cut -d. -f1 || echo "N/A")

# Determine status
EXIT_CODE=${CLAUDE_EXIT_CODE:-0}
if [ "$EXIT_CODE" -eq 0 ]; then
    STATUS="✅"
else
    STATUS="❌"
fi

# Format duration
if [ "$DURATION_MS" = "N/A" ]; then
    DURATION_STR="N/A"
elif [ "$DURATION_MS" -lt 1000 ]; then
    DURATION_STR="${DURATION_MS}ms"
else
    DURATION_SEC=$(echo "scale=2; $DURATION_MS / 1000" | bc 2>/dev/null || echo "N/A")
    DURATION_STR="${DURATION_SEC}s"
fi

# Output summary
echo ""
echo "═════════════════════════════════════════"
echo "  $STATUS Command Complete"
echo "  Command: ${CLAUDE_COMMAND:-unknown}"
echo "  Duration: $DURATION_STR"
echo "  Exit Code: $EXIT_CODE"
echo "═════════════════════════════════════════"

# Log timing data
LOG_FILE="$HOME/.claude/command-timing.log"
mkdir -p "$(dirname "$LOG_FILE")"
echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) ${CLAUDE_COMMAND:-unknown} ${DURATION_STR}" >> "$LOG_FILE"

# Optional: Show performance warning for slow commands
if [ "$DURATION_MS" != "N/A" ] && [ "$DURATION_MS" -gt 10000 ]; then
    echo "⚠️  This command took longer than 10 seconds"
fi
