/**
 * This script is used to fix the field setting type in the generated API.
 * The generated API uses '_default' instead of 'default' for the default value.
 * This script replaces '_default' with 'default' and "'_default'" with "'default'" in the generated API.
 */
import fs from 'fs';
import path from 'path';

const rootDir = 'generated-sources/api';

function patchFieldSetting(filePath: string) {
  let original = fs.readFileSync(filePath, 'utf-8');
  if (!original.includes('export interface FieldSetting ')) return;

  let updated = original;

  // 1. Rename `_default?: FieldSettingDefault` to `default?: FieldSettingDefault`
  updated = updated.replace(/_default\?\:\s*FieldSettingDefault/g, 'default?: FieldSettingDefault');

  // 2. Replace `. _default` usage with `.default`
  updated = updated.replace(/value\._default/g, 'value.default');

  // 3. Replace `_default` keys in return object (FromJSON/ToJSON)
  updated = updated.replace(/'_default'/g, "'default'");
  updated = updated.replace(/_default:/g, 'default:');

  fs.writeFileSync(filePath, updated);

  if (updated !== original) {
    fs.writeFileSync(filePath, updated);
    console.log(`✅ Patched _default to default): ${filePath}`);
  } else {
    console.log(`ℹ️  No changes needed: ${filePath}`);
  }
}

function walk(dir: string) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(fullPath);
    else if (entry.name.endsWith('.ts')) patchFieldSetting(fullPath);
  }
}

walk(rootDir);
