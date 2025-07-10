import ModalBox from '@/shared/ModalBox';

function ViewPP({
  isOpen,
  data,
  closeModal,
  isLoading,
}: {
  isOpen: boolean;
  data: any;
  closeModal: any;
  isLoading?: boolean;
}) {
  const datas = data?.viewBox;
  return (
    <ModalBox
      open={isOpen}
      onCancel={closeModal}
      className='max-w-[584px] p-5 lg:p-10'
      title='Add Payment'
      //remove footer
      loading={isLoading}
      width={500}
      maskClosable={false}
    >
      {datas &&
        Object.entries(datas).map(([key, value]) => (
          <div key={key} className='  '>
            <ViewList label={key} value={value} />
          </div>
        ))}
      <footer className='flex justify-end'>
        <h1>
          issued by: <span className='font-bold'>{data.byName}</span>
        </h1>
      </footer>
    </ModalBox>
  );
}

const ViewList = ({ label, value }: any) => {
  return (
    <div className='flex gap-2 text-lg items-center border-b pb-2'>
      <label className='font-bold capitalize'>{label}:</label>
      <h3>{value}</h3>
    </div>
  );
};

export default ViewPP;
