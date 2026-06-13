import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMDXComponents as getDocsMDXComponents } from 'nextra-theme-docs';
import { ImageZoom } from 'nextra/components';
import { Callout as DefaultCallout } from './components/Callout.js';
import { DataTable } from './components/DataTable.js';
import { Embed } from './components/Embed.js';
import { PageBreadcrumb } from './components/PageBreadcrumb.js';
import { Video } from './components/Video.js';
import { YouTube } from './components/YouTube.js';
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
export function createUseMDXComponents(options) {
    const { meta, Callout = DefaultCallout } = options;
    const docsComponents = getDocsMDXComponents();
    const NextraWrapper = docsComponents.wrapper;
    function Wrapper(props) {
        return (_jsxs(NextraWrapper, { ...props, children: [_jsx(PageBreadcrumb, { meta: meta }), props.children] }));
    }
    return function useMDXComponents(components = {}) {
        return {
            ...docsComponents,
            wrapper: Wrapper,
            img: ImageZoom,
            Callout,
            DataTable,
            Embed,
            Video,
            YouTube,
            ...components
        };
    };
}
//# sourceMappingURL=mdx-components.js.map