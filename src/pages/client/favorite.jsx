import ProductFavoriteCard from "../../components/products/card/product_favorite_card";
import { useFavorite } from "../../context/favorite_context";

const Favorite = () => {
    const { favorites, count } = useFavorite();

    return (
        // <Empty />
        <div className="layout-container !pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 my-3">
                <h1 className="text-xl font-[600]">Sản phẩm yêu thích ({count})</h1>
            </div>

            {/* Product List */}
            {(favorites.length > 0 && favorites) ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {favorites?.map((product) => (
                        <ProductFavoriteCard key={product.product_id}
                            product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center">Chưa có sản phẩm yêu thích</div>
            )}
        </div>
    )
}

export default Favorite;
