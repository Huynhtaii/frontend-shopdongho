import ProductListSlider from "./product_list_slider";

const ProductListShowCase = () => {
    return (
        <div className="layout-container">
            <div className="mt-12 flex items-center">
                <img src="/banner-dong-ho-cao-cap.webp" alt=""
                    className="hidden lg:flex w-[350px] object-cover" />
                <div className="w-full lg:w-[80%] lg:-ml-32">
                    <ProductListSlider col={4} />
                </div>
            </div>
        </div>
    )
}

export default ProductListShowCase;