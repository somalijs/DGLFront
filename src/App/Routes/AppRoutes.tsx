// AgencyRoutes.tsx

import AppLayout from '../Layout/AppLayout';
import { Route } from 'react-router';
import UserProfiles from '@/App/Pages/Auth/UserProfiles';
import AdminRoutes from './AdminRoutes';

import Sales from '@/App/Pages/Sales/Sales';
import DashBoard from '../Pages/Dashboard';

import ManagerRoutes from './ManagerRoutes';

const AppRoutes = () => (
  <Route element={<AppLayout />}>
    <Route path='/' element={<DashBoard />} />
    <Route path='/profile' element={<UserProfiles />} />
    <Route path='/sales' element={<Sales />} />

    {/* store */}
    {AdminRoutes()}
    {ManagerRoutes()}
  </Route>
);

export default AppRoutes;
