import ModalBox from '@/shared/ModalBox';
import { useForm } from 'react-hook-form';
import { v4 as uuidV4 } from 'uuid';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '@/components/ui/button/Button';
import { FormInput } from '@/shared/fields/FormInput';
import useAuth from '@/hooks/auth/use/useAuth';
import FetchSelectors from '@/components/fetchSelectors';
import FormSelect from '@/shared/fields/FormSelect';
import { useEffect, useState } from 'react';
import DetailsAdd from './detailModal';
import Detailstable from '../tables/Detailstable';
const baseSchema = z.object({
  amount: z.number().gt(0, 'Amount must be greater than 0'),
  store: z.string().optional(),
  agentObj: z.object({}).passthrough().optional(),
  storeObj: z.object({}).passthrough().optional(),
  type: z.enum(['none', 'detailed']),
});
const adminSchema = baseSchema.extend({
  store: z.string().min(1, 'Store id is required'),
  by: z.string().min(1, 'Seller id is required'),
});

function SalesAdd({
  isOpen,
  closeModal,
  addToSales,
}: {
  isOpen: boolean;
  closeModal: () => void;
  addToSales: (data) => void;
}) {
  const { user } = useAuth();
  const { role, id } = user;
  const isAdmin = role === 'admin';
  const isStaff = role === 'staff';
  const schema = isAdmin ? adminSchema : baseSchema;
  type FormSchema = z.infer<typeof schema>;
  const defaultValues: any = {
    type: 'none',
  };
  if (role !== 'admin') {
    const storeName = user?.stores[0]?.name;
    const storeId = user?.store;
    defaultValues.store = storeId;
    defaultValues.storeObj = { value: storeId, label: storeName };
  }
  if (role === 'staff') {
    defaultValues.by = id;
    defaultValues.agentObj = { value: id, label: user.names };
  }

  const form = useForm<FormSchema>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues,
  });
  const { handleSubmit, watch, setValue } = form;
  const type = watch('type');
  const [details, setDetails] = useState<any>([]);
  const [detailModal, setDetailModal] = useState({
    type: '',
  });
  const onCloseDetailModal = () => {
    setDetailModal({
      type: '',
    });
    if (!details.length) setValue('type', 'none');
  };
  const addTodDetails = (data) => {
    setDetails([
      ...details,
      {
        uid: uuidV4(),
        index: details.length + 1,
        ...data,
      },
    ]);

    const total = [...details, data].reduce(
      (prev, curr) => prev + curr.quantity * curr.amount,
      0
    );
    setValue('amount', Number(total.toFixed(2)));
    setDetailModal({
      type: '',
    });
  };
  const onSubmit = async (data: FormSchema) => {
    const obj: any = {
      ...data,
    };
    if (role === 'staff') {
      obj.by = id;
    }
    if (details.length) obj.details = details;
    addToSales(obj);
  };
  useEffect(() => {
    if (type === 'detailed') {
      setDetailModal({ type });
    }
  }, [type]);
  return (
    <>
      {detailModal.type === 'detailed' && (
        <DetailsAdd
          isOpen={true}
          closeModal={onCloseDetailModal}
          addTodDetails={addTodDetails}
        />
      )}

      <ModalBox
        open={isOpen}
        onCancel={closeModal}
        className='max-w-[584px] p-5 lg:p-10'
        title='Add Sale'
        width={800}
        maskClosable={false}
      >
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-2'>
          <FormSelect
            name='type'
            label='Sale type'
            form={form}
            disabled={details.length > 0}
            options={[
              {
                label: 'None',
                value: 'none',
              },
              {
                label: 'Detailed',
                value: 'detailed',
              },
            ]}
            placeHolder='Select Sale Type'
            required
          />
          {isAdmin && (
            <FetchSelectors.Stores
              label='Store'
              placeHolder='Select Store'
              form={form}
              storeObj={'storeObj'}
              name='store'
              required
            />
          )}
          {!isStaff && (
            <FetchSelectors.Agents
              label='Seller'
              placeHolder='Select Seller'
              form={form}
              name='by'
              agentObj={'agentObj'}
              required
            />
          )}
          <FormInput
            name='amount'
            label='Amount'
            form={form}
            type='number'
            inputClassName='text-center'
            placeHolder='0.00'
            autoComplete='off'
            min={0}
            required
            disabled={details.length > 0}
          />
          {details && details.length > 0 && (
            <Detailstable
              data={details}
              removeDetail={(id) => {
                setDetails(details.filter((item) => item.uid !== id));
                setValue('amount', 0);
                setValue('type', 'none');
              }}
            />
          )}
          <footer className='flex justify-end'>
            <Button
              size='sm'
              variant='primary'
              className='min-w-[100px] text-center '
            >
              add
            </Button>
          </footer>
        </form>
      </ModalBox>
    </>
  );
}

export default SalesAdd;
