import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaTag } from 'react-icons/fa';
import { FiPlus, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';
import BrandService from '../../services/brand_service';

const EMPTY_FORM = { name: '', description: '', logo_url: '', country: '' };

const BrandAdmin = () => {
   const [brands, setBrands] = useState([]);
   const [showModal, setShowModal] = useState(false);
   const [editingBrand, setEditingBrand] = useState(null);
   const [formData, setFormData] = useState(EMPTY_FORM);
   const [submitting, setSubmitting] = useState(false);

   const fetchBrands = async () => {
      try {
         const res = await BrandService.getAll();
         setBrands(res.DT || []);
      } catch {
         toast.error('Không thể tải danh sách thương hiệu');
      }
   };

   useEffect(() => {
      fetchBrands();
   }, []);

   const handleAdd = () => {
      setEditingBrand(null);
      setFormData(EMPTY_FORM);
      setShowModal(true);
   };

   const handleEdit = (brand) => {
      setEditingBrand(brand);
      setFormData({
         name: brand.name || '',
         description: brand.description || '',
         logo_url: brand.logo_url || '',
         country: brand.country || '',
      });
      setShowModal(true);
   };

   const handleDelete = async (id) => {
      if (!window.confirm('Bạn có chắc chắn muốn xóa thương hiệu này?')) return;
      try {
         const res = await BrandService.delete(id);
         if (res.EC === '0') {
            toast.success('Xóa thương hiệu thành công');
            fetchBrands();
         } else {
            toast.error(res.EM || 'Xóa thương hiệu thất bại');
         }
      } catch {
         toast.error('Có lỗi xảy ra khi xóa thương hiệu');
      }
   };

   const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      if (!formData.name.trim()) {
         toast.error('Vui lòng nhập tên thương hiệu');
         return;
      }
      setSubmitting(true);
      try {
         let res;
         if (editingBrand) {
            res = await BrandService.update(editingBrand.brand_id, formData);
         } else {
            res = await BrandService.create(formData);
         }
         if (res.EC === '0') {
            toast.success(`${editingBrand ? 'Cập nhật' : 'Thêm'} thương hiệu thành công`);
            setShowModal(false);
            fetchBrands();
         } else {
            toast.error(res.EM || 'Có lỗi xảy ra');
         }
      } catch {
         toast.error('Có lỗi xảy ra');
      } finally {
         setSubmitting(false);
      }
   };

   return (
      <div className="p-4 sm:p-6">
         {/* Header */}
         <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <div>
               <h1 className="text-xl sm:text-2xl font-semibold">Quản lý Thương hiệu</h1>
               <p className="text-sm text-gray-500 mt-1">{brands.length} thương hiệu</p>
            </div>
            <button
               onClick={handleAdd}
               className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition"
            >
               <FiPlus /> Thêm thương hiệu
            </button>
         </div>

         {/* Table */}
         <div className="w-full rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
               <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                     <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Logo</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                           Tên thương hiệu
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Xuất xứ</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mô tả</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số SP</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                     {brands.length === 0 ? (
                        <tr>
                           <td colSpan={7} className="px-4 py-10 text-center text-gray-400">
                              <FaTag size={32} className="mx-auto mb-2 opacity-30" />
                              Chưa có thương hiệu nào. Hãy thêm thương hiệu mới.
                           </td>
                        </tr>
                     ) : (
                        brands.map((brand) => (
                           <tr key={brand.brand_id} className="hover:bg-gray-50 transition">
                              <td className="px-4 py-3 text-sm text-gray-700 font-mono">{brand.brand_id}</td>
                              <td className="px-4 py-3">
                                 {brand.logo_url ? (
                                    <img
                                       src={brand.logo_url}
                                       alt={brand.name}
                                       className="w-10 h-10 object-contain rounded border"
                                    />
                                 ) : (
                                    <div className="w-10 h-10 bg-gray-100 rounded border flex items-center justify-center text-gray-300">
                                       <FaTag />
                                    </div>
                                 )}
                              </td>
                              <td className="px-4 py-3 text-sm font-semibold text-gray-800">{brand.name}</td>
                              <td className="px-4 py-3 text-sm text-gray-500">{brand.country || '—'}</td>
                              <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">
                                 {brand.description || '—'}
                              </td>
                              <td className="px-4 py-3 text-sm text-center">
                                 <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">
                                    {brand.products?.length ?? 0} SP
                                 </span>
                              </td>
                              <td className="px-4 py-3 text-right">
                                 <div className="flex gap-2 justify-end">
                                    <button
                                       onClick={() => handleEdit(brand)}
                                       className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded flex items-center gap-1 text-sm transition"
                                    >
                                       <FaEdit />
                                       <span className="hidden sm:inline">Sửa</span>
                                    </button>
                                    <button
                                       onClick={() => handleDelete(brand.brand_id)}
                                       className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded flex items-center gap-1 text-sm transition"
                                    >
                                       <FaTrash />
                                       <span className="hidden sm:inline">Xóa</span>
                                    </button>
                                 </div>
                              </td>
                           </tr>
                        ))
                     )}
                  </tbody>
               </table>
            </div>
         </div>

         {/* Modal */}
         {showModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
               <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-fadeIn">
                  {/* Modal Header */}
                  <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50 rounded-t-2xl">
                     <h2 className="text-lg font-bold text-gray-800">
                        {editingBrand ? 'Cập nhật thương hiệu' : 'Thêm thương hiệu mới'}
                     </h2>
                     <button
                        onClick={() => setShowModal(false)}
                        className="p-2 rounded-full hover:bg-gray-200 transition text-gray-400 hover:text-gray-700"
                     >
                        <FiX size={20} />
                     </button>
                  </div>

                  {/* Modal Body */}
                  <form onSubmit={handleSubmit} className="p-6 space-y-4">
                     {/* Logo Preview */}
                     {formData.logo_url && (
                        <div className="flex justify-center">
                           <img
                              src={formData.logo_url}
                              alt="Logo Preview"
                              className="h-16 object-contain rounded border border-gray-200 p-1"
                              onError={(e) => (e.target.style.display = 'none')}
                           />
                        </div>
                     )}

                     <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                           Tên thương hiệu <span className="text-red-500">*</span>
                        </label>
                        <input
                           type="text"
                           name="name"
                           value={formData.name}
                           onChange={handleInputChange}
                           placeholder="Ví dụ: Casio, Citizen, Seiko..."
                           className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                           required
                        />
                     </div>

                     <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                           Xuất xứ / Quốc gia
                        </label>
                        <input
                           type="text"
                           name="country"
                           value={formData.country}
                           onChange={handleInputChange}
                           placeholder="Ví dụ: Nhật Bản, Thụy Sĩ..."
                           className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                     </div>

                     <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">URL Logo</label>
                        <input
                           type="url"
                           name="logo_url"
                           value={formData.logo_url}
                           onChange={handleInputChange}
                           placeholder="https://..."
                           className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                     </div>

                     <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Mô tả</label>
                        <textarea
                           name="description"
                           value={formData.description}
                           onChange={handleInputChange}
                           placeholder="Giới thiệu ngắn về thương hiệu..."
                           rows={3}
                           className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                        />
                     </div>

                     {/* Actions */}
                     <div className="flex gap-3 justify-end pt-2">
                        <button
                           type="button"
                           onClick={() => setShowModal(false)}
                           className="px-5 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-100 transition"
                        >
                           Hủy
                        </button>
                        <button
                           type="submit"
                           disabled={submitting}
                           className="px-5 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-60"
                        >
                           {submitting ? 'Đang lưu...' : editingBrand ? 'Cập nhật' : 'Thêm mới'}
                        </button>
                     </div>
                  </form>
               </div>
            </div>
         )}
      </div>
   );
};

export default BrandAdmin;
