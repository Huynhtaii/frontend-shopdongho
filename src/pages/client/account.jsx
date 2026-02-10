import React, { useEffect, useState, useContext } from 'react';
import { FaTrash } from 'react-icons/fa';
import AccountService from '../../services/account_service';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthContext from '../../context/auth.context';
function Account() {
   const [user, setUser] = useState({
      name: 'Chưa có thông tin',
      email: 'Chưa có thông tin',
      phone: 'Chưa có thông tin',
      address: 'Chưa có thông tin',
      orders: [],
   });
   const [id, setId] = useState(localStorage.getItem('userId'));
   const adminId = process.env.REACT_APP_ADMIN_ID;
   const { auth } = useContext(AuthContext);
   useEffect(() => {
      fetchData();
      console.log(user.orders);
   }, []);

   const fetchData = async () => {
      try {
         const response = await AccountService.getInforAccount(id);
         if (response?.EC === '0') {
            setUser({
               name: response.DT.name || 'Chưa có thông tin',
               email: response.DT.email || 'Chưa có thông tin',
               phone: response.DT.phone || 'Chưa có thông tin',
               address: response.DT.address || 'Chưa có thông tin',
               orders: response.DT.orders || [],
            });
         }
      } catch (error) {
         console.error('Lỗi khi lấy dữ liệu tài khoản:', error);
      }
   };

   const handleToastDisabledEdit = () => {
      toast.info('Bạn không thể sửa đổi email');
   };
   const handleUpdateInfo = async () => {
      try {
         const response = await AccountService.updateInforAccount(id, user);

         console.log('Response từ backend:', response);

         if (response?.EC === '0') {
            toast.success(response.EM || 'Cập nhật thông tin thành công');
            fetchData();
         } else {
            toast.error(response.EM || 'Có lỗi xảy ra khi cập nhật');
         }
      } catch (error) {
         console.error('Lỗi khi gửi request cập nhật:', error);
         toast.error('Cập nhật thông tin thất bại, vui lòng thử lại!');
      }
   };

   return (
      <div className="min-h-screen bg-gray-100 py-10 px-4">
         <h1 className="text-2xl font-bold mb-8 text-center text-red-600">Quản lý tài khoản của bạn</h1>

         <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Thông tin cá nhân */}
            <div className="bg-white shadow-lg rounded-lg p-6">
               <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">Thông tin cá nhân</h2>

               <div className="flex flex-col items-center mb-6">
                  <img
                     className="w-24 h-24 rounded-full border-4 border-blue-500 mb-4"
                     src="https://th.bing.com/th/id/OIP.4jxvWlLezIhMpagdKO3GQAHaHa?w=1200&h=1200&rs=1&pid=ImgDetMain"
                     alt="Avatar"
                  />
               </div>
               <div onClick={() => handleToastDisabledEdit()}>
                  <label className="block text-gray-700 font-medium mb-1">Email:</label>
                  <input type="email" className="w-full p-2 border rounded-lg bg-gray-50" value={user.email} disabled />
               </div>

               <div className="space-y-4">
                  <div>
                     <label className="block text-gray-700 font-medium mb-1">Tên:</label>
                     <input
                        type="text"
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={user.name}
                        onChange={(e) => {
                           setUser({ ...user, name: e.target.value });
                        }}
                     />
                  </div>

                  <div>
                     <label className="block text-gray-700 font-medium mb-1">Số điện thoại:</label>
                     <input
                        type="text"
                        className="w-full p-2 border rounded-lg"
                        value={user.phone}
                        onChange={(e) => setUser({ ...user, phone: e.target.value })}
                     />
                  </div>

                  <div>
                     <label className="block text-gray-700 font-medium mb-1">Địa chỉ:</label>
                     <input
                        type="text"
                        className="w-full p-2 border rounded-lg"
                        value={user.address}
                        onChange={(e) => setUser({ ...user, address: e.target.value })}
                     />
                  </div>

                  <div className="flex justify-center mt-6">
                     <button
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-600 transition"
                        onClick={() => handleUpdateInfo()}
                     >
                        Cập nhật thông tin
                     </button>
                  </div>
               </div>
            </div>

            {/* Lịch sử mua hàng */}
            {String(auth.user?.id) === String(adminId) ? (
               <div className="bg-white shadow-lg rounded-lg p-6 max-h-[610.5px] overflow-y-auto">
                  <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">Lịch sử mua hàng</h2>
                  <div className="text-center py-8 text-gray-500">
                     <p>Admin không có đơn hàng.</p>
                  </div>
               </div>
            ) : (
               <div className="bg-white shadow-lg rounded-lg p-6 max-h-[610.5px] overflow-y-auto">
                  <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">Lịch sử mua hàng</h2>
                  <div className="space-y-4">
                     {user.orders.length > 0 ? (
                        user.orders.map((order) => (
                           <div
                              key={order.order_id}
                              className="border p-4 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
                           >
                              <div className="flex justify-between items-start">
                                 <div className="space-y-2">
                                    <p className="text-gray-600">
                                       <strong>Mã đơn hàng:</strong> {order.order_id}
                                    </p>
                                    {order.order_items.map((item, index) => (
                                       <p key={index} className="text-gray-600">
                                          <strong>Sản phẩm:</strong> {item.Product.name} - Số lượng: {item.quantity}
                                       </p>
                                    ))}
                                    <p className="text-gray-600">
                                       <strong>Ngày mua:</strong> {new Date(order.order_date).toLocaleDateString()}
                                    </p>
                                    <p className="text-gray-600">
                                       <strong>Trạng thái:</strong>{' '}
                                       <span
                                          className={`px-2 py-1 rounded-full text-sm ${
                                             order.status === 'Pending'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : order.status === 'Shipped'
                                                ? 'bg-blue-100 text-blue-800'
                                                : order.status === 'Completed'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                          }`}
                                       >
                                          {order.status === 'Pending' && 'Đang chờ'}
                                          {order.status === 'Shipped' && 'Đang giao hàng'}
                                          {order.status === 'Completed' && 'Đã giao hàng'}
                                          {order.status === 'Cancelled' && 'Đã hủy'}
                                       </span>
                                    </p>
                                    <p className="text-gray-600">
                                       <strong>Tổng tiền:</strong>{' '}
                                       <span className="text-primary font-medium">
                                          {new Intl.NumberFormat('vi-VN', {
                                             style: 'currency',
                                             currency: 'VND',
                                          }).format(order.total_amount)}
                                       </span>
                                    </p>
                                 </div>
                              </div>
                           </div>
                        ))
                     ) : (
                        <div className="text-center py-8 text-gray-500">
                           <p>Bạn chưa có đơn hàng nào.</p>
                        </div>
                     )}
                  </div>
               </div>
            )}
         </div>
      </div>
   );
}

export default Account;
