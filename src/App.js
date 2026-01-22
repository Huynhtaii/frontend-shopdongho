import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ClientRoutes from './routers/client_routes';
import AdminRoutes from './routers/admin_routes';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import './App.css';
import 'swiper/css';
import 'swiper/css/pagination';
import ScrollToTop from './components/scroolltotop/ScrollToTop'; // Import component mới
<<<<<<< HEAD
import { FavoriteProvider } from './context/favorite_context';
import AuthContext from './context/auth.context';
import { useContext, useEffect } from 'react';
import AccountService from './services/account_service';
function App() {
   const { auth, setAuth } = useContext(AuthContext);

   const fetchAccount = async () => {
      let response = await AccountService.getAccount();
      console.log('>>>>>>>check response check get account', response);
      if (response && response.EC === '0') {
         setAuth({
            isLoading: false,
            isAuthenticated: true,
            user: {
               email: response.DT.email,
               name: response.DT.username,
               role: response.DT.role,
            },
         });
      }
   };

   useEffect(() => {
      if (localStorage.getItem('access_token')) {
         fetchAccount();
      } else {
         setAuth({
            isAuthenticated: false,
            isLoading: false,
            user: {
               email: '',
               name: '',
            },
         });
      }
   }, []);
   useEffect(() => {
      console.log('Auth state changed:', auth);
   }, [auth]);
   return (
      <>
         {auth.isLoading && (
            <div className="flex justify-center items-center h-screen">
               <div className="w-10 h-10 border-t-transparent border-solid animate-spin rounded-full border-blue-500 border-8"></div>
            </div>
         )}
         {!auth.isLoading && (
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
                     theme="colored"
                     transition={Bounce}
                  />
               </BrowserRouter>
            </FavoriteProvider>
         )}
      </>
   );
=======
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
>>>>>>> a973e28bc0d0015ccc98e873b7e358e1d260c263
}

export default App;
