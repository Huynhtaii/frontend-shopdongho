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
    },
    getProductByCategoriesWithPaginate: async (page, limit, categoryName, filter) => {
        const url = `/v1/read-product-by-categories-with-pagination`;
        return await axios.get(url, { params: { page, limit, categoryName, filter } });
    },
    searchProducts: async (keyword) => {
        const url = `/v1/product-search?name=${keyword}`;
        const response = await axios.get(url);
        return response;
    },
    createProduct: async (data) => {
        const formData = new FormData();

        // Thêm dữ liệu text vào formData
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('price', data.price);
        formData.append('discount_price', data.discount_price);
        formData.append('rating', data.rating);
        formData.append('brand_id', data.brand_id);
        formData.append('category_id', data.category_id);
        formData.append('sku', data.sku);
        formData.append('images', data.images);

        const url = '/v1/create/product';
        return await axios.post(url, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    updateProduct: async (id, data) => {
        const formData = new FormData();

        // Thêm dữ liệu text vào formData
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('price', data.price);
        formData.append('discount_price', data.discount_price);
        formData.append('rating', data.rating);
        formData.append('brand_id', data.brand_id);
        formData.append('category_id', data.category_id);
        formData.append('sku', data.sku);
        const url = `/v1/update/product/${id}`;
        return await axios.put(url, formData);
    },
    deleteProduct: async (id) => {
        const url = `/v1/delete/product/${id}`;
        return await axios.delete(url);
    }

};

export default ProductService;