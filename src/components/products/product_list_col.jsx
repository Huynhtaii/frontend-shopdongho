import ProductCard from "./card/product_card";

const ProductListCol = ({ products }) => {
    return (
        <>
            {
                products.length === 0 && (
                    <div className="text-center">Không tìm thấy sản phẩm</div>
                )
            }
            <div className="layout-container grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {products.length > 0 && (
                    products.map(product => (
                        <ProductCard key={product.product_id} data={product} />
                    ))
                )}
            </div>
        </>
    );
}
export default ProductListCol;