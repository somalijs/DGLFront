import Button from '@/components/ui/button/Button';
import useFetchData from '@/hooks/fetch/useFetchData';

import { ScanEye } from 'lucide-react';
import { useState } from 'react';

import Formats from '@/func/Formats';

import FilterTable from '@/components/tables/custom/FilterTable';
import Add from './manage/AddPP';
import ViewPP from './manage/view';

function Payouts() {
  const [isView, setIsView] = useState({
    open: false,
    data: [],
  });
  const [modal, setModel] = useState({
    type: '',
    id: '',
  });
  const closeModal = () => {
    setModel({
      type: '',
      id: '',
    });
  };
  const { data, fetchData, isLoading, errorMessage } = useFetchData();

  const load = async (date?: string) => {
    await fetchData({
      url: `/payouts/get?date=${date}`,
    });
  };
  const columns = [
    {
      key: 'profileName',
      header: 'Name',
    },
    {
      key: 'model',
      header: 'Profile',
    },
    {
      key: 'ref',
      header: 'Ref',
      render: (item) => item.ref,
    },
    {
      key: 'bank',
      header: 'Bank/Drawer',
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (item) => (
        <h1
          className={`${
            !['agent', 'supplier'].includes(item.model)
              ? 'text-red-500'
              : 'text-green-500'
          }`}
        >
          {!['agent', 'supplier'].includes(item.model) ? '-' : '+'}{' '}
          {Formats.Price(item.amount, item.currency)}
        </h1>
      ),
    },
    {
      key: 'action',
      header: 'Action',
      render: (item) => (
        <div className='flex items-center gap-2'>
          <ScanEye
            onClick={() => setIsView({ open: true, data: item?.sale?.details })}
            className='hover:text-green-500 cursor-pointer'
            size={16}
          />
        </div>
      ),
    },
  ];

  return (
    <div>
      {modal.type === 'add' && (
        <Add
          isOpen={true}
          closeModal={closeModal}
          reFetch={load}
          type='payout'
        />
      )}
      {isView.open && (
        <ViewPP
          isOpen={true}
          closeModal={() => {
            setIsView({ open: false, data: [] });
          }}
          data={isView.data}
        />
      )}
      {/* {isView.open && (
        <ViewSale
          isOpen={isView.open}
          closeModal={() => {
            setIsView({ open: false, data: [] });
          }}
          data={isView.data}
        />
      )} */}
      <FilterTable
        columns={columns}
        data={data}
        loading={isLoading}
        reFetch={load}
        filterDate={load}
        errorMessage={errorMessage}
        title={
          <div className='flex items-center  gap-2'>
            <Button
              onClick={() => setModel({ type: 'add', id: '' })}
              size='sm'
              variant='outline'
            >
              Add Payout
            </Button>
          </div>
        }
      />
    </div>
  );
}

export default Payouts;
