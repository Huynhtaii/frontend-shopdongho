import ProductListSlider from "./product_list_slider";
import useProductByCategory from "../../hooks/use_product_by_category";

const ProductListShowCase = () => {
    const { products } = useProductByCategory('Cao cấp')
    return (
        <div className="layout-container">
            <div className="mt-12 flex items-center">
                <img src="/banner-dong-ho-cao-cap.webp" alt=""
                    className="hidden lg:flex w-[350px] object-cover" />
                <div className="w-full lg:w-[80%] lg:-ml-32">
                    {products && <ProductListSlider col={4} products={products} />}
                </div>
            </div>
        </div>
    )
}

export default ProductListShowCase;