import axios from "../utils/axios_config";

const ProductService = {
    getAllProducts: async (limit = null) => {
        const url = '/v1/read-all/products'
        const response = await axios.get(url, { params: { limit } });
        return response;
    },
    getProductByCategory: async (name) => {
        const url = `/v1/read-product-by-categories/${name}`
        const response = await axios.get(url);
        return response;
    },
    getRecentProducts: async (recentProduct) => {
        const url = '/v1/recent-products'
        const response = await axios.get(url, { params: { arrId: recentProduct } });
        return response;
    },
    getProductById: async (id) => {
        const urlAPI = `/v1/product/${id}`;
        return await axios.get(urlAPI);
    }
};

export default ProductService;