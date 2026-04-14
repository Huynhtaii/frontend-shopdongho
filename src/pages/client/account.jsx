import { useEffect, useState, useCallback } from 'react';
import { useLocation, Link } from 'react-router-dom';
import AccountService from '../../services/account_service';
import { toast } from 'react-toastify';
import { FiUser, FiPhone, FiMapPin, FiMail, FiShoppingBag, FiEdit3, FiSave } from 'react-icons/fi';
import address_service from '../../services/address_service';
import ModalAddressSelector from '../../components/modals/ModalAddressSelector';

function Account() {
   const id = localStorage.getItem('userId'); // FIX: bỏ useState wrapper
   const location = useLocation();

   const [user, setUser] = useState({
      name: '',
      email: '',
      phone: '',
      address: '',
   });
   const [loading, setLoading] = useState(true);
   const [saving, setSaving] = useState(false);
   const [isEditing, setIsEditing] = useState(false);
   const [activeTab, setActiveTab] = useState(location.state?.tab || 'profile'); // 'profile' or 'addresses'
   const [addresses, setAddresses] = useState([]);
   const [addressLoading, setAddressLoading] = useState(false);
   const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
   const [selectedAddressForEdit, setSelectedAddressForEdit] = useState(null);

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

   const fetchAddresses = useCallback(async () => {
      setAddressLoading(true);
      try {
         const res = await address_service.getUserAddresses(id);
         if (res.EC === 0) {
            setAddresses(res.DT);
         }
      } catch (error) {
         console.error('Fetch addresses error:', error);
      } finally {
         setAddressLoading(false);
      }
   }, [id]);

   useEffect(() => {
      fetchData();
   }, [fetchData]);

   useEffect(() => {
      if (activeTab === 'addresses') {
         fetchAddresses();
      }
   }, [activeTab, fetchAddresses]);

   const validatePhone = (phone) => {
      const phoneRegex = /^(0)[1-9][0-9]{8}$/;
      return phoneRegex.test(phone);
   };

   const handleUpdateInfo = async () => {
      if (!user.phone) {
         toast.error('Số điện thoại không được để trống');
         return;
      }

      if (!validatePhone(user.phone)) {
         toast.error('Số điện thoại không hợp lệ (Phải có 10 chữ số và bắt đầu bằng 0)');
         return;
      }

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
                           <div 
                              onClick={() => setActiveTab('profile')}
                              className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer font-medium text-sm transition-all ${
                                 activeTab === 'profile' ? 'bg-red-50 text-red-600 shadow-sm' : 'text-slate-600 hover:bg-slate-50'
                              }`}
                           >
                              <FiUser size={16} />
                              <span>Thông tin cá nhân</span>
                           </div>
                           <div 
                              onClick={() => setActiveTab('addresses')}
                              className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer font-medium text-sm transition-all ${
                                 activeTab === 'addresses' ? 'bg-red-50 text-red-600 shadow-sm' : 'text-slate-600 hover:bg-slate-50'
                              }`}
                           >
                              <FiMapPin size={16} />
                              <span>Sổ địa chỉ</span>
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
                        <h3 className="font-semibold text-slate-800">{activeTab === 'profile' ? 'Thông tin cá nhân' : 'Sổ địa chỉ'}</h3>
                        {activeTab === 'profile' && (
                           !isEditing ? (
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
                           )
                        )}
                     </div>

                     {activeTab === 'profile' ? (
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
                                 <FiMapPin size={13} /> Địa chỉ chính
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
                     ) : (
                        <div className="p-6">
                           <div className="flex justify-between items-center mb-6">
                              <h4 className="text-sm font-bold text-slate-700 uppercase tracking-tight">Danh sách địa chỉ</h4>
                              <button 
                                 onClick={() => {
                                    setSelectedAddressForEdit(null);
                                    setIsAddressModalOpen(true);
                                 }}
                                 className="px-4 py-2 bg-slate-800 text-white text-xs font-bold rounded-lg hover:bg-slate-900 transition-all shadow-sm flex items-center gap-2"
                              >
                                 + Thêm địa chỉ mới
                              </button>
                           </div>
                           
                           {addressLoading ? (
                              <div className="py-10 flex justify-center">
                                 <div className="w-8 h-8 border-3 border-red-200 border-t-red-600 rounded-full animate-spin" />
                              </div>
                           ) : addresses.length > 0 ? (
                              <div className="space-y-4">
                                 {addresses.map((addr) => (
                                    <div key={addr.id} className="p-4 border border-slate-100 rounded-2xl bg-slate-50/50 hover:bg-white hover:border-red-100 hover:shadow-md transition-all relative overflow-hidden group">
                                       <div className="flex justify-between items-start mb-2">
                                          <div className="flex items-center gap-2">
                                             <span className="font-bold text-slate-800">{addr.recipient_name}</span>
                                             <span className="text-slate-300">|</span>
                                             <span className="text-slate-600 font-medium">{addr.recipient_phone}</span>
                                          </div>
                                          <button 
                                             onClick={() => {
                                                setSelectedAddressForEdit(addr);
                                                setIsAddressModalOpen(true);
                                             }}
                                             className="text-red-600 text-xs font-bold hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
                                          >
                                             Thiết lập
                                          </button>
                                       </div>
                                       <p className="text-sm text-slate-500 leading-relaxed mb-3">{addr.address}</p>
                                       {addr.is_default && (
                                          <span className="inline-block px-2 py-0.5 bg-red-50 text-red-600 text-[10px] font-bold border border-red-100 rounded uppercase">Mặc định</span>
                                       )}
                                    </div>
                                 ))}
                              </div>
                           ) : (
                              <div className="py-12 flex flex-col items-center text-slate-400">
                                 <FiMapPin size={40} className="mb-3 opacity-20" />
                                 <p className="text-sm">Bạn chưa có địa chỉ giao hàng nào</p>
                              </div>
                           )}
                        </div>
                     )}
                  </div>
               </div>
            </div>
         </div>
         <ModalAddressSelector 
            isOpen={isAddressModalOpen}
            onClose={() => setIsAddressModalOpen(false)}
            userId={id}
            onSelect={() => {
               fetchAddresses();
               setIsAddressModalOpen(false);
            }}
            currentAddressId={selectedAddressForEdit?.id}
         />
      </div>
   );
}

export default Account;
