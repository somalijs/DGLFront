import PageMeta from '@/components/common/PageMeta';

import SignInForm from '@/components/auth/SignInForm';

export default function SignIn() {
  return (
    <>
      <PageMeta
        title='Agent Login'
        description='This is Agent Login page for Pos'
      />
      <SignInForm />
    </>
  );
}
