import Button from '@/components/ui/button/Button';

import { z } from 'zod';
import { message } from 'antd';

import useFetch from '@/hooks/fetch/useFetch';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormInput } from '@/shared/fields/FormInput';
import Enums from '@/func/Enums';
import FormPhoneInput from '@/shared/fields/FromPhoneInput';
import FormSelect from '@/shared/fields/FormSelect';
import { useEffect } from 'react';
import ModalBox from '@/shared/ModalBox';
import FetchSelectors from '@/components/fetchSelectors';

const schema = z
  .object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
    surname: z
      .string()
      .min(2, { message: 'Surname must be at least 2 characters' }),
    email: z.string().email('Please enter a valid email address'),
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
    gender: z
      .enum(Enums.gender as [string, ...string[]])
      .refine((val) => !!val, { message: 'Gender is required' }),
    store: z.string().optional(),
    role: z
      .enum(Enums.profileRoles as [string, ...string[]])
      .refine((val) => !!val, { message: 'Role is required' }),
    salary: z.number().min(0, 'Salary should be at least 0').optional(),
    commissionPercentage: z
      .number()
      .min(0, 'Commission percentage should be at least 0')
      .max(100, 'Commission percentage should be at most 100')
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.role !== 'admin') {
      if (!data.store || data.store.trim().length < 2) {
        ctx.addIssue({
          path: ['store'],
          code: z.ZodIssueCode.custom,
          message: 'Store name must be at least 2 characters',
        });
      }
    }
  });
type FormSchema = z.infer<typeof schema>;
function Add({ isOpen, closeModal, reFetch }: any) {
  const { Post, isLoading } = useFetch();

  const form = useForm<FormSchema>({
    resolver: zodResolver(schema),
    shouldUnregister: true,
  });
  const { handleSubmit, watch, clearErrors } = form;
  const role = watch('role');
  const onSubmit = async (data: FormSchema) => {
    const res = await Post({
      url: '/agents/add',
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
    message.success('Agent added successfully');
  };

  useEffect(() => {
    if (role === 'admin') {
      clearErrors('store');
    }
  }, [role]);
  return (
    <ModalBox
      open={isOpen}
      onCancel={closeModal}
      className='max-w-[584px] p-5 lg:p-10'
      title='Add Agent'
      //remove footer
      loading={isLoading}
      width={800}
      maskClosable={false}
    >
      {' '}
      <div className=''>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div className='grid gap-6 sm:grid-cols-2'>
            <FormInput
              name='name'
              label='First Names'
              form={form}
              type='text'
              placeHolder='name'
              autoComplete='off'
              required
            />
            <FormInput
              name='surname'
              label='Last Name'
              form={form}
              type='text'
              placeHolder='surname'
              autoComplete='off'
              required
            />
            <FormSelect
              name='gender'
              label='Sex'
              form={form}
              options={[
                {
                  label: 'Male',
                  value: 'male',
                },
                {
                  label: 'Female',
                  value: 'female',
                },
              ]}
              placeHolder='Select Sex'
              required
            />
            <FormSelect
              name='role'
              label='Role'
              form={form}
              options={[
                {
                  label: 'Staff',
                  value: 'staff',
                },
                {
                  label: 'Manager',
                  value: 'manager',
                },
                {
                  label: 'Admin',
                  value: 'admin',
                },
              ]}
              placeHolder='Select Role'
              required
            />
            <FormInput
              name='email'
              label='Email'
              form={form}
              type='email'
              placeHolder='email address'
              autoComplete='off'
              required
            />
            <FormPhoneInput
              name='phone'
              label='Phone Number'
              form={form}
              placeHolder='phone number'
              required
            />

            <FormInput
              name='salary'
              label='Salaray'
              form={form}
              type='number'
              placeHolder='salary'
              autoComplete='off'
            />
            <FormInput
              name='commissionPercentage'
              label='Commission Percentage'
              form={form}
              type='number'
              placeHolder='Commission Percentage'
              autoComplete='off'
            />

            {['manager', 'staff'].includes(role) && (
              <FetchSelectors.Stores
                name='store'
                label='Store'
                form={form}
                placeHolder='Select Store'
                required
              />
            )}
          </div>
          <footer className='flex justify-end'>
            <Button
              size='md'
              variant='primary'
              className='min-w-[100px] text-center '
            >
              Add
            </Button>
          </footer>
        </form>
      </div>
    </ModalBox>
  );
}

export default Add;
