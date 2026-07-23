/**
 * Reads the Theatre.js project state from the Storybook iframe localStorage
 * and writes it to theatreState.json in this folder.
 *
 * Run after recording keyframes in the Theatre.js Studio UI:
 *   node src/stories/three/stories-components/experiences/camera-path/save-theatre-state.mjs
 */
import { chromium } from '../../../../../../node_modules/.pnpm/playwright@1.55.0/node_modules/playwright/index.mjs'
import { writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const STORY_URL = 'http://localhost:6006/iframe.html?globals=&args=&id=three-experiences-camerapath--default&viewMode=story'
const OUT_FILE = join(__dirname, 'theatreState.json')

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage()

console.log('Opening story iframe...')
await page.goto(STORY_URL)
await page.waitForTimeout(5000)

const result = await page.evaluate(() => {
  const key = Object.keys(localStorage).find(k => k.toLowerCase().includes('theatre'))
  if (!key) return { error: 'No theatre key in localStorage', keys: Object.keys(localStorage) }
  const full = JSON.parse(localStorage.getItem(key) ?? '{}')
  // Extract just the BerlinTour project state — this is what getProject() expects
  const projectState = full?.historic?.innerState?.coreByProject?.BerlinTour
  if (!projectState) return { error: 'BerlinTour project not found in state', full }
  const hasKeyframes = Object.keys(projectState.sheetsById ?? {}).length > 0
  return { projectState, hasKeyframes }
})

await browser.close()

if (result.error) {
  console.error('Error:', result.error, result)
  process.exit(1)
}

if (!result.hasKeyframes) {
  console.warn('\n⚠  No keyframes found — sheetsById is empty.')
  console.warn('   Go to the Theatre.js Studio in Storybook, sequence the Camera position')
  console.warn('   and rotation props (click the dot next to each), add keyframes,')
  console.warn('   then run this script again.\n')
  process.exit(1)
}

writeFileSync(OUT_FILE, JSON.stringify(result.projectState, null, 2))
console.log(`\n✅ Saved ${OUT_FILE}`)
