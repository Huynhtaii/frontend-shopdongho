import { Link } from "react-router-dom";

import { IoSearchOutline } from "react-icons/io5";
import { AiOutlineUser } from "react-icons/ai";
import { LuShoppingCart } from "react-icons/lu";
import { MdFavoriteBorder } from "react-icons/md";

import UserMenu from "./user_menu";

const UserHeader = () => {
    return (
        <div className="bg-[#f1f3f4]">
            <div className="layout-container flex items-center gap-3">
                <Link to={'/'} className="hidden lg:flex"><img src="/logo-watchstore.webp" alt="" className="w-[200px] h-auto" /></Link>
                <UserMenu />
                <div className="options flex gap-3 items-center">
                    <div className="relative hidden md:flex">
                        <IoSearchOutline size={22} className="text-[#494949] absolute top-1/2 left-1 -translate-y-1/2 cursor-pointer" />
                        <input type="text" placeholder="Tìm là thấy" className="w-[200px] text-sm p-2 outline-none rounded-md pr-3 pl-7" />
                    </div>
                    <div className="relative account">
                        <AiOutlineUser size={28} className="text-[#494949] cursor-pointer" />
                        <div className="account-menu-popup absolute -bottom-16 left-1/2 -translate-x-1/2 bg-[#363636] rounded-md text-white text-sm flex flex-col w-[90px] z-[999]">
                            <Link to={'/login'} className="hover:bg-[#666] duration-100 p-2 py-1 rounded-t-md">Đăng nhập</Link>
                            <Link to={'/register'} className="hover:bg-[#666] duration-100 p-2 py-1 rounded-b-md">Đăng ký</Link>
                        </div>
                        {/* <div className="account-menu-popup absolute -bottom-16 left-1/2 -translate-x-1/2 bg-[#363636] rounded-md text-white text-sm flex flex-col w-[90px] z-[999]">
                        <Link to={'/account'} className="hover:bg-[#666] duration-100 p-2 py-1 rounded-t-md">Tài khoản</Link>
                        <Link to={'/logout'} className="hover:bg-[#666] duration-100 p-2 py-1 rounded-b-md">Đăng xuất</Link>
                        </div> */}
                    </div>
                    <Link to={'/cart'} className="relative hidden sm:flex">
                        <LuShoppingCart size={28} className="text-[#494949] cursor-pointer" />
                        <span className="absolute top-0 -right-2 bg-primary rounded-full w-3.5 h-3.5 item-center text-[11px]">0</span>
                    </Link>
                    <Link to={'/favorite'} className="relative hidden sm:flex">
                        <MdFavoriteBorder size={28} className="text-[#494949] cursor-pointer" />
                        <span className="absolute top-0 -right-2 bg-primary rounded-full w-3.5 h-3.5 item-center text-[11px]">0</span>
                    </Link>
                </div>
            </div>
        </div>
    )
}
export default UserHeader