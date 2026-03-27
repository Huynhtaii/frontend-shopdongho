import axios from '../utils/axios_config';

const FeedbackService = {
   create: async (data) => {
      const response = await axios.post('/v1/create/feedback', data, {
         headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response;
   },
   getAllFeedbacks: async () => {
      const response = await axios.get('/v1/read-all/feedbacks');
      return response;
   },
   toggleFeedbackStatus: async (id) => {
      const response = await axios.put(`/v1/update/feedback-status/${id}`);
      return response;
   },
   getFeedbacksByProductId: async (id) => {
      const response = await axios.get(`/v1/read/feedbacks/${id}`);
      return response;
   },
};

export default FeedbackService;
