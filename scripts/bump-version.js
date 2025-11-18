#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const versionFilePath = path.join(__dirname, '..', 'version.json');

// Read current version
const versionData = JSON.parse(fs.readFileSync(versionFilePath, 'utf8'));
const currentVersion = versionData.version;

// Get current date
const now = new Date();
const year = now.getFullYear().toString().slice(-2); // Last 2 digits of year
const month = (now.getMonth() + 1).toString(); // Month (1-12)

// Parse current version
const [currentYear, currentMonth, currentPatch] = currentVersion.split('.');

// Determine new version
let newYear = year;
let newMonth = month;
let newPatch = '1';

if (currentYear === year && currentMonth === month) {
  // Same month - increment patch version
  newPatch = (parseInt(currentPatch, 10) + 1).toString();
} else {
  // New month - reset to version 1
  newPatch = '1';
}

const newVersion = `${newYear}.${newMonth}.${newPatch}`;

// Update version file
versionData.version = newVersion;
fs.writeFileSync(versionFilePath, JSON.stringify(versionData, null, 2) + '\n');

console.log(`Version bumped: ${currentVersion} → ${newVersion}`);
