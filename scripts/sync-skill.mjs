// Postinstall: copy this engine's SKILL.md into the consumer's
// `.claude/skills/nextra-docs/SKILL.md` so Claude Code agents see the latest
// authoring protocol.
//
// Runs in the engine's own directory when installed; uses `INIT_CWD` to find
// the consumer's project root. Safe no-op when:
//   - INIT_CWD isn't set (engine is being developed locally, not installed)
//   - INIT_CWD equals the engine's own package dir (`npm install` inside engine)
//   - the source SKILL.md is missing
//
// To run manually after `npm ci --ignore-scripts`:
//   node node_modules/@sygnal/nextra-docs-engine/scripts/sync-skill.mjs
import { copyFileSync, mkdirSync, existsSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const enginePkgRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const consumerRoot = process.env.INIT_CWD ?? process.cwd()

// If we're being run in the engine's own directory (e.g. `npm install` inside
// the engine repo while developing), don't sync into ourselves.
if (resolve(consumerRoot) === enginePkgRoot) {
  console.log('[sync-skill] running inside engine repo — skipping self-sync')
  process.exit(0)
}

const source = join(enginePkgRoot, 'skill', 'SKILL.md')
if (!existsSync(source)) {
  console.warn(`[sync-skill] source not found: ${source}`)
  process.exit(0)
}

const targetDir = join(consumerRoot, '.claude', 'skills', 'nextra-docs')
const target = join(targetDir, 'SKILL.md')
mkdirSync(targetDir, { recursive: true })
copyFileSync(source, target)
console.log(`[sync-skill] wrote ${target}`)
