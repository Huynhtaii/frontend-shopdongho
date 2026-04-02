import { useState } from 'react';

const ModalUpdateOrder = ({ show, handleClose, orderId, currentStatus, currentPaymentStatus, onUpdateStatus }) => {
   const [status, setStatus] = useState(currentStatus);
   const [paymentStatus, setPaymentStatus] = useState(currentPaymentStatus || 'Pending');

   const handleSubmit = (e) => {
      e.preventDefault();
      onUpdateStatus(orderId, status, paymentStatus);
      handleClose();
   };

   if (!show) return null;

   const getAvailableStatuses = (current) => {
      switch (current) {
         case 'Pending':
            return [
               { value: 'Pending', label: 'Chờ xác nhận' },
               { value: 'Shipped', label: 'Đang giao hàng' },
               { value: 'Canceled', label: 'Hủy đơn hàng' },
            ];
         case 'Shipped':
            return [
               { value: 'Shipped', label: 'Đang giao hàng' },
               { value: 'Completed', label: 'Hoàn thành' },
               { value: 'FailedDelivery', label: 'Giao hàng thất bại' },
            ];
         case 'Completed':
            return [
               { value: 'Completed', label: 'Hoàn thành' },
               { value: 'Returned to shop', label: 'Trả hàng (Hoàn tiền)' },
            ];
         case 'Canceled':
            return [{ value: 'Canceled', label: 'Đã hủy' }];
         case 'FailedDelivery':
            return [
               { value: 'FailedDelivery', label: 'Giao hàng thất bại' },
               { value: 'Returned to shop', label: 'Chuyển về kho' },
            ];
         case 'Returned to shop':
            return [{ value: 'Returned to shop', label: 'Đã trả hàng' }];
         case 'ReturnRequested':
            return [
               { value: 'ReturnRequested', label: 'Đang yêu cầu trả hàng' },
               { value: 'Returned to shop', label: 'Duyệt trả hàng (Hoàn tiền)' },
               { value: 'Completed', label: 'Từ chối trả hàng (Hoàn thành)' },
            ];
         default:
            return [{ value: current, label: current }];
      }
   };

   const availableStatuses = getAvailableStatuses(currentStatus);

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
         {/* Overlay */}
         <div className="fixed inset-0 bg-black opacity-50" onClick={handleClose}></div>

         {/* Modal */}
         <div className="relative bg-white rounded-lg w-full max-w-md p-6 shadow-xl animate-modalScale">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
               <h3 className="text-xl font-bold text-gray-900 border-l-4 border-blue-600 pl-3">
                  Cập nhật đơn hàng #{orderId}
               </h3>
               <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
               </button>
            </div>

            {/* Body */}
            <form onSubmit={handleSubmit} className="space-y-6">
               <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                     Trạng thái đơn hàng
                  </label>
                  <select
                     value={status}
                     onChange={(e) => {
                        const newStatus = e.target.value;
                        setStatus(newStatus);
                        // Tự động gợi ý trạng thái thanh toán
                        if (newStatus === 'Completed') {
                           setPaymentStatus('Success');
                        } else if (newStatus === 'Returned to shop' || newStatus === 'Canceled') {
                           // Nếu đã thanh toán rồi mới Hủy/Trả thì gợi ý Chờ hoàn tiền
                           if (paymentStatus === 'Success') {
                              setPaymentStatus('RefundPending');
                           }
                        }
                     }}
                     disabled={currentStatus === 'Canceled' || currentStatus === 'Returned to shop'}
                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                     {availableStatuses.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                           {opt.label}
                        </option>
                     ))}
                  </select>
                  <p className="mt-1.5 text-[10px] text-gray-500 italic">
                     {currentStatus === 'Canceled' || currentStatus === 'Returned to shop'
                        ? 'Đơn hàng đã kết thúc, không thể thay đổi trạng thái.'
                        : 'Trạng thái đơn hàng chỉ có thể cập nhật theo đúng luồng nghiệp vụ.'}
                  </p>
               </div>

                <div>
                   <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                      Trạng thái thanh toán
                   </label>
                   <div className="flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-lg bg-gray-50">
                      <span
                         className={`px-3 py-1 rounded-full text-xs font-bold ${
                            paymentStatus === 'Success' || paymentStatus === 'Refunded'
                               ? 'bg-green-100 text-green-800'
                               : paymentStatus === 'RefundPending'
                                 ? 'bg-orange-100 text-orange-800'
                                 : 'bg-yellow-100 text-yellow-800'
                         }`}
                      >
                         {paymentStatus === 'Pending'
                            ? 'Chờ thanh toán'
                            : paymentStatus === 'Success'
                              ? 'Thanh toán thành công'
                              : paymentStatus === 'Failed'
                                ? 'Thanh toán thất bại'
                                : paymentStatus === 'RefundPending'
                                  ? 'Chờ hoàn tiền'
                                  : 'Đã hoàn tiền'}
                      </span>
                      <span className="text-[10px] text-gray-400 italic font-medium">
                         (Hệ thống sẽ tự động cập nhật)
                      </span>
                   </div>
                </div>

               {/* Footer */}
               <div className="flex justify-end gap-3 pt-4">
                  <button
                     type="button"
                     onClick={handleClose}
                     className="px-6 py-2.5 text-sm font-bold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
                  >
                     Đóng
                  </button>
                  <button
                     type="submit"
                     className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-md shadow-blue-200 transition-all active:scale-95"
                  >
                     Lưu thay đổi
                  </button>
               </div>
            </form>
         </div>
      </div>
   );
};

export default ModalUpdateOrder;
