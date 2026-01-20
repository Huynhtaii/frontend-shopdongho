import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import CategoryBanner from "../../components/banners/category_banner";
import ProductListCol from "../../components/products/product_list_col";
import ProductFilters from "../../components/product_filters";
import Pagination from "../../components/pagination";
import ProductListSlider from "../../components/products/product_list_slider";
import useRecentProduct from "../../hooks/use_recent_product";
import ProductService from "../../services/product_service";

const Category = () => {
    const { category } = useParams()
    const [categoryName, setCategoryName] = useState(category)

    const { products: productRecent } = useRecentProduct()
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0)

    const [filter, setFilter] = useState({
        price: 'all',
        rating: 'all',
    })

    const [products, setProducts] = useState([])
    useEffect(() => {
        const fetchProducts = async () => {
            const limit = 10
            const data = await ProductService.getProductByCategoriesWithPaginate(page, limit, categoryName, filter)
            setProducts(data.DT.product)
            setTotalPages(data.DT.totalPages)
        }
        fetchProducts()
    }, [page, filter])

    useEffect(() => {
        setCategoryName(category)
    }, [category])

    return (
        <div className="pb-20">
            <div className="layout-container">
                <div className="flex items-center gap-1 py-2">
                    <Link to="/" className="text-sm text-blue-600">Home</Link>
                    <span className="text-sm text-gray-600">/</span>
                    <span className="text-sm text-blue-600">{category}</span>
                </div>
            </div>
            <CategoryBanner />
            <ProductFilters setFilter={setFilter} setCategoryName={setCategoryName} categoryName={categoryName} />
            <div className="mt-3">
                <ProductListCol products={products} />
            </div>
            {totalPages > 1 && <Pagination page={page} totalPages={totalPages} setPage={setPage} />}
            <div className='mt-12'>
                <ProductListSlider title='Sản phẩm đã xem' products={productRecent} />
            </div>
        </div>
    )
}

export default Category;