import { Navigate, Outlet } from "react-router-dom";
import AuthContext from "../context/auth.context";
import { useContext } from "react";

const PublicRouter = () => {
    const { auth } = useContext(AuthContext);
    const isAuthenticated = auth.isAuthenticated;
    return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
}

export default PublicRouter;
