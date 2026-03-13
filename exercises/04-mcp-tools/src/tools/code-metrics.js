#!/usr/bin/env node
/**
 * Code Metrics MCP Tool
 *
 * Calculates code quality and complexity metrics.
 *
 * Usage:
 *   node code-metrics.js --path <directory> [--language js|ts|py|go]
 */

const fs = require('fs');
const path = require('path');

function calculateMetrics(directory, language = null) {
  if (!fs.existsSync(directory)) {
    return {
      error: `Directory not found: ${directory}`,
      success: false
    };
  }

  const stats = {
    path: directory,
    timestamp: new Date().toISOString(),
    files: {
      total: 0,
      byExtension: {}
    },
    lines: {
      total: 0,
      code: 0,
      blank: 0,
      comment: 0
    },
    complexity: {
      cyclomatic: 0,
      cognitive: 0,
      averageFunctionLength: 0,
      maxNestingDepth: 0
    },
    maintainability: {
      index: 0,
      grade: 'A'
    }
  };

  const fileStats = [];

  function scanDir(dir) {
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        if (item !== 'node_modules' && item !== '.git' && item !== 'dist' && item !== 'build') {
          scanDir(fullPath);
        }
      } else if (stat.isFile()) {
        processFile(fullPath);
      }
    }
  }

  function processFile(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    stats.files.total++;
    stats.files.byExtension[ext] = (stats.files.byExtension[ext] || 0) + 1;

    stats.lines.total += lines.length;

    // Analyze lines
    let fileCodeLines = 0;
    let fileBlankLines = 0;
    let fileCommentLines = 0;
    let inBlockComment = false;

    lines.forEach(line => {
      const trimmed = line.trim();

      if (!trimmed) {
        fileBlankLines++;
      } else if (trimmed.startsWith('//') || trimmed.startsWith('#')) {
        fileCommentLines++;
      } else if (trimmed.startsWith('/*')) {
        fileCommentLines++;
        if (!trimmed.endsWith('*/')) inBlockComment = true;
      } else if (inBlockComment) {
        fileCommentLines++;
        if (trimmed.endsWith('*/')) inBlockComment = false;
      } else {
        fileCodeLines++;
      }
    });

    stats.lines.code += fileCodeLines;
    stats.lines.blank += fileBlankLines;
    stats.lines.comment += fileCommentLines;

    // Calculate complexity for code files
    if (['.js', '.ts', '.jsx', '.tsx', '.py', '.java', '.go', '.rs', '.c', '.cpp'].includes(ext)) {
      const complexity = calculateFileComplexity(content, ext);
      fileStats.push({
        path: filePath,
        ...complexity
      });

      stats.complexity.cyclomatic += complexity.cyclomatic;
      stats.complexity.maxNestingDepth = Math.max(
        stats.complexity.maxNestingDepth,
        complexity.maxNestingDepth
      );
    }
  }

  function calculateFileComplexity(content, ext) {
    const lines = content.split('\n');
    let cyclomatic = 1; // Base complexity
    let maxNesting = 0;
    let currentNesting = 0;
    let functionLengths = [];
    let currentFunctionLength = 0;
    let inFunction = false;

    // Patterns based on language
    const branchPatterns = [
      /\bif\s*\(/,
      /\belse\s+if\s*\(/,
      /\belse\s*\{/,
      /\bwhile\s*\(/,
      /\bfor\s*\(/,
      /\bcase\s+\w+/,
      /\bcatch\s*\(/,
      /\b\?\s*\w+\s*:/, // ternary
      /\&\&|\|\|/ // logical operators
    ];

    if (ext === '.py') {
      branchPatterns.push(/\belif\s+/, /\bexcept\s+/);
    }

    const functionStartPatterns = [
      /function\s+\w+\s*\(/,
      /\w+\s*\([^)]*\)\s*\{/,
      /\bdef\s+\w+\s*\(/,
      /\bfunc\s+\w+\s*\(/,
      /^\s*\w+\s*:\s*function/
    ];

    lines.forEach(line => {
      // Track nesting
      const openBraces = (line.match(/\{/g) || []).length;
      const closeBraces = (line.match(/\}/g) || []).length;

      // Check for function start
      if (functionStartPatterns.some(p => p.test(line))) {
        if (inFunction) {
          functionLengths.push(currentFunctionLength);
        }
        inFunction = true;
        currentFunctionLength = 1;
      } else if (inFunction) {
        currentFunctionLength++;
      }

      // Track nesting
      currentNesting += openBraces - closeBraces;
      maxNesting = Math.max(maxNesting, currentNesting);

      // Count branches
      branchPatterns.forEach(pattern => {
        if (pattern.test(line)) cyclomatic++;
      });
    });

    if (currentFunctionLength > 0) {
      functionLengths.push(currentFunctionLength);
    }

    const avgFunctionLength = functionLengths.length > 0
      ? functionLengths.reduce((a, b) => a + b, 0) / functionLengths.length
      : 0;

    return {
      cyclomatic,
      maxNestingDepth: maxNesting,
      averageFunctionLength: avgFunctionLength
    };
  }

  try {
    scanDir(directory);

    // Calculate averages
    if (fileStats.length > 0) {
      stats.complexity.cyclomatic = Math.round(stats.complexity.cyclomatic / fileStats.length);
      stats.complexity.averageFunctionLength = Math.round(
        fileStats.reduce((sum, f) => sum + f.averageFunctionLength, 0) / fileStats.length
      );
    }

    // Calculate maintainability index (simplified)
    // MI = 171 - 5.2 * ln(Halstead Volume) - 0.23 * CC - 16.2 * ln(LOC)
    // Simplified version based on metrics we have
    const halsteadEstimate = stats.lines.code * Math.log(stats.lines.code + 1);
    const maintainability = 171 - 5.2 * Math.log(halsteadEstimate + 1) - 0.23 * stats.complexity.cyclomatic - 16.2 * Math.log(stats.lines.total + 1);

    stats.maintainability.index = Math.max(0, Math.round(maintainability));

    if (stats.maintainability.index > 85) stats.maintainability.grade = 'A';
    else if (stats.maintainability.index > 70) stats.maintainability.grade = 'B';
    else if (stats.maintainability.index > 50) stats.maintainability.grade = 'C';
    else if (stats.maintainability.index > 30) stats.maintainability.grade = 'D';
    else stats.maintainability.grade = 'F';

    // Summary
    stats.summary = {
      health: stats.maintainability.grade === 'A' ? 'Excellent' :
              stats.maintainability.grade === 'B' ? 'Good' :
              stats.maintainability.grade === 'C' ? 'Fair' : 'Needs Improvement',
      recommendations: []
    };

    if (stats.complexity.cyclomatic > 10) {
      stats.summary.recommendations.push('High cyclomatic complexity - consider refactoring');
    }
    if (stats.lines.code / stats.files.total > 300) {
      stats.summary.recommendations.push('Large files detected - consider splitting');
    }
    if (stats.lines.comment / stats.lines.total < 0.1) {
      stats.summary.recommendations.push('Low comment ratio - consider adding documentation');
    }
    if (stats.complexity.maxNestingDepth > 4) {
      stats.summary.recommendations.push('Deep nesting detected - consider early returns');
    }

    stats.success = true;
  } catch (e) {
    stats.error = e.message;
    stats.success = false;
  }

  return stats;
}

// Main execution
function main() {
  const args = process.argv.slice(2);
  const pathIndex = args.indexOf('--path');
  const langIndex = args.indexOf('--language');

  if (pathIndex === -1 || !args[pathIndex + 1]) {
    console.log(JSON.stringify({
      error: "Usage: node code-metrics.js --path <directory> [--language js|ts|py|go]",
      success: false
    }, null, 2));
    process.exit(1);
  }

  const directory = args[pathIndex + 1];
  const language = langIndex !== -1 ? args[langIndex + 1] : null;

  const result = calculateMetrics(directory, language);
  console.log(JSON.stringify(result, null, 2));
}

if (require.main === module) {
  main();
}

module.exports = { calculateMetrics };
