#!/usr/bin/env node
/**
 * Commit Skill - Conventional Commit Generator
 *
 * Analyzes git diff and generates conventional commit messages.
 *
 * Commands:
 *   /commit - Generate commit message from staged changes
 *   /commit suggest - Show multiple suggestions
 *   /commit --type=[type] - Force specific commit type
 */

const { execSync } = require('child_process');

const COMMIT_TYPES = {
  feat: { emoji: '✨', desc: 'New feature' },
  fix: { emoji: '🐛', desc: 'Bug fix' },
  docs: { emoji: '📚', desc: 'Documentation' },
  style: { emoji: '💄', desc: 'Styling/formatting' },
  refactor: { emoji: '♻️', desc: 'Code refactoring' },
  test: { emoji: '✅', desc: 'Tests' },
  chore: { emoji: '🔧', desc: 'Chores/maintenance' }
};

function getGitDiff() {
  try {
    return execSync('git diff --cached --stat', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
  } catch (e) {
    return null;
  }
}

function getDetailedDiff() {
  try {
    return execSync('git diff --cached', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
  } catch (e) {
    return null;
  }
}

function getStagedFiles() {
  try {
    const output = execSync('git diff --cached --name-only', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
    return output.trim().split('\n').filter(f => f);
  } catch (e) {
    return [];
  }
}

function analyzeChanges(files, diffContent) {
  const analysis = {
    types: new Set(),
    scopes: new Set(),
    isBreaking: false
  };

  // Analyze file patterns
  files.forEach(file => {
    if (file.includes('test')) analysis.types.add('test');
    if (file.endsWith('.md') || file.includes('docs')) analysis.types.add('docs');
    if (file.match(/\.(css|scss|less)$/)) analysis.types.add('style');
    if (file.match(/package\.json|lock|config/)) analysis.types.add('chore');
    if (file.match(/\.(js|ts|jsx|tsx|py|go|rs)$/)) analysis.types.add('feat');

    // Extract scope from path
    const parts = file.split('/');
    if (parts.length > 1) analysis.scopes.add(parts[0]);
  });

  // Check for breaking changes
  if (diffContent) {
    if (diffContent.includes('BREAKING') || diffContent.includes('-export') || diffContent.includes('-class')) {
      analysis.isBreaking = true;
    }
  }

  return analysis;
}

function generateMessage(analysis, forcedType) {
  const type = forcedType || Array.from(analysis.types)[0] || 'feat';
  const scope = analysis.scopes.size > 0 ? `(${Array.from(analysis.scopes)[0]})` : '';
  const breaking = analysis.isBreaking ? '!' : '';

  const templates = {
    feat: [
      `add${scope ? ' ' + analysis.scopes.values().next().value + ' ' : ' ' }feature`,
      `implement${scope} functionality`,
      `introduce${scope} new capability`
    ],
    fix: [
      `fix${scope} bug`,
      `resolve${scope} issue`,
      `correct${scope} error`
    ],
    docs: [
      `update${scope} documentation`,
      `add${scope} docs`,
      `document${scope} feature`
    ],
    refactor: [
      `refactor${scope} code`,
      `improve${scope} structure`,
      `cleanup${scope} implementation`
    ],
    test: [
      `add${scope} tests`,
      `update${scope} test coverage`,
      `fix${scope} failing tests`
    ],
    chore: [
      `update${scope} dependencies`,
      `maintain${scope} codebase`,
      `cleanup${scope} configuration`
    ],
    style: [
      `format${scope} code`,
      `update${scope} styles`,
      `fix${scope} linting`
    ]
  };

  const typeTemplates = templates[type] || templates.feat;
  const description = typeTemplates[Math.floor(Math.random() * typeTemplates.length)];

  return `${type}${scope}${breaking}: ${description}`;
}

function main() {
  const args = process.argv.slice(2);
  const suggestMode = args.includes('suggest');
  const typeFlag = args.find(a => a.startsWith('--type='));
  const forcedType = typeFlag ? typeFlag.split('=')[1] : null;

  // Check if in git repo
  try {
    execSync('git rev-parse --git-dir', { stdio: 'ignore' });
  } catch (e) {
    console.log('❌ Not a git repository');
    process.exit(1);
  }

  const diff = getGitDiff();
  if (!diff || diff.trim() === '') {
    console.log('📝 No staged changes found.');
    console.log('Stage your changes with: git add <files>');
    process.exit(0);
  }

  const files = getStagedFiles();
  const detailedDiff = getDetailedDiff();
  const analysis = analyzeChanges(files, detailedDiff);

  console.log('📊 Changed files:');
  console.log(diff);
  console.log('');

  if (suggestMode) {
    console.log('💡 Suggested commit messages:\n');
    const types = forcedType ? [forcedType] : Object.keys(COMMIT_TYPES);
    types.forEach(type => {
      const msg = generateMessage(analysis, type);
      const { emoji, desc } = COMMIT_TYPES[type] || COMMIT_TYPES.feat;
      console.log(`  ${emoji} ${msg}`);
      console.log(`     └─ ${desc}\n`);
    });
  } else {
    const message = generateMessage(analysis, forcedType);
    const type = message.split(':')[0].split('(')[0].split('!')[0];
    const { emoji } = COMMIT_TYPES[type] || COMMIT_TYPES.feat;

    console.log(`${emoji} Suggested commit message:`);
    console.log('\n   ' + message + '\n');
    console.log('To use this message, run:');
    console.log(`   git commit -m "${message}"`);
  }
}

main();
