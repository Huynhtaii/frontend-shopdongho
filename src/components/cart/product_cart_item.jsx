import { IoAddOutline, IoRemoveOutline } from "react-icons/io5";
import { IoIosCloseCircle } from "react-icons/io";
import { useCart } from "../../context/cart_context";
const ProductCartItem = ({ item }) => {
    const { deleteCartItem } = useCart();
    return (
        <div className="relative bg-[#f8f8f8] flex justify-between border rounded-md truncate mt-2">
            <div className="flex gap-2">
                <img src={item.Product.ProductImages[0].url} alt="" className="w-[98px] h-[98px] object-cover" />
                <h3 className="font-[600] text-[15px] py-2 text-wrap">{item.Product.name}</h3>
            </div>
            <div className="flex flex-col items-end pr-5 py-2">
                <p className="text-[#ed1c24] font-[600] text-[15px]">
                    {(item.Product.discount_price ? item.Product.discount_price : item.Product.price) * item.quantity}đ
                </p>
                {item.Product.discount_price && (
                    <p className="text-[13px] font-[500] line-through text-[#939393]">
                        {item.Product.price * item.quantity}đ
                    </p>
                )}
                <div className="flex items-center mt-1">
                    <button className="bg-white border border-[#e7e7e7] rounded-full p-1"><IoRemoveOutline size={15} /></button>
                    <p className="text-sm min-w-8 text-center">{item.quantity}</p>
                    <button className="bg-white border border-[#e7e7e7] rounded-full p-1"><IoAddOutline size={15} /></button>
                </div>
            </div>
            <IoIosCloseCircle size={18} className="absolute top-1 left-1 text-gray-300 cursor-pointer"
                onClick={() => deleteCartItem(item.cart_item_id)} />
        </div>
    )
}

export default ProductCartItem;
