import FormSpinner from '@/assets/spinners/FormSpinner';
import React from 'react';

function FormCard({
  className,
  children,
  loading = false,
}: {
  className?: string;
  children: React.ReactNode;
  loading?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] ${className} relative text-dark dark:text-white/90`}
    >
      {loading && <FormSpinner />}
      <div className='p-4 space-y-2'>{children}</div>
    </div>
  );
}

export default FormCard;
