import { useState, useEffect } from "react";
import ProductService from "../services/product_service";

const useProductByCategory = (name = '') => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [category, setCategory] = useState(name)

    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                setLoading(true);
                const data = await ProductService.getProductByCategory(category);
                setProducts(data.DT);
                setError(null);
            } catch (err) {
                setError(err.message || "Có lỗi xảy ra khi tải sản phẩm");
            } finally {
                setLoading(false);
            }
        };

        if (category) fetchAllProducts();
    }, [category]);

    return { products, loading, error, setCategory };
};

export default useProductByCategory;
