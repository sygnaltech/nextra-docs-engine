# ACTION: refactor an existing docs project to use `@sygnal/nextra-docs-engine`

**Audience:** an agent operating inside a Nextra 4 + Next 15 docs project that
currently has its own copy of the shared docs components. This document is the
authoritative procedure.

**Result:** the project consumes the engine via npm. Local copies of shared
components are deleted. Branding and content remain untouched.

---

## Preflight (read before doing anything)

### 1. Confirm the project is in scope

Run these checks. **Abort if any fails** and report back to the user instead
of attempting workarounds.

| Check | Required value |
|---|---|
| `package.json` → `dependencies.next` | exactly `15.5.4` |
| `package.json` → `dependencies.nextra` | exactly `4.6.0` |
| `package.json` → `dependencies.nextra-theme-docs` | exactly `4.6.0` |
| `package.json` → `dependencies.react` | `^19.1.0` |
| `src/app/[[...slug]]/page.tsx` | exists |
| `src/content/_meta.js` | exists |
| `src/mdx-components.tsx` | exists |

If a version mismatch exists, do **not** silently upgrade — flag it. The
engine pins these exact versions in its peer deps; mismatches will cause
hard-to-debug failures.

### 2. Identify the engine's location

The engine source must be accessible. Default expectation:
`../nextra-docs-engine` (sibling directory). Confirm:

```bash
test -f ../nextra-docs-engine/package.json && cat ../nextra-docs-engine/package.json | grep '"name"'
```

Expected output includes `"@sygnal/nextra-docs-engine"`. If not present at
that path, **stop and ask** the user where the engine lives.

### 3. Snapshot what's there

Before changing anything, list these directories so you can verify deletions
later:

```bash
ls src/components/
ls src/content/
cat src/mdx-components.tsx
```

Take note of:
- Which files exist in `src/components/`
- Whether `src/components/PageBreadcrumb.tsx` exists (some older projects predate it)
- Any **project-specific** components in `src/components/` that are NOT in the
  engine's set (see "Engine component set" below) — these must be preserved.

### Engine component set (will be deleted from consumer)

Only these files are owned by the engine. If they exist locally, they are
duplicates and get deleted:

- `src/components/Callout.tsx`
- `src/components/DataTable.tsx`
- `src/components/Embed.tsx`
- `src/components/PageBreadcrumb.tsx`
- `src/components/Video.tsx`
- `src/components/YouTube.tsx`
- `src/components/styleguide-demos.tsx`

Anything else in `src/components/` is project-specific. **Do not touch it.**

---

## Step 1 — Add the engine as a dependency

Edit `package.json`. Add to `dependencies`, placed alphabetically (before
`next`):

```json
"@sygnal/nextra-docs-engine": "file:../nextra-docs-engine",
```

Then install:

```bash
npm install --no-audit --no-fund
```

**Verify:**
- The postinstall script should print:
  `[sync-skill] wrote <path>/.claude/skills/nextra-docs/SKILL.md`
- `node_modules/@sygnal/nextra-docs-engine/dist/index.js` exists
- `.claude/skills/nextra-docs/SKILL.md` was created or updated

If the postinstall did NOT run (CI uses `--ignore-scripts`), run it manually:

```bash
node node_modules/@sygnal/nextra-docs-engine/scripts/sync-skill.mjs
```

---

## Step 2 — Rewrite `src/mdx-components.tsx`

Replace the entire file with exactly:

```tsx
import { createUseMDXComponents } from '@sygnal/nextra-docs-engine'
import meta from './content/_meta.js'

export const useMDXComponents = createUseMDXComponents({ meta })
```

**If the project has a custom Callout** (different from the engine's
default — check `src/components/Callout.tsx` against the engine version
before deleting), pass it via the factory:

```tsx
import { createUseMDXComponents } from '@sygnal/nextra-docs-engine'
import meta from './content/_meta.js'
import { Callout } from './components/Callout'  // keep the local custom one

export const useMDXComponents = createUseMDXComponents({ meta, Callout })
```

**If the project registers additional non-engine components**, augment the
returned function:

```tsx
import { createUseMDXComponents } from '@sygnal/nextra-docs-engine'
import meta from './content/_meta.js'
import { MyCustomThing } from './components/MyCustomThing'

const useEngineMDX = createUseMDXComponents({ meta })

export function useMDXComponents(components = {}) {
  return useEngineMDX({ MyCustomThing, ...components })
}
```

---

## Step 3 — Rewrite `src/app/globals.css`

Read the current file first. Preserve any **project-specific** rules at the
bottom (typically the `--nextra-content-width` override or brand colors).

Replace the file with:

```css
@import '@sygnal/nextra-docs-engine/styles.css';

/* Project-specific overrides go below */
:root {
  --nextra-content-width: 1400px;
}

/* …carry over any other project-specific rules you found above… */
```

