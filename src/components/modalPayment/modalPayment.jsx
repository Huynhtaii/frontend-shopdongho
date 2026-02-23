import React, { useEffect, useState, useContext } from 'react';
import { IoMdClose } from 'react-icons/io';
import { paymentAPI, paymentCompleted } from '../../services/payment_service';
import { toast } from 'react-toastify';
import AuthContext from '../../context/auth.context';

function ModalPayment({ isOpen, onClose, totalAmount, transferContent, cartItem, paymentMethod }) {
   // API DỮ LIỆU CHUYỂN TIỀN NHẬN TỪ GOOGLE SHEET
   // https://script.google.com/macros/s/AKfycbzNwXKfnWU0IOQv-ALzNJ_E-83PHGRi9F345WpeM2RE72olHfCJrUz01ySOiTVM0QaO/exec
   const [hasCheckedPayment, setHasCheckedPayment] = useState(false);
   const [checkingPayment, setCheckingPayment] = useState(false);
   //lấy ra userID
   const userID = localStorage.getItem('userId');
   //lấy ra email của user
   const { auth } = useContext(AuthContext);
   const userEmail = auth.user.email;
   const handlePayMentSuccess = async () => {
      try {
         const res = await paymentCompleted(userID, userEmail, totalAmount, cartItem, paymentMethod);

         console.log('Payment response:', res);
         toast.success('Thanh toán thành công!');
      } catch (error) {
         console.error('🔥 Lỗi khi thanh toán:', error);
         toast.error('Có lỗi xảy ra khi thanh toán!');
      }
   };
   useEffect(() => {
      if (!isOpen) return;
      console.log('🔥 useEffect chạy');
      setCheckingPayment(true);
      let checkCount = 0;
      const maxChecks = 10;

      const interval = setInterval(async () => {
         try {
            const data = await paymentAPI();
            if (!data || !data.data || !data.data.length) {
               console.log('⚠️ Không có dữ liệu giao dịch.');
               return;
            }

            const lastPaid = data.data[data.data.length - 1];
            const lastPaidContent = lastPaid['Mô tả'];
            const lastPaidPrice = lastPaid['Giá trị'];

            console.log('🔍 Kiểm tra giao dịch lần', checkCount + 1);
            console.log('📜 Nội dung giao dịch gốc:', lastPaidContent);
            console.log('📜 Nội dung mong muốn gốc:', transferContent);

            // Chuẩn hóa: Xóa "|" và khoảng trắng, chuyển về chữ thường
            const normalizedTransferContent = transferContent.replace(/\|/g, '').replace(/\s+/g, '').toLowerCase();
            const normalizedLastPaidContent = lastPaidContent.replace(/\|/g, '').replace(/\s+/g, '').toLowerCase();

            console.log('🆕 Nội dung giao dịch sau khi chuẩn hóa:', normalizedLastPaidContent);
            console.log('🆕 Nội dung mong muốn sau khi chuẩn hóa:', normalizedTransferContent);
            console.log('✅ So khớp lần 2:', normalizedLastPaidContent.includes(normalizedTransferContent));
            console.log('💰 Số tiền nhận được:', lastPaidPrice);
            console.log('💰 Số tiền đủ?', lastPaidPrice >= totalAmount);

            if (normalizedLastPaidContent.includes(normalizedTransferContent) && lastPaidPrice >= totalAmount) {
               console.log('🎉 Thanh toán hợp lệ, đóng modal.');
               clearInterval(interval);
               setCheckingPayment(false);
               setHasCheckedPayment(true);
               alert('🎉 Thanh toán thành công!');
               handlePayMentSuccess();
               onClose();
               return;
            }

            checkCount++;
            if (checkCount >= maxChecks) {
               console.log('❌ Hết số lần kiểm tra, đóng modal.');
               clearInterval(interval);
               setCheckingPayment(false);
               alert('❌ Hết thời gian kiểm tra hoặc không có thanh toán hợp lệ, vui lòng thử lại.');
               onClose();
            }
         } catch (error) {
            console.error('❌ Lỗi kiểm tra thanh toán:', error);
            clearInterval(interval);
            setCheckingPayment(false);
            alert('Lỗi khi kiểm tra thanh toán!');
         }
      }, 6000);

      return () => {
         console.log('⛔ Clearing interval...');
         clearInterval(interval);
      };
   }, [isOpen, totalAmount, transferContent]);

   const handleClose = () => {
      console.log('Closing modal...');
      if (onClose) {
         onClose();
      }
   };

   if (!isOpen) return null;

   let amount = totalAmount ? totalAmount.toLocaleString('vi-VN') : '0';
   let QR = `https://img.vietqr.io/image/${process.env.REACT_APP_BANK_ID}-${process.env.REACT_APP_ACCOUNT_NO}-qr_only.png?amount=${totalAmount}&addInfo=${transferContent}&accountName=Nguyen%20Van%20A`;
   return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center">
         {/* Overlay - Thêm pointer-events-auto để đảm bảo có thể click */}
         <div className="absolute inset-0 bg-black opacity-50 pointer-events-auto" onClick={handleClose} />

         {/* Modal content */}
         <div className="relative bg-white rounded-lg p-6 w-[800px] max-w-[95%] z-[9999]">
            {/* Close button */}
            <button
               onClick={handleClose}
               className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer"
            >
               <IoMdClose size={24} />
            </button>

            <div className="flex gap-6">
               {/* Left section - QR Code */}
               <div className="flex-1">
                  {/* Modal header */}
                  <div className="text-center mb-6">
                     <h2 className="text-2xl font-bold text-gray-800">Thanh toán QR</h2>
                     <p className="text-red-600 mt-2 font-bold">
                        Số tiền: {totalAmount ? totalAmount.toLocaleString('vi-VN') : '0'}đ
                     </p>
                     {/* Hiển thị mã đơn hàng */}
                     <p className="text-sm text-gray-600 mt-1">Nội dung chuyển khoản: {transferContent}</p>
                     {checkingPayment && (
                        <div className="mt-2">
                           <p className="text-yellow-500">⏳ Đang kiểm tra thanh toán...</p>
                        </div>
                     )}
                  </div>
                  {/* QR Code */}
                  <div className="flex flex-col items-center">
                     <div className="border-2 border-gray-200 p-4 rounded-lg">
                        <img src={QR} alt="QR Payment" className="w-64 h-64 object-contain" />
                     </div>
                  </div>
               </div>

               {/* Right section - Information and Instructions */}
               <div className="flex-1 flex flex-col justify-between">
                  {/* Bank Information */}
                  <div>
                     <div className="mb-6">
                        <h3 className="font-semibold text-lg mb-3">Thông tin chuyển khoản</h3>
                        <div className="space-y-2 text-gray-600">
                           <p className="flex justify-between">
                              <span>Ngân hàng:</span>
                              <span className="font-medium">{process.env.REACT_APP_BANK_ID}</span>
                           </p>
                           <p className="flex justify-between">
                              <span>Số tài khoản:</span>
                              <span className="font-medium">{process.env.REACT_APP_ACCOUNT_NO}</span>
                           </p>
                           <p className="flex justify-between">
                              <span>Chủ tài khoản:</span>
                              <span className="font-medium">Công Minh</span>
                           </p>
                        </div>
                     </div>

                     {/* Instructions */}
                     <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold mb-3">Hướng dẫn thanh toán:</h3>
                        <ol className="list-decimal list-inside space-y-2 text-gray-600">
                           <li>Mở ứng dụng ngân hàng hoặc ví điện tử của bạn</li>
                           <li>Quét mã QR bên cạnh</li>
                           <li>Kiểm tra thông tin và số tiền thanh toán</li>
                           <li>Xác nhận thanh toán</li>
                        </ol>
                     </div>
                  </div>

                  {/* Note */}
                  <div className="mt-4 text-sm text-gray-500 italic">
                     Lưu ý: Vui lòng giữ lại biên lai thanh toán cho đến khi đơn hàng hoàn tất
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}

export default ModalPayment;
