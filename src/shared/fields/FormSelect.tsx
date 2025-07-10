import type { UseFormReturn, Path } from 'react-hook-form';
import Label from '@/components/form/Label';
import Select from '@/components/form/Select';
import type { Option } from '@/components/form/Select';

type ChakraInputsProps<T> = {
  name: Path<T>;
  form: UseFormReturn<T>;
  label: string;
  placeHolder?: string;
  disabled?: boolean;
  className?: string;
  required?: boolean;
  defualtValue?: string | number | undefined;
  options: Option[];
};
function FormSelect<T>({
  name,
  form,
  label = 'undefined',
  placeHolder = '',
  disabled = false,
  options = [],
  required = false,
  className,
}: ChakraInputsProps<T>) {
  const nameI = name.split('.');
  const names: string = nameI.length > 1 ? nameI[1] : nameI[0];
  const {
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = form;
  const message = errors?.[names ? names : name];
  const current = watch(name);

  const onHandler = (value) => {
    setValue(name, value.target.value);
    clearErrors(name);
  };

  return (
    <section className={className}>
      <div>
        <Label className='capitalize'>
          {label} {required && <span className='text-error-500'>*</span>}
        </Label>

        <Select
          options={options}
          onChange={onHandler}
          placeholder={placeHolder}
          className='dark:bg-dark-900'
          required={required}
          value={current}
          disabled={disabled}
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

export default FormSelect;