If the file currently has the breadcrumb / sidebar separator styles that
match the engine's (look for `.page-breadcrumb` or `.nextra-breadcrumb { display: none }`),
**delete those** — they're now provided by the engine import.

---

## Step 4 — Update `next.config.mjs`

This is the one with the highest risk if done wrong. Read the current file
first. Preserve any project-specific Nextra options (e.g. `latex`, `search`).

Replace with:

```js
import nextra from 'nextra'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

const withNextra = nextra({
  latex: true,
  search: {
    codeblocks: true
  }
})

// REQUIRED when @sygnal/nextra-docs-engine is installed as a `file:` dep.
// npm symlinks the engine source; without this dedup, the engine's nested
// nextra-theme-docs gets resolved first, producing two ConfigContexts and
// breaking useConfig at prerender ("Missing ConfigContext.Provider").
const dedupePeerDeps = (config) => {
  config.resolve = config.resolve ?? {}
  config.resolve.symlinks = false
  config.resolve.alias = config.resolve.alias ?? {}
  try {
    config.resolve.alias['nextra-theme-docs$'] = require.resolve('nextra-theme-docs')
  } catch {
    /* fallthrough */
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
```

**Do not omit `dedupePeerDeps`** — even if you used `github:` install instead
of `file:` dep. The cost of leaving it in place when not needed is zero; the
cost of omitting when needed is a hard-to-diagnose prerender failure.

**Do not** put `@sygnal/nextra-docs-engine` in `transpilePackages` — the
package ships pre-compiled ESM with `'use client'` directives preserved.
Transpiling it again is unnecessary and can break the directives.

---

## Step 5 — Delete the duplicated components

These files are now provided by the engine. **Delete exactly these:**

```bash
rm -f src/components/Callout.tsx
rm -f src/components/DataTable.tsx
rm -f src/components/Embed.tsx
rm -f src/components/PageBreadcrumb.tsx
rm -f src/components/Video.tsx
rm -f src/components/YouTube.tsx
rm -f src/components/styleguide-demos.tsx
```

Use `-f` (or PowerShell `-ErrorAction SilentlyContinue`) so missing files
don't error.

**Do NOT** delete anything else in `src/components/`. Project-specific
components must remain.

If after the deletions `src/components/` is empty, leave the empty directory
in place — don't delete the directory itself.

---

## Step 6 — Update `src/content/styleguide.mdx` (if present)

The styleguide demos that used to be local imports now come from the engine.
Read the file. Find any import lines referencing the deleted files:

```mdx
import { ButtonDemo, CollapseDemo, SelectDemo } from '../components/styleguide-demos'
import { DataTable } from '../components/DataTable'
```

Replace with a single engine import:

```mdx
import { ButtonDemo, CollapseDemo, SelectDemo, DataTable } from '@sygnal/nextra-docs-engine'
```

**Do not** rewrite the styleguide content. If the project's styleguide
diverges from the engine's `templates/styleguide.mdx`, preserve the local
content — only the import lines change.

If no `styleguide.mdx` exists, skip this step.

---

## Step 7 — Verify

Build must pass:

```bash
npm run build
```

Expected output ends with:

```
✓ Compiled successfully
✓ Generating static pages (N/N)
✓ Exporting (M/M)
```

