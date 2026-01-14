import { IoAddOutline, IoRemoveOutline } from "react-icons/io5";
import { IoIosCloseCircle } from "react-icons/io";

const ProductCartItem = () => {
    return (
        <div className="relative bg-[#f8f8f8] flex justify-between border rounded-md truncate mt-2">
            <div className="flex gap-2">
                <img src="https://www.watchstore.vn/images/products/2024/small/op990-45adgs-gl-d-1-1655171691816-1712491806.webp" alt="" className="w-[98px] h-[98px] object-cover" />
                <h3 className="font-[600] text-[15px] py-2">Olym Pianus Nam OP990-45ADGS-GL-D</h3>
            </div>
            <div className="flex flex-col items-end pr-5 py-2">
                <p className="text-[#ed1c24] font-[600] text-[15px]">2.800.000đ</p>
                <p className="text-[13px] font-[500] line-through text-[#939393]">2.800.000đ</p>
                <div className="flex items-center mt-1">
                    <button className="bg-white border border-[#e7e7e7] rounded-full p-1"><IoRemoveOutline size={15} /></button>
                    <p className="text-sm min-w-8 text-center">10</p>
                    <button className="bg-white border border-[#e7e7e7] rounded-full p-1"><IoAddOutline size={15} /></button>
                </div>
            </div>
            <IoIosCloseCircle size={18} className="absolute top-1 left-1 text-gray-300 cursor-pointer" />
        </div>
    )
}

export default ProductCartItem;
