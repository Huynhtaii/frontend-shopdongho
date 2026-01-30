import { createContext, useContext, useEffect, useState } from "react";
import CartService from "../services/cart_service";
import { toast } from "react-toastify";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [cartItem, setCartItem] = useState([]);
    const [countItem, setCountItem] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [savingsPrice, setSavingsPrice] = useState(0);//số tiền tiết kiệm được
    const user_id_fake = 1 // thay đổi khi đã có id người dùng

    const fetchCart = async () => {
        const response = await CartService.getCartByUserId(user_id_fake);

        if (response.EC === "0") {
            setCart(response.DT);
            setCartItem(response.DT[0].CartItems);

            const total = response.DT[0].CartItems.reduce((acc, item) => acc + item.quantity, 0);
            setCountItem(total);
            setTotalPrice(response.totalPrice);
            setSavingsPrice(response.totalSavings >= response.totalPrice
                ? response.totalSavings - response.totalPrice
                : response.totalPrice - response.totalSavings);
        }
    }

    useEffect(() => {
        fetchCart();
    }, []);

    const addToCart = async (cart_item) => {
        const response = await CartService.createCartItem(user_id_fake, cart_item);
        if (response.EC === "0") {
            toast.success("Thêm vào giỏ hàng thành công");
            fetchCart();
        } else {
            toast.error("Thêm vào giỏ hàng thất bại");
        }
    }

    const deleteCartItem = async (cart_item_id) => {
        const response = await CartService.deleteCartItem(cart_item_id);
        if (response.EC === "0") {
            toast.success("Xóa khỏi giỏ hàng thành công");
            fetchCart();
        } else {
            toast.error("Xóa khỏi giỏ hàng thất bại");
        }
    }

    const updateQuantityCartItem = async (cart_item_id, quantity) => {
        const response = await CartService.updateQuantityCartItem(cart_item_id, quantity);
        if (response.EC === "0") {
            fetchCart();
        } else {
            console.log(response);
        }
    }

    return (
        <CartContext.Provider value={{
            cart,
            cartItem,
            countItem,
            addToCart,
            deleteCartItem,
            updateQuantityCartItem,
            totalPrice,
            savingsPrice
        }}>
            {children}
        </CartContext.Provider>
    )

}
export default CartContext;

export const useCart = () => {
    return useContext(CartContext);
}

