import type { CSSProperties, ReactNode } from 'react'
import { Children, cloneElement, isValidElement } from 'react'

interface DataTableProps {
  /** Optional column headers. If omitted, the table renders without a header row. */
  headers?: ReactNode[]
  /** Column alignment per column. Defaults to 'left'. */
  align?: ('left' | 'center' | 'right')[]
  /** Per-column width as CSS (e.g. '20%', '160px', 'auto'). */
  widths?: (string | number)[]
  /** `<DataTable.Row>` children. */
  children: ReactNode
  /** Optional caption rendered above the table. */
  caption?: ReactNode
  /** Additional className for the outer wrapper. */
  className?: string
}

interface RowProps {
  children: ReactNode
  variant?: 'body' | 'header'
}

interface CellProps {
  children: ReactNode
  colSpan?: number
  rowSpan?: number
  align?: 'left' | 'center' | 'right'
}

const wrapperStyle: CSSProperties = {
  margin: '1.5rem 0',
  overflowX: 'auto'
}

const tableStyle: CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: '0.95em',
  borderTop: '1px solid var(--nextra-border, #e5e7eb)'
}

const captionStyle: CSSProperties = {
  textAlign: 'left',
  fontStyle: 'italic',
  fontSize: '0.85em',
  opacity: 0.75,
  paddingBottom: '0.5rem',
  captionSide: 'top'
}

const thStyle: CSSProperties = {
  textAlign: 'left',
  fontWeight: 600,
  padding: '0.625rem 0.75rem',
  borderBottom: '1px solid var(--nextra-border, #e5e7eb)',
  verticalAlign: 'top'
}

const tdStyle: CSSProperties = {
  padding: '0.75rem',
  borderBottom: '1px solid var(--nextra-border, #e5e7eb)',
  verticalAlign: 'top'
}

function Cell({ children, colSpan, rowSpan, align }: CellProps) {
  return (
    <td
      style={{ ...tdStyle, ...(align && { textAlign: align }) }}
      colSpan={colSpan}
      rowSpan={rowSpan}
    >
      {children}
    </td>
  )
}

function HeaderCell({ children, colSpan, rowSpan, align }: CellProps) {
  return (
    <th
      style={{ ...thStyle, ...(align && { textAlign: align }) }}
      colSpan={colSpan}
      rowSpan={rowSpan}
    >
      {children}
    </th>
  )
}

function Row({ children }: RowProps) {
  return <tr>{children}</tr>
}

export function DataTable({
  headers,
  align,
  widths,
  caption,
  children,
  className
}: DataTableProps) {
  const colCount = headers?.length ?? Children.count(children)
  const colgroup = widths?.length
    ? (
        <colgroup>
          {Array.from({ length: colCount }).map((_, i) => (
            <col key={i} style={widths[i] ? { width: widths[i] } : undefined} />
          ))}
        </colgroup>
      )
    : null

  return (
    <div style={wrapperStyle} className={className}>
      <table style={tableStyle}>
        {caption && <caption style={captionStyle}>{caption}</caption>}
        {colgroup}
        {headers?.length ? (
          <thead>
            <tr>
              {headers.map((h, i) => (
                <th
                  key={i}
                  style={{
                    ...thStyle,
                    ...(align?.[i] && { textAlign: align[i] }),
                    background: 'var(--nextra-bg-secondary, #f9fafb)'
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
        ) : null}
        <tbody>
          {Children.map(children, child => {
            if (!isValidElement(child)) return child
            if (align?.length && child.type === Row) {
              const cells = Children.map(
                (child.props as RowProps).children,
                (cell, i) => {
                  if (
                    isValidElement(cell) &&
                    align[i] &&
                    !(cell.props as CellProps).align
                  ) {
                    return cloneElement(
                      cell as React.ReactElement<CellProps>,
                      { align: align[i] }
                    )
                  }
                  return cell
                }
              )
              return cloneElement(
                child as React.ReactElement<RowProps>,
                {},
                cells
              )
            }
            return child
          })}
        </tbody>
      </table>
    </div>
  )
}

DataTable.Row = Row
DataTable.Cell = Cell
DataTable.HeaderCell = HeaderCell
