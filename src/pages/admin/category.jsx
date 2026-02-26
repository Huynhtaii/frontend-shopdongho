import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaLayerGroup } from 'react-icons/fa';
import { FiPlus, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';
import CategoryService from '../../services/category_service';

const EMPTY_FORM = { name: '', description: '', image: '', imageFile: null };

const CategoryAdmin = () => {
   const [categories, setCategories] = useState([]);
   const [showModal, setShowModal] = useState(false);
   const [editingCategory, setEditingCategory] = useState(null);
   const [formData, setFormData] = useState(EMPTY_FORM);
   const [submitting, setSubmitting] = useState(false);
   const [previewImage, setPreviewImage] = useState(null);

   const fetchCategories = async () => {
      try {
         const res = await CategoryService.getAll();
         setCategories(res.DT || []);
      } catch {
         toast.error('Không thể tải danh sách danh mục');
      }
   };

   useEffect(() => {
      fetchCategories();
   }, []);

   const getImageUrl = (imagePath) => {
      if (!imagePath) return null;
      if (imagePath.startsWith('http')) return imagePath;
      return `${process.env.REACT_APP_API_URL}${imagePath}`;
   };

   const handleAdd = () => {
      setEditingCategory(null);
      setFormData(EMPTY_FORM);
      setPreviewImage(null);
      setShowModal(true);
   };

   const handleEdit = (category) => {
      setEditingCategory(category);
      setFormData({
         name: category.name || '',
         description: category.description || '',
         image: category.image || '',
         imageFile: null,
      });
      setPreviewImage(category.image ? getImageUrl(category.image) : null);
      setShowModal(true);
   };

   const handleDelete = async (id) => {
      if (!window.confirm('Bạn có chắc chắn muốn xóa danh mục này?')) return;
      try {
         const res = await CategoryService.delete(id);
         if (res.EC === '0') {
            toast.success('Xóa danh mục thành công');
            fetchCategories();
         } else {
            toast.error(res.EM || 'Xóa danh mục thất bại');
         }
      } catch {
         toast.error('Có lỗi xảy ra khi xóa danh mục');
      }
   };

   const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
   };

   const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
         setFormData((prev) => ({ ...prev, imageFile: file }));
         setPreviewImage(URL.createObjectURL(file));
      }
   };

   const handleRemoveImage = () => {
      setFormData((prev) => ({ ...prev, imageFile: null, image: '' }));
      setPreviewImage(null);
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      if (!formData.name.trim()) {
         toast.error('Vui lòng nhập tên danh mục');
         return;
      }
      setSubmitting(true);
      try {
         let res;
         if (editingCategory) {
            res = await CategoryService.update(editingCategory.category_id, formData);
         } else {
            res = await CategoryService.create(formData);
         }
         if (res.EC === '0') {
            toast.success(`${editingCategory ? 'Cập nhật' : 'Thêm'} danh mục thành công`);
            setShowModal(false);
            fetchCategories();
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
               <h1 className="text-xl sm:text-2xl font-semibold">Quản lý Danh mục</h1>
               <p className="text-sm text-gray-500 mt-1">{categories.length} danh mục</p>
            </div>
            <button
               onClick={handleAdd}
               className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition"
            >
               <FiPlus /> Thêm danh mục
            </button>
         </div>

         {/* Table */}
         <div className="w-full rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
               <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                     <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hình ảnh</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                           Tên danh mục
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mô tả</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                     {categories.length === 0 ? (
                        <tr>
                           <td colSpan={5} className="px-4 py-10 text-center text-gray-400">
                              <FaLayerGroup size={32} className="mx-auto mb-2 opacity-30" />
                              Chưa có danh mục nào. Hãy thêm danh mục mới.
                           </td>
                        </tr>
                     ) : (
                        categories.map((category) => (
                           <tr key={category.category_id} className="hover:bg-gray-50 transition">
                              <td className="px-4 py-3 text-sm text-gray-700 font-mono">{category.category_id}</td>
                              <td className="px-4 py-3">
                                 {category.image ? (
                                    <img
                                       src={getImageUrl(category.image)}
                                       alt={category.name}
                                       className="w-12 h-12 object-cover rounded-lg border"
                                    />
                                 ) : (
                                    <div className="w-12 h-12 bg-gray-100 rounded-lg border flex items-center justify-center text-gray-300">
                                       <FaLayerGroup size={20} />
                                    </div>
                                 )}
                              </td>
                              <td className="px-4 py-3 text-sm font-semibold text-gray-800">{category.name}</td>
                              <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">
                                 {category.description || '—'}
                              </td>
                              <td className="px-4 py-3 text-right">
                                 <div className="flex gap-2 justify-end">
                                    <button
                                       onClick={() => handleEdit(category)}
                                       className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded flex items-center gap-1 text-sm transition"
                                    >
                                       <FaEdit />
                                       <span className="hidden sm:inline">Sửa</span>
                                    </button>
                                    <button
                                       onClick={() => handleDelete(category.category_id)}
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
                        {editingCategory ? 'Cập nhật danh mục' : 'Thêm danh mục mới'}
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
                     <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                           Tên danh mục <span className="text-red-500">*</span>
                        </label>
                        <input
                           type="text"
                           name="name"
                           value={formData.name}
                           onChange={handleInputChange}
                           placeholder="Ví dụ: Đồng hồ nam, Đồng hồ nữ..."
                           className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                           required
                        />
                     </div>

                     {/* Image Upload */}
                     <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                           Hình ảnh danh mục
                        </label>
                        {previewImage ? (
                           <div className="relative inline-block group">
                              <img
                                 src={previewImage}
                                 alt="Preview"
                                 className="w-24 h-24 object-cover rounded-xl border-2 border-gray-200 shadow-sm"
                              />
                              <button
                                 type="button"
                                 onClick={handleRemoveImage}
                                 className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 shadow-lg z-10"
                                 title="Xóa ảnh"
                              >
                                 ✕
                              </button>
                           </div>
                        ) : (
                           <input
                              type="file"
                              onChange={handleImageChange}
                              className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer border border-dashed border-gray-300 p-2 rounded-lg"
                              accept="image/jpeg,image/jpg,image/png,image/webp"
                           />
                        )}
                     </div>

                     <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Mô tả</label>
                        <textarea
                           name="description"
                           value={formData.description}
                           onChange={handleInputChange}
                           placeholder="Mô tả ngắn về danh mục..."
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
                           {submitting ? 'Đang lưu...' : editingCategory ? 'Cập nhật' : 'Thêm mới'}
                        </button>
                     </div>
                  </form>
               </div>
            </div>
         )}
      </div>
   );
};

export default CategoryAdmin;
