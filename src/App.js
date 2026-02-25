import { Route, Routes } from 'react-router-dom';
import ClientRoutes from './routers/client_routes';
import AdminRoutes from './routers/admin_routes';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import './App.css';
import 'swiper/css';
import 'swiper/css/pagination';
import ScrollToTop from './components/scroolltotop/ScrollToTop';
import { FavoriteProvider } from './context/favorite_context';
import { CompareProvider } from './context/compare_context';
import { CartProvider } from './context/cart_context';
import AuthContext from './context/auth.context';
import CompareBar from './components/products/compare_bar';
import { useContext, useEffect } from 'react';
import AccountService from './services/account_service';
import { useNavigate } from 'react-router-dom';

function App() {
   const { auth, setAuth } = useContext(AuthContext);
   const navigate = useNavigate();
   useEffect(() => {
      const fetchAccount = async () => {
         let response = await AccountService.getAccount();
         console.log('>>>>>>>check response check get account', response);
         if (response.data === null) {
            toast.warning('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!');
            setTimeout(() => {
               setAuth({
                  isAuthenticated: false,
                  isLoading: false,
                  user: { id: '', email: '', name: '', role: '' },
               });
               navigate('/login');
            }, 2000);
            return;
         }
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
   }, [setAuth, navigate]);

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
                  <CompareProvider>
                     <>
                        <ScrollToTop />
                        <Routes>
                           <Route path="/*" element={<ClientRoutes />} />
                           <Route path="/admin/*" element={<AdminRoutes />} />
                        </Routes>
                        <CompareBar />
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
                     </>
                  </CompareProvider>
               </FavoriteProvider>
            </CartProvider>
         )}
      </>
   );
}

export default App;
