#!/usr/bin/env node
/**
 * Refactor Skill - Code Refactoring Assistant
 *
 * Provides refactoring suggestions and automation.
 *
 * Commands:
 *   /refactor analyze <file> - Analyze code for refactoring opportunities
 *   /refactor extract-function <file> <line-range> <name> - Extract function
 *   /refactor rename <file> <old-name> <new-name> - Rename symbol
 *   /refactor patterns - Show available refactoring patterns
 */

const fs = require('fs');

const REFACTORING_PATTERNS = {
  'extract-function': {
    description: 'Extract a block of code into a new function',
    benefits: ['Improves readability', 'Enables reuse', 'Reduces duplication'],
    example: 'Extract lines 10-20 into calculateTotal()'
  },
  'rename-variable': {
    description: 'Rename variables for clarity',
    benefits: ['Improves readability', 'Better expresses intent'],
    example: 'Rename "x" to "customerCount"'
  },
  'inline-variable': {
    description: 'Replace variable with its value',
    benefits: ['Simplifies code', 'Removes indirection'],
    example: 'Inline temp variable used once'
  },
  'extract-constant': {
    description: 'Extract magic numbers/strings to named constants',
    benefits: ['Self-documenting', 'Easy to change'],
    example: 'Extract 3.14159 to PI constant'
  },
  'simplify-conditionals': {
    description: 'Simplify complex conditional expressions',
    benefits: ['Easier to understand', 'Less error-prone'],
    example: 'Replace nested ifs with early returns'
  },
  'remove-dead-code': {
    description: 'Remove unused variables and unreachable code',
    benefits: ['Cleaner codebase', 'Less confusion'],
    example: 'Delete unused imports and variables'
  }
};

function showPatterns() {
  console.log('🔧 Available Refactoring Patterns:\n');
  Object.entries(REFACTORING_PATTERNS).forEach(([key, pattern]) => {
    console.log(`  ${key}:`);
    console.log(`    ${pattern.description}`);
    console.log(`    Benefits: ${pattern.benefits.join(', ')}`);
    console.log(`    Example: ${pattern.example}\n`);
  });
}

function analyzeFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`❌ File not found: ${filePath}`);
    return;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const issues = [];

  // Simple analysis patterns
  const patterns = [
    { regex: /var\s+/, msg: 'Use const or let instead of var', severity: 'warning' },
    { regex: /console\.log/, msg: 'Remove console.log statements', severity: 'info' },
    { regex: /TODO|FIXME/, msg: 'Address TODO/FIXME comments', severity: 'warning' },
    { regex: /function\s*\([^)]*\)\s*\{[\s\S]*?if[\s\S]*?if/, msg: 'Consider simplifying nested conditionals', severity: 'suggestion' },
    { regex: /\.length\s*>\s*0/, msg: 'Could use truthy check instead', severity: 'suggestion' },
    { regex: /==(?!=)/, msg: 'Use strict equality (===)', severity: 'warning' }
  ];

  lines.forEach((line, index) => {
    patterns.forEach(pattern => {
      if (pattern.regex.test(line)) {
        issues.push({
          line: index + 1,
          message: pattern.msg,
          severity: pattern.severity,
          code: line.trim().substring(0, 50)
        });
      }
    });
  });

  // Check function length
  let inFunction = false;
  let funcStart = 0;
  let braceCount = 0;

  lines.forEach((line, index) => {
    const funcMatch = line.match(/function\s+\w+\s*\(|=>\s*\{/);
    if (funcMatch && !inFunction) {
      inFunction = true;
      funcStart = index;
      braceCount = 0;
    }

    braceCount += (line.match(/\{/g) || []).length;
    braceCount -= (line.match(/\}/g) || []).length;

    if (inFunction && braceCount === 0) {
      const funcLength = index - funcStart + 1;
      if (funcLength > 30) {
        issues.push({
          line: funcStart + 1,
          message: `Long function (${funcLength} lines), consider extracting`,
          severity: 'suggestion',
          code: lines[funcStart].trim().substring(0, 50)
        });
      }
      inFunction = false;
    }
  });

  // Display results
  console.log(`🔍 Analysis Results for ${filePath}:\n`);
  console.log(`  Lines: ${lines.length}`);
  console.log(`  Issues found: ${issues.length}\n`);

  if (issues.length === 0) {
    console.log('  ✅ No refactoring opportunities found!');
  } else {
    const grouped = issues.reduce((acc, issue) => {
      acc[issue.severity] = acc[issue.severity] || [];
      acc[issue.severity].push(issue);
      return acc;
    }, {});

    ['warning', 'suggestion', 'info'].forEach(severity => {
      if (grouped[severity]) {
        console.log(`  ${severity.toUpperCase()}:`);
        grouped[severity].forEach(issue => {
          console.log(`    Line ${issue.line}: ${issue.message}`);
          console.log(`      > ${issue.code}`);
        });
        console.log();
      }
    });
  }

  return issues;
}

function showUsage() {
  console.log('Refactor Skill - Commands:');
  console.log('  /refactor patterns              - Show available patterns');
  console.log('  /refactor analyze <file>        - Analyze code for refactoring');
  console.log('  /refactor extract-function <file> <start> <end> <name>');
  console.log('                                  - Extract code into function');
  console.log('  /refactor rename <file> <old> <new>');
  console.log('                                  - Rename variable/function');
}

// Main execution
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case 'patterns':
    showPatterns();
    break;

  case 'analyze':
    if (!args[1]) {
      console.log('Usage: /refactor analyze <file>');
      process.exit(1);
    }
    analyzeFile(args[1]);
    break;

  case 'extract-function':
    console.log('📝 Extract function refactoring');
    console.log('This would extract lines', args[2], 'to', args[3], 'into function', args[4]);
    console.log('(Implementation would modify the file)');
    break;

  case 'rename':
    console.log('📝 Rename refactoring');
    console.log('This would rename', args[2], 'to', args[3], 'in', args[1]);
    console.log('(Implementation would modify the file)');
    break;

  default:
    showUsage();
}
