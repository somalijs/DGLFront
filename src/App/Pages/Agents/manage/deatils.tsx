import ComponentCard from '@/components/common/ComponentCard';
import Button from '@/components/ui/button/Button';

import { z } from 'zod';
import { message } from 'antd';

import useFetch from '@/hooks/fetch/useFetch';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormInput } from '@/shared/fields/FormInput';
import useFetchData from '@/hooks/fetch/useFetchData';
import { useEffect } from 'react';
import Enums from '@/func/Enums';
import FormSelect from '@/shared/fields/FormSelect';
import ModalBox from '@/shared/ModalBox';

const schema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  surname: z
    .string()
    .min(2, { message: 'Surname must be at least 2 characters' }),
  gender: z
    .enum(Enums.gender as [string, ...string[]])
    .refine((val) => !!val, { message: 'Gender is required' }),
  role: z
    .enum(Enums.profileRoles as [string, ...string[]])
    .refine((val) => !!val, { message: 'Role is required' }),
  salary: z.number().min(0, 'Salary should be at least 0').optional(),
  commissionPercentage: z
    .number()
    .min(0, 'Commission percentage should be at least 0')
    .max(100, 'Commission percentage should be at most 100')
    .optional(),
});

type FormSchema = z.infer<typeof schema>;
function UpdateDeatils({ isOpen, closeModal, reFetch, id }: any) {
  const { Post, isLoading } = useFetch();
  // const [currentPhone, setCurrentPhone] = useState('');
  const { fetchData, isLoading: loadingData } = useFetchData();
  const form = useForm<FormSchema>({
    resolver: zodResolver(schema),
  });
  const { handleSubmit, setValue } = form;
  const onSubmit = async (data: FormSchema) => {
    const res = await Post({
      url: `/agents/updatedetails/${id}`,
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
      if (res.name) setValue('name', res.name);
      if (res.surname) setValue('surname', res.surname);
      if (res.gender) setValue('gender', res.gender);
      if (res.role) setValue('role', res.role);
      // if (res.phone && res.phone.number)
      //   setCurrentPhone(`${res.phone.dialCode}${res.phone.number}`);
      if (res.salary) setValue('salary', res.salary);
      if (res.commissionPercentage)
        setValue('commissionPercentage', res.commissionPercentage);
    };
    fetch();
  }, []);
  return (
    <ComponentCard title='Form In Modal'>
      <ModalBox
        open={isOpen}
        onCancel={closeModal}
        className='max-w-[584px] p-5 lg:p-10'
        title='update Agent'
        //remove footer
        loading={isLoading || loadingData}
        width={800}
        maskClosable={false}
      >
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-2'>
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

            {/* <FormPhoneInput
              name='phone'
              label='Phone Number'
              form={form}
              placeHolder='phone number'
              defaultValue={currentPhone}
            /> */}

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
          </div>
          <footer className='flex justify-end'>
            <Button
              size='md'
              variant='primary'
              className='min-w-[100px] text-center !bg-orange-500'
            >
              Update Agent
            </Button>
          </footer>
        </form>
      </ModalBox>
    </ComponentCard>
  );
}

export default UpdateDeatils;
