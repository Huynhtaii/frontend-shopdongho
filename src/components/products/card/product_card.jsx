import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';

import { MdFavoriteBorder } from 'react-icons/md';
import { useFavorite } from '../../../context/favorite_context';
import useFormatPrice from '../../../hooks/use_formatPrice';

const ProductCard = ({ data }) => {
   const { addAndRemoveToFavorite, findFavorite } = useFavorite();
   const [isFavorite, setIsFavorite] = useState(findFavorite(data?.product_id));
   const { formatPrice } = useFormatPrice();

   useEffect(() => {
      setIsFavorite(findFavorite(data?.product_id));
   }, [data?.product_id, findFavorite]);

   return (
      <div className="bg-white px-3 pt-3 rounded-md border-[1px] border-[#e7e7e7]">
         <div className="relative">
            <Link to={`/product/${data.product_id}`}>
               <img src={data.ProductImages[0]?.url} alt="" className="w-full object-cover" />
            </Link>
            <div
               className="absolute top-0 left-0 p-[5px] hover:bg-white hover:shadow-md rounded-full cursor-pointer text-[#626262]"
               onClick={() => {
                  addAndRemoveToFavorite(data);
                  setIsFavorite(!isFavorite);
               }}
            >
               <MdFavoriteBorder size={20} className={`${isFavorite ? 'text-red-600' : ''}`} />
            </div>
         </div>
         <div className="mt-3">
            <Link to={`/product/${data.product_id}`}>
               <h3 className="text-[14px] font-[500] text-[#626262] hover:text-[#2054ad] duration-100 line-clamp-1">
                  {data.name}
               </h3>
            </Link>
            <p className="text-[#ed1c24] font-[600] text-[18px]">{formatPrice(data.discount_price || data.price)}</p>
            {data.discount_price && (
               <div className="flex items-center gap-3">
                  <p className="text-[14px] font-[500] line-through text-[#939393]">{formatPrice(data.price)}</p>
                  <span className="text-xs text-[#ef5555] bg-[#f9e9e2]">
                     {Math.round(((data.price - data.discount_price) / data.price) * 100)}%
                  </span>
               </div>
            )}
         </div>
         <p className="flex gap-1 items-center text-[13px] pt-3 pb-2">
            <FaStar className="fill-[#f7c709]" />
            <span className="text-[#626262] mt-[1px]">{data.rating}</span>
         </p>
      </div>
   );
};
export default ProductCard;
