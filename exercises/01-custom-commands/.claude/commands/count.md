# /count Command

Count files and directories in the current working directory.

## Usage
```
/count
/count --extensions
/count --detailed
```

## Options
- `--extensions`: Show breakdown by file extension
- `--detailed`: Show detailed file listing with sizes

## Output
Displays:
- Total number of files
- Total number of directories
- Breakdown by file type (if --extensions flag used)
- Total size (if --detailed flag used)

## Example
```
User: /count
Claude: 📊 Directory Statistics:
       Files: 24
       Directories: 5
       Total items: 29

User: /count --extensions
Claude: 📊 Directory Statistics:
       Files: 24
       - .js: 12
       - .md: 8
       - .json: 4
       Directories: 5
```

## Implementation
Use the `Bash` tool to run:
```bash
find . -maxdepth 1 -type f | wc -l
find . -maxdepth 1 -type d | wc -l
```
