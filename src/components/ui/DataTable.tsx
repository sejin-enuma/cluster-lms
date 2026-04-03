import { useTranslation } from 'react-i18next';
import type { Column, SortState } from '../../types';

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  sorts: SortState[];
  onSort: (key: string) => void;
  keyExtractor: (row: T) => string;
}

export default function DataTable<T>({
  columns,
  data,
  sorts,
  onSort,
  keyExtractor,
}: DataTableProps<T>) {
  const { t } = useTranslation();

  const getSortIcon = (key: string) => {
    const sort = sorts.find((s) => s.key === key);
    if (!sort || !sort.direction) {
      return (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0 opacity-40">
          <path d="M6 2L9 5H3L6 2Z" fill="currentColor" />
          <path d="M6 10L3 7H9L6 10Z" fill="currentColor" />
        </svg>
      );
    }
    if (sort.direction === 'asc') {
      return (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0">
          <path d="M6 2L9 5H3L6 2Z" fill="currentColor" />
          <path d="M6 10L3 7H9L6 10Z" fill="currentColor" opacity="0.3" />
        </svg>
      );
    }
    return (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0">
        <path d="M6 2L9 5H3L6 2Z" fill="currentColor" opacity="0.3" />
        <path d="M6 10L3 7H9L6 10Z" fill="currentColor" />
      </svg>
    );
  };

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[200px] text-[14px] text-gray-500">
        {t('common.noData')}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`bg-list border border-line px-[16px] py-[12px] text-[12px] font-normal text-gray-950 text-center whitespace-nowrap ${
                  col.sortable ? 'cursor-pointer select-none' : ''
                }`}
                style={{ width: col.width }}
                onClick={() => col.sortable && onSort(col.key)}
              >
                <div className="flex items-center justify-center gap-[8px]">
                  <span>{col.header}</span>
                  {col.sortable && getSortIcon(col.key)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={keyExtractor(row)}>
              {columns.map((col) => (
                <td
                  key={col.key}
                  className="bg-white border-b border-r border-line px-[12px] py-[12px] text-[14px] text-gray-950 text-center"
                  style={{ width: col.width }}
                >
                  {col.render
                    ? col.render(row)
                    : String((row as Record<string, unknown>)[col.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
