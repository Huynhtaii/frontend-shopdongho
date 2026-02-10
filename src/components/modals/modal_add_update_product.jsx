import { useEffect, useState } from 'react';
import CategoryService from '../../services/category_service';
import { toast } from 'react-toastify';
import useFormatPrice from '../../hooks/use_formatPrice';

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
   const { formatPrice } = useFormatPrice();

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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
                <h2 className="text-xl font-semibold mb-4">
                    {selectedProduct ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Mã sản phẩm</label>
                            <span
                                className="mt-1 block w-full text-[#b3b3b3] rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            >
                                {formData.sku}
                            </span>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tên sản phẩm</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                placeholder="Nhập tên sản phẩm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Giá</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                placeholder="Nhập giá"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Giá khuyến mãi</label>
                            <input
                                type="number"
                                name="discount_price"
                                value={formData.discount_price}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                placeholder="Nhập giá khuyến mãi"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Danh mục</label>
                            <select
                                name="category_id"
                                value={formData.Categories?.[0]?.category_id}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            >
                                <option value={0}>Chọn danh mục</option>
                                {categories?.map(category => (
                                    <option
                                        key={category.category_id}
                                        value={category.category_id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {!selectedProduct && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Hình ảnh sản phẩm</label>
                                <span className="text-xs text-[#b0b0b0]">Chỉ hổ trợ file (jpeg, jpg, png, webp)</span>
                                <input
                                    type="file"
                                    name="images"
                                    multiple
                                    onChange={handleImageChange}
                                    className="mt-1 block w-full text-sm text-gray-500
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-md file:border-0
                                        file:text-sm file:font-semibold
                                        file:bg-blue-50 file:text-blue-700
                                        hover:file:bg-blue-100"
                           accept="image/*"
                        />
                     </div>
                  )}
                  <div className="col-span-2">
                     <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                     <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        rows="3"
                        placeholder="Nhập mô tả sản phẩm"
                     ></textarea>
                  </div>
                  {previewImages?.length > 0 && !selectedProduct && (
                     <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Xem trước hình ảnh</label>
                        <div className="grid grid-cols-4 gap-4">
                           <div key={previewImages[0].product_image_id} className="relative">
                              <img
                                 src={previewImages[0].url}
                                 alt={`Preview ${previewImages[0].product_image_id}`}
                                 className="w-full h-24 object-cover rounded-lg"
                              />
                           </div>
                        </div>
                     </div>
                  )}
               </div>
               <div className="flex justify-end gap-4 mt-6">
                  <button
                     type="button"
                     onClick={() => setShowModal(false)}
                     className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                     Hủy
                  </button>
                  <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                     {selectedProduct ? 'Cập nhật' : 'Thêm mới'}
                  </button>
               </div>
            </form>
         </div>
      </div>
   );
};

export default ModalAddUpdateProduct;
