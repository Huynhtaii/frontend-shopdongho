import { Link } from "react-router-dom";

import { IoCloseSharp } from "react-icons/io5";
import { FaStar } from "react-icons/fa";

const ProductFavoriteCard = () => {
    return (
        <div className="bg-white px-3 pt-3 rounded-md border-[1px] border-[#e7e7e7]">
            <div className="relative">
                <Link to={'#'}>
                    <img src="https://www.watchstore.vn/images/products/2024/08/22/resized/8131g-ch-n-1_1724295651.webp"
                        alt=""
                        className="w-full object-cover" />
                </Link>
            </div>
            <div className="mt-3">
                <Link to={''}><h3 className="text-[14px] font-[500] text-[#626262] hover:text-[#2054ad] duration-100 line-clamp-1">Carnival Nam 8131G-CH-N Size 41mm</h3></Link>
                <p className="text-[#ed1c24] font-[600] text-[18px]">2.800.000đ</p>
                <div className="flex items-center gap-3">
                    <p className="text-[14px] font-[500] line-through text-[#939393]">2.800.000đ</p>
                    <span className="text-xs text-[#ef5555] bg-[#f9e9e2]">-32%</span>
                </div>
            </div>
            <p className="flex gap-1 items-center text-[13px] pt-3">
                <FaStar className="fill-[#f7c709]" />
                <span className="text-[#626262] mt-[1px]">5</span>
            </p>
            <div className="flex flex-col py-3 text-[14px]">
                <Link to={''} className="bg-blue-600 p-2 text-center rounded-md text-white">Mua ngay</Link>
                <button className="p-2 rounded-md text-gray-500 flex items-center gap-1 justify-center"><IoCloseSharp size={20} />Xoá sản phẩm</button>
            </div>
        </div>
    )
}

export default ProductFavoriteCard;