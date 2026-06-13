// Copies non-TS assets into `dist/` after `tsc` has run.
// Run from the engine's package root (npm script: `build`).
import { copyFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname } from 'node:path'

const assets = [
  ['src/styles/engine.css', 'dist/styles.css']
]

for (const [from, to] of assets) {
  if (!existsSync(from)) {
    console.warn(`[copy-assets] missing source: ${from}`)
    continue
  }
  mkdirSync(dirname(to), { recursive: true })
  copyFileSync(from, to)
  console.log(`[copy-assets] ${from} -> ${to}`)
}
