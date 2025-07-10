import SimpleTable from '@/components/tables/custom/SimpleTable';
import Button from '@/components/ui/button/Button';
import useFetchData from '@/hooks/fetch/useFetchData';
import { EllipsisVertical } from 'lucide-react';
import { useEffect, useState } from 'react';
import Add from './manage/add';
import { MenuProps, message, Switch } from 'antd';
import useFetch from '@/hooks/fetch/useFetch';
import AntDropdown from '@/shared/dropDown/AntDropdown';
import UpdateDeatils from './manage/deatils';
import UpdatePhone from './manage/phone';
import UpdateEmail from './manage/email';
import VerifyProfileEmail from './manage/profileEmail';
import VerifyNewEmail from './manage/newEmail';

function Agents() {
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
      url: '/agents/get',
    });
  };
  const getMenuItems = (datas: any): MenuProps['items'] => [
    {
      key: '1',
      label: 'Agent Manage Box',
      disabled: true,
    },
    {
      type: 'divider',
    },
    {
      key: 'Edit Details',
      label: 'Edit Details',
      onClick: () => {
        setModel({ type: 'details', id: datas._id });
      },
    },
    {
      key: 'Edit Phone',
      label: 'Change Phone Number',
      onClick: () => {
        setModel({ type: 'phone', id: datas._id });
      },
    },
    {
      key: 'Change email',
      label: 'Update Email Address',
      onClick: () => {
        setModel({ type: 'email', id: datas._id });
      },
    },

    (!datas.isEmailVerified || datas.newEmail) && {
      type: 'divider',
    },
    !datas.isEmailVerified && {
      key: 'profile email verification',
      label: 'Verify Profile Email',
      onClick: () => {
        setModel({ type: 'profileEmail', id: datas._id });
      },
    },
    datas.newEmail && {
      key: 'new email verification',
      label: 'Verify New Email',
      onClick: () => {
        setModel({ type: 'newEmail', id: datas._id });
      },
    },
  ];
  const columns = [
    {
      key: 'name',
      header: 'Agents Name',
      render: (item) => item.names,
      // onClick: (item, c) => console.log(item, c),
    },
    {
      key: 'store',
      header: 'Store Name',
    },
    {
      key: 'status',
      header: 'Status',
      className: 'text-center',
      render: (item) => (
        <span
          className={`${
            item.status === 'active' ? 'text-green-500' : 'text-red-500'
          }`}
        >
          {item.status}
        </span>
      ),
    },
    {
      key: 'action',
      header: 'Action',
      render: (item) => (
        <div className='flex items-center gap-2'>
          <AntDropdown
            data={item}
            dropDownList={getMenuItems}
            // preventCloseList={['resetPassword']}
          >
            <EllipsisVertical size={16} className='cursor-pointer' />
          </AntDropdown>
          <ActivateUser id={item._id} value={item.isActive} reFetch={load} />
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
      {modal.type === 'details' && (
        <UpdateDeatils
          isOpen={true}
          closeModal={closeModal}
          reFetch={load}
          id={modal.id}
        />
      )}
      {modal.type === 'phone' && (
        <UpdatePhone
          isOpen={true}
          closeModal={closeModal}
          reFetch={load}
          id={modal.id}
        />
      )}
      {modal.type === 'email' && (
        <UpdateEmail
          isOpen={true}
          closeModal={closeModal}
          reFetch={load}
          id={modal.id}
        />
      )}
      {modal.type === 'profileEmail' && (
        <VerifyProfileEmail
          isOpen={true}
          closeModal={closeModal}
          reFetch={load}
          id={modal.id}
        />
      )}
      {modal.type === 'newEmail' && (
        <VerifyNewEmail
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
              Add Agent
            </Button>
          </div>
        }
      />
    </div>
  );
}

function ActivateUser({
  id,
  value,
  reFetch,
}: {
  id: string;
  value: boolean;
  reFetch: () => void;
}) {
  const { Post, isLoading } = useFetch();
  const [current, setCurrent] = useState(value);
  const onChange = async () => {
    const res = await Post({
      url: `/agents/activate/${id}`,
      body: {},
      method: 'PUT',
    });
    if (!res.ok) {
      setCurrent(value);
      message.error(res.message || 'Something went wrong');
      return;
    }
    reFetch();
    message.success(res.data);
  };
  return (
    <Switch
      value={current}
      loading={isLoading}
      size='small'
      onChange={onChange}
    />
  );
}
export default Agents;
