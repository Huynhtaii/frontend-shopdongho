import { useState, useEffect } from "react";
import ProductService from "../services/product_service";

const useProducts = (limit = null) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                setLoading(true);
                const data = await ProductService.getAllProducts(limit);
                setProducts(data.DT);
                setError(null);
            } catch (err) {
                setError(err.message || "Có lỗi xảy ra khi tải sản phẩm");
            } finally {
                setLoading(false);
            }
        };

        fetchAllProducts();
    }, [limit]);

    return { products, loading, error };
};

export default useProducts;
