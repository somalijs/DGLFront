import useFetchData from '@/hooks/fetch/useFetchData';
import React, { useEffect, useState } from 'react';
import Add from './manage/add';
import Update from './manage/update';
import { message, Switch } from 'antd';
import useFetch from '@/hooks/fetch/useFetch';
import { StoreCard } from './Home';

function Stores() {
  const [modal, setModel] = useState({
    type: '',
    id: '',
  });
  const closeModal = () => {
    setModel({
      type: '',
      id: '',
    });
  };
  const { data, fetchData } = useFetchData();

  const load = async () => {
    await fetchData({
      url: '/stores/get',
    });
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      {modal.type === 'add' && (
        <Add isOpen={true} closeModal={closeModal} reFetch={load} />
      )}
      {modal.type === 'update' && (
        <Update
          isOpen={true}
          closeModal={closeModal}
          reFetch={load}
          id={modal.id}
        />
      )}
      <div className='grid grid-cols-1 xsm:grid-cols-2 gap-4 sm:grid-cols-4 md:gap-6'>
        {(data || []).map((store, i) => (
          <React.Fragment key={i}>
            <StoreCard store={store} reFetch={load} />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export function ActivateStore({
  id,
  value,
  reFetch,
}: {
  id: string;
  value: boolean;
  reFetch: () => void;
}) {
  const { Post, isLoading } = useFetch();
  const onChange = async () => {
    const res = await Post({
      url: `/stores/activate/${id}`,
      body: {},
      method: 'PUT',
    });
    if (!res.ok) {
      message.error(res.message || 'Something went wrong');
      return;
    }
    reFetch();
    message.success(res.data);
  };
  return (
    <Switch
      defaultChecked={value}
      loading={isLoading}
      size='default'
      onChange={onChange}
    />
  );
}
export default Stores;
