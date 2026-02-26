import axios from '../utils/axios_config';

const FeedbackService = {
   create: async (data) => {
      const response = await axios.post('/v1/create/feedback', data);
      return response;
   },
};

export default FeedbackService;
