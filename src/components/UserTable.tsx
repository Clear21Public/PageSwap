import { useMemo, useRef, useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
  type ColumnFiltersState,
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import type { IUser } from '../types/IUser.ts'
import { UserAvatar } from './UserAvatar'
import styles from './UserTable.module.css'

interface UserTableProps {
  users: IUser[]
  onRequestDelete?: (user: IUser) => void
}

const columnHelper = createColumnHelper<IUser>()

export function UserTable({ users, onRequestDelete }: UserTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const scrollParentRef = useRef<HTMLDivElement | null>(null)

  const columns = useMemo(
    () => [
      columnHelper.accessor((_row, index) => index, {
        id: 'index',
        header: (context) => {
          const sortState = context.column.getIsSorted()
          let iconClass = 'fa-solid fa-sort'
          if (sortState === 'asc') iconClass = `fa-solid fa-sort-up ${styles.active}`
          if (sortState === 'desc') iconClass = `fa-solid fa-sort-down ${styles.active}`

          return (
            <div className={styles.indexHeader}>
              <span>#</span>
              <i className={iconClass}></i>
            </div>
          )
        },
        cell: (info) => <div className={styles.indexCell}>{info.row.index + 1}</div>,
        sortingFn: 'basic',
      }),
      columnHelper.accessor(
        (row) => `${row.firstName || ''} ${row.lastName || ''}`.trim() || '(No name)',
        {
          id: 'fullName',
          header: (context) => {
            const sortState = context.column.getIsSorted()
            let iconClass = 'fa-solid fa-sort'
            if (sortState === 'asc') iconClass = `fa-solid fa-sort-up ${styles.active}`
            if (sortState === 'desc') iconClass = `fa-solid fa-sort-down ${styles.active}`

            return (
              <div className={styles.nameHeader}>
                <div>Name</div>
                <i className={iconClass}></i>
              </div>
            )
          },
          cell: (info) => {
            const user = info.row.original
            const firstName = user.firstName || ''
            const lastName = user.lastName || ''
            const fullName = `${firstName} ${lastName}`.trim()

            return (
              <div className={styles.nameColumn}>
                <UserAvatar
                  avatarId={user.profileImageUrl}
                  firstName={firstName}
                  lastName={lastName}
                  size={28}
                />
                <div className={styles.fullName}>{fullName ? fullName : '-'}</div>
              </div>
            )
          },
          sortingFn: 'text',
        },
      ),
      columnHelper.accessor('age', {
        id: 'age',
        header: (context) => {
          const sortState = context.column.getIsSorted()
          let iconClass = 'fa-solid fa-sort'
          if (sortState === 'asc') iconClass = `fa-solid fa-sort-up ${styles.active}`
          if (sortState === 'desc') iconClass = `fa-solid fa-sort-down ${styles.active}`

          return (
            <div className={styles.ageHeader}>
              <span>Age</span>
              <i className={iconClass}></i>
            </div>
          )
        },
        cell: (info) => {
          const age = info.getValue()
          return age !== undefined ? <span className={styles.ageCell}>{age}</span> : <span>-</span>
        },
        sortingFn: 'basic',
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Row Control',
        cell: (info) => {
          const user = info.row.original

          return (
            <div className={styles.actions}>
              <button type="button" onClick={() => onRequestDelete?.(user)}>
                Remove
              </button>
            </div>
          )
        },
      }),
    ],
    [onRequestDelete],
  )

  const table = useReactTable({
    data: users,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  const rows = table.getRowModel().rows

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollParentRef.current,
    estimateSize: () => 50,
    overscan: 10,
  })

  const headerCellStyleForId = (id: string) => {
    if (id === 'index') return styles.indexColumn
    if (id === 'fullName') return styles.nameColumn
    if (id === 'age') return styles.ageColumn
    if (id === 'actions') return styles.actionsColumn
    return ''
  }

  const cellStyleForId = (id: string) => {
    if (id === 'index') return styles.indexColumn
    if (id === 'age') return styles.ageColumn
    if (id === 'actions') return styles.actionsColumn
    return ''
  }

  const virtualItems = rowVirtualizer.getVirtualItems()
  const totalSize = rowVirtualizer.getTotalSize()
  const virtualCount = virtualItems.length
  const paddingTop = virtualCount > 0 ? virtualItems[0].start : 0
  const paddingBottom = virtualCount > 0 ? totalSize - virtualItems[virtualCount - 1].end : 0

  const visibleColumnCount = table.getVisibleLeafColumns().length

  return (
    <div ref={scrollParentRef} className={styles.tableContainer}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className={`${styles.th} ${
                    header.column.getCanSort() ? styles.sortable : ''
                  } ${headerCellStyleForId(header.column.id)}`}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <div>{flexRender(header.column.columnDef.header, header.getContext())}</div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className={styles.tbody}>
          {paddingTop > 0 && (
            <tr aria-hidden="true">
              <td colSpan={visibleColumnCount} style={{ height: `${paddingTop}px` }} />
            </tr>
          )}
          {virtualItems.map((virtualRow) => {
            const row = rows[virtualRow.index]

            return (
              <tr key={row.id} className={styles.tr}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className={`${styles.td} ${cellStyleForId(cell.column.id)}`}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            )
          })}
          {paddingBottom > 0 && (
            <tr aria-hidden="true">
              <td colSpan={visibleColumnCount} style={{ height: `${paddingBottom}px` }} />
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
