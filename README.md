# @sygnal/nextra-docs-engine

Shared infrastructure for Sygnal's Nextra 4 + Next.js 15 documentation sites.

Bundles the components, styles, custom breadcrumb (with sidebar group prefix),
MDX wiring, and authoring skill that we've evolved across multiple docs
projects. One source of truth — fixes flow to all consumers via version bump.

## What's in here

- **Components** (registered globally by the factory) — `Callout`, `DataTable`, `Embed`, `Video`, `YouTube`
- **Demo wrappers** for the styleguide — `ButtonDemo`, `CollapseDemo`, `SelectDemo`
- **`createPageBreadcrumb(meta)`** — factory for the custom breadcrumb that reads sidebar groups from `_meta.js`
- **`createUseMDXComponents({ meta })`** — the only thing most consumers call
- **`/styles.css`** — breadcrumb + sidebar separator styling
- **`/skill/SKILL.md`** — Claude Code authoring skill, synced into consumer's `.claude/skills/nextra-docs/` on install
- **`/templates/*`** — starter files for new projects

## Install

```bash
npm install @sygnal/nextra-docs-engine
```

Or for local development:

```bash
npm install file:../nextra-docs-engine
```

## Consumer setup

After install, three files in the consumer project need to look like this:

### `src/mdx-components.tsx`

```tsx
import { createUseMDXComponents } from '@sygnal/nextra-docs-engine'
import meta from './content/_meta.js'

export const useMDXComponents = createUseMDXComponents({ meta })
```

### `src/app/globals.css`

```css
@import '@sygnal/nextra-docs-engine/styles.css';

/* Project-specific overrides go below */
:root {
  --nextra-content-width: 1400px;
}
```

### `src/app/[[...slug]]/page.tsx`

Standard Nextra page handler, but make sure `sourceCode` is threaded to the
wrapper (enables the theme's built-in Copy Page / ChatGPT / Claude menu):

```tsx
import { generateStaticParamsFor, importPage } from 'nextra/pages'
import { useMDXComponents as getMDXComponents } from '../../mdx-components'

export const generateStaticParams = generateStaticParamsFor('slug')

export async function generateMetadata(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params
  const { metadata } = await importPage(params.slug)
  return metadata
}

const Wrapper = getMDXComponents().wrapper

export default async function Page(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params
  const result = await importPage(params.slug)
  const { default: MDXContent, toc, metadata, sourceCode } = result
  return (
    <Wrapper toc={toc} metadata={metadata} sourceCode={sourceCode}>
      <MDXContent {...props} params={params} />
    </Wrapper>
  )
}
```

### `next.config.mjs`

See `templates/next.config.mjs` for the canonical version. Key bits:

```js
import nextra from 'nextra'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const withNextra = nextra({ latex: true, search: { codeblocks: true } })

// Required when the engine is installed as a `file:` dep (local dev) or via
// `npm link` — see "Peer-dep deduplication" below.
const dedupePeerDeps = (config) => {
  config.resolve = config.resolve ?? {}
  config.resolve.symlinks = false
  config.resolve.alias = config.resolve.alias ?? {}
  try {
    config.resolve.alias['nextra-theme-docs$'] = require.resolve('nextra-theme-docs')
  } catch {}
  return config
}

export default withNextra({
  reactStrictMode: true,
  output: 'export',
  images: { unoptimized: true },
  transpilePackages: ['@theguild/remark-mermaid'],
  webpack: dedupePeerDeps
})
```

### Peer-dep deduplication (important for local dev)

When the engine is installed via `npm install file:../nextra-docs-engine` or
`npm link`, npm **symlinks** the engine source into the consumer's
`node_modules`. The engine's own `node_modules/nextra-theme-docs` then takes
precedence over the consumer's copy when Node resolves imports from inside the
engine code.

Two copies of `nextra-theme-docs` means two `ConfigContext` instances. The
consumer's Layout sets up Provider A; the engine's `useConfig` reads from
Provider B — finds nothing — throws **`Missing ConfigContext.Provider`** at
prerender time.

The `dedupePeerDeps` webpack config in `next.config.mjs` fixes this by:

1. **`resolve.symlinks: false`** — webpack treats the symlinked path as the
   resolution root, so imports inside the engine fall through to the
   consumer's `node_modules`.
2. **Alias `nextra-theme-docs$`** — belt-and-braces, pins the package to the
   consumer's copy explicitly. The `$` ensures subpaths like
   `nextra-theme-docs/style.css` still resolve normally.

This is safe to leave in place for tarball / git URL installs too — the alias
just resolves to what would resolve anyway.

## What stays per-project

- `src/app/layout.tsx` — brand identity (logo, footer, repo URL, title template)
- `src/app/opengraph-image.tsx` — OG branding
- `src/content/` — the actual docs
- `src/content/_meta.js` — sidebar structure (used by the breadcrumb factory)
- `public/` — site-specific assets

## The skill

`skill/SKILL.md` is the Claude Code authoring protocol. On `npm install` a
postinstall script copies it into `<consumer>/.claude/skills/nextra-docs/SKILL.md`
so the agent always sees the latest.

If your CI uses `npm ci --ignore-scripts`, the sync is skipped. Run manually:

```bash
node node_modules/@sygnal/nextra-docs-engine/scripts/sync-skill.mjs
```

Or wire it into a `prebuild` script.

## Updating

```bash
npm install @sygnal/nextra-docs-engine@latest
```

The skill, components, and styles update together. Check the engine's
CHANGELOG for breaking changes before bumping.

## Versioning

Semver. Breaking changes to the public API (exports from `index.ts`, prop
shapes, CSS class names) bump the major version. Additions are minor. Bug
fixes and internal refactors are patch.

## Development

```bash
git clone https://github.com/sygnaltech/nextra-docs-engine
cd nextra-docs-engine
npm install
npm run build
```

To test changes against a consumer locally, run `npm run build` in the engine
first, then in the consumer:

```bash
npm install file:../nextra-docs-engine
```

The engine ships its committed `dist/` — consumers don't build.

## License

MIT — see [LICENSE](./LICENSE).
