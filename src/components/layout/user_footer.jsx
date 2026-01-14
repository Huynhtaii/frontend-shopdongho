import { HiMapPin } from "react-icons/hi2";
import { MdPhoneIphone } from "react-icons/md";
import { HiOutlineMail } from "react-icons/hi";
import { Link } from "react-router-dom";

const UserFooter = () => {
    return (
        <div className="bg-footer py-14">
            <div className="layout-container text-white flex gap-10 text-[15px] flex-col sm:flex-col md:flex-col lg:flex-row xl:flex-row 2xl:flex-row">
                <div className="flex flex-col gap-3 w-full sm:w-full md:w-full lg:w-[23%] xl:w-[23%] 2xl:w-[23%]">
                    <img src="/logo-watchstore.webp" alt="" className="w-[280px] h-auto" />
                    <h1 className="text-2xl mt-1">Cửa hàng WatchStore</h1>
                    <p>Cửa hàng uy tín và chất lượng, cam kết mang đến những trải nghiệm mua sắm tiện lợi và hiện đại</p>
                    <p>Mã số thuế: 12345678999</p>
                    <div className="info flex flex-col gap-2">
                        <p className="flex gap-2"><HiMapPin size={20} /> Địa chỉ: 70 Demo, Demo Demo, Demo Demo</p>
                        <p className="flex gap-2"><MdPhoneIphone size={20} /> Số điện thoại: 1111111111</p>
                        <p className="flex gap-2"><HiOutlineMail size={20} /> Email: support@gmail.vn</p>
                    </div>
                    <p>© Bản quyền thuộc về Demo | Cung cấp bởi Demo</p>
                </div>
                <div className="flex-1">
                    <div className="flex justify-between flex-col sm:flex-col md:flex-row lg:flex-row xl:flex-row 2xl:flex-row">
                        <div>
                            <h2 className="text-base font-[600] uppercase">Cửa hàng WatchStore</h2>
                            <ul className="flex flex-col gap-3 mt-3">
                                <Link to={'#'} className="hover:text-blue-500 duration-50">Cửa hàng</Link>
                                <Link to={'#'} className="hover:text-blue-500 duration-50">Giới thiệu</Link>
                                <Link to={'#'} className="hover:text-blue-500 duration-50">Liên hệ</Link>
                                <Link to={'#'} className="hover:text-blue-500 duration-50">Câu hỏi thường gặp</Link>
                                <Link to={'#'} className="hover:text-blue-500 duration-50">Khuyến mãi Combo</Link>
                                <Link to={'#'} className="hover:text-blue-500 duration-50">Khuyến mãi Mua X tặng Y</Link>
                            </ul>
                        </div>
                        <div>
                            <h2 className="text-base font-[600] uppercase">Chính sách</h2>
                            <ul className="flex flex-col gap-3 mt-3">
                                <Link to={'#'} className="hover:text-blue-500 duration-50">Chính sách giao hàng</Link>
                                <Link to={'#'} className="hover:text-blue-500 duration-50">Điều khoản dịch vụ</Link>
                                <Link to={'#'} className="hover:text-blue-500 duration-50">Chính sách bảo mật</Link>
                                <Link to={'#'} className="hover:text-blue-500 duration-50">Chính sách đổi trả</Link>
                                <Link to={'#'} className="hover:text-blue-500 duration-50">Chương trình cộng tác viên</Link>
                            </ul>
                        </div>
                        <div>
                            <h2 className="text-base font-[600] uppercase">Đăng kí nhận tin</h2>
                            <ul className="flex flex-col gap-3 mt-3">
                                <p className="flex flex-col">Bạn muốn nhận khuyến mãi đặc biệt? <span>Đăng ký ngay.</span></p>
                                <div className="relative bg-white p-2 rounded-full min-w-[350px]">
                                    <input type="text" placeholder="Nhập địa chỉ email" className="outline-none text-foreground pl-2 pr-28 w-full" />
                                    <div className="absolute top-0 right-0 p-[2px] h-full">
                                        <button className="h-full px-6 rounded-full bg-footer">Đăng ký</button>
                                    </div>
                                </div>
                                <ul className="flex items-center gap-5 mt-2">
                                    <li>
                                        <Link to={'#'}><img src="/facebook.webp" alt="" className="w-[33px] h-auto" /></Link>
                                    </li>
                                    <li>
                                        <Link to={'#'}><img src="/zalo.webp" alt="" className="w-[33px] h-auto" /></Link>
                                    </li>
                                    <li>
                                        <Link to={'#'}><img src="/instagram.webp" alt="" className="w-[33px] h-auto" /></Link>
                                    </li>
                                    <li>
                                        <Link to={'#'}><img src="/youtube.webp" alt="" className="w-[33px] h-auto" /></Link>
                                    </li>
                                    <li>
                                        <Link to={'#'}><img src="/tiktok.webp" alt="" className="w-[33px] h-auto" /></Link>
                                    </li>
                                </ul>
                            </ul>
                        </div>
                    </div>
                    <div className="flex-1 py-10 flex justify-center">
                        <Link to={'#'}><img src="/footer_trustbadge.webp" alt="" className="w-[260px] h-auto" /></Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default UserFooter