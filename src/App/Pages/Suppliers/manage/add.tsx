import Button from '@/components/ui/button/Button';

import { z } from 'zod';
import { message } from 'antd';

import useFetch from '@/hooks/fetch/useFetch';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormInput } from '@/shared/fields/FormInput';
import ModalBox from '@/shared/ModalBox';
import Enums from '@/func/Enums';

import FetchSelectors from '@/components/fetchSelectors';
import FormPhoneInput from '@/shared/fields/FromPhoneInput';

const schema = z.object({
  name: z
    .string()
    .min(3, 'Name should be at least 3 characters long')
    .transform((name) => name.toLowerCase().replace(/\s+/g, ' ')),
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
function Add({ isOpen, closeModal, reFetch }: any) {
  const { Post, isLoading } = useFetch();

  const form = useForm<FormSchema>({
    resolver: zodResolver(schema),
  });
  const { handleSubmit } = form;
  const onSubmit = async (data: FormSchema) => {
    const datas = data;
    if (!datas.phone?.number) {
      delete datas.phone;
    }
    const res = await Post({
      url: '/suppliers/add',
      body: datas,
      method: 'POST',
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
    message.success('Supplier added successfully');
  };
  return (
    <ModalBox
      open={isOpen}
      onCancel={closeModal}
      className='max-w-[584px] p-5 lg:p-10'
      title='Add suppliers'
      //remove footer
      loading={isLoading}
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
        </div>
        <div className='flex justify-end'>
          <Button
            size='md'
            variant='primary'
            className='min-w-[100px] text-center '
          >
            add
          </Button>
        </div>
      </form>
    </ModalBox>
  );
}

export default Add;
