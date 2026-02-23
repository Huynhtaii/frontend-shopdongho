import { Link } from 'react-router-dom';

import { GrFormPrevious } from 'react-icons/gr';
import ProductListCart from '../../components/cart/product_list_cart';
import Payment from '../../components/cart/payment';
import { useCart } from '../../context/cart_context';
import { useEffect } from 'react';
import useFormatPrice from '../../hooks/use_formatPrice';
const Cart = () => {
   const { cartItem, totalPrice, savingsPrice } = useCart();
   const { formatPrice } = useFormatPrice();

   return (
      //  <Empty />
      <div className="bg-[#f8f8f8] py-5">
         <div className="layout-container">
            <div className="w-[85%] sm:w-[85%] md:[75%] lg:w-[65%] xl:w-[55%] m-auto shadow-md rounded-lg bg-white p-6">
               {cartItem?.length > 0 ? (
                  <>
                     <div className="border-b pb-5">
                        <div className="flex items-center justify-between text-sm">
                           <Link to={'/category/all'} className="flex items-center text-blue-500 z-[9999]">
                              <GrFormPrevious size={20} />
                              Mua thêm sản phẩm khác
                           </Link>
                           <h3>Giỏ hàng của bạn</h3>
                        </div>
                        <ProductListCart cartItem={cartItem} />
                        <div className="flex justify-between mt-8">
                           <h3 className="text-[14px] font-[600]">Tổng tiền tạm tính:</h3>
                           <div className="flex flex-col items-end">
                              <p className="text-[#ed1c24] font-[600] text-[15px]">{formatPrice(totalPrice)}</p>
                              <span className="text-green-700 text-[12px]">Tiết kiệm: {formatPrice(savingsPrice)}</span>
                           </div>
                        </div>
                     </div>
                     <Payment totalPrice={totalPrice} cartItem={cartItem} />
                  </>
               ) : (
                  <div className="flex gap-1">
                     Chưa có sản phẩm trong giỏ hàng!
                     <Link to={'/category/all'} className="flex items-center text-blue-500 z-[99999]">
                        Mua ngay
                     </Link>
                  </div>
               )}
            </div>
         </div>
      </div>
   );
};

export default Cart;
