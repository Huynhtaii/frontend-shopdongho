import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import CartService from '../services/cart_service';
import { toast } from 'react-toastify';
import AuthContext from './auth.context';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
   const [cart, setCart] = useState([]);
   const [cartItem, setCartItem] = useState([]);
   const [countItem, setCountItem] = useState(0);
   const [totalPrice, setTotalPrice] = useState(0);
   const [savingsPrice, setSavingsPrice] = useState(0); //số tiền tiết kiệm được
   const { auth } = useContext(AuthContext);
   const user_id = localStorage.getItem('userId');

   const fetchCart = useCallback(async () => {
      if (!auth.isAuthenticated) {
         // Guest Cart Logic
         const localCart = JSON.parse(localStorage.getItem('guestCart')) || [];
         setCartItem(localCart);
         setCountItem(localCart.reduce((acc, item) => acc + item.quantity, 0));

         const total = localCart.reduce((acc, item) => {
            const price = item.Product.discount_price || item.Product.price;
            return acc + item.quantity * price;
         }, 0);
         setTotalPrice(total);

         const savings = localCart.reduce((acc, item) => {
            if (item.Product.discount_price) {
               return acc + (item.Product.price - item.Product.discount_price) * item.quantity;
            }
            return acc;
         }, 0);
         setSavingsPrice(savings);
         return;
      }

      const response = await CartService.getCartByUserId(user_id);

      if (response.EC === '0') {
         setCart(response.DT);
         setCartItem(response.DT[0]?.CartItems || []);

         const total = response.DT[0]?.CartItems.reduce((acc, item) => acc + item.quantity, 0);
         setCountItem(total);
         setTotalPrice(response.totalPrice);
         setSavingsPrice(response.totalSavings);
      }
   }, [auth.isAuthenticated, user_id]);

   useEffect(() => {
      fetchCart();
   }, [auth.isAuthenticated, fetchCart]);

   const addToCart = async (cart_item, productDetail) => {
      if (!auth.isAuthenticated) {
         // Add to Guest Cart
         const localCart = JSON.parse(localStorage.getItem('guestCart')) || [];
         const existingItemIndex = localCart.findIndex((item) => item.product_id === cart_item.product_id);

         if (existingItemIndex > -1) {
            localCart[existingItemIndex].quantity += cart_item.quantity;
         } else {
            // We need product detail for the UI to display correctly
            localCart.push({
               ...cart_item,
               cart_item_id: Date.now(), // Temporary ID for guest
               Product: productDetail,
            });
         }

         localStorage.setItem('guestCart', JSON.stringify(localCart));
         toast.success('Thêm vào giỏ hàng thành công (Khách)');
         fetchCart();
         return;
      }

      const response = await CartService.createCartItem(user_id, cart_item);
      if (response.EC === '0') {
         toast.success('Thêm vào giỏ hàng thành công');
         fetchCart();
      } else {
         console.log(response.EM);

         toast.error('Thêm vào giỏ hàng thất bại');
      }
   };

   const deleteCartItem = async (cart_item_id) => {
      if (!auth.isAuthenticated) {
         const localCart = JSON.parse(localStorage.getItem('guestCart')) || [];
         const updatedCart = localCart.filter((item) => item.cart_item_id !== cart_item_id);
         localStorage.setItem('guestCart', JSON.stringify(updatedCart));
         fetchCart();
         toast.success('Xóa khỏi giỏ hàng thành công');
         return;
      }

      const response = await CartService.deleteCartItem(cart_item_id);
      if (response.EC === '0') {
         toast.success('Xóa khỏi giỏ hàng thành công');
         fetchCart();
      } else {
         toast.error('Xóa khỏi giỏ hàng thất bại');
      }
   };

   const updateQuantityCartItem = async (cart_item_id, quantity) => {
      if (!auth.isAuthenticated) {
         const localCart = JSON.parse(localStorage.getItem('guestCart')) || [];
         const itemIndex = localCart.findIndex((item) => item.cart_item_id === cart_item_id);
         if (itemIndex > -1) {
            localCart[itemIndex].quantity = quantity;
            localStorage.setItem('guestCart', JSON.stringify(localCart));
            fetchCart();
         }
         return;
      }

      const response = await CartService.updateQuantityCartItem(cart_item_id, quantity);
      if (response.EC === '0') {
         fetchCart();
      } else {
         console.log(response);
      }
   };

   return (
      <CartContext.Provider
         value={{
            cart,
            cartItem,
            countItem,
            addToCart,
            deleteCartItem,
            updateQuantityCartItem,
            totalPrice,
            savingsPrice,
            fetchCart,
         }}
      >
         {children}
      </CartContext.Provider>
   );
};
export default CartContext;

export const useCart = () => {
   return useContext(CartContext);
};
