// AgencyRoutes.tsx
import { Route } from 'react-router';

import { ManagerProtectedRoute } from '@/guards/Guard';
import Payments from '../Pages/Payments';
import Payouts from '../Pages/Payments/payouts';
import Reports from '../Pages/Report';

const ManagerRoutes = () => (
  <Route element={<ManagerProtectedRoute />}>
    <Route path='/payments' element={<Payments />} />
    <Route path='/payouts' element={<Payouts />} />
    <Route path='/reports' element={<Reports />} />
  </Route>
);

export default ManagerRoutes;
