import Button from '@/components/ui/button/Button';

import { z } from 'zod';
import { message } from 'antd';

import useFetch from '@/hooks/fetch/useFetch';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormInput } from '@/shared/fields/FormInput';
import useFetchData from '@/hooks/fetch/useFetchData';
import { useEffect, useState } from 'react';
import ModalBox from '@/shared/ModalBox';
import FetchSelectors from '@/components/fetchSelectors';

import Enums from '@/func/Enums';
import FormPhoneInput from '@/shared/fields/FromPhoneInput';

const schema = z.object({
  name: z
    .string()
    .min(3, 'Name should be at least 3 characters long')
    .transform((name) => name.toLowerCase().replace(/\s+/g, ' ')),
  creditLimit: z.number().min(0, 'Credit limit should be at least 0'),
  currency: z
    .enum(Enums.currencies as [string, ...string[]])
    .refine((val) => !!val, { message: 'Currency is required' }),
  address: z.string().optional(),
  phone: z.object({
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
});
type FormSchema = z.infer<typeof schema>;
function Update({ isOpen, closeModal, reFetch, id }: any) {
  const { Post, isLoading } = useFetch();
  const [phoneNumber, setPhoneNumber] = useState('');
  const { fetchData, isLoading: loadingData } = useFetchData();
  const form = useForm<FormSchema>({
    resolver: zodResolver(schema),
  });
  const { handleSubmit, setValue } = form;
  const onSubmit = async (data: FormSchema) => {
    const res = await Post({
      url: `/customers/update/${id}`,
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
    message.success('Customer Updated Successfully');
  };
  useEffect(() => {
    const fetch = async () => {
      const res = await fetchData({
        url: `/customers/get?id=${id}`,
        alert: true,
      });
      if (res.name) setValue('name', res.name);
      if (res.address) setValue('address', res.address);
      if (res.currency) setValue('currency', res.currency);
      if (res.creditLimit) setValue('creditLimit', res.creditLimit);
      if (res.phone?.number) {
        setValue('phone', res.phone);
        setPhoneNumber(`${res.phone.dialCode}${res.phone.number}`);
      }
    };
    fetch();
  }, []);
  return (
    <ModalBox
      open={isOpen}
      onCancel={closeModal}
      className='max-w-[584px] p-5 lg:p-10'
      title='Update Customer'
      //remove footer
      loading={isLoading || loadingData}
      width={800}
      maskClosable={false}
    >
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-2'>
        <div className='grid gap-6 sm:grid-cols-2'>
          <FormInput
            name='name'
            label='Name'
            form={form}
            type='text'
            placeHolder='name'
            autoComplete='off'
            required
          />
          <FormPhoneInput
            name='phone'
            label='Phone Number'
            form={form}
            defaultValue={phoneNumber}
            placeHolder='phone number'
          />
          <FormInput
            name='address'
            label='Supplier Address'
            form={form}
            type='text'
            placeHolder='name'
            autoComplete='off'
          />
          <FetchSelectors.Currencies form={form} required />
          <FormInput
            name='creditLimit'
            label='Credit Limit'
            form={form}
            type='number'
            inputClassName='text-center'
            min={0}
            placeHolder='eg: 30,000'
            autoComplete='off'
            required
          />
        </div>
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
