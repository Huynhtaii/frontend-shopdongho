import React, { useEffect, useState, useContext, useCallback } from 'react';
import { Link } from 'react-router-dom';
import AccountService from '../../services/account_service';
import { toast } from 'react-toastify';
import AuthContext from '../../context/auth.context';
import { FiUser, FiPhone, FiMapPin, FiMail, FiShoppingBag, FiEdit3, FiSave } from 'react-icons/fi';

function Account() {
   const id = localStorage.getItem('userId'); // FIX: bỏ useState wrapper
   const { auth } = useContext(AuthContext);

   const [user, setUser] = useState({
      name: '',
      email: '',
      phone: '',
      address: '',
   });
   const [loading, setLoading] = useState(true);
   const [saving, setSaving] = useState(false);
   const [isEditing, setIsEditing] = useState(false);

   const fetchData = useCallback(async () => {
      try {
         const response = await AccountService.getInforAccount(id);
         if (response?.EC === '0') {
            setUser({
               name: response.DT.name || '',
               email: response.DT.email || '',
               phone: response.DT.phone || '',
               address: response.DT.address || '',
            });
         }
      } catch (error) {
         console.error('Lỗi khi lấy dữ liệu tài khoản:', error);
      } finally {
         setLoading(false);
      }
   }, [id]);

   useEffect(() => {
      fetchData();
   }, [fetchData]);

   const handleUpdateInfo = async () => {
      setSaving(true);
      try {
         const response = await AccountService.updateInforAccount(id, user);
         if (response?.EC === '0') {
            toast.success('Cập nhật thông tin thành công!');
            setIsEditing(false);
            fetchData();
         } else {
            toast.error(response?.EM || 'Có lỗi xảy ra khi cập nhật');
         }
      } catch (error) {
         toast.error('Cập nhật thông tin thất bại, vui lòng thử lại!');
      } finally {
         setSaving(false);
      }
   };

   const getInitials = (name) => {
      if (!name) return '?';
      return name
         .split(' ')
         .map((w) => w[0])
         .join('')
         .toUpperCase()
         .slice(0, 2);
   };

   if (loading) {
      return (
         <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
               <div className="w-10 h-10 rounded-full border-4 border-red-200 border-t-red-600 animate-spin" />
               <p className="text-slate-500 text-sm">Đang tải thông tin...</p>
            </div>
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50 py-10 px-4">
         <div className="layout-container">
            {/* Header */}
            <div className="mb-8 text-center">
               <h1 className="text-3xl font-bold text-slate-800">Tài khoản của tôi</h1>
               <p className="text-slate-500 mt-1 text-sm">Quản lý thông tin cá nhân của bạn</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {/* Sidebar card */}
               <div className="md:col-span-1">
                  <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                     {/* gradient header */}
                     <div className="bg-gradient-to-br from-red-500 to-rose-600 p-6 flex flex-col items-center">
                        <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/50 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                           {getInitials(user.name)}
                        </div>
                        <h2 className="mt-3 text-white font-semibold text-lg leading-tight text-center">
                           {user.name || 'Người dùng'}
                        </h2>
                        <p className="text-red-100 text-xs mt-1 truncate max-w-full px-2">{user.email}</p>
                     </div>

                     {/* Nav links */}
                     <div className="p-3">
                        <div className="flex flex-col gap-1">
                           <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 text-red-600 font-medium text-sm">
                              <FiUser size={16} />
                              <span>Thông tin cá nhân</span>
                           </div>
                           <Link
                              to="/orders"
                              className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors text-sm font-medium"
                           >
                              <FiShoppingBag size={16} />
                              <span>Lịch sử mua hàng</span>
                           </Link>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Main form card */}
               <div className="md:col-span-2">
                  <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                     <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                        <h3 className="font-semibold text-slate-800">Thông tin cá nhân</h3>
                        {!isEditing ? (
                           <button
                              onClick={() => setIsEditing(true)}
                              className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
                           >
                              <FiEdit3 size={15} />
                              Chỉnh sửa
                           </button>
                        ) : (
                           <button
                              onClick={() => {
                                 setIsEditing(false);
                                 fetchData();
                              }}
                              className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
                           >
                              Hủy
                           </button>
                        )}
                     </div>

                     <div className="p-6 space-y-5">
                        {/* Email (disabled) */}
                        <div>
                           <label className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                              <FiMail size={13} /> Email
                           </label>
                           <div
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 text-sm cursor-not-allowed select-none"
                              onClick={() => toast.info('Email không thể thay đổi')}
                           >
                              {user.email || 'Chưa có email'}
                           </div>
                        </div>

                        {/* Tên */}
                        <div>
                           <label className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                              <FiUser size={13} /> Họ và tên
                           </label>
                           <input
                              type="text"
                              disabled={!isEditing}
                              className={`w-full px-4 py-3 border rounded-xl text-sm transition-all outline-none ${
                                 isEditing
                                    ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100 bg-white'
                                    : 'border-slate-200 bg-slate-50 text-slate-600 cursor-default'
                              }`}
                              placeholder="Nhập họ và tên"
                              value={user.name}
                              onChange={(e) => setUser({ ...user, name: e.target.value })}
                           />
                        </div>

                        {/* SĐT */}
                        <div>
                           <label className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                              <FiPhone size={13} /> Số điện thoại
                           </label>
                           <input
                              type="text"
                              disabled={!isEditing}
                              className={`w-full px-4 py-3 border rounded-xl text-sm transition-all outline-none ${
                                 isEditing
                                    ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100 bg-white'
                                    : 'border-slate-200 bg-slate-50 text-slate-600 cursor-default'
                              }`}
                              placeholder="Nhập số điện thoại"
                              value={user.phone}
                              onChange={(e) => setUser({ ...user, phone: e.target.value })}
                           />
                        </div>

                        {/* Địa chỉ */}
                        <div>
                           <label className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                              <FiMapPin size={13} /> Địa chỉ
                           </label>
                           <input
                              type="text"
                              disabled={!isEditing}
                              className={`w-full px-4 py-3 border rounded-xl text-sm transition-all outline-none ${
                                 isEditing
                                    ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100 bg-white'
                                    : 'border-slate-200 bg-slate-50 text-slate-600 cursor-default'
                              }`}
                              placeholder="Nhập địa chỉ"
                              value={user.address}
                              onChange={(e) => setUser({ ...user, address: e.target.value })}
                           />
                        </div>

                        {/* Save button */}
                        {isEditing && (
                           <div className="pt-2">
                              <button
                                 onClick={handleUpdateInfo}
                                 disabled={saving}
                                 className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-semibold rounded-xl shadow-md shadow-red-200 transition-all disabled:opacity-60"
                              >
                                 {saving ? (
                                    <>
                                       <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                       Đang lưu...
                                    </>
                                 ) : (
                                    <>
                                       <FiSave size={16} />
                                       Lưu thay đổi
                                    </>
                                 )}
                              </button>
                           </div>
                        )}
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}

export default Account;
