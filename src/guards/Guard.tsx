import FormSpinner from '@/assets/spinners/FormSpinner';
import useAuth from '@/hooks/auth/use/useAuth';

import useFetch from '@/hooks/fetch/useFetch';
import { message } from 'antd';
import { useEffect, useLayoutEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';

export const Guard = () => {
  const { Fetch } = useFetch();
  const location = useLocation();

  const { login, setIsLoggedIn, setIsFetched, isFetched } = useAuth();
  useLayoutEffect(() => {
    const fetch = async () => {
      const res = await Fetch({
        url: '/agents/me',
        v: 1,
      });
      if (!res.ok) {
        //  message.error(res.message || 'Something went wrong');
        setIsFetched(true);
        setIsLoggedIn(false);
        return;
      }
      login(res.data);
      setIsLoggedIn(true);
      setIsFetched(true);
    };
    fetch();
  }, [location.pathname, setIsFetched]);

  if (!isFetched) {
    return (
      <div className='min-h-screen'>
        <FormSpinner />
      </div>
    );
  }
  return <Outlet />;
};
export const ProtectedRoute = () => {
  const { isLoggedIn } = useAuth();

  return isLoggedIn ? <Outlet /> : <Navigate to='/login' replace />;
};

export const UnProtectedRoute = () => {
  const { isLoggedIn, user } = useAuth();

  return !isLoggedIn ? <Outlet /> : <Navigate to={user.homePath} replace />;
};

export const AdminProtectedRoute = () => {
  const { user } = useAuth();

  const { role } = user;
  useEffect(() => {
    if (!['admin'].includes(role)) {
      message.error('Only admin can access this page');
    }
  }, [role]);

  return ['admin'].includes(role) ? <Outlet /> : <Navigate to='/' replace />;
};

export const ManagerProtectedRoute = () => {
  const { user } = useAuth();

  const { role } = user;

  useEffect(() => {
    if (!['admin', 'manager'].includes(role)) {
      message.error('Only admin and manager can access this page');
    }
  }, [role]);

  return ['admin', 'manager'].includes(role) ? (
    <Outlet />
  ) : (
    <Navigate to='/' replace />
  );
};
