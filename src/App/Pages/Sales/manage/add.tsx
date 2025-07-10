import Button from '@/components/ui/button/Button';

import { z } from 'zod';
import { message } from 'antd';
import { v4 as uuidV4 } from 'uuid';
import useFetch from '@/hooks/fetch/useFetch';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import ModalBox from '@/shared/ModalBox';

import { FormDate } from '@/shared/fields/FormDate';
import { useState } from 'react';
import SalesAdd from '../modal/salesAdd';
import Salestable from '../tables/salesTable';
import { dateSchema } from '@/zod/config';

const baseSchema = z.object({
  date: dateSchema,
});
const schema = baseSchema;
type FormSchema = z.infer<typeof schema>;
function Add({ isOpen, closeModal, reFetch }: any) {
  const { Post, isLoading } = useFetch();

  const [sales, setSales] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const form = useForm<FormSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: new Date().toLocaleDateString('en-GB'),
    },
  });
  const { handleSubmit } = form;
  const onSubmit = async (data: FormSchema) => {
    // console.log(data);
    // return;
    const res = await Post({
      url: '/sales/add',
      body: {
        date: data.date,
        sales,
      },
      method: 'POST',
    });
    if (!res.ok) {
      message.error(res.message || 'Something went wrong');
      res.errors?.forEach((err) => {
        form.setError(err.field as any, {
          type: 'server',
          message: err.message,
        });
      });
      return;
    }
    reFetch(form.getValues('date'));
    closeModal();
    message.success('Store added successfully');
  };
  const addToSales = (data) => {
    setSales([
      ...sales,
      {
        index: sales.length + 1,
        uid: uuidV4(),
        ...data,
      },
    ]);
    setIsModalOpen(false);
  };
  return (
    <>
      {isModalOpen && (
        <SalesAdd
          isOpen={isModalOpen}
          closeModal={() => setIsModalOpen(false)}
          addToSales={addToSales}
        />
      )}

      <ModalBox
        open={isOpen}
        onCancel={closeModal}
        className='max-w-[584px] p-5 lg:p-10'
        title='Add Sale'
        //remove footer
        loading={isLoading}
        width={1200}
        maskClosable={false}
      >
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-2'>
          <FormDate
            className='max-w-[200px]'
            label='Date'
            name='date'
            form={form}
            required
          />
          <Button
            size='md'
            type='button'
            variant='outline'
            className='min-w-[100px] size-10 text-center !bg-amber-300'
            onClick={() => setIsModalOpen(true)}
          >
            add Sale
          </Button>
          <main>
            <Salestable
              data={sales}
              removeDetail={(d) => {
                setSales(sales.filter((sale) => sale.uid !== d));
              }}
            />
          </main>
          <footer className='flex justify-end'>
            <Button
              size='md'
              variant='primary'
              className='min-w-[100px] text-center '
            >
              sumbit
            </Button>
          </footer>
        </form>
      </ModalBox>
    </>
  );
}

export default Add;
