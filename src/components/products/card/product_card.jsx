import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// import ProductService from "../../../services/product_service";
import { FaStar } from "react-icons/fa";
import { MdFavoriteBorder } from "react-icons/md";

const ProductCard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    try {
      setLoading(true);
      // const data = await ProductService.getAllProducts();
      // setProducts(data);
      setError(null);
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra khi tải sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <Link
          key={product.id}
          to={`/product/${product.id}`}
          className="bg-white rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <div className="p-4">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-contain mb-4"
            />
            <h3 className="text-sm font-medium mb-2 line-clamp-2">
              {product.name}
            </h3>
            <div className="flex justify-between items-baseline">
              <span className="text-red-600 font-bold">
                {product.price.toLocaleString()}đ
              </span>
              {product.originalPrice && (
                <span className="text-gray-500 text-sm line-through">
                  {product.originalPrice.toLocaleString()}đ
                </span>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProductCard;
