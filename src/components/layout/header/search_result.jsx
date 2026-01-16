import { Link } from "react-router-dom";

const SearchResult = () => {
    return (
        <>
            <div className="fixed inset-0 bg-black/50 z-[-1]"></div>
            <div className="absolute z-[999] top-full left-0 w-[300px] max-h-[400px] bg-white shadow-lg rounded-md mt-1 p-2 overflow-y-auto">
                <div className="flex flex-col gap-2">
                    <div className="text-sm text-gray-500 font-medium">Kết quả tìm kiếm</div>
                    <div className="flex flex-col gap-1">
                        <Link to={'/product/1'} className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                            <img src="https://www.watchstore.vn/images/products/2024/06/14/resized/mtp-1374l-1avdf_1718337912.webp" alt="" className="w-10 h-10 object-cover rounded-md" />
                            <div>
                                <div className="text-sm font-medium">Demo Product</div>
                                <div className="text-xs text-gray-500">100.000.000 VNĐ</div>
                            </div>
                        </Link>
                        <Link to={'/product/1'} className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                            <img src="https://www.watchstore.vn/images/products/2024/06/14/resized/mtp-1374l-1avdf_1718337912.webp" alt="" className="w-10 h-10 object-cover rounded-md" />
                            <div>
                                <div className="text-sm font-medium">Demo Product 2</div>
                                <div className="text-xs text-gray-500">100.000.000 VNĐ</div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SearchResult;
