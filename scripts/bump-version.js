#!/usr/bin/env node
/**
 * bump-version.js
 *
 * Sincroniza la versión de package.json a los archivos nativos de Android e iOS.
 * Se ejecuta automáticamente como hook `postbump` de standard-version (ver .versionrc.json).
 *
 * Archivos actualizados:
 *   - android/app/build.gradle  → versionName, versionCode
 *   - ios/ruteo.xcodeproj/project.pbxproj → MARKETING_VERSION, CURRENT_PROJECT_VERSION
 *
 * versionCode / CURRENT_PROJECT_VERSION formula:
 *   major * 10000 + minor * 100 + patch
 *   Ej: 1.2.3 → 10203 | 2.0.0 → 20000
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));

const version = pkg.version;
const [major, minor, patch] = version.split('.').map(Number);
const buildNumber = major * 10000 + minor * 100 + patch;

console.log(`\nBumping native versions → ${version} (build: ${buildNumber})`);

// ── Android ──────────────────────────────────────────────────────────────────
const buildGradlePath = path.join(ROOT, 'android/app/build.gradle');
let buildGradle = fs.readFileSync(buildGradlePath, 'utf8');

buildGradle = buildGradle.replace(/versionCode\s+\d+/, `versionCode ${buildNumber}`);
buildGradle = buildGradle.replace(/versionName\s+"[^"]+"/, `versionName "${version}"`);

fs.writeFileSync(buildGradlePath, buildGradle);
console.log('  android/app/build.gradle updated');

// ── iOS ───────────────────────────────────────────────────────────────────────
const pbxprojPath = path.join(ROOT, 'ios/ruteo.xcodeproj/project.pbxproj');
let pbxproj = fs.readFileSync(pbxprojPath, 'utf8');

pbxproj = pbxproj.replace(/MARKETING_VERSION = [^;]+;/g, `MARKETING_VERSION = ${version};`);
pbxproj = pbxproj.replace(/CURRENT_PROJECT_VERSION = \d+;/g, `CURRENT_PROJECT_VERSION = ${buildNumber};`);

fs.writeFileSync(pbxprojPath, pbxproj);
console.log('  ios/ruteo.xcodeproj/project.pbxproj updated');

// Stage native files so standard-version includes them in the release commit
execSync('git add android/app/build.gradle ios/ruteo.xcodeproj/project.pbxproj', { cwd: ROOT });
console.log('  Native files staged for release commit');

console.log(`Done!\n`);
