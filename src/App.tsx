import { BrowserRouter as Router, Routes, Route } from 'react-router';

import SignIn from '@/App/Pages/Auth/SignIn';

import NotFound from '@/App/Pages/OtherPage/NotFound';

import { ScrollToTop } from '@/components/common/ScrollToTop';

import AppRoutes from '@/App/Routes/AppRoutes';
import { Guard, ProtectedRoute, UnProtectedRoute } from './guards/Guard';

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route element={<Guard />}>
            {/* Dashboard Layout */}
            <Route element={<ProtectedRoute />}>
              {AppRoutes()} {/* ✅ Call it here */}
            </Route>

            <Route element={<UnProtectedRoute />}>
              <Route path='/login' element={<SignIn />} />
            </Route>
            {/* Fallback Route */}
            <Route path='*' element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}
