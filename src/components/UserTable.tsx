import { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
  type ColumnFiltersState,
} from '@tanstack/react-table';
import type { IUser } from '../types/IUser.ts';
import { UserAvatar } from './UserAvatar';
import styles from './UserTable.module.css';
import formStyles from './AddUserButton.module.css';
import * as RadixDialog from '@radix-ui/react-dialog';
import { Dialog } from './Dialog.tsx';
import { RemoveUserForm } from './RemoveUserForm.tsx';
import { getFullName } from '../helpers/userHelper.ts';

interface UserTableProps {
  users: IUser[];
}

const columnHelper = createColumnHelper<IUser>();

export function UserTable({ users }: UserTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(users[0]);

  const columns = useMemo(
    () => [
      columnHelper.accessor((_row, index) => index, {
        id: 'index',
        header: (context) => {
          const sortState = context.column.getIsSorted();
          let iconClass = 'fa-solid fa-sort';
          if (sortState === 'asc') iconClass = `fa-solid fa-sort-up ${styles.active}`;
          if (sortState === 'desc') iconClass = `fa-solid fa-sort-down ${styles.active}`;

          return (
            <div className={styles.indexHeader}>
              <span>#</span>
              <i className={iconClass}></i>
            </div>
          );
        },
        cell: (info) => <div className={styles.indexCell}>{info.row.index + 1}</div>,
        sortingFn: 'basic',
      }),
      columnHelper.accessor((row) => `${row.firstName || ''} ${row.lastName || ''}`.trim() || '(No name)', {
        id: 'fullName',
        header: (context) => {
          const sortState = context.column.getIsSorted();
          let iconClass = 'fa-solid fa-sort';
          if (sortState === 'asc') iconClass = `fa-solid fa-sort-up ${styles.active}`;
          if (sortState === 'desc') iconClass = `fa-solid fa-sort-down ${styles.active}`;

          return (
            <div className={styles.nameHeader}>
              <div>Name</div>
              <i className={iconClass}></i>
            </div>
          );
        },
        cell: (info) => {
          const user = info.row.original;
          const firstName = user.firstName || '';
          const lastName = user.lastName || '';
          const fullName = getFullName(firstName, lastName);

          return (
            <div className={styles.nameColumn}>
              <UserAvatar avatarId={user.profileImageUrl} firstName={firstName} lastName={lastName} size={28} />
              <div className={styles.fullName}>{fullName}</div>
            </div>
          );
        },
        sortingFn: 'text',
      }),
      columnHelper.accessor('age', {
        id: 'age',
        header: (context) => {
          const sortState = context.column.getIsSorted();
          let iconClass = 'fa-solid fa-sort';
          if (sortState === 'asc') iconClass = `fa-solid fa-sort-up ${styles.active}`;
          if (sortState === 'desc') iconClass = `fa-solid fa-sort-down ${styles.active}`;

          return (
            <div className={styles.ageHeader}>
              <span>Age</span>
              <i className={iconClass}></i>
            </div>
          );
        },
        cell: (info) => {
          const age = info.getValue();
          return age !== undefined ? <span className={styles.ageCell}>{age}</span> : <span>-</span>;
        },
        sortingFn: 'basic',
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Row Control',
        cell: (info) => {
          const user = info.row.original;
          return (
            <RadixDialog.Trigger asChild>
              <button className={formStyles.Button} onClick={() => setSelectedUser(user)}>
                <i className="fa-solid fa-trash-can" />
                Remove
              </button>
            </RadixDialog.Trigger>
          );
        },
      }),
    ],
    []
  );

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
  });

  const headerCellStyleForId = (id: string) => {
    if (id === 'index') return styles.indexColumn;
    if (id === 'fullName') return styles.nameColumn;
    if (id === 'age') return styles.ageColumn;
    if (id === 'actions') return styles.actionsColumn;
    return '';
  };

  const cellStyleForId = (id: string) => {
    if (id === 'index') return styles.indexColumn;
    if (id === 'age') return styles.ageColumn;
    if (id === 'actions') return styles.actionsColumn;
    return '';
  };

  return (
    <RadixDialog.Root open={open} onOpenChange={setOpen}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className={`${styles.th} ${header.column.getCanSort() ? styles.sortable : ''} ${headerCellStyleForId(header.column.id)}`}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <div>{flexRender(header.column.columnDef.header, header.getContext())}</div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className={styles.tbody}>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className={styles.tr}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className={`${styles.td} ${cellStyleForId(cell.column.id)}`}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <Dialog title="Remove User">
        <RemoveUserForm setOpen={setOpen} user={selectedUser} />
      </Dialog>
    </RadixDialog.Root>
  );
}
