import SimpleTable from '@/components/tables/custom/SimpleTable';
import Formats from '@/func/Formats';
import ModalBox from '@/shared/ModalBox';

function ViewSale({
  isOpen,
  closeModal,
  data,
}: {
  isOpen: boolean;
  closeModal: () => void;
  data: any[];
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
  ];
  return (
    <ModalBox
      open={isOpen}
      onCancel={closeModal}
      className='max-w-[584px] p-5 lg:p-10'
      title='View Sale'
      //remove footer

      width={600}
      maskClosable={false}
    >
      <SimpleTable
        columns={columns}
        data={data}
        loading={false}
        errorMessage={`no data to show`}
        title={`Item Details`}
      />
    </ModalBox>
  );
}
export default ViewSale;
