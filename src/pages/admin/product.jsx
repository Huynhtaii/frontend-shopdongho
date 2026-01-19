import React, { useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { FiPlus } from 'react-icons/fi';
import { toast } from 'react-toastify';
import ModalAddUpdateProduct from '../../components/modals/modal_add_update_product';

// Mock data để test
const MOCK_PRODUCTS = [{
    product_id: 201,
    name: "Đồng hồ Xu hướng 2025 - A",
    description: "Thiết kế độc đáo, bắt kịp xu hướng năm 2025",
    price: "600.00",
    discount_price: "580.00",
    rating: 5,
    created_at: "2025-02-24T12:10:32.000Z",
    brand_id: 4,
    sku: "XTD-201",
    ProductImages: [
        {
            product_image_id: 4,
            url: "https://www.watchstore.vn/images/products/2024/06/04/resized/caw211r-fc6401-1_tag-heuer_1717491547.webp",
            product_id: 201
        },
    ]
}];

const ProductAdmin = () => {
    const [products, setProducts] = useState(MOCK_PRODUCTS);
    const [showModal, setShowModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        price: '',
        discount_price: '',
        description: '',
        brand_id: '',
        ProductImages: []
    });
    const [previewImages, setPreviewImages] = useState([]);

    const handleAdd = () => {
        setSelectedProduct(null);
        setFormData({
            name: '',
            sku: '',
            price: '',
            discount_price: '',
            description: '',
            brand_id: '',
            ProductImages: []
        });
        setPreviewImages([]);
        setShowModal(true);
    };

    const handleEdit = (product) => {
        setSelectedProduct(product);
        setFormData(product);
        setPreviewImages(product.ProductImages.map(img => ({
            url: img.url,
            isExisting: true,
            product_image_id: img.product_image_id
        })));
        setShowModal(true);
    };

    const handleDelete = async (productId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
            try {
                // Thêm logic xóa sản phẩm ở đây
                toast.success('Xóa sản phẩm thành công');
            } catch (error) {
                toast.error('Có lỗi xảy ra khi xóa sản phẩm');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log(formData);

            // logic thêm sản phẩm mới
            setShowModal(false);
            toast.success(`${selectedProduct ? 'Cập nhật' : 'Thêm'} sản phẩm thành công`);
        } catch (error) {
            toast.error('Có lỗi xảy ra');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        const newPreviewImages = files.map(file => ({
            url: URL.createObjectURL(file),
            file: file
        }));

        setPreviewImages(newPreviewImages);

        setFormData(prev => ({
            ...prev,
            ProductImages: files
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
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã SP</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên sản phẩm</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giá</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giá KM</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thương hiệu</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {products.map((product) => (
                            <tr key={product.product_id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">{product.sku}</td>
                                <td className="px-6 py-4">{product.name}</td>
                                <td className="px-6 py-4">{product.price}</td>
                                <td className="px-6 py-4">{product.discount_price}</td>
                                <td className="px-6 py-4">{product.brand_id}</td>
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
