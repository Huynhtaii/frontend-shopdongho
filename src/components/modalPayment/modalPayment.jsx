import { useEffect, useState, useContext, useCallback } from 'react';
import { IoMdClose } from 'react-icons/io';
import { MdOutlineAccountBalance, MdContentCopy, MdPerson, MdNumbers } from 'react-icons/md';
import { paymentAPI, paymentCompleted } from '../../services/payment_service';
import { toast } from 'react-toastify';
import AuthContext from '../../context/auth.context';
import { useCart } from '../../context/cart_context';
function ModalPayment({
   isOpen,
   onClose,
   totalAmount,
   transferContent,
   cartItem,
   paymentMethod,
   onOrderSuccess,
   onRegenerate,
}) {
   // API DỮ LIỆU CHUYỂN TIỀN NHẬN TỪ GOOGLE SHEET
   // https://script.google.com/macros/s/AKfycbzNwXKfnWU0IOQv-ALzNJ_E-83PHGRi9F345WpeM2RE72olHfCJrUz01ySOiTVM0QaO/exec
   const { fetchCart } = useCart();
   const [checkingPayment, setCheckingPayment] = useState(false);
   const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds

   //lấy ra userID
   const userID = localStorage.getItem('userId');
   //lấy ra email của user
   const { auth } = useContext(AuthContext);
   const userEmail = auth.user.email;

   // Format time from seconds to MM:SS
   const formatTime = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
   };

   const copyToClipboard = (text, label) => {
      navigator.clipboard
         .writeText(text)
         .then(() => {
            toast.info(`Đã sao chép ${label}`);
         })
         .catch((err) => {
            console.error('Lỗi khi sao chép:', err);
            toast.error('Không thể sao chép');
         });
   };
   const handlePayMentSuccess = useCallback(async () => {
      try {
         const res = await paymentCompleted(userID, userEmail, totalAmount, cartItem, paymentMethod);
         // Lấy order_id từ response trả về
         const order_id = res?.data?.DT?.order_id || null;

         fetchCart();
         if (onOrderSuccess) {
            const itemsToRate = cartItem.map((item) => ({
               product_id: item.product_id,
               productData: item.productData,
               order_id,
            }));
            onOrderSuccess(itemsToRate);
         }
         toast.success('Thanh toán thành công, vui lòng kiểm tra email!');
      } catch (error) {
         console.error('Lỗi khi thanh toán:', error);
         toast.error('Có lỗi xảy ra khi thanh toán!');
      }
   }, [userID, userEmail, totalAmount, cartItem, paymentMethod, fetchCart, onOrderSuccess]);

   const handleClose = useCallback(() => {
      if (onClose) {
         onClose();
      }
   }, [onClose]);

   // Reset timer when modal opens or transferContent changes (regeneration)
   useEffect(() => {
      if (isOpen) {
         setTimeLeft(300);
      }
   }, [isOpen, transferContent]);

   // Countdown logic
   useEffect(() => {
      if (!isOpen || timeLeft <= 0) return;

      const timer = setInterval(() => {
         setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
   }, [isOpen, timeLeft]);

   // Expiration logic
   useEffect(() => {
      if (isOpen && timeLeft === 0) {
         toast.warning('Hết thời gian thanh toán, vui lòng tạo mã mới.');
      }
   }, [isOpen, timeLeft]);

   useEffect(() => {
      if (!isOpen) return;

      setCheckingPayment(true);

      const interval = setInterval(async () => {
         try {
            const data = await paymentAPI();
            if (!data || !data.data || !data.data.length) {
               return;
            }

            const lastPaid = data.data[data.data.length - 1];
            const lastPaidContent = lastPaid['Mô tả'];
            const lastPaidPrice = lastPaid['Giá trị'];

            // Chuẩn hóa: Xóa "|" và khoảng trắng, chuyển về chữ thường
            const normalizedTransferContent = transferContent.replace(/\|/g, '').replace(/\s+/g, '').toLowerCase();
            const normalizedLastPaidContent = lastPaidContent.replace(/\|/g, '').replace(/\s+/g, '').toLowerCase();

            if (normalizedLastPaidContent.includes(normalizedTransferContent) && lastPaidPrice >= totalAmount) {
               clearInterval(interval);
               setCheckingPayment(false);
               handlePayMentSuccess();
               onClose();
               return;
            }
         } catch (error) {
            console.error('Lỗi kiểm tra thanh toán:', error);
            clearInterval(interval);
            setCheckingPayment(false);
         }
      }, 6000);

      return () => {
         clearInterval(interval);
      };
   }, [isOpen, totalAmount, transferContent, handlePayMentSuccess, onClose]);

   if (!isOpen) return null;

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
                     <p className="text-red-600 mt-4 font-bold text-lg">
                        Số tiền: {totalAmount ? totalAmount.toLocaleString('vi-VN') : '0'}đ
                     </p>
                     {/* Hiển thị mã đơn hàng */}
                     <p className="text-sm text-gray-600 mt-1">Nội dung chuyển khoản: {transferContent}</p>
                     {checkingPayment && (
                        <div className="mt-4 flex justify-center items-center gap-2">
                           <span className="relative flex h-3 w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                           </span>
                           <p className="text-blue-600 font-medium animate-pulse">Đang kiểm tra thanh toán...</p>
                        </div>
                     )}
                  </div>
                  {/* QR Code */}
                  <div className="flex flex-col items-center">
                     <div className="relative border-2 border-gray-200 p-4 rounded-lg overflow-hidden group">
                        <img
                           src={QR}
                           alt="QR Payment"
                           className={`w-64 h-64 object-contain transition-all duration-300 ${
                              timeLeft === 0 ? 'blur-sm grayscale opacity-40' : ''
                           }`}
                        />

                        {timeLeft === 0 && (
                           <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/20 backdrop-blur-[2px]">
                              <p className="text-red-600 font-bold mb-3 text-center px-4 bg-white/80 py-2 rounded-lg shadow-sm border border-red-100">
                                 Hết thời gian thanh toán
                              </p>
                              <button
                                 onClick={onRegenerate}
                                 className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-blue-200 active:scale-95 flex items-center gap-2 cursor-pointer"
                              >
                                 <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                 >
                                    <path
                                       strokeLinecap="round"
                                       strokeLinejoin="round"
                                       strokeWidth={2}
                                       d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                    />
                                 </svg>
                                 Tạo mã mới
                              </button>
                           </div>
                        )}
                     </div>

                     <div
                        className={`mt-4 p-2 rounded-lg inline-block border text-center transition-all ${
                           timeLeft === 0
                              ? 'bg-gray-50 border-gray-200 text-gray-400'
                              : 'bg-orange-50 border-orange-100'
                        }`}
                     >
                        <p className={`font-bold mb-1 text-xs uppercase tracking-wider ${
                           timeLeft === 0 ? 'text-gray-400' : 'text-orange-600'
                        }`}>
                           {timeLeft === 0 ? 'Mã đã hết hạn' : 'Mã QR hết hạn sau:'}
                        </p>
                        <p className={`text-2xl font-mono font-bold leading-none ${
                           timeLeft === 0 ? 'text-gray-400' : 'text-orange-700'
                        }`}>
                           {formatTime(timeLeft)}
                        </p>
                     </div>
                  </div>
               </div>

               {/* Right section - Information and Instructions */}
               <div className="flex-1 flex flex-col justify-between">
                  {/* Bank Information */}
                  <div>
                     <div className="mb-6">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-800 border-b pb-2">
                           <MdOutlineAccountBalance className="text-blue-600" size={24} />
                           Thông tin chuyển khoản
                        </h3>
                        <div className="space-y-3">
                           {/* Bank Name Card */}
                           <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100 group transition-all hover:bg-white hover:border-blue-200 hover:shadow-sm">
                              <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-full text-blue-600">
                                 <MdOutlineAccountBalance size={20} />
                              </div>
                              <div className="flex-1">
                                 <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                                    Ngân hàng
                                 </p>
                                 <p className="font-bold text-gray-800">{process.env.REACT_APP_BANK_ID}</p>
                              </div>
                           </div>

                           {/* Account Number Card */}
                           <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100 group transition-all hover:bg-white hover:border-blue-200 hover:shadow-sm">
                              <div className="w-10 h-10 flex items-center justify-center bg-green-100 rounded-full text-green-600 font-bold">
                                 <MdNumbers size={20} />
                              </div>
                              <div className="flex-1">
                                 <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                                    Số tài khoản
                                 </p>
                                 <p className="font-mono text-lg font-bold text-gray-800 tracking-wider">
                                    {process.env.REACT_APP_ACCOUNT_NO}
                                 </p>
                              </div>
                              <button
                                 onClick={() => copyToClipboard(process.env.REACT_APP_ACCOUNT_NO, 'số tài khoản')}
                                 className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                 title="Sao chép số tài khoản"
                              >
                                 <MdContentCopy size={20} />
                              </button>
                           </div>

                           {/* Account Holder Card */}
                           <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100 group transition-all hover:bg-white hover:border-blue-200 hover:shadow-sm">
                              <div className="w-10 h-10 flex items-center justify-center bg-purple-100 rounded-full text-purple-600">
                                 <MdPerson size={20} />
                              </div>
                              <div className="flex-1">
                                 <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                                    Chủ tài khoản
                                 </p>
                                 <p className="font-bold text-gray-800 uppercase">Nguyễn Quốc Quý</p>
                              </div>
                           </div>
                        </div>
                     </div>

                     {/* Instructions */}
                     <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                        <h3 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                           <div className="w-1.5 h-4 bg-blue-600 rounded-full" />
                           Hướng dẫn thanh toán
                        </h3>
                        <div className="grid gap-3">
                           {[
                              'Mở ứng dụng ngân hàng hoặc ví điện tử',
                              'Quét mã QR hoặc nhập thông tin thủ công',
                              'Kiểm tra kỹ nội dung và số tiền',
                              'Xác nhận và hoàn tất giao dịch',
                           ].map((text, idx) => (
                              <div key={idx} className="flex items-start gap-3">
                                 <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold mt-0.5">
                                    {idx + 1}
                                 </div>
                                 <p className="text-sm text-gray-600 leading-tight">{text}</p>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>

                  {/* Note */}
                  <div className="mt-6 flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100">
                     <div className="w-5 h-5 flex items-center justify-center text-amber-500 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                           />
                        </svg>
                     </div>
                     <p className="text-xs text-amber-700 italic leading-snug">
                        Lưu ý: Vui lòng giữ lại biên lai thanh toán cho đến khi đơn hàng hoàn tất. Đừng đóng cửa sổ này
                        khi hệ thống đang kiểm tra.
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}

export default ModalPayment;
