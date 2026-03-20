import axios from '../utils/axios_config';

const BrandService = {
   getAll: async (isAdmin = false) => {
      const url = isAdmin ? '/v1/read/brand' : '/v1/read-all/brands';
      const response = await axios.get(url, { params: { isAdmin: isAdmin ? 'true' : 'false' } });
      return response;
   },
   getById: async (id) => {
      const response = await axios.get(`/v1/brand/${id}`);
      return response;
   },
   create: async (data) => {
      const response = await axios.post('/v1/create/brand', data);
      return response;
   },
   update: async (id, data) => {
      const response = await axios.put(`/v1/update/brand/${id}`, data);
      return response;
   },
   delete: async (id) => {
      const response = await axios.delete(`/v1/delete/brand/${id}`);
      return response;
   },
};

export default BrandService;
