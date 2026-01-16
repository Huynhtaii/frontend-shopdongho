import React, { useEffect, useState } from "react";
import { RiShoppingCart2Line, RiHeartLine } from "react-icons/ri";
import { useParams } from "react-router-dom";
import getProductById from "../../services/product_service";
import { FaStar } from "react-icons/fa";

function ProductDetail() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  // Định nghĩa hàm addRecentProduct trước khi sử dụng
  const addRecentProduct = (productId) => {
    // Lấy mảng đã lưu từ localStorage, nếu chưa có thì khởi tạo là mảng rỗng
    const stored = localStorage.getItem("recentProduct");
    let recentProducts = stored ? JSON.parse(stored) : [];

    // Nếu sản phẩm đã có trong mảng thì loại bỏ đi để sau đó thêm lại ở đầu
    recentProducts = recentProducts.filter((id) => id !== productId);

    // Thêm sản phẩm mới vào đầu mảng
    recentProducts.unshift(productId);

    // Giới hạn mảng tối đa 8 phần tử
    if (recentProducts.length > 8) {
      recentProducts = recentProducts.slice(0, 8);
    }

    // Lưu lại vào localStorage
    localStorage.setItem("recentProduct", JSON.stringify(recentProducts));
    console.log(JSON.parse(localStorage.getItem("recentProduct")));
  };

  const fetchProductById = async () => {
    try {
      setLoading(true);
      const response = await getProductById(id);
      if (response.EC === "0") {
        setProduct(response.DT);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductById();
    addRecentProduct(id);
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!product) {
    return <div>Không tìm thấy sản phẩm</div>;
  }

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <FaStar
        key={index}
        className={`${index < rating ? "text-yellow-400" : "text-gray-300"} inline-block`}
      />
    ));
  };

  const calculateDiscount = (original, discounted) => {
    const originalPrice = parseFloat(original);
    const discountPrice = parseFloat(discounted);
    return Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
  };

  return (
    <div className="layout-container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Ảnh sản phẩm */}
        <div className="md:w-1/2">
          <div className="bg-white p-4 rounded-lg shadow">
            <img
              src={product.ProductImages[0]?.url}
              alt={product.name}
              className="w-full object-contain"
            />
          </div>
        </div>

        {/* Thông tin sản phẩm */}
        <div className="md:w-1/2">
          <h1 className="text-2xl font-semibold mb-4">{product.name}</h1>

          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center">
              {renderStars(product.rating)}
              <span className="ml-2">{product.rating}/5</span>
            </div>
            <div className="text-gray-500">SKU: {product.sku}</div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-red-600">
                {parseFloat(product.discount_price).toLocaleString()}đ
              </span>
              <span className="text-gray-500 line-through">
                {parseFloat(product.price).toLocaleString()}đ
              </span>
              <span className="text-red-600 bg-red-50 px-2 py-1 rounded">
                -{calculateDiscount(product.price, product.discount_price)}%
              </span>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-4 mb-2">
              <span className="text-gray-500 w-24">Danh mục:</span>
              <span>{product.Categories[0]?.name}</span>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-gray-500 w-24">Mô tả:</span>
              <span>{product.description}</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button className="flex-1 bg-red-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-red-700 transition-colors">
              <RiShoppingCart2Line size={20} />
              Thêm vào giỏ hàng
            </button>
            <button className="w-12 h-12 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
              <RiHeartLine size={20} />
            </button>
          </div>

          {/* Cam kết */}
          <div className="mt-8 bg-white p-4 rounded-lg border">
            <h3 className="font-semibold mb-4">CAM KẾT CỦA WATCHSTORE.VN</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Bảo hành chính hãng {product.name}
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Không bán hàng fake, chỉ bán hàng chính hãng
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Freeship toàn quốc, thanh toán khi nhận hàng
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
