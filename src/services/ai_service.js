import axios from '../utils/axios_config';

const AIService = {
   consult: async (message, userId, sessionId) => {
      try {
         const response = await axios.post('/v1/ai/consult', { message, userId, sessionId });
         return response;
      } catch (error) {
         console.error('AI Service Error:', error);
         throw error;
      }
   },
   getHistory: async (userId, sessionId) => {
      try {
         const params = {};
         if (userId) params.userId = userId;
         if (sessionId) params.sessionId = sessionId;
         const response = await axios.get('/v1/ai/history', { params });
         return response;
      } catch (error) {
         console.error('AI History Error:', error);
         throw error;
      }
   },
};

export default AIService;
