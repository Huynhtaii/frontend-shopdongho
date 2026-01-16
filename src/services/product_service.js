import axios from "../utils/axios_config";

const getProductById = async (id) => {
  const urlAPI = `api/v1/product/${id}`;
  return await axios.get(urlAPI);
};

export default getProductById;
