import FormSpinner from '@/assets/spinners/FormSpinner';
import { Divider, Modal } from 'antd';
import { SquareX } from 'lucide-react';
import React from 'react';

function ModalBox({
  open,
  onCancel,
  loading,
  children,
  maskClosable = false,
  centered = false,
  title,

  width = 500,
}: {
  open: boolean;
  onCancel: () => void;
  loading?: boolean;
  children: React.ReactNode;
  maskClosable?: boolean;
  centered?: boolean;
  title?: string;
  className?: string;
  width?: number;
}) {
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      closable={false}
      width={width}
      centered={centered}
      maskClosable={maskClosable}
      rootClassName='custom-modal'
    >
      <div className='flex flex-col gap-4 p-4 '>
        {loading && <FormSpinner />}
        <header className='flex justify-between items-center font-semibold'>
          {title}

          <SquareX
            onClick={onCancel}
            className={`cursor-pointer hover:text-red-500 `}
          />
        </header>
        <Divider className=' !p-0 !m-0' />
        {children}
      </div>
    </Modal>
  );
}

export default ModalBox;
