import Button from '@/components/ui/button/Button';

import { z } from 'zod';
import { message } from 'antd';

import useFetch from '@/hooks/fetch/useFetch';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormInput } from '@/shared/fields/FormInput';
import useFetchData from '@/hooks/fetch/useFetchData';
import { useEffect } from 'react';
import ModalBox from '@/shared/ModalBox';
import FetchSelectors from '@/components/fetchSelectors';
import FormSelect from '@/shared/fields/FormSelect';

const schema = z.object({
  name: z
    .string()
    .min(3, { message: 'Bank name must be at least 3 characters' }),
  type: z.string().optional(),
  currency: z.string().optional(),
  store: z.string().optional(),
});
type FormSchema = z.infer<typeof schema>;
function Update({ isOpen, closeModal, reFetch, id }: any) {
  const { Post, isLoading } = useFetch();
  const { fetchData, isLoading: loadingData } = useFetchData();
  const form = useForm<FormSchema>({
    resolver: zodResolver(schema),
  });
  const { handleSubmit, setValue } = form;
  const onSubmit = async (data: FormSchema) => {
    const res = await Post({
      url: `/banks/name/${id}`,
      body: data,
      method: 'PUT',
    });
    if (!res.ok) {
      message.error(res.message || 'Login failed');
      res.errors?.forEach((err) => {
        form.setError(err.field as any, {
          type: 'server',
          message: err.message,
        });
      });
      return;
    }
    reFetch();
    closeModal();
    message.success('Bank Updated Successfully');
  };
  useEffect(() => {
    const fetch = async () => {
      const res = await fetchData({
        url: `/banks/get?id=${id}`,
        alert: true,
      });
      if (res.name) setValue('name', res.name);
      if (res.type) setValue('type', res.type);
      if (res.currency) setValue('currency', res.currency);
      if (res.store) setValue('store', res.store);
    };
    fetch();
  }, []);
  return (
    <ModalBox
      open={isOpen}
      onCancel={closeModal}
      className='max-w-[584px] p-5 lg:p-10'
      title='Update Bank Name'
      //remove footer
      loading={isLoading || loadingData}
      width={800}
      maskClosable={false}
    >
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-2'>
        <FormInput
          name='name'
          label='Name'
          form={form}
          type='text'
          placeHolder='name'
          autoComplete='off'
          required
        />
        <FormSelect
          name='type'
          label='Account Type'
          form={form}
          options={[
            {
              label: 'Bank',
              value: 'bank',
            },
            {
              label: 'Drawer',
              value: 'drawer',
            },
          ]}
          placeHolder='Select Account Type'
          disabled
        />
        <FetchSelectors.Currencies form={form} disabled />
        <FetchSelectors.Stores
          name='store'
          label='Store'
          form={form}
          none={true}
          placeHolder='Select Store'
          disabled
        />
        <footer className='flex justify-end'>
          <Button
            size='md'
            variant='primary'
            className='min-w-[100px] text-center !bg-orange-500'
          >
            Update
          </Button>
        </footer>
      </form>
    </ModalBox>
  );
}

export default Update;
