import useAuth from '@/hooks/auth/use/useAuth';
import StoreCards from './StoreCards';

function DashBoard() {
  const { role } = useAuth().user;
  return (
    <div className='grid grid-cols-12 gap-4 md:gap-6'>
      <div className='col-span-12'>
        {role !== 'staff' ? (
          <StoreCards />
        ) : (
          <h3 className='text-2xl'>staff dashboard is under construction</h3>
        )}
      </div>
    </div>
  );
}

export default DashBoard;
