import type { ReactNode } from 'react';
interface DataTableProps {
    /** Optional column headers. If omitted, the table renders without a header row. */
    headers?: ReactNode[];
    /** Column alignment per column. Defaults to 'left'. */
    align?: ('left' | 'center' | 'right')[];
    /** Per-column width as CSS (e.g. '20%', '160px', 'auto'). */
    widths?: (string | number)[];
    /** `<DataTable.Row>` children. */
    children: ReactNode;
    /** Optional caption rendered above the table. */
    caption?: ReactNode;
    /** Additional className for the outer wrapper. */
    className?: string;
}
interface RowProps {
    children: ReactNode;
    variant?: 'body' | 'header';
}
interface CellProps {
    children: ReactNode;
    colSpan?: number;
    rowSpan?: number;
    align?: 'left' | 'center' | 'right';
}
export declare function DataTable({ headers, align, widths, caption, children, className }: DataTableProps): import("react").JSX.Element;
export declare namespace DataTable {
    var Row: ({ children }: RowProps) => import("react").JSX.Element;
    var Cell: ({ children, colSpan, rowSpan, align }: CellProps) => import("react").JSX.Element;
    var HeaderCell: ({ children, colSpan, rowSpan, align }: CellProps) => import("react").JSX.Element;
}
export {};
//# sourceMappingURL=DataTable.d.ts.map