// Consumer's `src/mdx-components.tsx`. 4 lines.
// Copy to your project root (overwriting the starter) and you're done.
import { createUseMDXComponents } from '@sygnal/nextra-docs-engine'
import meta from './content/_meta.js'

export const useMDXComponents = createUseMDXComponents({ meta })
