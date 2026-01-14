import { Route, Routes } from "react-router-dom";
import Dashboard from "../pages/admin/dashboard";
import PrivateRoute from "./private_route";
import NotFound from "../pages/common/not_found";

const AdminRoutes = () => {
    return (
        <Routes>
            <Route element={<PrivateRoute />}>
                <Route path="dashboard" element={<Dashboard />} />
            </Route>
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}

export default AdminRoutes;
