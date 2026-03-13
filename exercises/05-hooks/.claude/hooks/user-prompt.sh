#!/bin/bash
#
# User Prompt Hook
#
# Executed when the user submits a prompt.
# Validates input and provides helpful feedback.
#
# Environment Variables:
#   CLAUDE_USER_PROMPT - The user's prompt text
#   CLAUDE_PROMPT_LENGTH - Length of the prompt
#

PROMPT="${CLAUDE_USER_PROMPT:-}"
LENGTH=${CLAUDE_PROMPT_LENGTH:-0}

# Validation checks
declare -a WARNINGS=()
declare -a SUGGESTIONS=()

# Check for empty prompt
if [ -z "$PROMPT" ] || [ "$LENGTH" -eq 0 ]; then
    echo "❌ Error: Empty prompt"
    exit 1
fi

# Check for very long prompts (might be copy-paste errors)
if [ "$LENGTH" -gt 10000 ]; then
    WARNINGS+=("Very long prompt ($LENGTH chars) - consider breaking into smaller questions")
fi

# Check for common issues
if echo "$PROMPT" | grep -q "fix this"; then
    SUGGESTIONS+=("Consider being more specific about what needs fixing")
fi

if echo "$PROMPT" | grep -q "^Why\?"; then
    SUGGESTIONS+=("Consider providing context for your question")
fi

# Check for potentially dangerous commands
DANGEROUS_PATTERNS=(
    "rm -rf"
    ":(){ :|:& };:"
    "dd if=/dev/zero"
    "mkfs"
    "fdisk"
    "del /f /s /q"
    "format"
)

for pattern in "${DANGEROUS_PATTERNS[@]}"; do
    if echo "$PROMPT" | grep -qi "$pattern"; then
        WARNINGS+=("⚠️  Potentially dangerous command detected: $pattern")
        WARNINGS+=("   Please review carefully before executing")
    fi
done

# Check for API keys or secrets
if echo "$PROMPT" | grep -qE "[a-zA-Z0-9]{20,}"; then
    if echo "$PROMPT" | grep -qE "(api[_-]?key|token|secret|password)"; then
        WARNINGS+=("⚠️  Possible sensitive data detected in prompt")
        WARNINGS+=("   Consider using environment variables for secrets")
    fi
fi

# Output warnings and suggestions
if [ ${#WARNINGS[@]} -gt 0 ]; then
    echo ""
    echo "⚠️  Warnings:"
    for warning in "${WARNINGS[@]}"; do
        echo "   $warning"
    done
    echo ""
fi

if [ ${#SUGGESTIONS[@]} -gt 0 ]; then
    echo "💡 Suggestions:"
    for suggestion in "${SUGGESTIONS[@]}"; do
        echo "   $suggestion"
    done
    echo ""
fi

# All checks passed
exit 0
