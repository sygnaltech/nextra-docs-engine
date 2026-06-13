import type { MDXComponents } from 'mdx/types';
import type { ComponentType } from 'react';
import { type MetaShape } from './components/PageBreadcrumb.js';
interface CreateUseMDXComponentsOptions {
    /** The consumer's `_meta.js` default export. Drives the PageBreadcrumb's group prefix. */
    meta: MetaShape;
    /**
     * Optional override for the Callout component. Defaults to the engine's
     * house-style Callout (7 variants: default, info, tip, success, warning,
     * error, important). Pass your own if you need different variants or
     * styling.
     */
    Callout?: ComponentType<any>;
}
/**
 * Factory: returns a `useMDXComponents` function with all engine components
 * registered globally and the custom PageBreadcrumb injected via the wrapper.
 *
 * Usage in the consumer's `src/mdx-components.tsx`:
 * ```ts
 * import { createUseMDXComponents } from '@sygnal/nextra-docs-engine'
 * import meta from './content/_meta.js'
 *
 * export const useMDXComponents = createUseMDXComponents({ meta })
 * ```
 */
export declare function createUseMDXComponents(options: CreateUseMDXComponentsOptions): (components?: MDXComponents) => MDXComponents;
export {};
//# sourceMappingURL=mdx-components.d.ts.map