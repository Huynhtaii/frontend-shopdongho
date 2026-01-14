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
import Category from "../pages/client/category";
import Order from "../pages/client/order";
import FloatingButtons from "../components/floating_buttons";

const ClientLayout = ({ children }) => (
    <>
        <UserHeader />
        <FloatingButtons />
        <main>{children}</main>
        <UserFooter />
    </>
);

const CartLayout = ({ children }) => (
    <>
        <UserHeader />
        <FloatingButtons />
        <main>{children}</main>
    </>
);

const ClientRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<ClientLayout><Home /></ClientLayout>} />
            <Route path="/cart" element={<CartLayout><Cart /></CartLayout>} />
            <Route path="/favorite" element={<ClientLayout><Favorite /></ClientLayout>} />
            <Route path="/category/:category" element={<ClientLayout><Category /></ClientLayout>} />
            <Route path="/order" element={<ClientLayout><Order /></ClientLayout>} />
            <Route path="*" element={<NotFound />} />

            <Route element={<PublicRouter />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Route>

        </Routes>
    );
};

export default ClientRoutes;
