import { useState } from "react";
import { Link } from "react-router-dom";

import CategoryBanner from "../../components/banners/category_banner";
import ProductListCol from "../../components/products/product_list_col";
import ProductFilters from "../../components/product_filters";
import Pagination from "../../components/pagination";
import ProductListSlider from "../../components/products/product_list_slider";

const Category = () => {
    const [page, setPage] = useState(1);
    const totalPages = 8;

    return (
        <div className="pb-20">
            <div className="layout-container">
                <div className="flex items-center gap-1 py-2">
                    <Link to="/" className="text-sm text-blue-600">Home</Link>
                    <span className="text-sm text-gray-600">/</span>
                    <span className="text-sm text-blue-600">Đồng Hồ Tiếu Hublot</span>
                </div>
            </div>
            <CategoryBanner />
            <ProductFilters />
            <ProductListCol />
            <Pagination page={page} totalPages={totalPages} setPage={setPage} />
            <div className='mt-12'>
                <ProductListSlider title='Sản phẩm đã xem' />
            </div>
        </div>
    )
}

export default Category;