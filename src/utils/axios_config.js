import axios from 'axios';
import { toast } from 'react-toastify';

const instance = axios.create({
   baseURL: process.env.REACT_APP_API_URL,
   timeout: 5000,
   headers: {
      'Content-Type': 'application/json',
   },
   withCredentials: true,
});

// Add a request interceptor
instance.interceptors.request.use(
   function (config) {
      const token = localStorage.getItem('access_token');
      if (token) {
         config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
   },
   function (error) {
      return Promise.reject(error);
   },
);

instance.interceptors.response.use(
   function (response) {
      // Any status code that lie within the range of 2xx cause this function to trigger
      // Do something with response data
      return response.data;
   },
   function (error) {
      // Any status codes that falls outside the range of 2xx cause this function to trigger
      // Do something with response error
      const status = (error && error.response && error.response.status) || 500;
      switch (status) {
         // xác thực (token related issues)
         case 401: {
            toast.error('Unauthorized users. Please log in ...1111');
            // Nếu người dùng đang ở trang khác ngoài /login, /register, hiển thị thông báo lỗi yêu cầu đăng nhập lại.
            if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
               toast.error('Unauthorized users. Please log in ...');
               localStorage.removeItem('access_token');
               setTimeout(() => {
                  window.location.href = '/login';
               }, 1000);
            }
            return Promise.reject(error.response.data);
         }

         // bị cấm (vấn đề liên quan đến quyền)
         case 403: {
            toast.error(`You don't have permisssion access this resource...`);
            return Promise.reject(error);
         }

         // bad request
         case 400: {
            return Promise.reject(error);
         }

         // k tìm thấy
         case 404: {
            return Promise.reject(error);
         }

         // xung đột
         case 409: {
            return Promise.reject(error);
         }

         // không thể xử lý được
         case 422: {
            return Promise.reject(error);
         }

         // lỗi api chung (liên quan đến máy chủ) không mong muốn
         default: {
            return Promise.reject(error);
         }
      }
   },
);
export default instance;
