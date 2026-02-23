import axios from '../utils/axios_config';
const paymentAPI = async () => {
   try {
      console.log('Calling payment API...');
      const response = await fetch(
         `https://script.google.com/macros/s/AKfycbzNwXKfnWU0IOQv-ALzNJ_E-83PHGRi9F345WpeM2RE72olHfCJrUz01ySOiTVM0QaO/exec`,
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
