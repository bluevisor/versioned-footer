#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const projectRoot = process.cwd();
const hookPath = path.join(projectRoot, '.git', 'hooks', 'pre-commit');
const versionPath = path.join(projectRoot, 'version.json');
const configPath = path.join(projectRoot, 'version-config.json');
const packagePath = path.join(__dirname, '..');

// Check if .git exists
if (!fs.existsSync(path.join(projectRoot, '.git'))) {
  console.error('❌ Error: Not a git repository. Run `git init` first.');
  process.exit(1);
}

// Copy version.json if it doesn't exist
if (!fs.existsSync(versionPath)) {
  const sourceVersion = path.join(packagePath, 'version.json');
  fs.copyFileSync(sourceVersion, versionPath);
  console.log('✅ Created version.json in project root');
} else {
  console.log('ℹ️  version.json already exists, skipping');
}

// Copy version-config.json if it doesn't exist
if (!fs.existsSync(configPath)) {
  const sourceConfig = path.join(packagePath, 'version-config.json');
  fs.copyFileSync(sourceConfig, configPath);
  console.log('✅ Created version-config.json in project root');
} else {
  console.log('ℹ️  version-config.json already exists, skipping');
}

// Create hooks directory if it doesn't exist
const hooksDir = path.join(projectRoot, '.git', 'hooks');
if (!fs.existsSync(hooksDir)) {
  fs.mkdirSync(hooksDir, { recursive: true });
}

// Create pre-commit hook
const hookContent = `#!/bin/sh
node scripts/bump-version.js
git add version.json
exit 0
`;

fs.writeFileSync(hookPath, hookContent);
fs.chmodSync(hookPath, '755');
console.log('✅ Created pre-commit hook');

// Copy bump-version.js to project scripts
const projectScriptsDir = path.join(projectRoot, 'scripts');
if (!fs.existsSync(projectScriptsDir)) {
  fs.mkdirSync(projectScriptsDir, { recursive: true });
}

const sourceBumpScript = path.join(packagePath, 'scripts', 'bump-version.js');
const targetBumpScript = path.join(projectScriptsDir, 'bump-version.js');

fs.copyFileSync(sourceBumpScript, targetBumpScript);
console.log('✅ Copied bump-version.js to scripts/');

console.log('\n🎉 Auto-versioning setup complete!');
console.log('Your version will auto-increment on every commit.');
console.log('\n💡 Customize your version format in version-config.json');
console.log('   Supported formats: YY.MM.N, YYYY.MM.N, MM.YY.N, MM.YYYY.N, N, YY.N, MM.N, etc.\n');
