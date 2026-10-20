import { cpSync, rmSync, existsSync } from 'node:fs';

const buildDir = process.env.BUILD_DIR || 'dist';
const sbDir = 'storybook-static';

if (!existsSync(buildDir)) throw new Error(`No existe ${buildDir}. Corre el build primero.`);
if (!existsSync(sbDir)) throw new Error(`No existe ${sbDir}. Corre build-storybook primero.`);

rmSync(`${buildDir}/storybook`, { recursive: true, force: true });
cpSync(sbDir, `${buildDir}/storybook`, { recursive: true });
console.log(`Storybook copiado a ${buildDir}/storybook`);
