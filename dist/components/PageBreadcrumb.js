'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRightIcon } from 'nextra/icons';
import { useConfig } from 'nextra-theme-docs';
import { Fragment } from 'react';
function isSeparator(value) {
    return (typeof value === 'object' &&
        value !== null &&
        value.type === 'separator');
}
function getGroupForSlug(meta, targetKey) {
    const entries = Object.entries(meta);
    let currentGroup = null;
    for (const [key, value] of entries) {
        if (isSeparator(value)) {
            currentGroup = value.title ?? null;
            continue;
        }
        if (key === targetKey)
            return currentGroup;
    }
    return null;
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
export function PageBreadcrumb({ meta }) {
    const pathname = usePathname();
    const { normalizePagesResult } = useConfig();
    const { activePath, activeThemeContext: themeContext, activeType } = normalizePagesResult;
    // Respect per-page opt-out: `_meta.js` entries with `theme: { breadcrumb: false }`
    // suppress our breadcrumb the same way they suppress Nextra's.
    if (!themeContext.breadcrumb || activeType === 'page')
        return null;
    const segments = pathname.split('/').filter(Boolean);
    const targetKey = segments[0] ?? 'index';
    const group = getGroupForSlug(meta, targetKey);
    const crumbs = [];
    if (group) {
        crumbs.push({ title: group, isGroup: true });
    }
    activePath.forEach((item, index) => {
        const isLast = index === activePath.length - 1;
        const isPage = 'frontMatter' in item;
        crumbs.push({
            title: typeof item.title === 'string' ? item.title : String(item.title),
            href: !isLast && isPage ? item.route : undefined
        });
    });
    if (crumbs.length === 0)
        return null;
    return (_jsx("nav", { className: "page-breadcrumb", "aria-label": "Breadcrumb", children: crumbs.map((crumb, i) => {
            const isLast = i === crumbs.length - 1;
            const classes = [
                'page-breadcrumb-item',
                crumb.isGroup && 'page-breadcrumb-group',
                isLast && 'page-breadcrumb-current'
            ]
                .filter(Boolean)
                .join(' ');
            return (_jsxs(Fragment, { children: [i > 0 && (_jsx(ArrowRightIcon, { height: "14", className: "page-breadcrumb-arrow" })), crumb.href ? (_jsx(NextLink, { href: crumb.href, prefetch: false, className: classes, children: crumb.title })) : (_jsx("span", { className: classes, children: crumb.title }))] }, `${crumb.title}-${i}`));
        }) }));
}
//# sourceMappingURL=PageBreadcrumb.js.map