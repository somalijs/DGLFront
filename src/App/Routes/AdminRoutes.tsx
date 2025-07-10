// AgencyRoutes.tsx
import { Route } from 'react-router';
import Stores from '@/App/Pages/Stores/Stores';
import Agents from '@/App/Pages/Agents/Agents';
import { AdminProtectedRoute } from '@/guards/Guard';

import Banks from '@/App/Pages/Banks/Banks';
import Suppliers from '../Pages/Suppliers';
import Customers from '../Pages/Customers';
const AdminRoutes = () => (
  <Route element={<AdminProtectedRoute />}>
    {/* store */}

    <Route path='/stores' element={<Stores />} />
    <Route path='/agents' element={<Agents />} />
    <Route path='/banks' element={<Banks />} />
    <Route path='/suppliers' element={<Suppliers />} />
    <Route path='/customers' element={<Customers />} />
  </Route>
);

export default AdminRoutes;
