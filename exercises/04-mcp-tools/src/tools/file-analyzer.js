#!/usr/bin/env node
/**
 * File Analyzer MCP Tool
 *
 * Analyzes file contents and provides statistics.
 *
 * Usage:
 *   node file-analyzer.js --path <file> [--metrics lines,words,complexity]
 *
 * Output:
 *   JSON object with file statistics
 */

const fs = require('fs');
const path = require('path');

function analyzeFile(filePath, metrics = ['lines', 'words', 'characters']) {
  if (!fs.existsSync(filePath)) {
    return {
      error: `File not found: ${filePath}`,
      success: false
    };
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const stats = fs.statSync(filePath);

  const result = {
    path: filePath,
    filename: path.basename(filePath),
    extension: path.extname(filePath),
    size: {
      bytes: stats.size,
      kilobytes: (stats.size / 1024).toFixed(2),
      megabytes: (stats.size / (1024 * 1024)).toFixed(2)
    },
    timestamps: {
      created: stats.birthtime.toISOString(),
      modified: stats.mtime.toISOString(),
      accessed: stats.atime.toISOString()
    }
  };

  if (metrics.includes('lines')) {
    const lines = content.split('\n');
    result.lines = {
      total: lines.length,
      code: lines.filter(l => l.trim() && !l.trim().startsWith('//') && !l.trim().startsWith('#') && !l.trim().startsWith('/*')).length,
      blank: lines.filter(l => !l.trim()).length,
      comment: lines.filter(l => l.trim().startsWith('//') || l.trim().startsWith('#') || l.trim().startsWith('/*') || l.trim().startsWith('*')).length
    };
  }

  if (metrics.includes('words')) {
    const words = content.match(/\b\w+\b/g) || [];
    result.words = {
      total: words.length,
      unique: new Set(words.map(w => w.toLowerCase())).size
    };
  }

  if (metrics.includes('characters')) {
    result.characters = {
      total: content.length,
      nonWhitespace: content.replace(/\s/g, '').length,
      alphabetic: (content.match(/[a-zA-Z]/g) || []).length,
      numeric: (content.match(/[0-9]/g) || []).length
    };
  }

  if (metrics.includes('complexity')) {
    const lines = content.split('\n');
    let indentSum = 0;
    let indentCount = 0;
    let maxIndent = 0;
    let functionCount = 0;
    let classCount = 0;
    let commentDensity = 0;

    const functionPatterns = [
      /function\s+\w+\s*\(/,
      /\w+\s*\([^)]*\)\s*\{/,
      /\s*\w+\s*:\s*function\s*\(/,
      /\s*\w+\s*\([^)]*\)\s*=>/
    ];

    const classPatterns = [
      /class\s+\w+/,
      /\bclass\b.*\{/,
    ];

    lines.forEach(line => {
      const indent = line.match(/^(\s*)/)[0].length;
      if (line.trim()) {
        indentSum += indent;
        indentCount++;
        maxIndent = Math.max(maxIndent, indent);
      }

      functionPatterns.forEach(pattern => {
        if (pattern.test(line)) functionCount++;
      });

      classPatterns.forEach(pattern => {
        if (pattern.test(line)) classCount++;
      });
    });

    const commentLines = lines.filter(l =>
      l.trim().startsWith('//') ||
      l.trim().startsWith('#') ||
      l.trim().startsWith('/*') ||
      l.trim().startsWith('*')
    ).length;

    commentDensity = lines.length > 0 ? (commentLines / lines.length) : 0;

    result.complexity = {
      averageIndentation: indentCount > 0 ? (indentSum / indentCount).toFixed(2) : 0,
      maxIndentation: maxIndent,
      nestingDepth: Math.floor(maxIndent / 2),
      functionCount: functionCount,
      classCount: classCount,
      commentDensity: (commentDensity * 100).toFixed(1) + '%'
    };
  }

  // Language-specific analysis
  const lang = detectLanguage(filePath, content);
  if (lang) {
    result.language = lang;
    result.languageSpecific = getLanguageSpecificMetrics(content, lang);
  }

  result.success = true;
  return result;
}

function detectLanguage(filePath, content) {
  const ext = path.extname(filePath).toLowerCase();
  const map = {
    '.js': 'javascript',
    '.ts': 'typescript',
    '.jsx': 'javascript',
    '.tsx': 'typescript',
    '.py': 'python',
    '.go': 'go',
    '.rs': 'rust',
    '.java': 'java',
    '.c': 'c',
    '.cpp': 'cpp',
    '.h': 'c',
    '.rb': 'ruby',
    '.php': 'php',
    '.swift': 'swift',
    '.kt': 'kotlin',
    '.md': 'markdown',
    '.json': 'json',
    '.html': 'html',
    '.css': 'css',
    '.scss': 'scss',
    '.sql': 'sql',
    '.sh': 'bash',
    '.yml': 'yaml',
    '.yaml': 'yaml'
  };

  if (map[ext]) return map[ext];

  // Content-based detection
  if (content.includes('import React') || content.includes('from \'react\'')) return 'javascript';
  if (content.includes('def ') && content.includes(':')) return 'python';
  if (content.includes('package main') && content.includes('func ')) return 'go';
  if (content.includes('fn ') && content.includes('let ')) return 'rust';

  return null;
}

function getLanguageSpecificMetrics(content, lang) {
  const metrics = {};

  switch (lang) {
    case 'javascript':
    case 'typescript':
      metrics.imports = (content.match(/^(import|require)\b/gm) || []).length;
      metrics.exports = (content.match(/^export\b/gm) || []).length;
      metrics.asyncFunctions = (content.match(/async\s+function|async\s*\([^)]*\)/g) || []).length;
      metrics.arrowFunctions = (content.match(/=>/g) || []).length;
      break;

    case 'python':
      metrics.imports = (content.match(/^import\s|^from\s+\w+\s+import/gm) || []).length;
      metrics.classes = (content.match(/^class\s+\w+/gm) || []).length;
      metrics.functions = (content.match(/^def\s+\w+/gm) || []).length;
      break;

    case 'go':
      metrics.imports = (content.match(/^import\s+/gm) || []).length;
      metrics.structs = (content.match(/^type\s+\w+\s+struct/gm) || []).length;
      metrics.interfaces = (content.match(/^type\s+\w+\s+interface/gm) || []).length;
      metrics.goroutines = (content.match(/go\s+\w+\s*\(/g) || []).length;
      break;

    case 'rust':
      metrics.structs = (content.match(/^struct\s+\w+/gm) || []).length;
      metrics.traits = (content.match(/^trait\s+\w+/gm) || []).length;
      metrics.impls = (content.match(/^impl\s+/gm) || []).length;
      metrics.unsafeBlocks = (content.match(/unsafe\s*\{/g) || []).length;
      break;
  }

  return metrics;
}

// Main execution
function main() {
  const args = process.argv.slice(2);
  const pathIndex = args.indexOf('--path');
  const metricsIndex = args.indexOf('--metrics');

  if (pathIndex === -1 || !args[pathIndex + 1]) {
    console.log(JSON.stringify({
      error: "Usage: node file-analyzer.js --path <file> [--metrics lines,words,characters,complexity]",
      success: false
    }, null, 2));
    process.exit(1);
  }

  const filePath = args[pathIndex + 1];
  const metrics = metricsIndex !== -1 && args[metricsIndex + 1]
    ? args[metricsIndex + 1].split(',')
    : ['lines', 'words'];

  const result = analyzeFile(filePath, metrics);
  console.log(JSON.stringify(result, null, 2));
}

if (require.main === module) {
  main();
}

module.exports = { analyzeFile };
