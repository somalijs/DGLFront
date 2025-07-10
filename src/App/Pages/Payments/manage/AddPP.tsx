import Button from '@/components/ui/button/Button';

import { z } from 'zod';
import { message } from 'antd';

import useFetch from '@/hooks/fetch/useFetch';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import ModalBox from '@/shared/ModalBox';

import { FormDate } from '@/shared/fields/FormDate';
import { dateSchema } from '@/zod/config';
import Enums from '@/func/Enums';
import useAuth from '@/hooks/auth/use/useAuth';
import FetchSelectors from '@/components/fetchSelectors';
import FormSelect from '@/shared/fields/FormSelect';
import { FormInput } from '@/shared/fields/FormInput';
import { useEffect } from 'react';

const baseSchema = z.object({
  date: dateSchema,
  amount: z.number().gt(0, 'Amount must be greater than 0'),
  model: z
    .enum(Enums.paymentTypeModels as [string, ...string[]])
    .refine((val) => !!val, { message: 'profile type is required' }),
  id: z.string().min(1, 'Id is required'),
  bank: z.string().optional(),
  currency: z.string().optional(),
});
const adminSchema = baseSchema.extend({
  bank: z.string().min(1, 'account is required'),
  currency: z
    .enum(Enums.currencies as [string, ...string[]])
    .refine((val) => !!val, { message: 'Currency is required' }),
});

function AddPP({
  isOpen,
  closeModal,
  reFetch,
  type,
}: {
  isOpen: boolean;
  closeModal: () => void;
  reFetch: (date: string) => void;
  type: 'payment' | 'payout';
}) {
  const { Post, isLoading } = useFetch();
  const { role } = useAuth().user;

  const schema = role !== 'admin' ? baseSchema : adminSchema;
  type FormSchema = z.infer<typeof schema>;
  const form = useForm<FormSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: new Date().toLocaleDateString('en-GB'),
    },
  });
  const { handleSubmit, watch, setValue } = form;
  const Model = watch('model');
  const Currency = watch('currency');
  const onSubmit = async (data: FormSchema) => {
    const datas: any = data;
    if (type === 'payment') {
      datas.url = '/payments/add';
      if (['agent', 'supplier'].includes(Model)) {
        datas.from = data.bank;
      } else {
        datas.to = data.bank;
      }
    } else if (type === 'payout') {
      datas.url = '/payouts/add';
      if (['agent', 'supplier'].includes(Model)) {
        datas.to = data.bank;
      } else {
        datas.from = data.bank;
      }
    }

    const res = await Post({
      url: datas.url,
      body: datas,
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
  useEffect(() => {
    setValue('id', '');
  }, [Model]);
  useEffect(() => {
    setValue('bank', '');
  }, [Currency]);
  return (
    <>
      <ModalBox
        open={isOpen}
        onCancel={closeModal}
        className='max-w-[584px] p-5 lg:p-10'
        title='Add Payment'
        //remove footer
        loading={isLoading}
        width={800}
        maskClosable={false}
      >
        <form
          onSubmit={handleSubmit(onSubmit, (f) => console.log(f))}
          className='space-y-2'
        >
          <div className='grid gap-6 sm:grid-cols-2'>
            <FormDate label='Date' name='date' form={form} required />
            <FormSelect
              name='model'
              label='Profile Type'
              form={form}
              options={Enums.paymentTypeModels.map((model: any) => ({
                label: model,
                value: model,
              }))}
              placeHolder='Select Profile'
              required
            />
            {Model === 'agent' && (
              <FetchSelectors.Agents
                name='id'
                label='Agent'
                form={form}
                placeHolder='Select Agent'
                required
              />
            )}
            {Model === 'customer' && (
              <FetchSelectors.Customers
                name='id'
                label='Customer'
                form={form}
                placeHolder='Select Customer'
                required
              />
            )}
            {Model === 'supplier' && (
              <FetchSelectors.Suppliers
                name='id'
                label='Supplier'
                form={form}
                placeHolder='Select Supplier'
                required
              />
            )}
            {role === 'admin' && (
              <>
                <FetchSelectors.Currencies form={form} required />
                <FetchSelectors.Banks
                  name='bank'
                  label='Bank'
                  placeHolder='Select Bank'
                  currency={watch('currency') as any}
                  form={form}
                  required
                />
              </>
            )}
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
          </div>

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

export default AddPP;
