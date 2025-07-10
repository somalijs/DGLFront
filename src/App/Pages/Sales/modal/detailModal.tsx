import Button from '@/components/ui/button/Button';

import { z } from 'zod';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormInput } from '@/shared/fields/FormInput';
import ModalBox from '@/shared/ModalBox';

import { useState } from 'react';
import SalesAdd from './salesAdd';

const baseSchema = z.object({
  label: z.string().min(2, 'Label is required'),
  quantity: z
    .number()
    .gt(0, 'Quantity must be greater than 0')
    .int('Quantity must be a whole number'),
  amount: z.number().gt(0, 'Amount must be greater than 0'),
});
const schema = baseSchema;
type FormSchema = z.infer<typeof schema>;
function DetailsAdd({
  isOpen,
  closeModal,
  addTodDetails,
}: {
  isOpen: boolean;
  closeModal: () => void;
  addTodDetails: (data) => void;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const form = useForm<FormSchema>({
    resolver: zodResolver(schema),
  });
  const { handleSubmit } = form;
  const onSubmit = async (data: FormSchema) => {
    addTodDetails(data);
  };
  return (
    <>
      <SalesAdd
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        addToSales={addTodDetails}
      />

      <ModalBox
        open={isOpen}
        onCancel={closeModal}
        className='max-w-[584px] p-5 lg:p-10'
        title='Add Sale Detail'
        //remove footer

        width={600}
        maskClosable={false}
      >
        <form
          onSubmit={handleSubmit(onSubmit, (e) => console.log(e))}
          className='space-y-2'
        >
          <FormInput
            name='label'
            label='Item Name'
            form={form}
            type='text'
            placeHolder='e.g qamiis'
            autoComplete='off'
            min={0}
            required
          />
          <FormInput
            name='quantity'
            label='Quantity'
            form={form}
            type='number'
            inputClassName='text-center'
            placeHolder='0'
            autoComplete='off'
            min={0}
            required
          />
          <FormInput
            name='amount'
            label='Amount'
            form={form}
            type='number'
            inputClassName='text-center'
            placeHolder='0.00'
            autoComplete='off'
            min={0}
            required
          />

          <footer className='flex justify-end mt-2'>
            '
            <Button
              size='md'
              variant='primary'
              className='min-w-[100px] text-center '
            >
              Save
            </Button>
          </footer>
        </form>
      </ModalBox>
    </>
  );
}

export default DetailsAdd;
