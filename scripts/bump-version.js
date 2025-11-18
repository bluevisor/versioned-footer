#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const versionFilePath = path.join(__dirname, '..', 'version.json');
const configFilePath = path.join(__dirname, '..', 'version-config.json');

// Read current version
const versionData = JSON.parse(fs.readFileSync(versionFilePath, 'utf8'));
const currentVersion = versionData.version;

// Read version format configuration
let format = 'YY.MM.N'; // Default format
if (fs.existsSync(configFilePath)) {
  const configData = JSON.parse(fs.readFileSync(configFilePath, 'utf8'));
  format = configData.format || 'YY.MM.N';
}

// Get current date values
const now = new Date();
const fullYear = now.getFullYear();
const twoDigitYear = fullYear.toString().slice(-2);
const month = (now.getMonth() + 1).toString();

// Parse format to understand structure
const hasFullYear = format.includes('YYYY');
const hasTwoDigitYear = format.includes('YY') && !hasFullYear;
const hasMonth = format.includes('MM');
const hasPatch = format.includes('N');

// Extract values from current version based on format
function parseVersion(version, format) {
  // Create regex pattern from format
  let pattern = format
    .replace(/\./g, '\\.')
    .replace('YYYY', '(\\d{4})')
    .replace('YY', '(\\d{1,2})')
    .replace('MM', '(\\d{1,2})')
    .replace('N', '(\\d+)');

  const regex = new RegExp(`^${pattern}$`);
  const match = version.match(regex);

  if (!match) {
    return null;
  }

  const result = {};
  let groupIndex = 1;

  // Extract values in order they appear in format
  const formatParts = format.match(/YYYY|YY|MM|N/g) || [];
  formatParts.forEach(part => {
    if (part === 'YYYY' || part === 'YY') {
      result.year = match[groupIndex++];
    } else if (part === 'MM') {
      result.month = match[groupIndex++];
    } else if (part === 'N') {
      result.patch = match[groupIndex++];
    }
  });

  return result;
}

// Generate new version based on format
function generateVersion(format, year, month, patch) {
  return format
    .replace('YYYY', year)
    .replace('YY', year)
    .replace('MM', month)
    .replace('N', patch);
}

// Parse current version
const parsed = parseVersion(currentVersion, format);

if (!parsed) {
  console.error(`Error: Current version "${currentVersion}" doesn't match format "${format}"`);
  process.exit(1);
}

// Determine if we should reset or increment
let shouldReset = false;

if (hasFullYear && hasMonth) {
  // Check if year AND month changed
  shouldReset = parsed.year !== fullYear.toString() || parsed.month !== month;
} else if (hasFullYear) {
  // Check if year changed
  shouldReset = parsed.year !== fullYear.toString();
} else if (hasTwoDigitYear && hasMonth) {
  // Check if year AND month changed
  shouldReset = parsed.year !== twoDigitYear || parsed.month !== month;
} else if (hasTwoDigitYear) {
  // Check if year changed
  shouldReset = parsed.year !== twoDigitYear;
} else if (hasMonth) {
  // Check if month changed
  shouldReset = parsed.month !== month;
}

// Calculate new patch number
let newPatch = '1';
if (hasPatch) {
  if (shouldReset) {
    newPatch = '1';
  } else {
    newPatch = (parseInt(parsed.patch || '0', 10) + 1).toString();
  }
}

// Generate new version
const newYear = hasFullYear ? fullYear.toString() : twoDigitYear;
const newVersion = generateVersion(format, newYear, month, newPatch);

// Update version file
versionData.version = newVersion;
fs.writeFileSync(versionFilePath, JSON.stringify(versionData, null, 2) + '\n');

console.log(`Version bumped: ${currentVersion} → ${newVersion}`);
