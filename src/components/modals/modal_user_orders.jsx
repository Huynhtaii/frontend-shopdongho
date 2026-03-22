import React from 'react';
import { FiX } from 'react-icons/fi';

const ModalUserOrders = ({ user, orders, onClose }) => {
   const formatVND = (amount) =>
      new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

   const statusConfig = {
      Pending: { label: 'Đang chờ xử lý', color: 'bg-amber-100 text-amber-700' },
      Shipped: { label: 'Đang giao hàng', color: 'bg-blue-100 text-blue-700' },
      Completed: { label: 'Đã giao hàng', color: 'bg-emerald-100 text-emerald-700' },
      Canceled: { label: 'Đã hủy', color: 'bg-red-100 text-red-600' },
   };

   return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
         <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
               <div>
                  <h2 className="text-xl font-bold text-gray-800">Lịch sử đơn hàng</h2>
                  <p className="text-sm text-gray-500 mt-1">
                     Khách hàng: <span className="font-semibold text-gray-700">{user?.name}</span> ({user?.email})
                  </p>
               </div>
               <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
               >
                  <FiX size={24} />
               </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
               {orders && orders.length > 0 ? (
                  <div className="overflow-x-auto">
                     <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                           <tr>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                 Mã ĐH
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                 Ngày đặt
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                 Sản phẩm
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                 Tổng tiền
                              </th>
                              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                 Trạng thái
                              </th>
                           </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                           {orders.map((order) => {
                              const status = statusConfig[order.status] || {
                                 label: order.status,
                                 color: 'bg-gray-100 text-gray-600',
                              };
                              return (
                                 <tr key={order.order_id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                                       #{order.order_id}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                                       {new Date(order.order_date).toLocaleDateString('vi-VN')}
                                    </td>
                                    <td className="px-4 py-4 text-sm text-gray-600">
                                       <div className="max-w-xs truncate">
                                          {order.order_items?.map((item, idx) => (
                                             <div key={idx} className="truncate">
                                                {item.Product?.name} (x{item.quantity})
                                             </div>
                                          ))}
                                       </div>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-red-600">
                                       {formatVND(order.total_amount)}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-center text-sm">
                                       <span
                                          className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase ${status.color}`}
                                       >
                                          {status.label}
                                       </span>
                                    </td>
                                 </tr>
                              );
                           })}
                        </tbody>
                     </table>
                  </div>
               ) : (
                  <div className="text-center py-12">
                     <p className="text-gray-500 italic">Người dùng này chưa có đơn hàng nào.</p>
                  </div>
               )}
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end">
               <button
                  onClick={onClose}
                  className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors"
               >
                  Đóng
               </button>
            </div>
         </div>
      </div>
   );
};

export default ModalUserOrders;
