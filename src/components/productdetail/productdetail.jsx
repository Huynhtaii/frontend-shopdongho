import React from "react";
import { RiShoppingCart2Line, RiHeartLine } from "react-icons/ri";

function ProductDetail() {
  // Data mẫu - sau này sẽ lấy từ API
  const product = {
    id: 1,
    name: "Casio Nam AE-1200WHD-1AVDF - Đồng Hồ Pin/Quartz Nam Dây Thép Không Gỉ",
    price: 1129000,
    originalPrice: 1506000,
    discount: 25,
    brand: "Casio",
    origin: "Nhật",
    image: "/images/casio-ae1200.jpg",
    sold: 1522,
    rating: 4.9,
    stock: true,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Ảnh sản phẩm */}
        <div className="md:w-1/2">
          <div className="bg-white p-4 rounded-lg shadow">
            <img
              src={product.image}
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
              <span className="text-yellow-400">★</span>
              <span className="ml-1">{product.rating}</span>
            </div>
            <div className="text-gray-500">Đã bán {product.sold}</div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-red-600">
                {product.price.toLocaleString()}đ
              </span>
              <span className="text-gray-500 line-through">
                {product.originalPrice.toLocaleString()}đ
              </span>
              <span className="text-red-600 bg-red-50 px-2 py-1 rounded">
                -{product.discount}%
              </span>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-4 mb-2">
              <span className="text-gray-500 w-24">Thương hiệu:</span>
              <span>{product.brand}</span>
            </div>
            <div className="flex items-center gap-4 mb-2">
              <span className="text-gray-500 w-24">Xuất xứ:</span>
              <span>{product.origin}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-500 w-24">Tình trạng:</span>
              <span
                className={product.stock ? "text-green-600" : "text-red-600"}
              >
                {product.stock ? "Còn hàng" : "Hết hàng"}
              </span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button className="flex-1 bg-red-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-red-700">
              <RiShoppingCart2Line size={20} />
              Mua ngay
            </button>
            <button className="w-12 h-12 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50">
              <RiHeartLine size={20} />
            </button>
          </div>

          {/* Cam kết */}
          <div className="mt-8 bg-white p-4 rounded-lg border">
            <h3 className="font-semibold mb-4">CAM KẾT CỦA WATCHSTORE.VN</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Bảo hành máy 5 năm toàn quốc, thủ tục nhanh gọn
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
