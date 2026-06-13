import nextra from 'nextra'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

const withNextra = nextra({
  latex: true,
  search: {
    codeblocks: true
  }
})

// Force `nextra-theme-docs` to resolve to THIS project's copy. Required when
// @sygnal/nextra-docs-engine is installed as a `file:` dep (local dev) or via
// `npm link` — npm symlinks the engine source, and Node would otherwise find
// the engine's nested copy first. Two copies of nextra-theme-docs = two
// ConfigContexts = `useConfig` throws "Missing ConfigContext.Provider".
//
// Safe to leave in place for tarball / git URL installs too — the alias just
// matches what would resolve anyway.
const dedupePeerDeps = (config) => {
  config.resolve = config.resolve ?? {}
  config.resolve.symlinks = false
  config.resolve.alias = config.resolve.alias ?? {}
  try {
    config.resolve.alias['nextra-theme-docs$'] = require.resolve('nextra-theme-docs')
  } catch {
    /* not installed; default resolution applies */
  }
  return config
}

export default withNextra({
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true
  },
  transpilePackages: ['@theguild/remark-mermaid'],
  webpack: dedupePeerDeps
})
