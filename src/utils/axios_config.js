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
// Biến để kiểm soát việc hiển thị toast
let isShowingUnauthorizedToast = false;
let isShowingForbiddenToast = false;
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
            // Xóa token
            localStorage.clear(); // Xóa tất cả localStorage để đảm bảo

            // Kiểm tra nếu đang ở trang public thì không cần redirect
            if (
               window.location.pathname !== '/' &&
               window.location.pathname !== '/login' &&
               window.location.pathname !== '/register'
            ) {
               isShowingUnauthorizedToast = true;
               localStorage.removeItem('access_token');
               setTimeout(() => {
                  window.location.href = '/login';
               }, 3000);
               toast.error('Session expired. Please log in again!', {
                  onClose: () => {
                     isShowingUnauthorizedToast = false;
                  },
               });
            }
            return Promise.resolve({ data: null, status: 401 });
         }
         // bị cấm (vấn đề liên quan đến quyền)
         case 403: {
            const errorData = error.response?.data;
            toast.error(errorData?.EM || `You don't have permission to access this resource...`);
            return Promise.reject(errorData || error);
         }

         // bad request
         case 400: {
            const errorData = error.response?.data;
            return Promise.reject(errorData || error);
         }

         // k tìm thấy
         case 404: {
            const errorData = error.response?.data;
            return Promise.reject(errorData || error);
         }

         // xung đột
         case 409: {
            const errorData = error.response?.data;
            return Promise.reject(errorData || error);
         }

         // không thể xử lý được
         case 422: {
            const errorData = error.response?.data;
            return Promise.reject(errorData || error);
         }

         // lỗi api chung (liên quan đến máy chủ) không mong muốn
         default: {
            const errorData = error.response?.data;
            return Promise.reject(errorData || error);
         }
      }
   },
);
export default instance;
