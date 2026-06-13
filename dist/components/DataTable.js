import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Children, cloneElement, isValidElement } from 'react';
const wrapperStyle = {
    margin: '1.5rem 0',
    overflowX: 'auto'
};
const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.95em',
    borderTop: '1px solid var(--nextra-border, #e5e7eb)'
};
const captionStyle = {
    textAlign: 'left',
    fontStyle: 'italic',
    fontSize: '0.85em',
    opacity: 0.75,
    paddingBottom: '0.5rem',
    captionSide: 'top'
};
const thStyle = {
    textAlign: 'left',
    fontWeight: 600,
    padding: '0.625rem 0.75rem',
    borderBottom: '1px solid var(--nextra-border, #e5e7eb)',
    verticalAlign: 'top'
};
const tdStyle = {
    padding: '0.75rem',
    borderBottom: '1px solid var(--nextra-border, #e5e7eb)',
    verticalAlign: 'top'
};
function Cell({ children, colSpan, rowSpan, align }) {
    return (_jsx("td", { style: { ...tdStyle, ...(align && { textAlign: align }) }, colSpan: colSpan, rowSpan: rowSpan, children: children }));
}
function HeaderCell({ children, colSpan, rowSpan, align }) {
    return (_jsx("th", { style: { ...thStyle, ...(align && { textAlign: align }) }, colSpan: colSpan, rowSpan: rowSpan, children: children }));
}
function Row({ children }) {
    return _jsx("tr", { children: children });
}
export function DataTable({ headers, align, widths, caption, children, className }) {
    const colCount = headers?.length ?? Children.count(children);
    const colgroup = widths?.length
        ? (_jsx("colgroup", { children: Array.from({ length: colCount }).map((_, i) => (_jsx("col", { style: widths[i] ? { width: widths[i] } : undefined }, i))) }))
        : null;
    return (_jsx("div", { style: wrapperStyle, className: className, children: _jsxs("table", { style: tableStyle, children: [caption && _jsx("caption", { style: captionStyle, children: caption }), colgroup, headers?.length ? (_jsx("thead", { children: _jsx("tr", { children: headers.map((h, i) => (_jsx("th", { style: {
                                ...thStyle,
                                ...(align?.[i] && { textAlign: align[i] }),
                                background: 'var(--nextra-bg-secondary, #f9fafb)'
                            }, children: h }, i))) }) })) : null, _jsx("tbody", { children: Children.map(children, child => {
                        if (!isValidElement(child))
                            return child;
                        if (align?.length && child.type === Row) {
                            const cells = Children.map(child.props.children, (cell, i) => {
                                if (isValidElement(cell) &&
                                    align[i] &&
                                    !cell.props.align) {
                                    return cloneElement(cell, { align: align[i] });
                                }
                                return cell;
                            });
                            return cloneElement(child, {}, cells);
                        }
                        return child;
                    }) })] }) }));
}
DataTable.Row = Row;
DataTable.Cell = Cell;
DataTable.HeaderCell = HeaderCell;
//# sourceMappingURL=DataTable.js.map