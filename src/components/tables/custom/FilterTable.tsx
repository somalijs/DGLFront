import React, { useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '../../ui/table';
import { RefreshCcw } from 'lucide-react';
import { Spin } from 'antd';
import { FormDate } from '@/shared/fields/FormDate';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
const schema = z.object({
  date: z.string(),
});
type FormSchema = z.infer<typeof schema>;
type ColumnType = {
  key: string;
  header: string;
  render?: (item: any) => React.ReactNode;
  hide?: boolean;
  onClick?: any;
};

interface FilterTableProps<T> {
  columns: ColumnType[];
  data: T[];
  title?: React.ReactNode;
  reFetch?: () => void;
  loading?: boolean;
  errorMessage?: string;
  filterDate?: (dd) => void;
}

function FilterTable<T extends { id: number }>({
  columns,
  data,
  title,
  reFetch,
  loading = false,
  errorMessage = 'no data to show',
  filterDate,
}: FilterTableProps<T>) {
  const visibleColumns = columns.filter((col) => !col.hide);
  const form = useForm<FormSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: new Date().toLocaleDateString('en-GB'),
    },
  });
  const { watch } = form;
  const date = watch('date');
  useEffect(() => {
    filterDate(date);
  }, [date]);
  return (
    <div className='overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]'>
      <div className='px-4 pt-4 sm:px-6'>
        <div className='flex  gap-2 mb-4 justify-between w-full items-center'>
          <h3 className='text-lg font-semibold text-gray-800 dark:text-white/90'>
            {title || 'Table'}
          </h3>
          <div className='flex items-center gap-3 '>
            {filterDate && (
              <FormDate className='max-w-[200px]' name='date' form={form} />
            )}
            {reFetch && (
              <RefreshCcw
                className='cursor-pointer'
                onClick={() => filterDate(date)}
              />
            )}
          </div>
        </div>
      </div>

      <div className='max-w-full overflow-x-auto'>
        {loading ? (
          <div className=' border-gray-100 border-y dark:border-white/[0.05] flex justify-center min-h-[60px] items-center '>
            <Spin />
          </div>
        ) : (
          <>
            {!data.length ? (
              <div className=' border-gray-100 border-y dark:border-white/[0.05] flex justify-center min-h-[60px] items-center '>
                <p className='text-center py-4'>{errorMessage}</p>
              </div>
            ) : (
              <Table>
                <TableHeader className='border-gray-100 border-y dark:border-white/[0.05]'>
                  <TableRow>
                    {visibleColumns.map((col, i) => (
                      <TableCell
                        key={i}
                        isHeader
                        className='px-4 py-3 font-medium text-gray-500 sm:px-6 text-start text-theme-xs dark:text-gray-400'
                      >
                        {col.header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHeader>

                <TableBody className='divide-y divide-gray-100 dark:divide-white/[0.05]'>
                  {data.map((item, i) => (
                    <TableRow key={i}>
                      {visibleColumns.map((col, i) => (
                        <TableCell
                          key={i}
                          className='px-4 py-3 text-gray-500 sm:px-6 text-start text-theme-sm dark:text-gray-400 cursor-pointer'
                        >
                          <div
                            onClick={() =>
                              col.onClick ? col.onClick(col, item) : undefined
                            }
                          >
                            {col.render
                              ? col.render(item)
                              : (item as any)[col.key]}
                          </div>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default FilterTable;
