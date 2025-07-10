import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import useFetch from '@/hooks/fetch/useFetch';

import { FormInput } from '@/shared/fields/FormInput';
import Button from '@/components/ui/button/Button';
import { message } from 'antd';
import FormCard from '@/shared/cards/FormCard';
import { useNavigateHook } from '@/hooks/useFunctions';
const schema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormSchema = z.infer<typeof schema>;
export default function SignInForm() {
  const { Post, isLoading } = useFetch();
  const navigate = useNavigateHook();

  const form = useForm<LoginFormSchema>({
    resolver: zodResolver(schema),
  });
  const { handleSubmit } = form;
  const onSubmit = async (data: LoginFormSchema) => {
    const res = await Post({
      url: '/agents/emaillogin',
      body: data,
      method: 'POST',
    });
    if (!res.ok) {
      message.error(res.message || 'Login failed');
      res.errors?.forEach((err) => {
        form.setError(err.field as any, {
          type: 'server',
          message: 'err.message',
        });
      });
      return;
    }
    const auth = res.data;
    const path = auth.homePath;
    console.log(path);
    navigate(path);

    // message.success('Login successful');
  };

  return (
    <div className='flex flex-col flex-1'>
      <div className='w-full max-w-md pt-10 mx-auto'>
        <FormCard loading={isLoading}>
          <header className='text-center shadow-bsh64b pb-2 border-b border-gray-200 '>
            <div className='text-4xl text-Iblue cursor-pointer font-bold uppercase font-logo'>{`warqad.com`}</div>
            <h1 className=''>Welcome back! please sign in to your account</h1>
          </header>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            <FormInput
              name='email'
              label='Email'
              form={form}
              type='email'
              placeHolder='Enter your email'
              autoComplete='on'
            />
            <FormInput
              name='password'
              form={form}
              label='Password'
              type='password'
              placeHolder='Enter your password'
            />
            <footer className='flex justify-end'>
              <Button
                size='md'
                variant='primary'
                className='min-w-[100px] text-center'
              >
                Log in
              </Button>
            </footer>
          </form>
        </FormCard>
      </div>
    </div>
  );
}
