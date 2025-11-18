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

// Ensure semantic fields exist for custom placeholders
const majorVersion = Number.isInteger(versionData.majorVersion)
  ? versionData.majorVersion
  : 1;
const minorVersion = Number.isInteger(versionData.minorVersion)
  ? versionData.minorVersion
  : 0;

// Get current date values
const now = new Date();
const fullYear = now.getFullYear();
const twoDigitYear = fullYear.toString().slice(-2);
const monthNumber = now.getMonth() + 1;
const monthPlain = monthNumber.toString();
const monthPadded = monthPlain.padStart(2, '0');
const dayNumber = now.getDate();
const dayPlain = dayNumber.toString();
const dayPadded = dayPlain.padStart(2, '0');

const formatTokens = format.match(/MAJORVERSION|MINORVERSION|YYYY|YY|MM|M|DD|D|N/g) || [];
const hasFullYear = formatTokens.includes('YYYY');
const hasTwoDigitYear = !hasFullYear && formatTokens.includes('YY');
const hasMonth = formatTokens.some(token => token === 'MM' || token === 'M');
const hasDay = formatTokens.some(token => token === 'DD' || token === 'D');
const hasPatch = formatTokens.includes('N');

// Extract values from current version based on format
function parseVersion(version, format) {
  // Create regex pattern from format
  const escapeRegex = str => str.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
  const pattern = escapeRegex(format).replace(
    /MAJORVERSION|MINORVERSION|YYYY|YY|MM|M|DD|D|N/g,
    token => {
      switch (token) {
        case 'MAJORVERSION':
        case 'MINORVERSION':
        case 'N':
          return '(\\d+)';
        case 'YYYY':
          return '(\\d{4})';
        case 'YY':
          return '(\\d{1,2})';
        case 'MM':
        case 'M':
        case 'DD':
        case 'D':
          return '(\\d{1,2})';
        default:
          return token;
      }
    }
  );

  const regex = new RegExp(`^${pattern}$`);
  const match = version.match(regex);

  if (!match) {
    return null;
  }

  const result = {};
  let groupIndex = 1;

  // Extract values in order they appear in format
  const formatParts = format.match(/MAJORVERSION|MINORVERSION|YYYY|YY|MM|M|DD|D|N/g) || [];
  formatParts.forEach(part => {
    const value = match[groupIndex++];
    switch (part) {
      case 'YYYY':
        result.fullYear = value;
        break;
      case 'YY':
        result.twoDigitYear = value;
        break;
      case 'MM':
      case 'M':
        result.month = parseInt(value, 10);
        break;
      case 'DD':
      case 'D':
        result.day = parseInt(value, 10);
        break;
      case 'N':
        result.patch = parseInt(value, 10);
        break;
      case 'MAJORVERSION':
        result.majorVersion = parseInt(value, 10);
        break;
      case 'MINORVERSION':
        result.minorVersion = parseInt(value, 10);
        break;
      default:
        break;
    }
  });

  return result;
}

// Generate new version based on format
function generateVersion(format, values) {
  return format.replace(/MAJORVERSION|MINORVERSION|YYYY|YY|MM|M|DD|D|N/g, token => {
    switch (token) {
      case 'YYYY':
        return values.fullYear;
      case 'YY':
        return values.twoDigitYear;
      case 'MM':
        return values.monthPadded;
      case 'M':
        return values.month;
      case 'DD':
        return values.dayPadded;
      case 'D':
        return values.day;
      case 'N':
        return values.patch;
      case 'MAJORVERSION':
        return values.majorVersion;
      case 'MINORVERSION':
        return values.minorVersion;
      default:
        return token;
    }
  });
}

// Parse current version
const parsed = parseVersion(currentVersion, format);

if (!parsed) {
  console.error(`Error: Current version "${currentVersion}" doesn't match format "${format}"`);
  process.exit(1);
}

// Determine if we should reset or increment
let shouldReset = false;

if (hasFullYear) {
  shouldReset = parsed.fullYear !== fullYear.toString();
} else if (hasTwoDigitYear) {
  shouldReset = parsed.twoDigitYear !== twoDigitYear;
}

if (!shouldReset && hasMonth) {
  shouldReset = parsed.month !== monthNumber;
}

if (!shouldReset && hasDay) {
  shouldReset = parsed.day !== dayNumber;
}

// Calculate new patch number
let newPatch = '1';
if (hasPatch) {
  if (shouldReset) {
    newPatch = '1';
  } else {
    const previousPatch = Number.isInteger(parsed.patch) ? parsed.patch : 0;
    newPatch = (previousPatch + 1).toString();
  }
}

// Generate new version
const newVersion = generateVersion(format, {
  fullYear: fullYear.toString(),
  twoDigitYear,
  month: monthPlain,
  monthPadded,
  day: dayPlain,
  dayPadded,
  patch: newPatch,
  majorVersion: majorVersion.toString(),
  minorVersion: minorVersion.toString(),
});

// Update version file
versionData.version = newVersion;
versionData.majorVersion = majorVersion;
versionData.minorVersion = minorVersion;
fs.writeFileSync(versionFilePath, JSON.stringify(versionData, null, 2) + '\n');

console.log(`Version bumped: ${currentVersion} → ${newVersion}`);
