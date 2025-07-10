import SimpleTable from '@/components/tables/custom/SimpleTable';
import Button from '@/components/ui/button/Button';
import useFetchData from '@/hooks/fetch/useFetchData';

import { FileEdit } from 'lucide-react';
import { useEffect, useState } from 'react';
import Add from './manage/add';
import Update from './manage/update';
import Badge from '@/components/ui/badge/Badge';
import { message, Switch } from 'antd';
import useFetch from '@/hooks/fetch/useFetch';

function Suppliers() {
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
  const { data, fetchData, isLoading, errorMessage } = useFetchData();

  const load = async () => {
    await fetchData({
      url: '/suppliers/get',
    });
  };
  const columns = [
    {
      key: 'name',
      header: 'Supplier Name',
      // onClick: (item, c) => console.log(item, c),
    },
    {
      key: 'phoneNumber',
      header: 'Phone Number',
      render: (item) =>
        item.phoneNumber ? (
          item.phoneNumber
        ) : (
          <Badge variant='light' color='info'>
            none
          </Badge>
        ),
    },
    {
      key: 'action',
      header: 'Action',
      render: (item) => (
        <div className='flex items-center gap-2'>
          <FileEdit
            size={16}
            className='text-orange-400 cursor-pointer'
            onClick={() => setModel({ type: 'update', id: item._id })}
          />
        </div>
      ),
    },
    {
      key: 'isActive',
      header: 'Activation',
      render: (item) => (
        <div className='flex items-center gap-2'>
          <ActivateSupplier
            id={item._id}
            value={item.isActive}
            reFetch={load}
          />
        </div>
      ),
    },
    {
      key: 'restrict',
      header: 'Restriction',
      render: (item) => (
        <div className='flex items-center gap-2'>
          <RestrictSupplier
            id={item._id}
            value={item.restricted}
            reFetch={load}
          />
        </div>
      ),
    },
  ];
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
      <SimpleTable
        columns={columns}
        data={data}
        loading={isLoading}
        reFetch={load}
        errorMessage={errorMessage}
        title={
          <div className='flex items-center  gap-2'>
            <Button
              onClick={() => setModel({ type: 'add', id: '' })}
              size='sm'
              variant='outline'
            >
              Add Supplier
            </Button>
          </div>
        }
      />
    </div>
  );
}

function ActivateSupplier({
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
      url: `/suppliers/activate/${id}`,
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
      size='small'
      onChange={onChange}
    />
  );
}
function RestrictSupplier({
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
      url: `/suppliers/restricted/${id}`,
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
      size='small'
      onChange={onChange}
    />
  );
}
export default Suppliers;
