import { Navigate, Outlet } from "react-router-dom";
import AuthContext from "../context/auth.context";
import { useContext } from "react";

const PrivateRoute = () => {
    const { auth } = useContext(AuthContext);
    const isAuthenticated = auth.isAuthenticated;
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
