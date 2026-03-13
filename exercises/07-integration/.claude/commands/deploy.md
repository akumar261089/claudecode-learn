# /deploy Command

Deploy the project to a specified environment.

## Usage
```
/deploy
/deploy --env=production
/deploy --dry-run
```

## Parameters
- `--env`: Target environment (development, staging, production)
- `--dry-run`: Simulate deployment without making changes

## Process

1. **Pre-deploy Checks**:
   - Verify project is initialized
   - Check for uncommitted changes
   - Validate environment exists

2. **Build Phase**:
   - Compile assets
   - Run tests
   - Generate distribution package

3. **Deployment Phase**:
   - Upload to server
   - Verify deployment
   - Update status

## Example
```
User: /deploy --env=production
Claude: 🚀 Deploying to PRODUCTION...

Pre-deploy checks:
  ✅ No uncommitted changes
  ✅ Tests passing

Deploying:
  1/5 Building assets...
  2/5 Running tests...
  3/5 Packing distribution...
  4/5 Uploading to server...
  5/5 Verifying deployment...

✅ Deployment complete!
Deployed at: 2026-03-12T14:30:00Z
Version: 1.0.0
```

## Implementation

The deploy command should:
1. Load project configuration
2. Check git status
3. Confirm deployment with user
4. Execute deployment steps
5. Report results

Use the following tools:
- `Read` - Load configuration
- `Bash` - Run git commands
- `Skill` - Execute deployment skill
