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
  currency?: 'USD' | 'KSH';
};
function Banks<T>({
  name,
  form,
  label = 'Account',
  placeHolder = '',
  disabled = false,
  none = false,
  required = false,
  className,
  currency,
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
    clearErrors(name);
  };
  const load = async () => {
    let url = `/banks/get?select=option`;
    if (currency) url = `/banks/get?currency=${currency}&select=option`;
    const res = await fetchData({
      url: url,
    });
    if (!res || res.length === 0) {
      setError(name, { message: errorMessage });
    } else {
      clearErrors(name);
    }
  };

  useLayoutEffect(() => {
    load();
  }, [currency]);
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
          loading={isLoading}
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

export default Banks;
