import { FolderOpen } from 'lucide-react';
import useAuth from '@/hooks/auth/use/useAuth';
import React, { useEffect } from 'react';
import { Spin, Tooltip } from 'antd';
import { useNavigateHook } from '@/hooks/useFunctions';
import { ActivateStore } from './Stores';
import useFetchData from '@/hooks/fetch/useFetchData';

function StoresHome() {
  return (
    <div>
      <StoreCards />
    </div>
  );
}

export default StoresHome;

function StoreCards() {
  const { stores } = useAuth().user;

  return (
    <div className='grid grid-cols-1 xsm:grid-cols-2 gap-4 sm:grid-cols-4 md:gap-6'>
      {/* <!-- Metric Item Start --> */}
      {(stores || []).map((store, i) => (
        <React.Fragment key={i}>
          <StoreCard store={store} />
        </React.Fragment>
      ))}
    </div>
  );
}
export function StoreCard({ store, reFetch }: any) {
  const navigate = useNavigateHook();
  const { fetchData, isLoading } = useFetchData();
  const [employees, setEmployees] = React.useState(0);
  async function load() {
    const data = await fetchData({
      url: `/stores/get?id=${store._id}`,
    });
    setEmployees(data?.agents);
  }
  useEffect(() => {
    load();
  }, []);
  return (
    <div className='rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6'>
      <div className='flex justify-between items-center'>
        <h1 className='font-bold text-gray-800 text-title-sm dark:text-white/90'>
          {store.name}
        </h1>
        <Tooltip placement='bottomLeft' title={'Open Store'}>
          <div
            onClick={() => navigate(`/stores/${store._id}`)}
            className='flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800'
          >
            <FolderOpen className='text-gray-800 size-6 dark:text-white/90 cursor-pointer' />
          </div>
        </Tooltip>
      </div>

      <div className='flex items-end justify-between mt-5'>
        <div>
          <span className='text-sm text-gray-500 dark:text-gray-400'>
            Employees
          </span>

          <h4 className='mt-2 font-semibold  text-gray-800 text-title-sm dark:text-white/90'>
            {isLoading ? <Spin className='!-mt-2' /> : employees}
          </h4>
        </div>

        <ActivateStore
          id={store._id}
          value={store.isActive}
          reFetch={reFetch}
        />
      </div>
    </div>
  );
}
