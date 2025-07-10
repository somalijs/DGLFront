import ComponentCard from '@/components/common/ComponentCard';
import Button from '@/components/ui/button/Button';

import { z } from 'zod';
import { message } from 'antd';

import useFetch from '@/hooks/fetch/useFetch';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import useFetchData from '@/hooks/fetch/useFetchData';
import { useEffect } from 'react';

import ModalBox from '@/shared/ModalBox';
import { FormInput } from '@/shared/fields/FormInput';

const schema = z.object({
  current: z.string().optional(),
  email: z.string().email('Please enter a valid email address'),
});

type FormSchema = z.infer<typeof schema>;
function UpdateEmail({ isOpen, closeModal, reFetch, id }: any) {
  const { Post, isLoading } = useFetch();

  const { fetchData, isLoading: loadingData } = useFetchData();
  const form = useForm<FormSchema>({
    resolver: zodResolver(schema),
  });
  const { handleSubmit, setValue } = form;
  const onSubmit = async (data: FormSchema) => {
    const res = await Post({
      url: `/agents/changeEmail/${id}`,
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
    message.success('Agent Updated Successfully');
  };
  useEffect(() => {
    const fetch = async () => {
      const res = await fetchData({
        url: `/agents/get?id=${id}`,
        alert: true,
      });

      if (res.phone && res.phone.number)
        if (res.email) setValue('current', res.email);
    };
    fetch();
  }, []);
  return (
    <ComponentCard title='Form In Modal'>
      <ModalBox
        open={isOpen}
        onCancel={closeModal}
        className='max-w-[584px] p-5 lg:p-10'
        title='Update Agent Email'
        //remove footer
        loading={isLoading || loadingData}
        width={500}
        maskClosable={false}
      >
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-2'>
          <div className='grid gap-6 sm:grid-cols-2'>
            <FormInput
              name='current'
              label='Current Email'
              form={form}
              type='email'
              placeHolder='current email address'
              autoComplete='off'
              className='col-span-full'
              disabled
            />
            <FormInput
              name='email'
              label='Email'
              form={form}
              type='email'
              placeHolder='email address'
              autoComplete='off'
              className='col-span-full'
              required
            />
          </div>
          <footer className='flex justify-end'>
            <Button
              size='md'
              variant='primary'
              className='min-w-[100px] text-center !bg-orange-500'
            >
              Update Email
            </Button>
          </footer>
        </form>
      </ModalBox>
    </ComponentCard>
  );
}

export default UpdateEmail;
