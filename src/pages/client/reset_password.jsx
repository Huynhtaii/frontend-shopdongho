import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { IoLockClosedOutline } from 'react-icons/io5';
import UserService from '../../services/user_service';
import { toast } from 'react-toastify';

const ResetPassword = () => {
   const { token } = useParams();
   const navigate = useNavigate();
   const [showPassword, setShowPassword] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const [formData, setFormData] = useState({
      newPassword: '',
      confirmPassword: '',
   });

   const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      if (formData.newPassword !== formData.confirmPassword) {
         toast.error('Mật khẩu không khớp!');
         return;
      }
      if (formData.newPassword.length < 4) {
         toast.error('Mật khẩu phải từ 4 ký tự trở lên!');
         return;
      }

      setIsLoading(true);
      try {
         const response = await UserService.resetPassword({
            token,
            newPassword: formData.newPassword,
         });
         if (response && response.EC === '0') {
            toast.success('Đổi mật khẩu thành công! Vui lòng đăng nhập.');
            navigate('/login');
         } else {
            toast.error(response.EM || 'Đổi mật khẩu thất bại!');
         }
      } catch (error) {
         console.error('Reset password error:', error);
         toast.error('Có lỗi xảy ra hoặc liên kết đã hết hạn.');
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
         <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <Link to="/">
               <img src="/logo-watchstore.webp" alt="Logo" className="mx-auto h-12 w-auto" />
            </Link>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Đặt lại mật khẩu</h2>
            <p className="mt-2 text-center text-sm text-gray-600">
               Nhập mật khẩu mới cho tài khoản của bạn.
            </p>
         </div>

         <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
               <form className="space-y-6" onSubmit={handleSubmit}>
                  <div>
                     <label htmlFor="newPassword" class="block text-sm font-medium text-gray-700">
                        Mật khẩu mới
                     </label>
                     <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                           <IoLockClosedOutline className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                           type={showPassword ? 'text' : 'password'}
                           name="newPassword"
                           id="newPassword"
                           className="focus:ring-primary focus:border-primary block w-full pl-10 pr-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                           placeholder="Nhập mật khẩu mới"
                           value={formData.newPassword}
                           onChange={handleChange}
                           required
                        />
                        <div
                           className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                           onClick={() => setShowPassword(!showPassword)}
                        >
                           {showPassword ? (
                              <AiOutlineEyeInvisible className="h-5 w-5 text-gray-400" />
                           ) : (
                              <AiOutlineEye className="h-5 w-5 text-gray-400" />
                           )}
                        </div>
                     </div>
                  </div>

                  <div>
                     <label htmlFor="confirmPassword" class="block text-sm font-medium text-gray-700">
                        Xác nhận mật khẩu mới
                     </label>
                     <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                           <IoLockClosedOutline className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                           type={showPassword ? 'text' : 'password'}
                           name="confirmPassword"
                           id="confirmPassword"
                           className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                           placeholder="Xác nhận mật khẩu mới"
                           value={formData.confirmPassword}
                           onChange={handleChange}
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
                        {isLoading ? 'Đang xử lý...' : 'Cập nhật mật khẩu'}
                     </button>
                  </div>
               </form>
            </div>
         </div>
      </div>
   );
};

export default ResetPassword;
