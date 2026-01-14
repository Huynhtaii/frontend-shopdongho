import { Link } from "react-router-dom";

import { GrFormPrevious } from "react-icons/gr";
import ProductListCart from "../../components/cart/product_list_cart";
import Payment from "../../components/cart/payment";

const Cart = () => {
    return (
        //  <Empty />
        <div className="bg-[#f8f8f8] py-5">
            <div className="layout-container">
                <div className="w-[55%] m-auto shadow-md rounded-lg bg-white p-6">
                    <div className="border-b pb-5">
                        <div className="flex items-center justify-between text-sm">
                            <Link to={'/'} className="flex items-center text-blue-500">
                                <GrFormPrevious size={20} />Mua thêm sản phẩm khác</Link>
                            <h3>Giỏ hàng của bạn</h3>
                        </div>
                        <ProductListCart />
                        <div className="flex justify-between mt-8">
                            <h3 className="text-[14px] font-[600]">Tổng tiền tạm tính:</h3>
                            <div className="flex flex-col items-end">
                                <p className="text-[#ed1c24] font-[600] text-[15px]">2.800.000đ</p>
                                <span className="text-green-700 text-[12px]">Tiết kiệm: 1.000.000đ</span>
                            </div>
                        </div>
                    </div>
                    <Payment />
                </div>
            </div>
        </div>
    )
}

export default Cart;
