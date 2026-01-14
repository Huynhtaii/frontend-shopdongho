import { Navigate, Outlet } from "react-router-dom";

const PublicRouter = () => {
    const isAuthenticated = !!localStorage.getItem("token");// Kiểm tra user đã login chưa
    return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
}

export default PublicRouter;
