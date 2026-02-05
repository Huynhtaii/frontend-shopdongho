import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { FiPlus } from 'react-icons/fi';
import { toast } from 'react-toastify';
import ModalAddUpdateProduct from '../../components/modals/modal_add_update_product';
import ProductService from '../../services/product_service';
import useFormatPrice from '../../hooks/use_formatPrice';

const ProductAdmin = () => {
   const [products, setProducts] = useState([]);
   const [showModal, setShowModal] = useState(false);
   const [selectedProduct, setSelectedProduct] = useState(null);
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
   });
   const { formatPrice } = useFormatPrice();

   const autoSku = () => {
      const randomNumber = Math.floor(1000 + Math.random() * 9000);
      return `SP${randomNumber}`;
   };
   const [previewImages, setPreviewImages] = useState([]);

   const fetchData = async () => {
      try {
         const productsData = await ProductService.getAllProducts();
         setProducts(productsData.DT);
      } catch (error) {
         toast.error('Có lỗi xảy ra khi tải dữ liệu hoá đơn');
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
      });
      setPreviewImages([]);
      setShowModal(true);
   };

   const handleEdit = (product) => {
      setSelectedProduct(product);
      setFormData(product);
      setPreviewImages(
         product.ProductImages.map((img) => ({
            url: img.url,
            isExisting: true,
            product_image_id: img.product_image_id,
         })),
      );
      setShowModal(true);
   };

   const handleDelete = async (productId) => {
      if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
         try {
            await ProductService.deleteProduct(productId);
            toast.success('Xóa sản phẩm thành công');
            fetchData();
         } catch (error) {
            toast.error('Có lỗi xảy ra khi xóa sản phẩm');
         }
      }
   };

   const validateForm = () => {
      if (
         formData.name === '' ||
         formData.price === 0 ||
         formData.description === '' ||
         formData.category_id === 0 ||
         formData.images === ''
      ) {
         toast.error('Vui lòng điền đầy đủ thông tin');
         return false;
      }
      if (formData.discount_price > formData.price) {
         toast.error('Giá khuyến mãi phải nhỏ hơn giá gốc');
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
               await ProductService.createProduct({ ...formData, images: formData.images[0] });
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

      const newPreviewImages = files.map((file) => ({
         url: URL.createObjectURL(file),
         file: file,
      }));

      setPreviewImages(newPreviewImages);

      setFormData((prev) => ({
         ...prev,
         images: files,
      }));
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

         <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
               <thead className="bg-gray-50">
                  <tr>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ảnh</th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã SP</th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên sản phẩm</th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giá</th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giá KM</th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-200">
                  {products.map((product) => (
                     <tr key={product.product_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                           <img
                              src={product.ProductImages[0].url}
                              alt="thumbnail"
                              className="max-w-[50px] object-cover"
                           />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{product.sku}</td>
                        <td className="px-6 py-4">{product.name}</td>
                        <td className="px-6 py-4">{formatPrice(product.price)}</td>
                        <td className="px-6 py-4">{formatPrice(product.discount_price)}</td>
                        <td className="px-6 py-4">
                           <div className="flex gap-2">
                              <button
                                 className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded flex items-center gap-1 transition duration-200"
                                 onClick={() => handleEdit(product)}
                              >
                                 <FaEdit /> Sửa
                              </button>
                              <button
                                 className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1 transition duration-200"
                                 onClick={() => handleDelete(product.product_id)}
                              >
                                 <FaTrash /> Xóa
                              </button>
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>

         {showModal && (
            <ModalAddUpdateProduct
               setShowModal={setShowModal}
               selectedProduct={selectedProduct}
               formData={formData}
               handleInputChange={handleInputChange}
               handleImageChange={handleImageChange}
               handleSubmit={handleSubmit}
               previewImages={previewImages}
            />
         )}
      </div>
   );
};

export default ProductAdmin;
