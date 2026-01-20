import { BrowserRouter, Route, Routes } from "react-router-dom";
import ClientRoutes from "./routers/client_routes";
import AdminRoutes from "./routers/admin_routes";
import { Bounce, ToastContainer } from "react-toastify";
import "./App.css";
import "swiper/css";
import "swiper/css/pagination";
import ScrollToTop from './components/scroolltotop/ScrollToTop'; // Import component mới
import { FavoriteProvider } from "./context/favorite_context";
import { CartProvider } from "./context/cart_context";

function App() {
  return (
    <>
      <CartProvider>
        <FavoriteProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/*" element={<ClientRoutes />} />
              <Route path="/admin/*" element={<AdminRoutes />} />
            </Routes>
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick={false}
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
              transition={Bounce}
            />
          </BrowserRouter>
        </FavoriteProvider>
      </CartProvider>
    </>
  );
}

export default App;