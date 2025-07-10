import Button from '@/components/ui/button/Button';
import useFetchData from '@/hooks/fetch/useFetchData';

import { ScanEye } from 'lucide-react';
import { useState } from 'react';
import Add from './manage/add';

import useAuth from '@/hooks/auth/use/useAuth';
import Formats from '@/func/Formats';
import ViewSale from './modal/ViewSale';
import FilterTable from '@/components/tables/custom/FilterTable';

function Sales() {
  const { role } = useAuth().user;
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
      url: `/sales/get?date=${date}`,
    });
  };
  const columns = [
    {
      key: 'agent',
      header: 'Agent',
      render: (item) => item.sale.by.name,
    },
    {
      key: 'ref',
      header: 'Ref',
      render: (item) => item.ref,
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (item) => Formats.Price(item.amount, item.currency), //item.amount,
    },
    {
      key: 'action',
      header: 'Action',
      render: (item) => (
        <div className='flex items-center gap-2'>
          {/* <FileEdit
            size={16}
            className='text-orange-400 cursor-pointer'
            onClick={() => setModel({ type: 'update', id: item._id })}
          /> */}

          {item?.sale?.details?.length > 0 && (
            <ScanEye
              onClick={() =>
                setIsView({ open: true, data: item?.sale?.details })
              }
              className='hover:text-green-500 cursor-pointer'
              size={16}
            />
          )}
        </div>
      ),
    },
  ];
  if (role === 'admin') {
    columns.unshift(
      {
        key: 'store',
        header: 'Store',
        render: (item) => item.sale?.store?.name || 'Not Set',
      },
      {
        key: 'saleRef',
        header: 'Sale ref',
        render: (item) => item?.saleRef,
      }
    );
  }

  return (
    <div>
      {modal.type === 'add' && (
        <Add isOpen={true} closeModal={closeModal} reFetch={load} />
      )}

      {isView.open && (
        <ViewSale
          isOpen={isView.open}
          closeModal={() => {
            setIsView({ open: false, data: [] });
          }}
          data={isView.data}
        />
      )}
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
              Add Sale
            </Button>
          </div>
        }
      />
    </div>
  );
}

export default Sales;
