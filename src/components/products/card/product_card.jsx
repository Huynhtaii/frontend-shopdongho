import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import { MdFavoriteBorder } from 'react-icons/md';
import { IoAdd } from 'react-icons/io5';
import { RiShoppingCart2Line } from 'react-icons/ri';
import { useFavorite } from '../../../context/favorite_context';
import { useCompare } from '../../../context/compare_context';
import { useCart } from '../../../context/cart_context';
import useFormatPrice from '../../../hooks/use_formatPrice';

const ProductCard = ({ data }) => {
   const { addAndRemoveToFavorite, findFavorite } = useFavorite();
   const { addToCompare, compareList } = useCompare();
   const { addToCart } = useCart();
   const [isFavorite, setIsFavorite] = useState(findFavorite(data?.product_id));
   const { formatPrice } = useFormatPrice();

   const isInCompare = compareList.some((p) => p.product_id === data.product_id);

   const handleAddToCart = (e) => {
      e.preventDefault();
      const cart_item = {
         product_id: data.product_id,
         quantity: 1,
         created_at: new Date().toISOString(),
      };
      addToCart(cart_item, data);
   };

   useEffect(() => {
      setIsFavorite(findFavorite(data?.product_id));
   }, [data?.product_id, findFavorite]);

   return (
      <div className="bg-white px-3 pt-3 rounded-md border-[1px] border-[#e7e7e7] group relative">
         <div className="relative overflow-hidden">
            <Link to={`/product/${data.product_id}`}>
               <img
                  src={data.ProductImages[0]?.url}
                  alt=""
                  className="w-full h-[200px] object-cover hover:scale-105 transition-transform duration-300"
               />
            </Link>
            <div
               className="absolute top-0 left-0 p-[5px] hover:bg-white hover:shadow-md rounded-full cursor-pointer text-[#626262] bg-white/50 backdrop-blur-sm transition-all"
               onClick={() => {
                  addAndRemoveToFavorite(data);
                  setIsFavorite(!isFavorite);
               }}
            >
               <MdFavoriteBorder size={20} className={`${isFavorite ? 'text-red-600' : ''}`} />
            </div>

            {/* Nút so sánh */}
            <div
               className={`absolute bottom-2 right-2 p-1.5 rounded-md cursor-pointer transition-all duration-200 shadow-sm
                  ${
                     isInCompare
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white/80 text-gray-700 hover:bg-blue-600 hover:text-white border border-gray-200'
                  }`}
               title="So sánh sản phẩm"
               onClick={(e) => {
                  e.preventDefault();
                  addToCompare(data);
               }}
            >
               <div className="flex items-center gap-0.5">
                  <IoAdd size={16} />
                  <span className="text-[10px] font-bold">SO SÁNH</span>
               </div>
            </div>

            {/* Nút thêm vào giỏ hàng */}
            <div
               className="absolute bottom-2 left-2 p-1.5 rounded-md cursor-pointer transition-all duration-200 shadow-sm
                  bg-white/80 text-gray-700 hover:bg-red-600 hover:text-white border border-gray-200"
               title="Thêm vào giỏ hàng"
               onClick={handleAddToCart}
            >
               <RiShoppingCart2Line size={16} />
            </div>
         </div>
         <div className="mt-3">
            <Link to={`/product/${data.product_id}`}>
               <h3 className="text-[14px] font-[500] text-[#626262] hover:text-[#2054ad] duration-100 line-clamp-1">
                  {data.name}
               </h3>
            </Link>
            <p className="text-[#ed1c24] font-[600] text-[18px]">{formatPrice(data.discount_price || data.price)}</p>
            <div className="flex items-center gap-3 min-h-[40px]">
               {data.discount_price && (
                  <>
                     <p className="text-[14px] font-[500] line-through text-[#939393]">{formatPrice(data.price)}</p>
                     <span className="text-xs text-[#ef5555] bg-[#f9e9e2]">
                        {Math.round(((data.price - data.discount_price) / data.price) * 100)}%
                     </span>
                  </>
               )}
            </div>
         </div>
         <p className="flex gap-1 items-center text-[13px] pt-3 pb-2">
            <FaStar className="fill-[#f7c709]" />
            <span className="text-[#626262]">{data.rating}</span>
            <span className="text-[#939393] text-[12px]">({data.review_count ?? 0} đánh giá)</span>
         </p>
      </div>
   );
};
export default ProductCard;
