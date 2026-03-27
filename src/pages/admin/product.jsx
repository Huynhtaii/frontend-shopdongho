import React, { useEffect, useState } from 'react';
import { FaEdit, FaEye, FaEyeSlash, FaStar } from 'react-icons/fa';
import { FiPlus } from 'react-icons/fi';
import { toast } from 'react-toastify';
import ModalAddUpdateProduct from '../../components/modals/modal_add_update_product';
import ModalProductFeedback from '../../components/modals/ModalProductFeedback';
import ProductService from '../../services/product_service';
import useFormatPrice from '../../hooks/use_formatPrice';
import Pagination from '../../components/pagination';

const ProductAdmin = () => {
   const [products, setProducts] = useState([]);
   const [showModal, setShowModal] = useState(false);
   const [showFeedbackModal, setShowFeedbackModal] = useState(false);
   const [selectedProduct, setSelectedProduct] = useState(null);
   const [selectedProductForFeedback, setSelectedProductForFeedback] = useState(null);
   const [formData, setFormData] = useState({
      name: '',
      description: '',
      price: '',
      discount_price: 0,
      rating: 1,
      created_at: new Date().toISOString(),
      brand_id: 1,
      sku: '',
      category_id: 0,
      images: '',
      origin: '',
      target_audience: '',
      product_line: '',
      water_resistance: '',
      movement_type: '',
      glass_material: '',
      strap_material: '',
      case_size: '',
      case_thickness: '',
      utilities: '',
   });
   const { formatPrice } = useFormatPrice();

   // Pagination states
   const [currentPage, setCurrentPage] = useState(1);
   const itemsPerPage = 8;

   const totalPages = Math.ceil(products.length / itemsPerPage);
   const paginatedProducts = products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

   const autoSku = () => {
      const randomNumber = Math.floor(1000 + Math.random() * 9000);
      return `SP${randomNumber}`;
   };
   const [previewImages, setPreviewImages] = useState([]);

   const fetchData = async () => {
      try {
         const productsData = await ProductService.getAllProducts(null, true);
         setProducts(productsData.DT);
      } catch (error) {
         toast.error('Có lỗi xảy ra khi tải dữ liệu sản phẩm');
      }
   };

   useEffect(() => {
      fetchData();
   }, []);

   const handleAdd = () => {
      setSelectedProduct(null);
      setFormData({
         name: '',
         description: '',
         price: '',
         discount_price: 0,
         rating: 1,
         created_at: new Date().toISOString(),
         brand_id: 1,
         sku: autoSku(),
         category_id: 0,
         images: '',
         origin: '',
         target_audience: '',
         product_line: '',
         water_resistance: '',
         movement_type: '',
         glass_material: '',
         strap_material: '',
         case_size: '',
         case_thickness: '',
         utilities: '',
      });
      setPreviewImages([]);
      setShowModal(true);
   };

   const handleEdit = (product) => {
      setSelectedProduct(product);
      // Extra category_id from Categories array if it exists
      const categoryId = product.Categories && product.Categories.length > 0 ? product.Categories[0].category_id : 0;

      setFormData({
         ...product,
         category_id: categoryId,
         images: [], // Reset images to empty when starting edit, but we'll show previews from ProductImages
         keptImageIds: product.ProductImages.map((img) => img.product_image_id),
      });
      setPreviewImages(
         product.ProductImages.map((img) => ({
            url: img.url,
            isExisting: true,
            product_image_id: img.product_image_id,
         })),
      );
      setShowModal(true);
   };

   const handleShowFeedback = (product) => {
      setSelectedProductForFeedback(product);
      setShowFeedbackModal(true);
   };

   const handleToggleStatus = async (product) => {
      const action = product.status === 1 ? 'ẩn' : 'hiện';
      if (window.confirm(`Bạn có chắc chắn muốn ${action} sản phẩm này?`)) {
         try {
            const res = await ProductService.deleteProduct(product.product_id);
            if (res.EC === '0') {
               toast.success(`${action.charAt(0).toUpperCase() + action.slice(1)} sản phẩm thành công`);
               fetchData();
            } else {
               toast.error(res.EM || `${action} sản phẩm thất bại`);
            }
         } catch (error) {
            toast.error(`Có lỗi xảy ra khi ${action} sản phẩm`);
         }
      }
   };

   const validateForm = () => {
      const hasNewImages = Array.isArray(formData.images) ? formData.images.length > 0 : formData.images !== '';
      const hasKeptImages = Array.isArray(formData.keptImageIds) ? formData.keptImageIds.length > 0 : false;

      if (
         formData.name === '' ||
         formData.price === 0 ||
         formData.description === '' ||
         formData.category_id === 0 ||
         (!hasNewImages && !hasKeptImages)
      ) {
         toast.error('Vui lòng điền đầy đủ thông tin');
         return false;
      }
      if (Number(formData.discount_price) >= Number(formData.price)) {
         toast.error('Giá bán khuyến mãi phải nhỏ hơn giá gốc');
         return false;
      }

      return true;
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      if (validateForm()) {
         try {
            if (selectedProduct) {
               await ProductService.updateProduct(selectedProduct.product_id, formData);
            } else {
               await ProductService.createProduct(formData);
            }
            setShowModal(false);
            fetchData();
            toast.success(`${selectedProduct ? 'Cập nhật' : 'Thêm'} sản phẩm thành công`);
         } catch (error) {
            toast.error('Có lỗi xảy ra');
         }
      }
   };

   const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
         ...prev,
         [name]: value,
      }));
   };
   const handleImageChange = (e) => {
      const files = Array.from(e.target.files);

      const newPreviews = files.map((file) => ({
         url: URL.createObjectURL(file),
         file: file,
         isNew: true,
      }));

      setPreviewImages((prev) => [...prev, ...newPreviews]);

      setFormData((prev) => ({
         ...prev,
         images: [...(Array.isArray(prev.images) ? prev.images : []), ...files],
      }));
   };

   const handleRemoveImage = (index) => {
      const imageToRemove = previewImages[index];

      // Remove from previews
      setPreviewImages((prev) => {
         const updated = [...prev];
         updated.splice(index, 1);
         return updated;
      });

      // If it's a newly added file, remove it from formData.images
      if (imageToRemove.isNew) {
         setFormData((prev) => {
            // Find the index of this file in the images array
            // Since we append files in the same order as previews, we need to find the correct file
            const newFilesOnly = previewImages.filter((img) => img.isNew);
            const fileIndexInNewFiles = newFilesOnly.indexOf(imageToRemove);

            const updatedImages = [...prev.images];
            updatedImages.splice(fileIndexInNewFiles, 1);

            return {
               ...prev,
               images: updatedImages,
            };
         });
      } else {
         // If it's an existing image, remove its ID from keptImageIds
         setFormData((prev) => ({
            ...prev,
            keptImageIds: prev.keptImageIds.filter((id) => id !== imageToRemove.product_image_id),
         }));
      }
   };

   return (
      <div className="p-6">
         <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">Quản lý sản phẩm</h1>
            <button
               onClick={handleAdd}
               className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
               <FiPlus /> Thêm sản phẩm
            </button>
         </div>

         <div className="max-w-full overflow-x-auto border border-gray-200 rounded-lg bg-white shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
               <thead className="bg-gray-50">
                  <tr>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ảnh</th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã SP</th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên sản phẩm</th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Danh mục</th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giá</th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giá KM</th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-200">
                  {paginatedProducts.map((product) => (
                     <tr key={product.product_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                           <img
                              src={product.ProductImages[0]?.url}
                              alt="thumbnail"
                              className="max-w-[50px] object-cover"
                           />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{product.sku}</td>
                        <td className="px-6 py-4">{product.name}</td>
                        <td className="px-6 py-4">{product.Categories && product.Categories.length > 0 ? product.Categories[0].name : 'Không có'}</td>
                        <td className="px-6 py-4">{formatPrice(product.price)}</td>
                        <td className="px-6 py-4">{formatPrice(product.discount_price)}</td>
                        <td className="px-6 py-4">
                           <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                 product.status === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}
                           >
                              {product.status === 1 ? 'Đang hiện' : 'Đang ẩn'}
                           </span>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-3">
                              <button
                                 className="group p-2 bg-green-50 text-green-600 hover:bg-green-600 hover:text-white rounded-xl transition-all duration-300 shadow-sm hover:shadow-md hover:scale-110"
                                 onClick={() => handleEdit(product)}
                                 title="Chỉnh sửa sản phẩm"
                              >
                                 <FaEdit size={16} />
                              </button>
                              <button
                                 className={`group p-2 transition-all duration-300 rounded-xl shadow-sm hover:shadow-md hover:scale-110 ${
                                    product.status === 1
                                       ? 'bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white'
                                       : 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white'
                                 }`}
                                 onClick={() => handleToggleStatus(product)}
                                 title={product.status === 1 ? 'Ẩn sản phẩm' : 'Hiện sản phẩm'}
                              >
                                 {product.status === 1 ? (
                                    <FaEyeSlash size={16} />
                                 ) : (
                                    <FaEye size={16} />
                                 )}
                              </button>
                              <button
                                 className="group p-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition-all duration-300 shadow-sm hover:shadow-md hover:scale-110"
                                 onClick={() => handleShowFeedback(product)}
                                 title="Xem đánh giá sản phẩm"
                              >
                                 <FaStar className="text-blue-500 group-hover:text-white transition-colors duration-300" size={16} />
                              </button>
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>

         <Pagination page={currentPage} totalPages={totalPages} setPage={setCurrentPage} />

         {showModal && (
            <ModalAddUpdateProduct
               setShowModal={setShowModal}
               selectedProduct={selectedProduct}
               formData={formData}
               handleInputChange={handleInputChange}
               handleImageChange={handleImageChange}
               handleRemoveImage={handleRemoveImage}
               handleSubmit={handleSubmit}
               previewImages={previewImages}
            />
         )}
         {showFeedbackModal && (
            <ModalProductFeedback
               product={selectedProductForFeedback}
               onClose={() => setShowFeedbackModal(false)}
            />
         )}
      </div>
   );
};

export default ProductAdmin;
