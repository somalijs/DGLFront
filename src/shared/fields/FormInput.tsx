import type { UseFormReturn, Path } from 'react-hook-form';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
type ChakraInputsProps<T> = {
  name: Path<T>;
  form: UseFormReturn<T>;
  type: 'text' | 'password' | 'number' | 'email';
  label: string;
  placeHolder?: string;
  disabled?: boolean;
  className?: string;
  required?: boolean;
  defualtValue?: string | number | undefined;
  min?: number;
  max?: number;
  autoComplete?: 'on' | 'off';
  inputClassName?: string;
};
function FormInput<T>({
  name,
  form,
  type = 'text',
  label = 'undefined',
  placeHolder = '',
  disabled = false,
  className,
  inputClassName,
  required = false,
  min,
  max,
  autoComplete = 'off',
}: ChakraInputsProps<T>) {
  const nameI = name.split('.');
  const names: string = nameI.length > 1 ? nameI[1] : nameI[0];
  const {
    register,
    formState: { errors },
  } = form;
  const message = errors?.[names ? names : name];
  return (
    <section className={className}>
      <div>
        <Label className='capitalize'>
          {label} {required && <span className='text-error-500'>*</span>}
        </Label>
        <Input
          placeholder={placeHolder}
          onKeyDown={(e) =>
            type === 'number' &&
            ['E', 'e', '+'].includes(e.key) &&
            e.preventDefault()
          }
          className={inputClassName}
          type={type}
          {...register(name, type === 'number' ? { valueAsNumber: true } : {})}
          disabled={disabled}
          autoComplete={autoComplete}
          min={type === 'number' ? min : undefined}
          step='any'
          max={type === 'number' ? max : undefined}
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

export { FormInput };
