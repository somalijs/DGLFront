import { useForm } from 'react-hook-form';
import Formats from '@/func/Formats';

import { useEffect, useState } from 'react';
import StatementTable from '@/components/tables/custom/StatementTable';

import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import FetchSelectors from '@/components/fetchSelectors';
import useFetch from '@/hooks/fetch/useFetch';
const schema = z.object({
  value: z.string().optional(),
});
type FormSchema = z.infer<typeof schema>;
function Reports() {
  const { Post, isLoading, errorMessage } = useFetch();
  const [data, setData] = useState({
    data: [],
    label: '',
    desc: '',
  });
  const form = useForm<FormSchema>({
    resolver: zodResolver(schema),
  });
  const { watch } = form;
  const value = watch('value');
  const load = async () => {
    const res = await Post({
      url: `/reports/admin`,
      body: {
        id: value,
        type: 'bank',
      },
    });

    if (res.ok) {
      let balance = 0;
      const transactionsWithBalance = (res.data.data || []).map((item) => {
        if (item.line === 'sub') {
          balance -= item.amount;
        } else {
          balance += item.amount;
        }

        return {
          ...item,
          balance: parseFloat(balance.toFixed(2)),
        };
      });
      setData({
        data: transactionsWithBalance,
        label: res.data.label,
        desc: res.data.desc,
      });
    } else {
      setData({
        data: [],
        label: '',
        desc: '',
      });
    }
  };

  const columns = [
    {
      key: 'type',
      header: 'Label',
    },
    {
      key: 'by',
      header: 'By',
      render: (item) => item.by.name,
    },
    {
      key: 'ref',
      header: 'Ref',
      render: (item) => item.ref,
    },

    {
      key: 'amount',
      header: 'Amount',
      render: (item) => (
        <h1
          className={`${
            item.line === 'sub' ? 'text-red-500' : 'text-green-500'
          }`}
        >
          {item.line === 'sub' ? '-' : '+'}{' '}
          {Formats.Price(item.amount, item.currency)}
        </h1>
      ), //item.amount,
    },
    {
      key: 'balance',
      header: 'Balance',
      render: (item) => (
        <div className='flex items-center gap-2'>
          {/* <ScanEye
            onClick={() => setIsView({ open: true, data: item })}
            className='hover:text-green-500 cursor-pointer'
            size={16}
          /> */}
          <h1>{Formats.Price(item.balance, item.currency)}</h1>
        </div>
      ),
    },
  ];
  useEffect(() => {
    if (value) {
      load();
    }
  }, [value]);
  return (
    <div>
      <StatementTable
        columns={columns}
        data={data.data}
        loading={isLoading}
        reFetch={load}
        errorMessage={errorMessage}
        title={
          <div className='flex items-center  gap-2'>
            <FetchSelectors.Banks
              name='value'
              label='Account'
              form={form}
              placeHolder='Select Bank'
              required
            />
          </div>
        }
      />
    </div>
  );
}

export default Reports;
