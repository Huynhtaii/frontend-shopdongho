import { useEffect, useState } from "react";
import { PiMedalFill } from "react-icons/pi";
import ProductListCol from "./product_list_col";
import useProductByCategory from "../../hooks/use_product_by_category";

const ProductTabs = () => {
    const [activeTab, setActiveTab] = useState("Nổi bật");
    const { products, setCategory } = useProductByCategory(activeTab)

    useEffect(() => {
        setCategory(activeTab)
    }, [activeTab, setCategory])


    return (
        <div className='layout-container'>
            <div className="flex flex-col items-center">
                <h1 className='mt-12 uppercase text-[20px] text-[#333] pb-[10px]'>Bộ sưu tập cho mùa hè</h1>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setActiveTab('Nổi bật')}
                        className={`text-sm font-[500] hover:shadow-md duration-50 border px-3 py-2 rounded-md flex items-center gap-1 ${activeTab === 'Nổi bật' ? 'border-primary text-primary' : 'text-[#717171]'}`}>
                        <PiMedalFill size={20} />Nổi bật
                    </button>
                    <button
                        onClick={() => setActiveTab('Đồng hồ nam')}
                        className={`text-sm font-[500] hover:shadow-md duration-50 border px-3 py-2 rounded-md ${activeTab === 'Đồng hồ nam' ? 'border-primary text-primary' : 'text-[#717171]'}`}>Đồng hồ nam</button>
                    <button
                        onClick={() => setActiveTab('Đồng hồ nữ')}
                        className={`text-sm font-[500] hover:shadow-md duration-50 border px-3 py-2 rounded-md ${activeTab === 'Đồng hồ nữ' ? 'border-primary text-primary' : 'text-[#717171]'}`}>Đồng hồ nữ</button>
                </div>
            </div>
            <div className="mt-6 min-h-[200px]">
                {products && <ProductListCol products={products} />}
            </div>

        </div>
    )
}

export default ProductTabs;
