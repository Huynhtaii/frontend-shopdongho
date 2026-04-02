import React, { useEffect, useState } from 'react';
import { FaEdit, FaArrowRight, FaSpinner, FaUndo, FaCheck } from 'react-icons/fa';
import { toast } from 'react-toastify';
import ModalUpdateOrder from '../../components/modals/modal_update_order';
import OrderService from '../../services/order_service';
import Pagination from '../../components/pagination';

const OrderAdmin = () => {
   const [orders, setOrders] = useState([]);
   const [isModalVisible, setIsModalVisible] = useState(false);
   const [isDetailModalVisible, setIsDetailModalVisible] = useState(0);
   const [selectedOrder, setSelectedOrder] = useState(null);
   const [loadingOrderId, setLoadingOrderId] = useState(null);

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

   const handleRefundSuccess = async (e, order) => {
      e.stopPropagation();
      setLoadingOrderId(order.order_id);
      try {
         const res = await OrderService.updateOrderStatus(order.order_id, null, 'Refunded');
         if (res?.EC === '0') {
            toast.success('Đã xác nhận hoàn tiền thành công!');
            fetchData();
         } else {
            toast.error(res?.EM || 'Lỗi khi cập nhật trạng thái hoàn tiền');
         }
      } catch (error) {
         console.error('Lỗi khi hoàn tiền:', error);
         toast.error('Có lỗi xảy ra, vui lòng thử lại!');
      } finally {
         setLoadingOrderId(null);
      }
   };

   const handleEdit = (e, order) => {
      e.stopPropagation();
      setSelectedOrder(order);
      setIsModalVisible(true);
   };

   const formatCurrency = (amount) => {
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
   };

   const getStatusBadgeClass = (status) => {
      switch (status) {
         case 'Completed':
            return 'bg-green-100 text-green-800';
         case 'Pending':
            return 'bg-yellow-100 text-yellow-800';
         case 'Shipped':
            return 'bg-blue-100 text-blue-800';
         case 'Canceled':
            return 'bg-red-100 text-red-800';
         case 'FailedDelivery':
            return 'bg-orange-100 text-orange-800';
         case 'Returned to shop':
            return 'bg-purple-100 text-purple-800';
         case 'ReturnRequested':
            return 'bg-indigo-100 text-indigo-800';
         default:
            return 'bg-gray-100 text-gray-800';
      }
   };

   const getStatusLabel = (status) => {
      switch (status) {
         case 'Pending':
            return 'Chờ xác nhận';
         case 'Shipped':
            return 'Đang giao hàng';
         case 'Completed':
            return 'Hoàn thành';
         case 'Canceled':
            return 'Đã hủy';
         case 'FailedDelivery':
            return 'Giao thất bại';
         case 'Returned to shop':
            return 'Trả hàng';
         case 'ReturnRequested':
            return 'Đang yêu cầu trả hàng';
         default:
            return status;
      }
   };

   const getPaymentStatusLabel = (status) => {
      switch (status) {
         case 'Pending':
            return 'Chờ thanh toán';
         case 'Success':
            return 'Đã thanh toán';
         case 'Failed':
            return 'Thất bại';
         case 'RefundPending':
            return 'Chờ hoàn tiền';
         case 'Refunded':
            return 'Đã hoàn tiền';
         default:
            return status;
      }
   };

   const handleUpdateStatus = async (orderId, status, paymentStatus) => {
      setLoadingOrderId(orderId);
      try {
         await OrderService.updateOrderStatus(orderId, status, paymentStatus);
         toast.success('Cập nhật trạng thái đơn hàng thành công');
         fetchData();
      } catch (error) {
         toast.error('Có lỗi xảy ra khi cập nhật trạng thái đơn hàng' + error);
      } finally {
         setLoadingOrderId(null);
      }
   };

   const handleNextStatus = async (e, order) => {
      e.stopPropagation();
      let nextStatus = '';
      let nextPaymentStatus = order.Payment?.status || 'Pending';

      switch (order.status) {
         case 'Pending':
            nextStatus = 'Shipped';
            break;
         case 'Shipped':
            nextStatus = 'Completed';
            // Không tự động set Success, để logic backend hoặc admin manual xử lý
            break;
         case 'FailedDelivery':
            nextStatus = 'Returned to shop';
            break;
         case 'ReturnRequested':
            nextStatus = 'Returned to shop';
            break;
         default:
            return;
      }

      setLoadingOrderId(order.order_id);
      try {
         await OrderService.updateOrderStatus(order.order_id, nextStatus, null);
         const successMsg = nextStatus === 'Returned to shop' && order.status === 'ReturnRequested' 
            ? 'Đã duyệt yêu cầu trả hàng và chuyển sang Chờ hoàn tiền'
            : `Đã chuyển trạng thái sang ${getStatusLabel(nextStatus)}`;
         toast.success(successMsg);
         fetchData();
      } catch (error) {
         toast.error('Có lỗi xảy ra khi chuyển trạng thái: ' + error);
      } finally {
         setLoadingOrderId(null);
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
                     <option value="Pending">Chờ xác nhận</option>
                     <option value="Shipped">Đang giao</option>
                     <option value="Completed">Hoàn thành</option>
                     <option value="Canceled">Đã hủy</option>
                     <option value="FailedDelivery">Giao thất bại</option>
                     <option value="Returned to shop">Trả hàng</option>
                     <option value="ReturnRequested">Yêu cầu trả hàng</option>
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
                     <option value="Pending">Chờ thanh toán</option>
                     <option value="Success">Đã thanh toán</option>
                     <option value="Failed">Thất bại</option>
                     <option value="RefundPending">Chờ hoàn tiền</option>
                     <option value="Refunded">Đã hoàn tiền</option>
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
                                    {getStatusLabel(order.status)}
                                 </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                 <div className="flex flex-col gap-1">
                                    <span
                                       className={`px-2 py-1 rounded-full text-xs w-fit ${
                                          order.Payment?.status === 'Success' || order.Payment?.status === 'Refunded'
                                             ? 'bg-green-100 text-green-800'
                                             : order.Payment?.status === 'RefundPending'
                                               ? 'bg-orange-100 text-orange-800'
                                               : 'bg-yellow-100 text-yellow-800'
                                       }`}
                                    >
                                       {getPaymentStatusLabel(order.Payment?.status || 'Pending')}
                                    </span>
                                    {order.Payment?.payment_method && (
                                       <span className="text-[11px] text-gray-500 font-medium ml-1 italic">
                                          ({order.Payment.payment_method === 'cod' ? 'COD' : 'QR'})
                                       </span>
                                    )}
                                 </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(order.total_amount)}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                 {order.User?.name || `ID: ${order.user_id}`}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                                 <div className="flex gap-2 justify-center items-center">
                                    <div className="w-9 h-9 flex items-center justify-center">
                                       {(order.status === 'Pending' ||
                                          order.status === 'Shipped' ||
                                          order.status === 'FailedDelivery' ||
                                          order.status === 'ReturnRequested') && (
                                          <button
                                             className={`${
                                                loadingOrderId === order.order_id
                                                   ? order.status === 'ReturnRequested' ? 'bg-indigo-300' : 'bg-blue-300'
                                                   : order.status === 'ReturnRequested' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-blue-500 hover:bg-blue-600'
                                             } text-white p-2 rounded flex items-center justify-center transition duration-200 w-full h-full`}
                                             onClick={(e) => handleNextStatus(e, order)}
                                             disabled={loadingOrderId === order.order_id}
                                             title={
                                                order.status === 'Pending'
                                                   ? 'Duyệt / Giao hàng'
                                                   : order.status === 'Shipped'
                                                     ? 'Hoàn thành'
                                                     : order.status === 'ReturnRequested'
                                                       ? 'Duyệt yêu cầu trả hàng'
                                                       : 'Chuyển về cửa hàng'
                                             }
                                          >
                                             {loadingOrderId === order.order_id ? (
                                                <FaSpinner className="animate-spin" />
                                             ) : order.status === 'ReturnRequested' ? (
                                                <FaCheck />
                                             ) : (
                                                <FaArrowRight />
                                             )}
                                          </button>
                                       )}
                                       {order.Payment?.status === 'RefundPending' && (
                                          <button
                                             className={`${
                                                loadingOrderId === order.order_id
                                                   ? 'bg-green-300'
                                                   : 'bg-green-500 hover:bg-green-600'
                                             } text-white px-3 py-1 rounded flex items-center justify-center transition duration-200 h-9 w-auto whitespace-nowrap text-xs font-bold`}
                                             onClick={(e) => handleRefundSuccess(e, order)}
                                             disabled={loadingOrderId === order.order_id}
                                             title="Xác nhận đã hoàn tiền"
                                          >
                                             {loadingOrderId === order.order_id ? (
                                                <FaSpinner className="animate-spin mx-4" />
                                             ) : (
                                                <>
                                                   <FaCheck className="mr-1.5" />
                                                   Hoàn tiền
                                                </>
                                             )}
                                          </button>
                                       )}
                                    </div>
                                    {/* Ẩn nút edit hoàn toàn nếu đã hoàn thành và thanh toán xong */}
                                    {!(order.status === 'Completed' && order.Payment?.status === 'Success') &&
                                       order.status !== 'Canceled' &&
                                       order.status !== 'Returned to shop' &&
                                       order.status !== 'ReturnRequested' && (
                                          <button
                                             className={`${
                                                loadingOrderId === order.order_id
                                                   ? 'bg-green-300'
                                                   : 'bg-green-500 hover:bg-green-600'
                                             } text-white p-2 rounded flex items-center justify-center transition duration-200 w-9 h-9`}
                                             onClick={(e) => handleEdit(e, order)}
                                             disabled={loadingOrderId === order.order_id}
                                             title="Chỉnh sửa chi tiết"
                                          >
                                             <FaEdit />
                                          </button>
                                       )}

                                    {/* Hiển thị nút Hoàn tiền/Trả hàng đặc biệt khi đã Completed nhưng chưa Success (COD) hoặc khi muốn hủy thủ công */}
                                    {order.status === 'Completed' && order.Payment?.status !== 'Success' && (
                                       <button
                                          className={`${
                                             loadingOrderId === order.order_id
                                                ? 'bg-red-300'
                                                : 'bg-red-500 hover:bg-red-600'
                                          } text-white p-2 rounded flex items-center justify-center transition duration-200 w-9 h-9`}
                                          onClick={(e) => handleEdit(e, order)}
                                          disabled={loadingOrderId === order.order_id}
                                          title="Hoàn tiền / Trả hàng"
                                       >
                                          <FaUndo />
                                       </button>
                                    )}
                                 </div>
                              </td>
                           </tr>
                           {isDetailModalVisible === order.order_id && (
                              <tr>
                                 <td colSpan="7" className="px-6 py-4 bg-gray-50">
                                    <div className="text-sm text-gray-600">
                                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pb-4 border-b border-gray-200">
                                          <div>
                                             <div className="font-semibold mb-1 text-blue-700">
                                                Thông tin khách hàng
                                             </div>
                                             <p>
                                                <span className="font-medium text-gray-500">Người nhận:</span>{' '}
                                                <span className="text-gray-800 font-semibold">
                                                   {order.User?.name || 'N/A'}
                                                </span>
                                             </p>
                                             <p>
                                                <span className="font-medium text-gray-500">Số điện thoại:</span>{' '}
                                                <span className="text-gray-800 font-semibold">
                                                   {order.User?.phone || 'N/A'}
                                                </span>
                                             </p>
                                          </div>
                                          <div>
                                             <div className="font-semibold mb-1 text-blue-700">Địa chỉ giao hàng</div>
                                             <p className="text-gray-800 italic leading-snug">
                                                {order.User?.address || 'Chưa cập nhật địa chỉ'}
                                             </p>
                                          </div>
                                       </div>
                                       <div className="font-semibold mb-2 subrayado uppercase text-[11px] tracking-wider text-gray-800">
                                          Danh sách sản phẩm
                                       </div>
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
