const stats = [
  {
    label: 'Total Revenue',
    value: '$200,45.87',
  },
  {
    label: 'Active Users',
    value: '9,528',
  },
  {
    label: 'Active Users',
    value: '9,528',
  },
  {
    label: 'Active Users',
    value: '9,528',
  },
  {
    label: 'Active Users',
    value: '9,528',
  },
  {
    label: 'Active Users',
    value: '9,528',
  },
  {
    label: 'Customer Lifetime Value',
    value: '$849.54',
  },
  {
    label: 'Customer Acquisition Cost',
    value: '9,528',
  },
  // add more...
];

export default function BankCards() {
  return (
    <div className='rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]'>
      <div className='mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center'>
        <h3 className='text-lg font-semibold text-gray-800 dark:text-white'>
          Stores Drawer Overview
        </h3>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 border rounded-2xl border-gray-200 overflow-hidden dark:border-gray-800 dark:bg-gray-900'>
        {stats.map((stat, index) => (
          <div
            key={index}
            className='border-b border-r border-gray-200 px-6 py-5 last:border-b-0 sm:last:border-r-0 dark:border-gray-800'
          >
            <h1 className='font-semibold dark:text-gray-400 text-theme-xl'>
              {stat?.label?.toUpperCase()}
            </h1>
            <p
              className='text-gray-5 mt-2
                Today Sales00 text-theme-sm dark:text-gray-400 '
            >
              Available Balance
            </p>
            <div className='flex items-end gap-3'>
              <h4 className='text-title-xs sm:text-title-sm font-bold text-gray-800 dark:text-white/90'>
                {stat.value}
              </h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
