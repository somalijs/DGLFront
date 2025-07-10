import SimpleTable from '@/components/tables/custom/SimpleTable';
import Formats from '@/func/Formats';
import { DeleteIcon } from 'lucide-react';

function Detailstable({
  data,
  removeDetail,
}: {
  data: any[];
  removeDetail?: (id: string) => void;
}) {
  const columns = [
    {
      key: 'label',
      header: 'Label',
      render: (item) => item.label,
    },
    {
      key: 'quantity',
      header: 'Quantity',
      render: (item) => item.quantity + 'x',
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (item) => item.amount,
    },
    {
      key: 'total',
      header: 'total',
      render: (item) => Formats.Price(item.amount * item.quantity),
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
          <DeleteIcon
            size={16}
            className='text-red-400 cursor-pointer'
            onClick={() => removeDetail(item.uid)}
          />
        </div>
      ),
    },
  ];
  return (
    <div>
      <SimpleTable
        columns={columns}
        data={data}
        loading={false}
        errorMessage={`no data to show`}
        title={`Item Details`}
      />
    </div>
  );
}

export default Detailstable;
