import ComponentCard from '@/components/common/ComponentCard';
import Button from '@/components/ui/button/Button';
import { Modal } from '@/components/ui/modal';
import { z } from 'zod';
import { message } from 'antd';

import useFetch from '@/hooks/fetch/useFetch';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormInput } from '@/shared/fields/FormInput';
import useFetchData from '@/hooks/fetch/useFetchData';
import { useEffect } from 'react';

const schema = z.object({
  name: z
    .string()
    .min(3, { message: 'Store name must be at least 3 characters' }),
  location: z.string().optional(),
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
      url: `/stores/update/${id}`,
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
    message.success('Store Updated Successfully');
  };
  useEffect(() => {
    const fetch = async () => {
      const res = await fetchData({
        url: `/stores/get?id=${id}`,
        alert: true,
      });
      if (res.name) setValue('name', res.name);
      if (res.location) setValue('location', res.location);
    };
    fetch();
  }, []);
  return (
    <ComponentCard title='Form In Modal'>
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className='max-w-[584px] p-5 lg:p-10'
        title='Update Store'
        loading={isLoading || loadingData}
      >
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-2'>
          <FormInput
            name='name'
            label='Store Name'
            form={form}
            type='text'
            placeHolder='name'
            autoComplete='off'
            required
          />
          <FormInput
            name='location'
            label='Location'
            form={form}
            type='text'
            placeHolder='store address'
            autoComplete='off'
          />
          <footer className='flex justify-end'>
            <Button
              size='md'
              variant='primary'
              className='min-w-[100px] text-center !bg-orange-500'
            >
              Update Store
            </Button>
          </footer>
        </form>
      </Modal>
    </ComponentCard>
  );
}

export default Update;
