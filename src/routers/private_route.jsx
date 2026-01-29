import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../context/auth.context';
import { useContext } from 'react';

const PrivateRouteUser = () => {
   const { auth } = useContext(AuthContext);
   const isAuthenticated = auth.isAuthenticated;
   return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

const PrivateRouteAdmin = () => {
   const { auth } = useContext(AuthContext);
   const isAuthenticated = auth.isAuthenticated;
   const isAdmin = auth.user.role === '1';
   return isAuthenticated && isAdmin ? <Outlet /> : <Navigate to="/" replace />;
};

export { PrivateRouteUser, PrivateRouteAdmin };
