import axios from '../utils/axios_config';

const CategoryService = {
   getAll: async () => {
      const response = await axios.get('/v1/read-all/categories');
      return response;
   },
   getById: async (id) => {
      const response = await axios.get(`/v1/category/${id}`);
      return response;
   },
   create: async (data) => {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('description', data.description || '');
      if (data.imageFile) {
         formData.append('image', data.imageFile);
      }
      const response = await axios.post('/v1/create/category', formData, {
         headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response;
   },
   update: async (id, data) => {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('description', data.description || '');
      if (data.imageFile) {
         formData.append('image', data.imageFile);
      } else if (data.image) {
         formData.append('image', data.image);
      }
      const response = await axios.put(`/v1/update/category/${id}`, formData, {
         headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response;
   },
   delete: async (id) => {
      const response = await axios.delete(`/v1/delete/category/${id}`);
      return response;
   },
};

export default CategoryService;
