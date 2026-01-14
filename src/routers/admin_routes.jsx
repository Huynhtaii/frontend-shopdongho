import { Route, Routes } from "react-router-dom";
import Dashboard from "../pages/admin/dashboard";
import PrivateRoute from "./private_route";
import NotFound from "../pages/common/not_found";
import AdminLayout from "../components/layout/admin/admin_layout";
import Chat from "../pages/admin/chat";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<PrivateRoute />}>
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
              <h1>Products Management</h1>
            </AdminLayout>
          }
        />
        <Route
          path="orders"
          element={
            <AdminLayout>
              <h1>Orders Management</h1>
            </AdminLayout>
          }
        />
        <Route
          path="users"
          element={
            <AdminLayout>
              <h1>Users Management</h1>
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
