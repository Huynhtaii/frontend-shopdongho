import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IoArrowBack, IoMailOutline } from 'react-icons/io5';
import UserService from '../../services/user_service';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
   const [email, setEmail] = useState('');
   const [isLoading, setIsLoading] = useState(false);
   const [isSubmitted, setIsSubmitted] = useState(false);

   const handleSubmit = async (e) => {
      e.preventDefault();
      if (!email) {
         toast.error('Vui lòng nhập email!');
         return;
      }

      setIsLoading(true);
      try {
         const response = await UserService.forgotPassword(email);
         if (response && response.EC === '0') {
            setIsSubmitted(true);
            toast.success('Yêu cầu đã được gửi! Vui lòng kiểm tra email.');
         } else {
            toast.error(response.EM || 'Gửi yêu cầu thất bại!');
         }
      } catch (error) {
         console.error('Forgot password error:', error);
         toast.error('Có lỗi xảy ra, vui lòng thử lại sau.');
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
         <div className="absolute top-4 left-4">
            <Link to="/login" className="flex items-center gap-2 text-gray-600 hover:text-primary">
               <IoArrowBack size={20} />
               <span className="text-sm font-medium">Quay lại đăng nhập</span>
            </Link>
         </div>

         <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <Link to="/">
               <img src="/logo-watchstore.webp" alt="Logo" className="mx-auto h-12 w-auto" />
            </Link>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Quên mật khẩu</h2>
            <p className="mt-2 text-center text-sm text-gray-600">
               Nhập email của bạn để nhận liên kết đặt lại mật khẩu.
            </p>
         </div>

         <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
               {!isSubmitted ? (
                  <form className="space-y-6" onSubmit={handleSubmit}>
                     <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                           Email của bạn
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <IoMailOutline className="h-5 w-5 text-gray-400" />
                           </div>
                           <input
                              type="email"
                              id="email"
                              className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                              placeholder="you@example.com"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                           />
                        </div>
                     </div>

                     <div>
                        <button
                           type="submit"
                           disabled={isLoading}
                           className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                           {isLoading ? 'Đang gửi...' : 'Gửi yêu cầu'}
                        </button>
                     </div>
                  </form>
               ) : (
                  <div className="text-center">
                     <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                        <IoMailOutline className="h-6 w-6 text-green-600" />
                     </div>
                     <h3 className="mt-2 text-lg font-medium text-gray-900">Đã gửi email thành công</h3>
                     <p className="mt-1 text-sm text-gray-500">
                        Chúng tôi đã gửi một liên kết đặt lại mật khẩu đến <strong>{email}</strong>. Vui lòng kiểm tra hộp thư của bạn.
                     </p>
                     <div className="mt-6">
                        <Link
                           to="/login"
                           className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-red-700"
                        >
                           Quay lại đăng nhập
                        </Link>
                     </div>
                  </div>
               )}
            </div>
         </div>
      </div>
   );
};

export default ForgotPassword;
