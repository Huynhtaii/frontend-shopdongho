import axios from '../utils/axios_config';

const MessageService = {
   // Lấy lịch sử chat của user
   getChatHistory: async (userId) => {
      const url = `/v1/getChatHistory/${userId}`;
      return await axios.get(url);
   },

   // Gửi tin nhắn mới
   sendMessage: async (data) => {
      const url = '/v1/sendMessage';
      return await axios.post(url, data);
   },

   // get all chat của admin
   getAllChat: async () => {
      const url = '/v1/getAllChat';
      return await axios.get(url);
   },
};

export default MessageService;
