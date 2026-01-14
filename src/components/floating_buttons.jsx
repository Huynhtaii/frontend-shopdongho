import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { IoChevronUp, IoSend } from "react-icons/io5";
import { MdOutlineSupportAgent } from "react-icons/md";

const FloatingButtons = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [showChat, setShowChat] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };
        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    return (
        <div className="fixed bottom-10 right-4 flex flex-col gap-3 z-50">
            <div className="relative w-10 h-10">
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    className={`absolute w-10 h-10 bg-yellow-400 rounded-full 
                    flex items-center justify-center shadow-lg 
                    hover:scale-110 duration-300
                    top-1/2 left-1/2 -translate-x-1/2
                     ${isVisible ? '-translate-y-1/2 visible opacity-100' : '-translate-y-20 invisible opacity-0'}
                   `}
                >
                    <IoChevronUp size={24} />
                </button>
            </div>
            <div className="relative">
                <div onClick={() => setShowChat(!showChat)} className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center hover:scale-110 transition cursor-pointer">
                    <MdOutlineSupportAgent size={24} />
                </div>
                {showChat && (
                    <Chat />
                )}
            </div>
            <Link href="#" target="_blank" className="flex items-center justify-center hover:scale-110 transition">
                <img src="https://bizweb.dktcdn.net/100/521/820/themes/957130/assets/addthis-zalo.svg?1736826036594" alt="Zalo" className="w-10 h-10" />
            </Link>
        </div>
    );
};

const Chat = () => {
    return (
        <div className="absolute bottom-12 right-0 w-72 h-96 bg-white rounded-lg shadow-lg p-4 border border-gray-200">
            <div className="flex flex-col h-full">
                <div className="text-lg font-medium mb-2">Hỗ trợ khách hàng</div>
                <div className="flex-1 overflow-y-auto">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-start gap-2">
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                <MdOutlineSupportAgent size={20} />
                            </div>
                            <div className="bg-gray-100 p-2 rounded-lg max-w-[80%]">
                                <p className="text-sm">Xin chào! Tôi có thể giúp gì cho bạn?</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-2 flex-row-reverse">
                            <div className="w-8 h-8 rounded-full bg-yellow-200 flex items-center justify-center">
                                <span className="text-sm">K</span>
                            </div>
                            <div className="bg-yellow-100 p-2 rounded-lg max-w-[80%]">
                                <p className="text-sm">Tôi muốn tìm hiểu về sản phẩm đồng hồ</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-2 relative">
                    <input
                        type="text"
                        placeholder="Nhập tin nhắn..."
                        className="w-full p-2 pr-10 border border-gray-300 rounded-md"
                    />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                        <IoSend size={20} />
                    </button>
                </div>
            </div>
            {/* <div className="flex flex-col h-full items-center justify-center">
                            <p className="text-sm text-gray-500 text-center">Đăng nhập tài khoản để bắt đầu chat với chúng tôi</p>
                            <Link to="/login" className="text-primary">Đăng nhập</Link>
                        </div> */}
        </div>
    );
};

export default FloatingButtons;
