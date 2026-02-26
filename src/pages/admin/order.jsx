import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import ModalUpdateOrder from '../../components/modals/modal_update_order';
import OrderService from '../../services/order_service';
import Pagination from '../../components/pagination';

const OrderAdmin = () => {
   const [orders, setOrders] = useState([]);
   const [isModalVisible, setIsModalVisible] = useState(false);
   const [isDetailModalVisible, setIsDetailModalVisible] = useState(0);
   const [selectedOrder, setSelectedOrder] = useState(null);

   // Filter states
   const [shippingFilter, setShippingFilter] = useState('All');
   const [paymentFilter, setPaymentFilter] = useState('All');

   // Pagination states
   const [currentPage, setCurrentPage] = useState(1);
   const itemsPerPage = 10;

   const fetchData = async () => {
      try {
         const ordersData = await OrderService.getAllOrders();
         setOrders(Array.isArray(ordersData.DT.orders) ? ordersData.DT.orders : []);
      } catch (error) {
         console.error('Error fetching orders:', error);
         toast.error('Có lỗi xảy ra khi tải dữ liệu hoá đơn');
         setOrders([]);
      }
   };

   useEffect(() => {
      fetchData();
   }, []);

   const filteredOrders = orders.filter((order) => {
      const matchShipping = shippingFilter === 'All' || order.status === shippingFilter;
      const matchPayment = paymentFilter === 'All' || (order.Payment?.status || 'Pending') === paymentFilter;
      return matchShipping && matchPayment;
   });

   // Reset to page 1 when filters change
   useEffect(() => {
      setCurrentPage(1);
   }, [shippingFilter, paymentFilter]);

   const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
   const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

   const handleViewDetails = (order) => {
      setSelectedOrder(order);
      setIsDetailModalVisible(isDetailModalVisible === order.order_id ? 0 : order.order_id);
   };

   const handleEdit = (e, order) => {
      e.stopPropagation();
      setSelectedOrder(order);
      setIsModalVisible(true);
   };

   const handleDelete = async (e, orderId) => {
      e.stopPropagation();
      if (window.confirm('Bạn có chắc chắn muốn xóa đơn hàng này?')) {
         try {
            await OrderService.deleteOrder(orderId);
            fetchData();
            toast.success('Xóa đơn hàng thành công');
         } catch (error) {
            toast.error('Có lỗi xảy ra khi xóa đơn hàng');
         }
      }
   };

   const formatCurrency = (amount) => {
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
   };

   const getStatusBadgeClass = (status) => {
      switch (status.toLowerCase()) {
         case 'completed':
            return 'bg-green-100 text-green-800';
         case 'pending':
            return 'bg-yellow-100 text-yellow-800';
         case 'shipped':
            return 'bg-red-100 text-red-800';
         case 'canceled':
            return 'bg-red-100 text-red-800';
         default:
            return 'bg-gray-100 text-gray-800';
      }
   };

   const handleUpdateStatus = async (orderId, status, paymentStatus) => {
      try {
         await OrderService.updateOrderStatus(orderId, status, paymentStatus);
         toast.success('Cập nhật trạng thái đơn hàng thành công');
         fetchData();
      } catch (error) {
         toast.error('Có lỗi xảy ra khi cập nhật trạng thái đơn hàng' + error);
      }
   };

   return (
      <div className="p-4 md:p-6">
         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h1 className="text-xl md:text-2xl font-semibold">Quản lý đơn hàng</h1>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 md:gap-4 w-full sm:w-auto">
               <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Giao hàng:</span>
                  <select
                     className="border border-gray-300 rounded px-3 py-1 text-sm outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                     value={shippingFilter}
                     onChange={(e) => setShippingFilter(e.target.value)}
                  >
                     <option value="All">Tất cả</option>
                     <option value="Pending">Pending</option>
                     <option value="Shipped">Shipped</option>
                     <option value="Completed">Completed</option>
                     <option value="Canceled">Canceled</option>
                  </select>
               </div>

               <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Thanh toán:</span>
                  <select
                     className="border border-gray-300 rounded px-3 py-1 text-sm outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                     value={paymentFilter}
                     onChange={(e) => setPaymentFilter(e.target.value)}
                  >
                     <option value="All">Tất cả</option>
                     <option value="Pending">Pending</option>
                     <option value="Success">Success</option>
                     <option value="Failed">Failed</option>
                  </select>
               </div>
            </div>
         </div>

         <div className="max-w-full overflow-x-auto border border-gray-200 rounded-lg bg-white shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
               <thead className="bg-gray-50">
                  <tr>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mã đơn hàng
                     </th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ngày đặt
                     </th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng thái đơn hàng
                     </th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thanh toán
                     </th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tổng tiền
                     </th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tên người dùng
                     </th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thao tác
                     </th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-200">
                  {paginatedOrders.length > 0 ? (
                     paginatedOrders.map((order) => (
                        <React.Fragment key={order.order_id}>
                           <tr className="hover:bg-gray-50" onClick={() => handleViewDetails(order)}>
                              <td className="px-6 py-4 whitespace-nowrap">{order.order_id}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                 {new Date(order.order_date).toLocaleDateString('vi-VN')}{' '}
                                 {new Date(order.order_date).toLocaleTimeString('vi-VN')}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                 <span
                                    className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(order.status)}`}
                                 >
                                    {order.status}
                                 </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                 <span
                                    className={`px-2 py-1 rounded-full text-xs ${
                                       order.Payment?.status === 'Success'
                                          ? 'bg-green-100 text-green-800'
                                          : 'bg-yellow-100 text-yellow-800'
                                    }`}
                                 >
                                    {order.Payment?.status || 'Pending'}
                                 </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(order.total_amount)}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                 {order.User?.name || `ID: ${order.user_id}`}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                                 <div className="flex gap-2">
                                    <button
                                       className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded flex items-center gap-1 transition duration-200"
                                       onClick={(e) => handleEdit(e, order)}
                                    >
                                       <FaEdit /> Cập nhật
                                    </button>
                                    <button
                                       className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1 transition duration-200"
                                       onClick={(e) => handleDelete(e, order.order_id)}
                                    >
                                       <FaTrash /> Xóa
                                    </button>
                                 </div>
                              </td>
                           </tr>
                           {isDetailModalVisible === order.order_id && (
                              <tr>
                                 <td colSpan="7" className="px-6 py-4 bg-gray-50">
                                    <div className="text-sm text-gray-600">
                                       <div className="font-semibold mb-2 subrayado">Chi tiết đơn hàng:</div>
                                       <table className="w-full">
                                          <thead>
                                             <tr className="border-b border-gray-300">
                                                <th className="text-left py-2">Sản phẩm</th>
                                                <th className="text-left py-2">Số lượng</th>
                                                <th className="text-left py-2 text-right">Đơn giá</th>
                                                <th className="text-left py-2 text-right">Thành tiền</th>
                                             </tr>
                                          </thead>
                                          <tbody>
                                             {order.order_items?.map((item) => (
                                                <tr key={item.order_item_id} className="border-b border-gray-200">
                                                   <td className="py-3">
                                                      <div className="flex items-center gap-2">
                                                         <img
                                                            src={
                                                               item.Product?.ProductImages?.[0]?.url ||
                                                               'https://via.placeholder.com/100'
                                                            }
                                                            alt={item.Product?.name}
                                                            className="w-10 h-10 object-cover rounded border"
                                                         />
                                                         <span>{item.Product?.name || 'Sản phẩm không xác định'}</span>
                                                      </div>
                                                   </td>
                                                   <td className="py-3 px-2 text-center">x{item.quantity}</td>
                                                   <td className="py-3 text-right">{formatCurrency(item.price)}</td>
                                                   <td className="py-3 text-right">
                                                      {formatCurrency(item.price * item.quantity)}
                                                   </td>
                                                </tr>
                                             ))}
                                          </tbody>
                                          <tfoot>
                                             <tr>
                                                <td colSpan="3" className="py-3 text-right font-semibold">
                                                   Tổng giá trị đơn hàng:
                                                </td>
                                                <td className="py-3 text-right font-bold text-lg text-red-600">
                                                   {formatCurrency(order.total_amount)}
                                                </td>
                                             </tr>
                                          </tfoot>
                                       </table>
                                    </div>
                                 </td>
                              </tr>
                           )}
                        </React.Fragment>
                     ))
                  ) : (
                     <tr>
                        <td colSpan="7" className="px-6 py-4 text-center">
                           Không có dữ liệu đơn hàng
                        </td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>

         <Pagination page={currentPage} totalPages={totalPages} setPage={setCurrentPage} />

         {isModalVisible && (
            <ModalUpdateOrder
               show={isModalVisible}
               handleClose={() => setIsModalVisible(false)}
               orderId={selectedOrder?.order_id}
               currentStatus={selectedOrder?.status}
               currentPaymentStatus={selectedOrder?.Payment?.status}
               onUpdateStatus={handleUpdateStatus}
            />
         )}
      </div>
   );
};

export default OrderAdmin;
