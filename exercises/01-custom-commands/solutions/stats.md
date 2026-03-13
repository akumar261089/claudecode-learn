# /stats Command - Solution

## Command File

Create `.claude/commands/stats.md`:

```markdown
# /stats Command

Display git repository statistics.

## Usage
```
/stats
/stats --author [name]
/stats --since [date]
```

## Options
- `--author`: Filter by author name
- `--since`: Show stats since date (e.g., "1 week ago")

## Implementation
Use git commands to gather statistics:
- `git log --oneline` - commit count
- `git ls-files | xargs wc -l` - line count
- `git shortlog -sn` - commits by author

## Example Output
```
📊 Repository Statistics

Commits: 142
Files: 38
Lines of Code: 12,456

Top Contributors:
  56  Alice
  43  Bob
  28  Charlie

Recent Activity: 12 commits this week
```
```

## Implementation Notes

1. Use `Bash` tool with git commands
2. Parse output to create formatted statistics
3. Handle edge cases (no git repo, no commits, etc.)
4. Support filtering by time period
