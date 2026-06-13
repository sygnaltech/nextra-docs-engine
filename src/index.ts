/**
 * @sygnal/nextra-docs-engine — public API.
 *
 * Most consumers only need `createUseMDXComponents({ meta })`. The individual
 * components and demos are exported for explicit imports inside MDX content.
 */

// Components (registered globally by the factory; exported for explicit MDX use)
export { Callout } from './components/Callout.js'
export { DataTable } from './components/DataTable.js'
export { Embed } from './components/Embed.js'
export { Video } from './components/Video.js'
export { YouTube } from './components/YouTube.js'

// Styleguide demo wrappers (use these in your styleguide.mdx)
export {
  ButtonDemo,
  CollapseDemo,
  SelectDemo
} from './components/styleguide-demos.js'

// PageBreadcrumb component (pass `meta` as prop). Most consumers don't use
// this directly — `createUseMDXComponents({ meta })` wires it up automatically.
export {
  PageBreadcrumb,
  type MetaShape,
  type MetaEntry,
  type MetaSeparator
} from './components/PageBreadcrumb.js'

// High-level: the one thing most consumers call.
export { createUseMDXComponents } from './mdx-components.js'
