import { IoAddOutline, IoRemoveOutline } from 'react-icons/io5';
import { IoIosCloseCircle } from 'react-icons/io';
import { useCart } from '../../context/cart_context';
import { useEffect, useState } from 'react';
import useFormatPrice from '../../hooks/use_formatPrice';
const ProductCartItem = ({ item }) => {
   const { deleteCartItem, updateQuantityCartItem } = useCart();
   const [quantity, setQuantity] = useState(item.quantity);
   const { formatPrice } = useFormatPrice();

   useEffect(() => {
      setQuantity(item.quantity);
   }, [item.quantity]);

   const increaseQuantity = () => {
      setQuantity(quantity + 1);
      updateQuantityCartItem(item.cart_item_id, quantity + 1);
   };

   const decreaseQuantity = () => {
      if (quantity > 1) {
         setQuantity(quantity - 1);
         updateQuantityCartItem(item.cart_item_id, quantity - 1);
      }
   };

   return (
      <div className="relative bg-[#f8f8f8] flex justify-between border rounded-md truncate mt-2">
         <div className="flex gap-2">
            <img src={item.Product.ProductImages[0].url} alt="" className="w-[98px] h-[98px] object-cover" />
            <h3 className="font-[600] text-[15px] py-2 text-wrap">{item.Product.name}</h3>
         </div>
         <div className="flex flex-col items-end pr-5 py-2">
            <p className="text-[#ed1c24] font-[600] text-[15px]">
               {formatPrice(
                  (item.Product.discount_price ? item.Product.discount_price : item.Product.price) * item.quantity,
               )}
            </p>
            {item.Product.discount_price && (
               <p className="text-[13px] font-[500] line-through text-[#939393]">
                  {formatPrice(item.Product.price * item.quantity)}
               </p>
            )}
            <div className="flex items-center mt-1">
               <button className="bg-white border border-[#e7e7e7] rounded-full p-1" onClick={() => decreaseQuantity()}>
                  <IoRemoveOutline size={15} />
               </button>
               <p className="text-sm min-w-8 text-center">{quantity}</p>
               <button className="bg-white border border-[#e7e7e7] rounded-full p-1" onClick={() => increaseQuantity()}>
                  <IoAddOutline size={15} />
               </button>
            </div>
         </div>
         <IoIosCloseCircle
            size={18}
            className="absolute top-1 left-1 text-gray-300 cursor-pointer"
            onClick={() => deleteCartItem(item.cart_item_id)}
         />
      </div>
   );
};

export default ProductCartItem;
