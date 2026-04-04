import axios from '../utils/axios_config';
const paymentAPI = async () => {
   try {
      console.log('Calling payment API...');
      const response = await fetch(
         `https://script.google.com/macros/s/AKfycbzX3up8YmPW9uqDjT2_r6OQ3ROw5Sz4IBD3JL41xdmpJaeOlhHf0EXvcjk1LXfWRFDF/exec`,
      );
      console.log('API Response:', response);
      const data = await response.json();
      console.log('API Data:', data);
      return data;
   } catch (error) {
      console.error('Payment API Error:', error);
      throw error;
   }
};
const paymentCompleted = async (userId, userEmail, totalAmount, cartItem, paymentMethod) => {
   console.log(userId, userEmail, totalAmount, cartItem);

   try {
      const url = '/v1/update-payment';
      const response = await axios.post(url, {
         id: userId,
         email: userEmail,
         totalAmount: totalAmount,
         cartItem: cartItem,
         paymentMethod,
      });
      return response;
   } catch (error) {
      console.error('paymentCompleted API Error:', error);
      throw error;
   }
};
export { paymentAPI, paymentCompleted };
