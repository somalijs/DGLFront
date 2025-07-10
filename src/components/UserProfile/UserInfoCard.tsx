import useAuth from '@/hooks/auth/use/useAuth';

export default function UserInfoCard() {
  const { name, surname, email, role, phoneNumber, gender } = useAuth().user;
  return (
    <div className='p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6'>
      <div className='flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between'>
        <div>
          <h4 className='text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6'>
            Personal Information
          </h4>

          <div className='grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32'>
            <div>
              <p className='mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400'>
                First Name
              </p>
              <p className='text-sm font-medium text-gray-800 dark:text-white/90'>
                {name}
              </p>
            </div>

            <div>
              <p className='mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400'>
                Last Name
              </p>
              <p className='text-sm font-medium text-gray-800 dark:text-white/90'>
                {surname}
              </p>
            </div>
            <div>
              <p className='mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400'>
                Sex
              </p>
              <p className='text-sm font-medium text-gray-800 dark:text-white/90'>
                {gender}
              </p>
            </div>
            <div>
              <p className='mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400'>
                Email address
              </p>
              <p className='text-sm font-medium text-gray-800 dark:text-white/90'>
                {email}
              </p>
            </div>

            <div>
              <p className='mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400'>
                Phone Number
              </p>
              <p className='text-sm font-medium text-gray-800 dark:text-white/90'>
                {phoneNumber}
              </p>
            </div>

            <div>
              <p className='mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400'>
                Role
              </p>
              <p className='text-sm font-medium text-gray-800 dark:text-white/90'>
                {role}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
