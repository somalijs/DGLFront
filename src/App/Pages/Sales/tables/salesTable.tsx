import SimpleTable from '@/components/tables/custom/SimpleTable';
import { DeleteIcon, ScanEye } from 'lucide-react';
import { useState } from 'react';
import Viewdetail from '../modal/viewdetail';
import useAuth from '@/hooks/auth/use/useAuth';
import Formats from '@/func/Formats';

function Salestable({
  data,
  removeDetail,
}: {
  data: any[];
  removeDetail: (id: number) => void;
}) {
  const { role } = useAuth().user;
  const [view, setView] = useState({ open: false, data: [] });
  const columns = [
    {
      key: 'Agent',
      header: 'Agent',
      render: (item) => item?.agentObj?.label || '-',
    },
    {
      key: 'quantity',
      header: 'Quantity',
      render: (item) =>
        item?.details?.length
          ? item?.details.reduce((prev, curr) => prev + curr.quantity, 0) + 'x'
          : '1x',
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (item) => Formats.Price(item.amount),
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
          {item?.details?.length && (
            <ScanEye
              onClick={() => {
                setView({
                  open: true,
                  data: item?.details,
                });
              }}
              size={16}
            />
          )}
          <DeleteIcon
            size={16}
            className='text-red-400 cursor-pointer'
            onClick={() => removeDetail(item.uid)}
          />
        </div>
      ),
    },
  ];

  if (role === 'admin') {
    columns.unshift({
      key: 'store',
      header: 'Store',
      render: (item) => item?.storeObj?.label || '-',
    });
  }
  return (
    <div>
      {view.open && (
        <Viewdetail
          isLoading={false}
          data={view.data}
          isOpen={view.open}
          closeModal={() => setView({ open: false, data: [] })}
        />
      )}
      <SimpleTable
        columns={columns}
        data={data}
        loading={false}
        errorMessage={`no data to show`}
        title={`Sales`}
      />
    </div>
  );
}

export default Salestable;
