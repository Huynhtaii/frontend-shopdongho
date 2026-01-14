import { Routes, Route } from "react-router-dom";

import Home from '../pages/client/home';
import Cart from '../pages/client/cart';
import Favorite from '../pages/client/favorite';
import Login from "../pages/client/login";
import Register from "../pages/client/register";
import PublicRouter from "./public_router";
import NotFound from "../pages/common/not_found";
import UserFooter from "../components/layout/user_footer";
import UserHeader from "../components/layout/header/user_header";

const ClientLayout = ({ children }) => (
    <>
        <UserHeader />
        <main>{children}</main>
        <UserFooter />
    </>
);

const ClientRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<ClientLayout><Home /></ClientLayout>} />
            <Route path="/cart" element={<ClientLayout><Cart /></ClientLayout>} />
            <Route path="/favorite" element={<ClientLayout><Favorite /></ClientLayout>} />
            <Route path="*" element={<NotFound />} />

            <Route element={<PublicRouter />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Route>

            {/* <Route path="dashboard" element={<Dashboard />}>
          <Route path="project/:id" element={<Project />} />
        </Route> */}
        </Routes>
    );
};

export default ClientRoutes;
