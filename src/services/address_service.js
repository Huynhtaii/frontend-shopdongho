import axios from '../utils/axios_config';

const getUserAddresses = (userId) => {
   return axios.get(`/v1/addresses/${userId}`);
};

const createAddress = (data) => {
   return axios.post('/v1/addresses', data);
};

const updateAddress = (id, data) => {
   return axios.put(`/v1/addresses/${id}`, data);
};

const deleteAddress = (id) => {
   return axios.delete(`/v1/addresses/${id}`);
};

const setDefaultAddress = (id, userId) => {
   return axios.put(`/v1/addresses/${id}/set-default`, { user_id: userId });
};

export default {
   getUserAddresses,
   createAddress,
   updateAddress,
   deleteAddress,
   setDefaultAddress,
};
