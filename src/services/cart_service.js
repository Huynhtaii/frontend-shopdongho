import axios from "../utils/axios_config";

const CartService = {
    getCartByUserId: async (userId) => {
        const url = `/v1/read/cart/${userId}`;
        return await axios.get(url);
    },
    createCartItem: async (userId, data) => {
        const url = `/v1/create/cart-item/${userId}`;
        return await axios.post(url, data);
    },
    updateQuantityCartItem: async (cart_item_id, quantity) => {
        const url = `/v1/update/quantity-cart-item/${cart_item_id}`;
        return await axios.put(url, { quantity });
    },
    deleteCartItem: async (cart_item_id) => {
        const url = `/v1/delete/cart-item/${cart_item_id}`;
        return await axios.delete(url);
    }
}

export default CartService;
