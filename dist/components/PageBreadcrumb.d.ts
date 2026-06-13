export interface MetaSeparator {
    type: 'separator';
    title?: string;
}
export type MetaEntry = string | MetaSeparator | {
    title?: string;
    theme?: unknown;
    type?: string;
};
/**
 * Shape of `_meta.js` default export, as far as the breadcrumb cares.
 * The consumer passes their actual meta value via the `meta` prop.
 */
export type MetaShape = Record<string, MetaEntry>;
interface PageBreadcrumbProps {
    /** The consumer's `_meta.js` default export. */
    meta: MetaShape;
}
/**
 * Custom breadcrumb that replaces Nextra's. Renders the same path chain
 * Nextra would (via the shared `activePath`), optionally prepended with the
 * sidebar group label from `meta`. The group reads as a non-linked leading
 * crumb, styled in the group color.
 *
 * `meta` is a prop so this client component lives in the engine while the
 * consumer's `_meta.js` lives in their own project. The wiring is normally
 * done by `createUseMDXComponents({ meta })`.
 */
export declare function PageBreadcrumb({ meta }: PageBreadcrumbProps): import("react").JSX.Element | null;
export {};
//# sourceMappingURL=PageBreadcrumb.d.ts.map