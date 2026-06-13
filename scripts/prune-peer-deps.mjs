// Removes the engine's nested peer-dep node_modules AFTER tsc has finished.
// These exist as devDependencies so tsc can typecheck the engine's source —
// but if they remain in the engine's node_modules, consumers installing the
// engine via `file:` / `npm link` end up resolving a SECOND copy of each peer
// (the engine's nested one), producing duplicate React contexts and breaking
// `useConfig` with "Missing ConfigContext.Provider".
//
// Engine devs: re-run `npm install` in the engine if you need to typecheck
// after a build (the deps come back, get pruned again on next build).
import { rmSync, existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const enginePkgRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const nodeModules = join(enginePkgRoot, 'node_modules')

const peerDeps = [
  'nextra-theme-docs',
  'nextra',
  'next',
  'react',
  'react-dom'
]

let pruned = 0
for (const pkg of peerDeps) {
  const target = join(nodeModules, pkg)
  if (existsSync(target)) {
    rmSync(target, { recursive: true, force: true })
    console.log(`[prune-peer-deps] removed ${pkg}`)
    pruned++
  }
}
console.log(`[prune-peer-deps] ${pruned} peer dep(s) pruned`)
