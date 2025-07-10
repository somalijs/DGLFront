import type { UseFormReturn, Path } from 'react-hook-form';
import Label from '@/components/form/Label';
import Select from '@/components/form/Select';

import useFetchData from '@/hooks/fetch/useFetchData';
import { useLayoutEffect } from 'react';
import { RefreshCcw } from 'lucide-react';
type ChakraInputsProps<T> = {
  name: Path<T>;
  form: UseFormReturn<T>;
  label: string;
  placeHolder?: string;
  disabled?: boolean;
  className?: string;
  required?: boolean;
  none?: boolean;
  defualtValue?: string | number | undefined;
  storeObj?: Path<T>;
  banks?: boolean;
};
function Stores<T>({
  name,
  form,
  label = 'Stores',
  placeHolder = '',
  disabled = false,
  none = false,
  required = false,
  className,
  storeObj,
}: ChakraInputsProps<T>) {
  const { data, isLoading, fetchData, errorMessage } = useFetchData();
  const nameI = name.split('.');
  const names: string = nameI.length > 1 ? nameI[1] : nameI[0];
  const {
    setValue,
    setError,
    clearErrors,
    watch,
    formState: { errors },
  } = form;
  const message = errors?.[names ? names : name];

  const onHandler = (value) => {
    // console.log(value.target.value);
    setValue(name, value.target.value);
    const obj = data.find((item: any) => item.value === value.target.value);

    if (storeObj && obj) setValue(storeObj, obj);
    clearErrors(name);
  };
  const load = async () => {
    const res = await fetchData({
      url: `/stores/get?type=options&banks=false`,
    });
    if (!res || res.length === 0) {
      setError(name, { message: errorMessage });
    } else {
      clearErrors(name);
    }
  };

  useLayoutEffect(() => {
    load();
  }, []);
  return (
    <section className={className}>
      <div className='relative'>
        <div className='flex items-center justify-between gap-2'>
          <Label className='capitalize'>
            {label} {required && <span className='text-error-500'>*</span>}
          </Label>
          <RefreshCcw
            size={15}
            onClick={load}
            className='cursor-pointer mr-2'
          />
        </div>
        <Select
          options={!none ? data : [{ label: 'None', value: '' }, ...data]}
          onChange={onHandler}
          placeholder={placeHolder}
          className='dark:bg-dark-900'
          value={watch(name)}
          required={required}
          disabled={disabled || isLoading}
        />
      </div>

      {message && (
        <p className='mt-1 text-red-500 text-sm'>
          {message.message === 'Required'
            ? 'This field is required'
            : message.message}
        </p>
      )}
    </section>
  );
}

export default Stores;
