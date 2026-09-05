#!/usr/bin/env node
// Adds a story to the `prodStories` list in .storybook/main.ts.
// Usage: node scripts/add-prod-story.mjs <story-title>
// <story-title> must match the folder/file name in kebab-case, e.g.
// "webgpu-vs-webgl" for src/stories/three/stories-components/webgpu-vs-webgl/webgpu-vs-webgl.stories.tsx

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const mainTsPath = path.join(repoRoot, '.storybook/main.ts');

// Keep in sync with groupBasePaths in .storybook/main.ts
const groupBasePaths = {
  three: 'three/stories-components',
  cpp: 'cpp',
  html: 'html/experiences',
  webgl: 'webgl',
};

// Prerequisite (see the "Pre:" comment above prodStories in main.ts): the
// story folder and its .stories.tsx file must share the same kebab-case name.
// If a folder matching `title` exists but doesn't contain `title.stories.tsx`,
// we point that out specifically instead of just saying "not found".
function checkMisnamedFolder(title) {
  for (const [group, basePath] of Object.entries(groupBasePaths)) {
    const folder = path.join(repoRoot, 'src/stories', basePath, title);
    if (!existsSync(folder)) continue;
    const storiesFiles = readdirSync(folder).filter((f) => f.endsWith('.stories.tsx'));
    if (storiesFiles.length > 0 && !storiesFiles.includes(`${title}.stories.tsx`)) {
      console.error(`Found folder "${title}" (group: ${group}) but its story file is named`);
      console.error(`  ${storiesFiles.join(', ')}`);
      console.error(`instead of "${title}.stories.tsx".`);
      console.error('');
      console.error(
        'Prerequisite: the story file (and its component file) must be named exactly like the folder, in kebab-case.',
      );
      console.error(`Rename both to "${title}.tsx" / "${title}.stories.tsx" and re-run this script.`);
      process.exit(1);
    }
  }
}

function findGroup(title) {
  const matches = Object.entries(groupBasePaths).filter(([group, basePath]) => {
    const storyFile = path.join(
      repoRoot,
      'src/stories',
      basePath,
      title,
      `${title}.stories.tsx`,
    );
    return existsSync(storyFile);
  });

  if (matches.length === 0) {
    checkMisnamedFolder(title);
    console.error(`No story file found for "${title}" in any group.`);
    console.error('Expected one of:');
    for (const [group, basePath] of Object.entries(groupBasePaths)) {
      console.error(`  src/stories/${basePath}/${title}/${title}.stories.tsx  (group: ${group})`);
    }
    process.exit(1);
  }

  if (matches.length > 1) {
    console.error(
      `"${title}" matches multiple groups: ${matches.map(([g]) => g).join(', ')}. Ambiguous, aborting.`,
    );
    process.exit(1);
  }

  return matches[0][0];
}

const title = process.argv[2];
if (!title) {
  console.error('Usage: node scripts/add-prod-story.mjs <story-title>');
  process.exit(1);
}

const group = findGroup(title);
let source = readFileSync(mainTsPath, 'utf8');

const entryRegex = new RegExp(
  `\\{\\s*group:\\s*'${group}',\\s*title:\\s*'${title}'\\s*\\}`,
);
if (entryRegex.test(source)) {
  console.log(`"${title}" (group: ${group}) is already in prodStories. Nothing to do.`);
  process.exit(0);
}

const newEntry = `  { group: '${group}', title: '${title}' },\n`;
const arrayEndMarker = '];';
const arrayStart = source.indexOf('const prodStories');
if (arrayStart === -1) {
  console.error('Could not find `const prodStories` in main.ts.');
  process.exit(1);
}
const arrayEnd = source.indexOf(arrayEndMarker, arrayStart);
if (arrayEnd === -1) {
  console.error('Could not find the end of the prodStories array in main.ts.');
  process.exit(1);
}

source = source.slice(0, arrayEnd) + newEntry + source.slice(arrayEnd);
writeFileSync(mainTsPath, source);

console.log(`Added "${title}" (group: ${group}) to prodStories in .storybook/main.ts`);
