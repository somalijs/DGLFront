import Button from '@/components/ui/button/Button';

import { z } from 'zod';
import { message } from 'antd';

import useFetch from '@/hooks/fetch/useFetch';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormInput } from '@/shared/fields/FormInput';
import ModalBox from '@/shared/ModalBox';
import Enums from '@/func/Enums';
import FormSelect from '@/shared/fields/FormSelect';

import FetchSelectors from '@/components/fetchSelectors';

const schema = z.object({
  name: z
    .string()
    .min(3, 'Name should be at least 3 characters long')
    .transform((name) => name.toLowerCase().replace(/\s+/g, ' ')),
  type: z
    .enum(Enums.BankTypes as [string, ...string[]])
    .refine((val) => !!val, { message: 'Account type is required' }),
  currency: z
    .enum(Enums.currencies as [string, ...string[]])
    .refine((val) => !!val, { message: 'Currency is required' }),
  store: z.string().optional(),
});
type FormSchema = z.infer<typeof schema>;
function Add({ isOpen, closeModal, reFetch }: any) {
  const { Post, isLoading } = useFetch();

  const form = useForm<FormSchema>({
    resolver: zodResolver(schema),
  });
  const { handleSubmit } = form;
  const onSubmit = async (data: FormSchema) => {
    const res = await Post({
      url: '/banks/add',
      body: data,
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
    message.success('Bank added successfully');
  };
  return (
    <ModalBox
      open={isOpen}
      onCancel={closeModal}
      className='max-w-[584px] p-5 lg:p-10'
      title='Add Bank'
      //remove footer
      loading={isLoading}
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
          required
        />
        <FetchSelectors.Currencies form={form} required />
        <FetchSelectors.Stores
          name='store'
          label='Store'
          form={form}
          none={true}
          placeHolder='Select Store'
          banks={false}
        />

        <footer className='flex justify-end'>
          <Button
            size='md'
            variant='primary'
            className='min-w-[100px] text-center '
          >
            add
          </Button>
        </footer>
      </form>
    </ModalBox>
  );
}

export default Add;
