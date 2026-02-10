import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ClientRoutes from './routers/client_routes';
import AdminRoutes from './routers/admin_routes';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import './App.css';
import 'swiper/css';
import 'swiper/css/pagination';
import ScrollToTop from './components/scroolltotop/ScrollToTop';
import { FavoriteProvider } from './context/favorite_context';
import { CartProvider } from './context/cart_context';
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
               id: response.DT.id,
               email: response.DT.email,
               name: response.DT.username,
               role: response.DT.role_id ? response.DT.role_id.toString() : '',
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
               id: '',
               email: '',
               name: '',
               role: '',
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
            <CartProvider>
               <FavoriteProvider>
                  <BrowserRouter>
                     <ScrollToTop />
                     <Routes>
                        <Route path="/*" element={<ClientRoutes />} />
                        <Route path="/admin/*" element={<AdminRoutes />} />
                     </Routes>
                     <ToastContainer
                        position="bottom-center"
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
            </CartProvider>
         )}
      </>
   );
}

export default App;
