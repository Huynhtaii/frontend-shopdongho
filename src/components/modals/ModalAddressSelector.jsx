import { useEffect, useState, useCallback } from 'react';
import { IoMdClose, IoMdAdd } from 'react-icons/io';
import { RiMapPinLine, RiEditLine, RiDeleteBinLine, RiCheckLine } from 'react-icons/ri';
import addressService from '../../services/address_service';
import { toast } from 'react-toastify';

const ModalAddressSelector = ({ isOpen, onClose, userId, onSelect, currentAddressId }) => {
   const [addresses, setAddresses] = useState([]);
   const [loading, setLoading] = useState(false);
   const [showForm, setShowForm] = useState(false);
   const [editingAddress, setEditingAddress] = useState(null);
   const [formData, setFormData] = useState({
      recipient_name: '',
      recipient_phone: '',
      recipient_email: '',
      address: '',
      is_default: false,
   });

   const fetchAddresses = useCallback(async () => {
      if (!userId) return;
      setLoading(true);
      try {
         const res = await addressService.getUserAddresses(userId);
         if (res.EC === 0) {
            setAddresses(res.DT);
         }
      } catch (error) {
         console.error('Fetch addresses error:', error);
      } finally {
         setLoading(false);
      }
   }, [userId]);

   useEffect(() => {
      if (isOpen) {
         fetchAddresses();
         setShowForm(false);
         setEditingAddress(null);
      }
   }, [isOpen, fetchAddresses]);

   const handleInputChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData((prev) => ({
         ...prev,
         [name]: type === 'checkbox' ? checked : value,
      }));
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      try {
         const data = { ...formData, user_id: userId };
         let res;
         if (editingAddress) {
            res = await addressService.updateAddress(editingAddress.id, data);
         } else {
            res = await addressService.createAddress(data);
         }

         if (res.EC === 0) {
            toast.success(editingAddress ? 'Cập nhật địa chỉ thành công' : 'Thêm địa chỉ mới thành công');
            setShowForm(false);
            setEditingAddress(null);
            setFormData({ recipient_name: '', recipient_phone: '', recipient_email: '', address: '', is_default: false });
            fetchAddresses();
         } else {
            toast.error(res.EM);
         }
      } catch (error) {
         toast.error('Có lỗi xảy ra!');
      }
   };

   const handleEdit = (address) => {
      setEditingAddress(address);
      setFormData({
         recipient_name: address.recipient_name,
         recipient_phone: address.recipient_phone,
         recipient_email: address.recipient_email || '',
         address: address.address,
         is_default: address.is_default,
      });
      setShowForm(true);
   };

   const handleDelete = async (id) => {
      if (window.confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) {
         try {
            const res = await addressService.deleteAddress(id);
            if (res.EC === 0) {
               toast.success('Xóa địa chỉ thành công');
               fetchAddresses();
            }
         } catch (error) {
            toast.error('Lỗi khi xóa!');
         }
      }
   };

   const handleSetDefault = async (id) => {
      try {
         const res = await addressService.setDefaultAddress(id, userId);
         if (res.EC === 0) {
            toast.success('Đã đặt làm mặc định');
            fetchAddresses();
         }
      } catch (error) {
         toast.error('Lỗi khi cập nhật!');
      }
   };

   if (!isOpen) return null;

   return (
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
         <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
         
         <div className="relative bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
               <h2 className="text-xl font-bold text-gray-800">Địa chỉ của tôi</h2>
               <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                  <IoMdClose size={24} />
               </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
               {showForm ? (
                  <form onSubmit={handleSubmit} className="space-y-4 animate-fadeIn">
                     <div className="flex items-center gap-2 mb-4 text-blue-600 font-semibold">
                        <RiMapPinLine />
                        <span>{editingAddress ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}</span>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Họ và tên</label>
                           <input
                              required
                              name="recipient_name"
                              value={formData.recipient_name}
                              onChange={handleInputChange}
                              className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                              placeholder="Nhập tên người nhận"
                           />
                        </div>
                        <div>
                           <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Số điện thoại</label>
                           <input
                              required
                              name="recipient_phone"
                              value={formData.recipient_phone}
                              onChange={handleInputChange}
                              className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                              placeholder="Nhập số điện thoại"
                           />
                        </div>
                     </div>
                     <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Email</label>
                        <input
                           type="email"
                           name="recipient_email"
                           value={formData.recipient_email}
                           onChange={handleInputChange}
                           className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                           placeholder="Địa chỉ email (không bắt buộc)"
                        />
                     </div>
                     <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Địa chỉ chi tiết</label>
                        <textarea
                           required
                           name="address"
                           value={formData.address}
                           onChange={handleInputChange}
                           rows={3}
                           className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                           placeholder="Nhập địa chỉ nhận hàng chi tiết"
                        />
                     </div>
                     <div className="flex items-center gap-2">
                        <input
                           type="checkbox"
                           id="is_default"
                           name="is_default"
                           checked={formData.is_default}
                           onChange={handleInputChange}
                           className="w-4 h-4 text-blue-600"
                        />
                        <label htmlFor="is_default" className="text-sm text-gray-600">Đặt làm địa chỉ mặc định</label>
                     </div>
                     <div className="flex gap-3 pt-4">
                        <button
                           type="button"
                           onClick={() => setShowForm(false)}
                           className="flex-1 py-3 px-4 border rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                           Trở lại
                        </button>
                        <button
                           type="submit"
                           className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all"
                        >
                           Hoàn thành
                        </button>
                     </div>
                  </form>
               ) : (
                  <div className="space-y-4">
                     {addresses.length === 0 && !loading && (
                        <div className="text-center py-10 text-gray-500">
                           <RiMapPinLine size={48} className="mx-auto mb-2 opacity-20" />
                           <p>Bạn chưa có địa chỉ nào</p>
                        </div>
                     )}
                     
                     {addresses.map((addr) => (
                        <div
                           key={addr.id}
                           className={`p-4 border-2 rounded-xl transition-all cursor-pointer group hover:border-blue-400 ${
                              currentAddressId === addr.id ? 'border-blue-500 bg-blue-50/30' : 'border-gray-100'
                           }`}
                           onClick={() => onSelect(addr)}
                        >
                           <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center gap-2 font-bold text-gray-800">
                                 {addr.recipient_name}
                                 <span className="text-gray-400 font-normal">|</span>
                                 <span className="text-gray-500 font-medium">{addr.recipient_phone}</span>
                              </div>
                              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                 <button
                                    onClick={(e) => { e.stopPropagation(); handleEdit(addr); }}
                                    className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                                    title="Sửa"
                                 >
                                    <RiEditLine />
                                 </button>
                                 {!addr.is_default && (
                                    <button
                                       onClick={(e) => { e.stopPropagation(); handleDelete(addr.id); }}
                                       className="p-1 text-red-600 hover:bg-red-100 rounded"
                                       title="Xóa"
                                    >
                                       <RiDeleteBinLine />
                                    </button>
                                 )}
                              </div>
                           </div>
                           <div className="text-sm text-gray-600 leading-relaxed mb-3">
                              {addr.address}
                           </div>
                           <div className="flex items-center gap-3">
                              {addr.is_default && (
                                 <span className="px-2 py-0.5 border border-red-500 text-red-500 text-[10px] uppercase font-bold rounded">Mặc định</span>
                              )}
                              {!addr.is_default && (
                                 <button
                                    onClick={(e) => { e.stopPropagation(); handleSetDefault(addr.id); }}
                                    className="text-xs text-gray-500 hover:text-gray-800 underline"
                                 >
                                    Thiết lập mặc định
                                 </button>
                              )}
                              {currentAddressId === addr.id && (
                                 <div className="ml-auto text-blue-600 flex items-center gap-1 text-xs font-bold bg-blue-100 px-2 py-1 rounded-full">
                                    <RiCheckLine /> Đang chọn
                                 </div>
                              )}
                           </div>
                        </div>
                     ))}

                     <button
                        onClick={() => {
                           setEditingAddress(null);
                           setFormData({ recipient_name: '', recipient_phone: '', recipient_email: '', address: '', is_default: false });
                           setShowForm(true);
                        }}
                        className="w-full py-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 font-semibold hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2 group"
                     >
                        <IoMdAdd className="group-hover:scale-110 transition-transform" />
                        Thêm địa chỉ mới
                     </button>
                  </div>
               )}
            </div>
            
            {!showForm && addresses.length > 0 && (
               <div className="p-4 border-t bg-gray-50 flex gap-3">
                  <button
                     onClick={onClose}
                     className="flex-1 py-3 bg-white border border-gray-300 rounded-xl font-bold text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                     Đóng
                  </button>
               </div>
            )}
         </div>
      </div>
   );
};

export default ModalAddressSelector;
