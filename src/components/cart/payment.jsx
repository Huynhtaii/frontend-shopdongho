import { useEffect, useState } from 'react';
import AccountService from '../../services/account_service';
import ModalPayment from '../modalPayment/modalPayment';
import PaymentOption from './PaymentOption';

const Payment = ({ totalPrice, cartItem }) => {
   const [paymentMethod, setPaymentMethod] = useState('cod');
   const [userOrder, setUserOrder] = useState(null);
   const [isModalOpen, setIsModalOpen] = useState(false);
   // Lấy id tài khoản đã đăng nhập
   const user_id = localStorage.getItem('userId');
   console.log('>>>>>>>>>>>>>>>check user_id', user_id);
   useEffect(() => {
      if (user_id) {
         fetchUser();
      }
   }, []);
   const fetchUser = async () => {
      try {
         const response = await AccountService.getInforAccount(user_id);
         console.log('>>>>>>>>>>>>>>>check res order', response);
         if (response.EC === '0') {
            setUserOrder(response.DT);
         }
      } catch (error) {
         console.error('Lỗi khi gọi API:', error);
      }
   };

   // Hàm tạo nội dung chuyển khoản với phút và giây
   const createTransferContent = () => {
      // Lấy thời gian hiện tại
      const now = new Date();
      const minutes = now.getMinutes().toString().padStart(2, '0'); // Định dạng 2 chữ số
      const seconds = now.getSeconds().toString().padStart(2, '0');

      // Tạo phần user ID
      const userPart = `User${user_id}`;

      // Tạo phần sản phẩm
      const productParts = cartItem.map((item) => `P${item.product_id}x${item.quantity}`).join('');

      // Kết hợp tất cả phần + thời gian
      return `${userPart}${productParts}T${minutes}${seconds}`;
   };

   const handleOrderProduct = () => {
      const transferContent = createTransferContent();
      if (paymentMethod === 'qr_code') {
         setIsModalOpen(true);
      }
      console.log('Transfer content:', transferContent);
   };

   const handleCloseModal = () => {
      console.log('Handling modal close....');
      setIsModalOpen(false);
   };

   return (
      <div className="flex flex-col">
         <div className="mt-5 border-b pb-5">
            <div className="flex gap-3 mb-3">
               <h3 className="text-[14px] text-gray-500 font-[500]">
                  *Thông tin được lấy từ tài khoản của bạn, vui lòng nhập đầy đủ thông tin để đặt hàng <br /> (có thể
                  thay đổi hoặc bổ sung ở trang tài khoản)*
               </h3>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
               <p className="border rounded-md p-2 text-sm">{userOrder?.name || 'Chưa có tên'}</p>
               <p className="border rounded-md p-2 text-sm">{userOrder?.phone || 'Chưa có số điện thoại'}</p>
            </div>
            <div className="mb-3">
               <p className="border rounded-md p-2 text-sm">{userOrder?.email || 'Chưa có email'}</p>
            </div>
            <div className="mb-3">
               <p className="border rounded-md p-2 text-sm">{userOrder?.address || 'Chưa có địa chỉ'}</p>
            </div>
         </div>
         <div className="flex justify-between border-b py-5">
            <h3 className="text-[14px] font-[600]">Cần thanh toán:</h3>
            <p className="text-[#ed1c24] font-[600] text-[14px]">{totalPrice.toLocaleString()}đ</p>
         </div>
         <PaymentOption paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} />
         <button
            className="bg-blue-600 py-3 px-5 text-white rounded-md m-auto flex flex-col items-center text-[20px]"
            onClick={handleOrderProduct}
         >
            <h1 className="font-[500]">Đặt hàng</h1>
            <span className="text-xs pb-2">(Bằng cách đặt hàng bạn đồng ý với các điều khoản của chúng tôi)</span>
         </button>

         {paymentMethod === 'qr_code' && (
            <ModalPayment
               isOpen={isModalOpen}
               onClose={handleCloseModal}
               totalAmount={totalPrice}
               transferContent={createTransferContent()}
            />
         )}
      </div>
   );
};

export default Payment;
