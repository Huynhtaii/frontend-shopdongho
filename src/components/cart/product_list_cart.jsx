import ProductCartItem from "./product_cart_item";

const ProductListCart = ({ cartItem }) => {
    return (
        <div className="mt-5">
            {cartItem.map((item) => (
                <ProductCartItem key={item.cart_item_id} item={item} />
            ))}
        </div>
    )
}

export default ProductListCart;