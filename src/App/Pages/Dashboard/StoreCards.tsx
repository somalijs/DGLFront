import Formats from '@/func/Formats';
import useAuth from '@/hooks/auth/use/useAuth';
import useFetchData from '@/hooks/fetch/useFetchData';
import { Spin } from 'antd';
import { RefreshCcw } from 'lucide-react';

import { useEffect, useState } from 'react';

function StoreCards() {
  const { stores } = useAuth().user;

  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-4 select-none'>
      {/* <!-- Metric Item Start --> */}
      {stores.map((item) => (
        <div
          key={item._id}
          className='rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] space-y-2'
        >
          <StoreCard name={item.name} id={item._id} bankID={item.bankID} />
        </div>
      ))}

      {/* <!-- Metric Item End --> */}
    </div>
  );
}

function StoreCard({
  name = '',
  bankID,
  id,
}: {
  id?: string;
  name: string;
  bankID: string;
}) {
  const { fetchData, isLoading } = useFetchData();
  const [amount, setAmount] = useState();

  const load = async () => {
    const data = await fetchData({
      url: `/stores/get?id=${id}`,
    });
    setAmount(data?.total);
    // setBank(data?.bankID);
  };
  useEffect(() => {
    load();
  }, [id]);
  return (
    <>
      <div className='flex gap-3 justify-between'>
        <h1 className='font-semibold dark:text-gray-400 text-theme-xl'>
          {name.toUpperCase()}
        </h1>
        <RefreshCcw
          onClick={load}
          className='text-gray-800 size-6 dark:text-white/90 cursor-pointer hover:text-teal-600'
        />
      </div>

      <div className='min-h-[50px]  flex-col '>
        <p
          className='text-gray-5
                Today Sales00 text-theme-sm dark:text-gray-400 '
        >
          Today Sales
        </p>
        {isLoading ? (
          <Spin className='m-2 !mx-3' size='small' />
        ) : (
          <h4 className='text-xl font-bold text-green-700    '>
            {Formats.Price(amount)}
          </h4>
        )}
      </div>
      <div className='border-t'></div>
      <DrawerView id={bankID} />
    </>
  );
}

function DrawerView({ id }: any) {
  const { fetchData, isLoading } = useFetchData();
  const [amount, setAmount] = useState();
  const load = async () => {
    const data = await fetchData({
      url: `/banks/balance/${id}`,
    });
    setAmount(id ? data : 0);
  };
  useEffect(() => {
    load();
  }, [id]);
  return (
    <>
      <div className='flex gap-3 justify-between'>
        <h1></h1>
        <RefreshCcw
          onClick={load}
          className='text-gray-800 size-4 mt-2 dark:text-white/90 cursor-pointer hover:text-teal-600'
        />
      </div>
      <div className='min-h-[50px]  flex-col '>
        <p
          className='text-gray-5
                Today Sales00 text-theme-sm dark:text-gray-400 '
        >
          Drawer Balance
        </p>
        {isLoading ? (
          <Spin className='m-2 !mx-3' size='small' />
        ) : (
          <h4 className='text-xl font-bold text-gray-800 dark:text-white/90   '>
            {Formats.Price(amount)}
          </h4>
        )}
      </div>{' '}
    </>
  );
}
export default StoreCards;
