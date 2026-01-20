import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const FavoriteContext = createContext();

export const FavoriteProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);
    const [count, setCount] = useState(0)

    useEffect(() => {
        const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
        setFavorites(storedFavorites);
        setCount(storedFavorites.length)
    }, []);

    const addAndRemoveToFavorite = (product) => {
        let updatedFavorites = [...favorites];
        if (updatedFavorites.some(p => p.product_id === product.product_id)) {
            updatedFavorites = updatedFavorites.filter(p => p.product_id !== product.product_id);
            toast.error(`Đã xóa ${product.sku} khỏi danh sách yêu thích`);
        } else {
            updatedFavorites.push(product);
            toast.success(`Đã thêm ${product.sku} vào danh sách yêu thích`);
        }

        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        setFavorites(updatedFavorites);
        setCount(updatedFavorites.length)
    };

    const findFavorite = (productId) => {
        return favorites.find(p => p.product_id === productId);
    };

    return (
        <FavoriteContext.Provider value={{ favorites, count, addAndRemoveToFavorite, findFavorite }}>
            {children}
        </FavoriteContext.Provider>
    );
};

export const useFavorite = () => {
    return useContext(FavoriteContext);
};
