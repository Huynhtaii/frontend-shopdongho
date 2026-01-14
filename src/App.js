import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ClientRoutes from './routers/client_routes';
import AdminRoutes from './routers/admin_routes';
import { Bounce, ToastContainer } from 'react-toastify';

import './App.css';
import 'swiper/css';
import 'swiper/css/pagination';

function App() {
  return (
    <BrowserRouter>
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
  )
}

export default App;
