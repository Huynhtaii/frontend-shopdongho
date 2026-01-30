import axios from '../utils/axios_config';
const AccountService = {
   getInforAccount: (id) => {
      const url = `/v1/read/account-user/${id}`;
      const response = axios.get(url);
      return response;
   },
   updateInforAccount: (id, data) => {
      const url = `/v1/update/account-user/${id}`;
      const response = axios.put(url, data);
      return response;
   },
   getAccount: () => {
      const url = `/v1/account`;
      const response = axios.get(url);
      return response;
   },
};

export default AccountService;
