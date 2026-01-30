import axios from '../utils/axios_config';

const CategoryService = {
    getAllCategories: async () => {
        const url = '/v1/read-all/categories'
        const response = await axios.get(url);
        return response;
    }
};

export default CategoryService;