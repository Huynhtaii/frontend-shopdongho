import { useState, useEffect } from "react";
import ProductService from "../services/product_service";

const useSearchProduct = (keyword) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSearchProducts = async () => {
            if (!keyword.trim()) {
                setProducts([]);
                return;
            }
            
            setLoading(true);
            setError(null);

            try {
                const response = await ProductService.searchProducts(keyword);

                setProducts(response?.DT ?? []);
            } catch (error) {
                console.error("Error fetching search products:", error);
                setError(error);
                setProducts([]); 
            } finally {
                setLoading(false);
            }
        };

        fetchSearchProducts();
    }, [keyword]);

    return { products, loading, error };
};

export default useSearchProduct;
