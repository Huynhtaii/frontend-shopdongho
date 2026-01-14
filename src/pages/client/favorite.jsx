import ProductFavoriteCard from "../../components/products/card/product_favorite_card";

const Favorite = () => {
    return (
        // <Empty />
        <div className="layout-container !pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 my-3">
                <h1 className="text-xl font-[600]">Sản phẩm yêu thích (1)</h1>
            </div>

            {/* Product List */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                <ProductFavoriteCard />
                <ProductFavoriteCard />
                <ProductFavoriteCard />
                <ProductFavoriteCard />
                <ProductFavoriteCard />
                <ProductFavoriteCard />
            </div>
        </div>
    )
}

export default Favorite;
