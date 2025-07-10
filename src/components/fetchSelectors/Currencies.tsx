import FormSelect from '@/shared/fields/FormSelect';
import type { UseFormReturn, Path } from 'react-hook-form';

type InputsProps<T> = {
  name?: Path<T>;
  form: UseFormReturn<T>;
  disabled?: boolean;
  required?: boolean;
};
function Currencies<T>({
  form,
  name = 'currency' as Path<T>,
  disabled = false,
  required = false,
}: InputsProps<T>) {
  return (
    <FormSelect
      name={name}
      label='Currency'
      form={form}
      options={[
        {
          label: 'USD',
          value: 'USD',
        },
        {
          label: 'KSH',
          value: 'KSH',
        },
      ]}
      placeHolder='Select Currency'
      required={required}
      disabled={disabled}
    />
  );
}

export default Currencies;