(N and M depend on the project's page count.)

If the build fails, see "Troubleshooting" below. **Do not** invent fixes; map
the error to a known cause.

---

## Files that must NOT be modified

These are per-project and are out of scope for this refactor:

- `src/app/layout.tsx` — brand identity (logo, footer, repo URL, title template)
- `src/app/opengraph-image.tsx` — branded OG image
- `src/app/[[...slug]]/page.tsx` — already correct in modern projects (if it
  doesn't thread `sourceCode`, copy from `templates/page.tsx` in the engine,
  but only that one line)
- `src/content/_meta.js` — sidebar structure
- `src/content/*.mdx` (except `styleguide.mdx` per Step 6) — page content
- `public/` — assets
- `CLAUDE.md`, `README.md` — project docs

---

## Troubleshooting

### `Missing ConfigContext.Provider` at prerender

Cause: the peer-dep dedup in `next.config.mjs` wasn't applied or didn't take
effect. The engine's nested `nextra-theme-docs` was resolved instead of the
consumer's.

Fix: confirm `webpack: dedupePeerDeps` is in `next.config.mjs` and the
function body matches Step 4 exactly. Then:

```bash
rm -rf .next
npm run build
```

### `Module not found: Can't resolve '@sygnal/nextra-docs-engine'`

Causes (in order of likelihood):

1. `npm install` wasn't run after editing `package.json`. Run it.
2. The `file:` path in `package.json` is wrong. Should be `file:../nextra-docs-engine`
   (sibling). Check `ls ../nextra-docs-engine/package.json`.
3. The engine's `dist/` wasn't built. Run `(cd ../nextra-docs-engine && npm run build)`.

### `Module not found: Can't resolve 'react/jsx-runtime'`

Cause: you aliased `react` in the webpack config (not in this procedure, but
agents sometimes add it defensively). Aliasing `react` to a single file breaks
its subpath exports.

Fix: only alias `nextra-theme-docs` as shown in Step 4. Do NOT alias `react`,
`react-dom`, `next`, or `nextra`.

### `Event handlers cannot be passed to Client Component props`

Cause: an MDX file is passing `onClick` (or similar) directly to a client
component. Not introduced by this refactor, but may surface if the project
had local workarounds that depended on a now-deleted file.

Fix: wrap the interactive bit in a `'use client'` component. Pattern in the
engine's `src/components/styleguide-demos.tsx`.

### Build succeeds but the breadcrumb shows no group prefix

Not a bug — this happens when `_meta.js` has no `{ type: 'separator', title }`
entries. Add them to see the group prefix appear in the breadcrumb. The
sidebar will show the labels in indigo + uppercase.

### Postinstall didn't sync the skill

CI environments often pass `--ignore-scripts`. Run manually:

```bash
node node_modules/@sygnal/nextra-docs-engine/scripts/sync-skill.mjs
```

Or add to `package.json` scripts as a `prebuild`:

```json
"prebuild": "node node_modules/@sygnal/nextra-docs-engine/scripts/sync-skill.mjs"
```

---

## Done state checklist

After completing all steps, the project should have:

- [ ] `@sygnal/nextra-docs-engine` in `package.json` `dependencies`
- [ ] `src/mdx-components.tsx` is 3 lines (or 5, if custom Callout)
- [ ] `src/app/globals.css` opens with `@import '@sygnal/nextra-docs-engine/styles.css';`
- [ ] `next.config.mjs` has the `dedupePeerDeps` webpack hook
- [ ] `src/components/` contains only project-specific files (Callout etc. deleted)
- [ ] `.claude/skills/nextra-docs/SKILL.md` exists (synced from engine)
- [ ] `npm run build` exits 0
- [ ] No edits to `layout.tsx`, `opengraph-image.tsx`, `_meta.js`, `content/*.mdx` (except styleguide imports), or `public/`

---

## Scope clarifications

This refactor is a **wiring change** — it swaps local copies of shared
components for engine imports. The engine's **capabilities** are then live
automatically. The refactor does not author or generate per-project
**content** — that's separate work.

### Engine capabilities active after refactor (no extra work)

| Capability | Where it lives |
|---|---|
| Custom `Callout` with 7 variants (`default`, `info`, `tip`, `success`, `warning`, `error`, `important`) | `mdx-components.tsx` factory |
| `DataTable`, `Embed`, `Video`, `YouTube` registered globally in MDX | `mdx-components.tsx` factory |
| `ImageZoom` on plain markdown images | `mdx-components.tsx` factory |
| Custom breadcrumb that replaces Nextra's, with sidebar group prefix | `mdx-components.tsx` factory + `engine.css` |
| Sidebar separator labels styled in indigo + uppercase | `engine.css` |
| `ButtonDemo`, `CollapseDemo`, `SelectDemo` for styleguides | engine export |
| Authoring skill synced to `.claude/skills/` | postinstall script |

### Per-project content this refactor does NOT touch

These are **content decisions** specific to each project. The capabilities
exist in the engine; the project decides whether and how to use them.

- **`src/content/_meta.js`** — sidebar order, page titles, separator groups.
  If the project has `{ type: 'separator', title: 'X' }` entries, they
  render in the engine's styling. If it doesn't, no group prefix appears in
  the breadcrumb — but the capability is live the moment one is added. See
  `templates/styleguide.mdx` and the engine's `SKILL.md` for the separator
  syntax.
- **`src/app/opengraph-image.tsx`** — OG image with project branding. Engine
  templates ship `templates/opengraph-image.tsx` with the correct route
  placement, `force-static` export, and the `next/og` `ImageResponse`
  pattern. The refactor doesn't copy or modify this file because the title
  text, gradient, and tagline have to match the consumer's brand. If one
  exists, it continues to work; if not, copy and edit the template.
- **`src/app/layout.tsx`** — logo, footer, title template, repo URL.
- **`src/content/*.mdx`** — the actual documentation pages.
- **`public/`** — images, videos, downloadable assets.
- **Versions of `next`, `nextra`, `nextra-theme-docs`, `react`.** The engine
  peer-deps require the exact versions; bumping them is a separate
  conscious decision, not something the refactor should do silently.
