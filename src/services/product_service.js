import axios from '../utils/axios_config';

export const getProducts = async (limit = null) => {
    const response = await axios.get('/products', { params: { limit } });
    return response.data;
};



