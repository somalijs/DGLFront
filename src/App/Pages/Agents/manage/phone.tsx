import ComponentCard from '@/components/common/ComponentCard';
import Button from '@/components/ui/button/Button';

import { z } from 'zod';
import { message } from 'antd';

import useFetch from '@/hooks/fetch/useFetch';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import useFetchData from '@/hooks/fetch/useFetchData';
import { useEffect, useState } from 'react';

import ModalBox from '@/shared/ModalBox';
import FormPhoneInput from '@/shared/fields/FromPhoneInput';

const schema = z.object({
  current: z.object({
    number: z
      .string()
      .min(5, 'Phone number must be at least 5 characters')
      .regex(/^\d+$/, 'Phone number can only contain digits')
      .optional()
      .or(z.literal('')), // Make number optional
    dialCode: z
      .string()
      .min(1, 'Dial code is required')
      .regex(/^\+\d+$/, "Dial code must start with '+' followed by numbers")
      .optional()
      .or(z.literal('')), // Make dial code optional
  }),
  phone: z.object({
    number: z
      .string()
      .min(5, 'Phone number must be at least 5 characters')
      .regex(/^\d+$/, 'Phone number can only contain digits'),
    dialCode: z
      .string()
      .min(1, 'Dial code is required')
      .regex(/^\+\d+$/, "Dial code must start with '+' followed by numbers"),
  }),
});

type FormSchema = z.infer<typeof schema>;
function UpdatePhone({ isOpen, closeModal, reFetch, id }: any) {
  const { Post, isLoading } = useFetch();
  const [currentPhone, setCurrentPhone] = useState('');
  const { fetchData, isLoading: loadingData } = useFetchData();
  const form = useForm<FormSchema>({
    resolver: zodResolver(schema),
  });
  const { handleSubmit } = form;
  const onSubmit = async (data: FormSchema) => {
    const res = await Post({
      url: `/agents/changephone/${id}`,
      body: data.phone,
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
        setCurrentPhone(`${res.phone.dialCode}${res.phone.number}`);
    };
    fetch();
  }, []);
  return (
    <ComponentCard title='Form In Modal'>
      <ModalBox
        open={isOpen}
        onCancel={closeModal}
        className='max-w-[584px] p-5 lg:p-10'
        title='update Agent Phone Number'
        //remove footer
        loading={isLoading || loadingData}
        width={500}
        maskClosable={false}
      >
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-2'>
          <div className='grid gap-6 sm:grid-cols-2'>
            <FormPhoneInput
              name='current'
              label='Current Phone Number'
              form={form}
              placeHolder='phone number'
              defaultValue={currentPhone}
              className='col-span-full'
              disabled={true}
            />
            <FormPhoneInput
              name='phone'
              label='new Phone Number'
              form={form}
              placeHolder='phone number'
              className='col-span-full'
            />
          </div>
          <footer className='flex justify-end'>
            <Button
              size='md'
              variant='primary'
              className='min-w-[100px] text-center !bg-orange-500'
            >
              Update Phone
            </Button>
          </footer>
        </form>
      </ModalBox>
    </ComponentCard>
  );
}

export default UpdatePhone;
