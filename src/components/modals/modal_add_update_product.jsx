import { useEffect, useState } from 'react';
import CategoryService from '../../services/category_service';
import { toast } from 'react-toastify';
import numberToWords from '../../utils/convertNumberToWords';

const ModalAddUpdateProduct = ({
   setShowModal,
   selectedProduct,
   formData,
   handleInputChange,
   handleImageChange,
   handleSubmit,
   previewImages,
}) => {
   const [categories, setCategories] = useState([]);

   const formatPriceInput = (price) => {
      if (!price) return '';
      return Math.round(parseFloat(price)).toString();
   };

   useEffect(() => {
      const fetchData = async () => {
         try {
            const categoriesData = await CategoryService.getAllCategories();
            setCategories(categoriesData.DT);
         } catch (error) {
            toast.error('Có lỗi xảy ra khi tải dữ loại sản phẩm');
         }
      };
      fetchData();
   }, []);

   return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
         <div className="bg-white rounded-2xl w-full max-w-6xl shadow-2xl flex flex-col overflow-hidden animate-modalScale">
            {/* Header */}
            <div className="px-8 py-5 border-b bg-gray-50/50 flex justify-between items-center">
               <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                     {selectedProduct ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">Vui lòng điền đầy đủ các thông tin cần thiết bên dưới</p>
               </div>
               <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400 hover:text-gray-600"
               >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
               </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8 space-y-8 overflow-y-auto custom-scrollbar">
               {/* Phần 1: Thông tin cơ bản - 4 Cột */}
               <div className="space-y-4">
                  <h3 className="text-sm font-bold text-blue-600 uppercase tracking-wider flex items-center gap-2">
                     <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                     Thông tin cơ bản
                  </h3>
                  <div className="grid grid-cols-4 gap-6">
                     <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Mã sản phẩm</label>
                        <div className="px-4 py-2.5 bg-gray-100 rounded-lg border border-gray-200 text-gray-600 font-mono text-sm shadow-sm">
                           {formData.sku || 'Tự động tạo'}
                        </div>
                     </div>
                     <div className="col-span-1">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Tên sản phẩm</label>
                        <input
                           type="text"
                           name="name"
                           value={formData.name}
                           onChange={handleInputChange}
                           className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm"
                           placeholder="Nhập tên sản phẩm..."
                        />
                     </div>
                     <div className="relative">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Giá gốc (VNĐ)</label>
                        <input
                           type="number"
                           name="price"
                           value={formatPriceInput(formData.price)}
                           onChange={handleInputChange}
                           className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                           placeholder="9.999.999"
                        />
                        {formData.price && (
                           <p className="absolute -bottom-5 left-0 text-[10px] text-red-500 truncate w-full italic px-1">
                              {numberToWords(parseInt(formData.price))}
                           </p>
                        )}
                     </div>
                     <div className="relative">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Giá khuyến mãi</label>
                        <input
                           type="number"
                           name="discount_price"
                           value={formatPriceInput(formData.discount_price)}
                           onChange={handleInputChange}
                           className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                           placeholder="8.999.999"
                        />
                        {formData.discount_price && (
                           <p className="absolute -bottom-5 left-0 text-[10px] text-red-500 truncate w-full italic px-1">
                              {numberToWords(parseInt(formData.discount_price))}
                           </p>
                        )}
                     </div>
                  </div>
               </div>

               {/* Phần 2: Phân loại & Hình ảnh - 4 Cột */}
               <div className="grid grid-cols-4 gap-6 items-start">
                  <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Danh mục</label>
                     <select
                        name="category_id"
                        value={formData.category_id}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer bg-white shadow-sm"
                     >
                        <option value={0}>Chọn danh mục</option>
                        {categories?.map((category) => (
                           <option key={category.category_id} value={category.category_id}>
                              {category.name}
                           </option>
                        ))}
                     </select>
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Hình ảnh sản phẩm</label>
                     {!selectedProduct && (
                        <input
                           type="file"
                           name="images"
                           multiple
                           onChange={handleImageChange}
                           className="w-full text-[10px] text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-[10px] file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer shadow-sm border border-dashed border-gray-300 p-1.5 rounded-lg"
                           accept="image/*"
                        />
                     )}
                  </div>
                  <div className="col-span-2">
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Mô tả ngắn</label>
                     <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none resize-none shadow-sm"
                        rows="1"
                        placeholder="Nhập mô tả sản phẩm (Ví dụ: Chịu nước tốt, mặt sapphire...)"
                     ></textarea>
                  </div>
               </div>

               {/* Phần 3: Thông số kỹ thuật - 5 Cột */}
               <div className="space-y-4 border-t pt-6">
                  <h3 className="text-sm font-bold text-blue-600 uppercase tracking-wider flex items-center gap-2">
                     <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                     Thông số kỹ thuật chi tiết
                  </h3>
                  <div className="grid grid-cols-5 gap-4">
                     {[
                        { label: 'Xuất xứ', name: 'origin', placeholder: 'Ví dụ: Nhật Bản' },
                        { label: 'Đối tượng', name: 'target_audience', placeholder: 'Nam / Nữ' },
                        { label: 'Dòng sản phẩm', name: 'product_line', placeholder: 'Ví dụ: G-Shock' },
                        { label: 'Kháng nước', name: 'water_resistance', placeholder: '5 ATM / 50m' },
                        { label: 'Loại máy', name: 'movement_type', placeholder: 'Pin / Quartz' },
                        { label: 'Chất liệu kính', name: 'glass_material', placeholder: 'Sapphire / Hardlex' },
                        { label: 'Chất liệu dây', name: 'strap_material', placeholder: 'Thép / Cao su' },
                        { label: 'Size mặt', name: 'case_size', placeholder: '40mm' },
                        { label: 'Độ dày', name: 'case_thickness', placeholder: '12mm' },
                        { label: 'Tiện ích', name: 'utilities', placeholder: 'Lịch ngày, Báo thức...' },
                     ].map((field) => (
                        <div key={field.name}>
                           <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
                              {field.label}
                           </label>
                           <input
                              type="text"
                              name={field.name}
                              value={formData[field.name]}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 text-xs rounded border border-gray-300 focus:border-blue-500 outline-none shadow-sm transition-all"
                              placeholder={field.placeholder}
                           />
                        </div>
                     ))}
                  </div>
               </div>

               {/* Xem trước ảnh (Chỉ khi thêm mới) */}
               {previewImages?.length > 0 && !selectedProduct && (
                  <div className="pt-2 animate-fadeIn">
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                        Xem trước hình ảnh ({previewImages.length})
                     </label>
                     <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                        {previewImages.map((img, index) => (
                           <div key={index} className="flex-shrink-0 group relative">
                              <img
                                 src={img.url}
                                 alt={`Preview ${index}`}
                                 className="w-16 h-16 object-cover rounded-lg border-2 border-gray-100 shadow-sm"
                              />
                              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"></div>
                           </div>
                        ))}
                     </div>
                  </div>
               )}
            </form>

            {/* Footer */}
            <div className="px-8 py-5 border-t bg-gray-50/80 flex justify-end gap-3">
               <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-bold text-sm hover:bg-white hover:shadow-sm transition-all active:scale-95"
               >
                  Hủy bỏ
               </button>
               <button
                  onClick={handleSubmit}
                  className="px-8 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-bold text-sm hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-200 transition-all active:scale-95"
               >
                  {selectedProduct ? 'Cập nhật sản phẩm' : 'Lưu sản phẩm'}
               </button>
            </div>
         </div>
      </div>
   );
};

export default ModalAddUpdateProduct;
