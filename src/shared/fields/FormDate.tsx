import type { UseFormReturn, Path } from 'react-hook-form';

import Label from '@/components/form/Label';
import DatePicker from '@/components/form/date-picker';
type ChakraInputsProps<T> = {
  name: Path<T>;
  form: UseFormReturn<T>;
  label?: string;
  placeHolder?: string;
  disabled?: boolean;
  className?: string;
  required?: boolean;
  defualtValue?: string;
};
function FormDate<T>({
  name,
  form,
  label,
  placeHolder = '',
  disabled = false,
  className,
  required = false,
}: ChakraInputsProps<T>) {
  const nameI = name.split('.');
  const names: string = nameI.length > 1 ? nameI[1] : nameI[0];
  const {
    setValue,
    clearErrors,
    formState: { errors },
  } = form;
  const message = errors?.[names ? names : name];
  return (
    <section className={className}>
      <div>
        {label && (
          <Label className='capitalize'>
            {label} {required && <span className='text-error-500'>*</span>}
          </Label>
        )}
        <DatePicker
          id={`${name}-picker`}
          placeholder={placeHolder}
          defaultDate={form.getValues(name) as any}
          onChange={(_, currentDateString) => {
            // Handle your logic
            setValue(name, currentDateString as any);
            clearErrors(name);
          }}
          disabled={disabled}
          required={required}
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

export { FormDate };
