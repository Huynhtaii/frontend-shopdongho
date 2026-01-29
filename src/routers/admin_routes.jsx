import { Route, Routes } from 'react-router-dom';
import Dashboard from '../pages/admin/dashboard';
import NotFound from '../pages/common/not_found';
import AdminLayout from '../components/layout/admin/admin_layout';
import Chat from '../pages/admin/chat';
import UserAdmin from '../pages/admin/user';
import OrderAdmin from '../pages/admin/order';
import ProductAdmin from '../pages/admin/product';
import { PrivateRouteAdmin } from './private_route';

const AdminRoutes = () => {
   return (
      <Routes>
         <Route element={<PrivateRouteAdmin />}>
            <Route
               path="/"
               element={
                  <AdminLayout>
                     <Dashboard />
                  </AdminLayout>
               }
            />
            <Route
               path="dashboard"
               element={
                  <AdminLayout>
                     <Dashboard />
                  </AdminLayout>
               }
            />
            <Route
               path="products"
               element={
                  <AdminLayout>
                     <ProductAdmin />
                  </AdminLayout>
               }
            />
            <Route
               path="orders"
               element={
                  <AdminLayout>
                     <OrderAdmin />
                  </AdminLayout>
               }
            />
            <Route
               path="users"
               element={
                  <AdminLayout>
                     <UserAdmin />
                  </AdminLayout>
               }
            />
            <Route
               path="chat"
               element={
                  <AdminLayout>
                     <Chat />
                  </AdminLayout>
               }
            />
         </Route>
         <Route path="*" element={<NotFound />} />
      </Routes>
   );
};

export default AdminRoutes;
