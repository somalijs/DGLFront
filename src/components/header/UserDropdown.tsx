import { useState } from 'react';
import { DropdownItem } from '../ui/dropdown/DropdownItem';
import { Dropdown } from '../ui/dropdown/Dropdown';
import useAuth from '@/hooks/auth/use/useAuth';
import useFetch from '@/hooks/fetch/useFetch';
import { message, Spin } from 'antd';
import { CircleUser, LogOutIcon } from 'lucide-react';
import { useNavigateHook } from '@/hooks/useFunctions';
export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, setIsFetched } = useAuth();
  const { Fetch, isLoading } = useFetch();
  const { names, name, email } = user;
  const navigate = useNavigateHook();
  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }
  const onLogout = async () => {
    const res = await Fetch({
      url: '/agents/logout',
      v: 1,
    });
    if (!res.ok) {
      message.error(res.message || 'Something went wrong');
      return;
    }
    logout();
    setIsFetched(false);
    navigate('/login');
  };
  return (
    <div className='relative !z-9999'>
      <button
        onClick={toggleDropdown}
        className='flex items-center text-gray-700 dropdown-toggle dark:text-gray-400'
      >
        <span className='mr-3 overflow-hidden rounded-full h-11 w-11'>
          <img
            src='/images/user/owner.jpg'
            alt='User'
            className='w-full h-full object-cover'
          />
        </span>

        <span className='block mr-1 font-medium text-theme-sm capitalize'>
          {name}
        </span>
        <svg
          className={`stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          width='18'
          height='20'
          viewBox='0 0 18 20'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M4.3125 8.65625L9 13.3437L13.6875 8.65625'
            stroke='currentColor'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className='absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark'
      >
        <div>
          <span className='block font-medium text-gray-700 text-theme-sm dark:text-gray-400'>
            {names}
          </span>
          <span className='mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400'>
            {email}
          </span>
        </div>

        <ul className='flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800'>
          <li className='crusor-pointer'>
            <DropdownItem
              onItemClick={closeDropdown}
              tag='a'
              to='/profile'
              className='flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300'
            >
              <CircleUser className='w-4 h-4' />
              Profile
            </DropdownItem>
          </li>
        </ul>
        <div
          onClick={onLogout}
          className='flex items-center gap-3 px-3 py-2 mt-3 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300 cursor-pointer'
        >
          {!isLoading ? (
            <LogOutIcon className='w-4 h-4' />
          ) : (
            <Spin size='small' />
          )}
          Sign out
        </div>
      </Dropdown>
    </div>
  );
}
