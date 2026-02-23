import { Link, useNavigate } from 'react-router-dom';

import { IoCloseSharp } from 'react-icons/io5';
import { FaStar } from 'react-icons/fa';
import { useFavorite } from '../../../context/favorite_context';
import { useCart } from '../../../context/cart_context';

const ProductFavoriteCard = ({ product }) => {
   const navigate = useNavigate();
   const { addAndRemoveToFavorite } = useFavorite();
   const { addToCart } = useCart();
   const handleAddToCart = async () => {
      const cart_item = {
         product_id: product.product_id,
         quantity: 1,
         created_at: new Date().toISOString(),
      };
      await addToCart(cart_item);
   };
   return (
      <div className="bg-white px-3 pt-3 rounded-md border-[1px] border-[#e7e7e7]">
         <div className="relative">
            <Link to={`/product/${product.product_id}`}>
               <img src={product.ProductImages[0]?.url} alt="" className="w-full object-cover" />
            </Link>
         </div>
         <div className="mt-3">
            <Link to={`/product/${product.product_id}`}>
               <h3 className="text-[14px] font-[500] text-[#626262] hover:text-[#2054ad] duration-100 line-clamp-1">
                  {product.name}
               </h3>
            </Link>
            <p className="text-[#ed1c24] font-[600] text-[18px]">
               {product.discount_price?.toLocaleString() || product.price?.toLocaleString()}đ
            </p>
            {product.discount_price && (
               <div className="flex items-center gap-3">
                  <p className="text-[14px] font-[500] line-through text-[#939393]">
                     {product.price?.toLocaleString()}đ
                  </p>
                  <span className="text-xs text-[#ef5555] bg-[#f9e9e2]">
                     {Math.round(((product.price - product.discount_price) / product.price) * 100)}%
                  </span>
               </div>
            )}
         </div>
         <p className="flex gap-1 items-center text-[13px] pt-3">
            <FaStar className="fill-[#f7c709]" />
            <span className="text-[#626262] mt-[1px]">{product.rating}</span>
         </p>
         <div className="flex flex-col py-3 text-[14px]">
            <button onClick={handleAddToCart} className="bg-blue-600 p-2 text-center rounded-md text-white">
               Mua ngay
            </button>
            <button
               className="p-2 rounded-md text-gray-500 flex items-center gap-1 justify-center"
               onClick={() => addAndRemoveToFavorite(product)}
            >
               <IoCloseSharp size={20} />
               Xoá sản phẩm
            </button>
         </div>
      </div>
   );
};

export default ProductFavoriteCard;
