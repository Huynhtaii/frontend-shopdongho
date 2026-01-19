import { useEffect, useState } from "react";
import ProductService from "../services/product_service";

const useRecentProduct = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRecentProducts = async () => {
            try {
                setLoading(true);

                // lấy mảng id từ localStorage
                const storedRecent = localStorage.getItem("recentProduct")
                const recentProduct = storedRecent ? JSON.parse(storedRecent) : []

                const data = await ProductService.getRecentProducts(recentProduct)
                setProducts(data.DT);
                setError(null);
            } catch (err) {
                setError(err.message || "Có lỗi xảy ra khi tải sản phẩm");
            } finally {
                setLoading(false);
            }
        };

        fetchRecentProducts();
    }, []);

    return { products, loading, error };
};

export default useRecentProduct;