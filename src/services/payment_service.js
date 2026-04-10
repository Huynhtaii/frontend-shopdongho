import axios from '../utils/axios_config';
const paymentAPI = async () => {
   try {
      console.log('Calling payment API...');
      const response = await fetch(
         `https://script.google.com/macros/s/AKfycbzx7aAOPh2P4azj4zsYk_TWhpN2PaymtXYRMoBjpysbUghlamJ8POOrcxoMwhuwIK4/exec`,
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
const paymentCompleted = async (userId, userEmail, totalAmount, cartItem, paymentMethod, shippingInfo) => {
   console.log(userId, userEmail, totalAmount, cartItem, shippingInfo);

   try {
      const url = '/v1/update-payment';
      const response = await axios.post(url, {
         id: userId,
         email: userEmail,
         totalAmount: totalAmount,
         cartItem: cartItem,
         paymentMethod,
         shippingInfo,
      });
      return response;
   } catch (error) {
      console.error('paymentCompleted API Error:', error);
      throw error;
   }
};
export { paymentAPI, paymentCompleted };
