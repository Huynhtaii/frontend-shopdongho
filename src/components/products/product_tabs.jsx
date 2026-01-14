import { useState } from "react";
import { PiMedalFill } from "react-icons/pi";
import ProductListCol from "./product_list_col";

const ProductTabs = () => {
    const [activeTab, setActiveTab] = useState(1)
    return (
        <div className='layout-container'>
            <div className="flex flex-col items-center">
                <h1 className='mt-12 uppercase text-[20px] text-[#333] pb-[10px]'>Bộ sưu tập cho mùa hè</h1>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setActiveTab(1)}
                        className={`text-sm font-[500] hover:shadow-md duration-50 border px-3 py-2 rounded-md flex items-center gap-1 ${activeTab === 1 ? 'border-primary text-primary' : 'text-[#717171]'}`}>
                        <PiMedalFill size={20} />Nổi bật
                    </button>
                    <button
                        onClick={() => setActiveTab(2)}
                        className={`text-sm font-[500] hover:shadow-md duration-50 border px-3 py-2 rounded-md ${activeTab === 2 ? 'border-primary text-primary' : 'text-[#717171]'}`}>Đồng hồ nam</button>
                    <button
                        onClick={() => setActiveTab(3)}
                        className={`text-sm font-[500] hover:shadow-md duration-50 border px-3 py-2 rounded-md ${activeTab === 3 ? 'border-primary text-primary' : 'text-[#717171]'}`}>Đồng hồ nữ</button>
                </div>
            </div>
            <div className="mt-6">
                <ProductListCol />
            </div>
            
        </div>
    )
}

export default ProductTabs;
