import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AccountService from '../../services/account_service';
import axios from '../../utils/axios_config';
import { toast } from 'react-toastify';
import ConfirmModal from '../../components/modals/confirm_modal';
import RatingModal from '../../components/modals/rating_modal';
import { useCart } from '../../context/cart_context';
import {
   FiUser,
   FiShoppingBag,
   FiPackage,
   FiChevronDown,
   FiChevronUp,
   FiArrowLeft,
   FiXCircle,
   FiStar,
   FiMapPin,
} from 'react-icons/fi';

const statusConfig = {
   Pending: { label: 'Chờ xác nhận', color: 'bg-amber-100 text-amber-700', dot: 'bg-amber-400' },
   Shipped: { label: 'Đang giao hàng', color: 'bg-blue-100 text-blue-700', dot: 'bg-blue-400' },
   Completed: { label: 'Hoàn thành', color: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-400' },
   Canceled: { label: 'Đã hủy', color: 'bg-red-100 text-red-600', dot: 'bg-red-400' },
   FailedDelivery: { label: 'Giao thất bại', color: 'bg-orange-100 text-orange-700', dot: 'bg-orange-400' },
   'Returned to shop': { label: 'Đã trả hàng', color: 'bg-purple-100 text-purple-700', dot: 'bg-purple-400' },
   ReturnRequested: { label: 'Yêu cầu trả hàng', color: 'bg-indigo-100 text-indigo-700', dot: 'bg-indigo-400' },
};

const formatVND = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

function OrderHistory() {
   const id = localStorage.getItem('userId');
   const [orders, setOrders] = useState([]);
   const [userName, setUserName] = useState('');
   const [loading, setLoading] = useState(true);
   const [expandedOrders, setExpandedOrders] = useState({});
   const [activeFilter, setActiveFilter] = useState('All');
   const [confirmModal, setConfirmModal] = useState({ isOpen: false, orderId: null });
   const [showRating, setShowRating] = useState(false);
   const [selectedOrder, setSelectedOrder] = useState(null);
   const { addToCart } = useCart();
   const navigate = useNavigate();

   const fetchData = useCallback(async () => {
      try {
         const response = await AccountService.getInforAccount(id);
         if (response?.EC === '0') {
            setOrders(response.DT.orders || []);
            setUserName(response.DT.name || '');
         }
      } catch (error) {
         console.error('Lỗi khi lấy lịch sử đơn hàng:', error);
      } finally {
         setLoading(false);
      }
   }, [id]);

   useEffect(() => {
      fetchData();
   }, [fetchData]);

   const toggleOrder = (orderId) => {
      setExpandedOrders((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
   };

   const handleCancelOrder = (orderId) => {
      setConfirmModal({ isOpen: true, orderId });
   };

   const handleConfirmCancel = async () => {
      const orderId = confirmModal.orderId;
      setConfirmModal({ isOpen: false, orderId: null });
      try {
         const res = await axios.put(`/v1/cancel/order/${orderId}`);
         if (res?.EC === '0') {
            toast.success('Hủy đơn hàng thành công!');
            fetchData();
         } else {
            toast.error(res?.EM || 'Không thể hủy đơn hàng này');
         }
      } catch (error) {
         toast.error('Có lỗi xảy ra, vui lòng thử lại!');
      }
   };

   const handleReorder = async (order) => {
      try {
         // Thêm từng sản phẩm vào giỏ hàng
         for (const item of order.order_items) {
            const cartItem = {
               product_id: item.product_id,
               quantity: item.quantity,
            };
            // Cần productDetail để hiển thị đúng trong UI giỏ hàng nếu là khách
            await addToCart(cartItem, item.Product);
         }
         toast.success('Đã thêm các sản phẩm vào giỏ hàng');
         navigate('/cart');
      } catch (error) {
         console.error('Lỗi khi mua lại:', error);
         toast.error('Có lỗi xảy ra khi thêm vào giỏ hàng');
      }
   };

   if (loading) {
      return (
         <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
               <div className="w-10 h-10 rounded-full border-4 border-red-200 border-t-red-600 animate-spin" />
               <p className="text-slate-500 text-sm">Đang tải đơn hàng...</p>
            </div>
         </div>
      );
   }

   return (
      <>
         <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50 py-10 px-4">
            <div className="layout-container">
               {/* Header */}
               <div className="mb-8 text-center">
                  <h1 className="text-3xl font-bold text-slate-800">Lịch sử mua hàng</h1>
                  <p className="text-slate-500 mt-1 text-sm">Xem lại toàn bộ đơn hàng của bạn</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Sidebar */}
                  <div className="md:col-span-1">
                     <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                        <div className="bg-gradient-to-br from-red-500 to-rose-600 p-6 flex flex-col items-center">
                           <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/50 flex items-center justify-center">
                              <FiUser size={24} className="text-white" />
                           </div>
                           <h2 className="mt-3 text-white font-semibold text-base text-center">
                              {userName || 'Người dùng'}
                           </h2>
                           <p className="text-red-100 text-xs mt-1">{orders.length} đơn hàng</p>
                        </div>
                        <div className="p-3">
                           <div className="flex flex-col gap-1">
                              <Link
                                 to="/account"
                                 state={{ tab: 'profile' }}
                                 className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors text-sm font-medium"
                              >
                                 <FiUser size={16} />
                                 <span>Thông tin cá nhân</span>
                              </Link>
                              <Link
                                 to="/account"
                                 state={{ tab: 'addresses' }}
                                 className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors text-sm font-medium"
                              >
                                 <FiMapPin size={16} />
                                 <span>Sổ địa chỉ</span>
                              </Link>
                              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 text-red-600 font-medium text-sm shadow-sm ring-1 ring-red-100/50">
                                 <FiShoppingBag size={16} />
                                 <span>Lịch sử mua hàng</span>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Orders list */}
                  <div className="md:col-span-2">
                     {/* Filter tabs */}
                     <div className="flex flex-wrap gap-2 mb-4">
                        {[
                           { key: 'All', label: 'Tất cả' },
                           { key: 'Pending', label: 'Chờ xác nhận' },
                           { key: 'Shipped', label: 'Đang giao' },
                           { key: 'Completed', label: 'Hoàn thành' },
                           { key: 'FailedDelivery', label: 'Thất bại' },
                           { key: 'Returned to shop', label: 'Trả hàng' },
                           { key: 'Canceled', label: 'Đã hủy' },
                        ].map(({ key, label }) => {
                           const count = key === 'All' ? orders.length : orders.filter((o) => o.status === key).length;
                           const isActive = activeFilter === key;
                           return (
                              <button
                                 key={key}
                                 onClick={() => setActiveFilter(key)}
                                 className={`inline-flex items-center z-[9999] gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                    isActive
                                       ? 'bg-red-600 text-white shadow-md shadow-red-200'
                                       : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                                 }`}
                              >
                                 {label}
                                 <span
                                    className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                                       isActive ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-500'
                                    }`}
                                 >
                                    {count}
                                 </span>
                              </button>
                           );
                        })}
                     </div>

                     {/* Orders */}
                     <div className="space-y-4">
                        {(() => {
                           const filtered =
                              activeFilter === 'All' ? orders : orders.filter((o) => o.status === activeFilter);
                           if (filtered.length === 0)
                              return (
                                 <div className="bg-white rounded-2xl shadow-md p-12 flex flex-col items-center gap-4">
                                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                                       <FiPackage size={28} className="text-slate-400" />
                                    </div>
                                    <p className="text-slate-500 font-medium">
                                       {activeFilter === 'All'
                                          ? 'Bạn chưa có đơn hàng nào'
                                          : 'Không có đơn hàng nào trong mục này'}
                                    </p>
                                    {activeFilter === 'All' && (
                                       <Link
                                          to="/category/all"
                                          className="px-5 py-2 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors"
                                       >
                                          Mua sắm ngay
                                       </Link>
                                    )}
                                 </div>
                              );
                           return filtered.map((order) => {
                              const status = statusConfig[order.status] || statusConfig.Pending;
                              const isExpanded = expandedOrders[order.order_id];
                              return (
                                 <div key={order.order_id} className="bg-white rounded-2xl shadow-md overflow-hidden">
                                    {/* Order header */}
                                    <button
                                       onClick={() => toggleOrder(order.order_id)}
                                       className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors text-left"
                                    >
                                       <div className="flex items-center gap-4">
                                          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                                             <FiPackage size={18} className="text-red-500" />
                                          </div>
                                          <div>
                                             <p className="font-semibold text-slate-800 text-sm">
                                                Đơn hàng #{order.order_id}
                                             </p>
                                             <p className="text-xs text-slate-400 mt-0.5">
                                                {new Date(order.order_date).toLocaleDateString('vi-VN', {
                                                   day: '2-digit',
                                                   month: '2-digit',
                                                   year: 'numeric',
                                                })}
                                             </p>
                                          </div>
                                       </div>
                                       <div className="flex items-center gap-3">
                                          <span
                                             className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${status.color}`}
                                          >
                                             <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                                             {status.label}
                                          </span>
                                          {isExpanded ? (
                                             <FiChevronUp size={16} className="text-slate-400" />
                                          ) : (
                                             <FiChevronDown size={16} className="text-slate-400" />
                                          )}
                                       </div>
                                    </button>

                                    {/* Order detail (expandable) */}
                                    {isExpanded && (
                                       <div className="border-t border-slate-100 px-5 pb-5">
                                          <div className="space-y-3 mt-4">
                                             {order.order_items?.map((item, idx) => (
                                                <div
                                                   key={idx}
                                                   className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0"
                                                >
                                                   <div className="flex items-center gap-3">
                                                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 text-xs font-bold flex-shrink-0">
                                                         {idx + 1}
                                                      </div>
                                                      <div>
                                                         <p className="text-sm font-medium text-slate-700 line-clamp-1">
                                                            {item.Product?.name}
                                                         </p>
                                                         <p className="text-xs text-slate-400">x{item.quantity}</p>
                                                      </div>
                                                   </div>
                                                   <p className="text-sm font-semibold text-red-600 flex-shrink-0 ml-4">
                                                      {formatVND(item.price * item.quantity)}
                                                   </p>
                                                </div>
                                             ))}
                                          </div>
                                          <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-100">
                                             <span className="text-sm text-slate-500 font-medium">Tổng cộng</span>
                                             <span className="text-base font-bold text-red-600">
                                                {formatVND(order.total_amount)}
                                             </span>
                                          </div>

                                          {/* Actions area */}
                                          <div className="mt-6 flex flex-col gap-3">
                                             {/* Nút Hủy (Pending) */}
                                             {order.status === 'Pending' && (
                                                <button
                                                   onClick={() => handleCancelOrder(order.order_id)}
                                                   className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-red-100 text-red-500 hover:bg-red-50 hover:border-red-300 rounded-xl text-sm font-semibold transition-all"
                                                >
                                                   <FiXCircle size={15} />
                                                   Hủy đơn hàng
                                                </button>
                                             )}

                                             {/* Completed: Rating and Reorder */}
                                             {order.status === 'Completed' && (
                                                <div className="flex flex-col gap-3">
                                                   <button
                                                      onClick={() => handleReorder(order)}
                                                      className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-red-100"
                                                   >
                                                      <FiShoppingBag size={15} />
                                                      Mua lại đơn hàng này
                                                   </button>

                                                   {(!order.Feedbacks || order.Feedbacks.length === 0) &&
                                                   (!order.feedbacks || order.feedbacks.length === 0) ? (
                                                      <button
                                                         onClick={() => {
                                                            setSelectedOrder(order);
                                                            setShowRating(true);
                                                         }}
                                                         className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-amber-200 text-amber-600 hover:bg-amber-50 rounded-xl text-sm font-semibold transition-all"
                                                      >
                                                         <FiStar size={15} />
                                                         Đánh giá ngay
                                                      </button>
                                                   ) : (
                                                      <div className="flex items-center justify-center gap-3 py-2.5 bg-emerald-50 border border-emerald-100 rounded-xl">
                                                         <span className="text-sm font-semibold text-emerald-700">
                                                            Bạn đã đánh giá{' '}
                                                            {order.Feedbacks?.[0]?.rating ||
                                                               order.feedbacks?.[0]?.rating ||
                                                               0}{' '}
                                                            sao
                                                         </span>
                                                         <div className="flex gap-0.5 text-yellow-500">
                                                            <FiStar size={14} className="fill-current" />
                                                         </div>
                                                      </div>
                                                   )}
                                                </div>
                                             )}
                                          </div>

                                          {/* Note cho đơn đang giao */}
                                          {order.status === 'Shipped' && (
                                             <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-xl text-[11px] text-blue-700 leading-relaxed">
                                                <span className="font-bold">Thông tin:</span> Đơn hàng đang được vận
                                                chuyển. Vui lòng để ý điện thoại, shipper sẽ liên hệ với bạn sớm.
                                             </div>
                                          )}

                                          {/* Note cho đơn đang yêu cầu trả hàng */}
                                          {order.status === 'ReturnRequested' && (
                                             <div className="mt-4 p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-[11px] text-indigo-700 leading-relaxed">
                                                <span className="font-bold">Yêu cầu trả hàng:</span> Hệ thống đã ghi
                                                nhận yêu cầu của bạn. Shop đang xem xét và sẽ phản hồi trong thời gian
                                                sớm nhất.
                                             </div>
                                          )}

                                          {/* Note cho đơn đã hủy */}
                                          {order.status === 'Canceled' && (
                                             <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600 leading-relaxed">
                                                <span className="font-bold">Đơn hàng đã hủy.</span>{' '}
                                                {order.Payment?.status === 'Refunded'
                                                   ? 'Tiền đã được hoàn trả thành công về tài khoản của bạn.'
                                                   : order.Payment?.status === 'RefundPending'
                                                     ? 'Đơn hàng đang trong quá trình hoàn tiền. Vui lòng kiểm tra tài khoản sau 1-3 ngày làm việc.'
                                                     : order.Payment?.status === 'Success'
                                                       ? 'Vui lòng liên hệ Admin để được hỗ trợ hoàn tiền cho đơn hàng đã thanh toán này.'
                                                       : 'Cảm ơn bạn đã quan tâm đến sản phẩm của shop.'}
                                             </div>
                                          )}

                                          {/* Pending Payment Note */}
                                          {order.status === 'Pending' && order.Payment?.status === 'Success' && (
                                             <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-xl text-[11px] text-amber-700 leading-relaxed">
                                                <span className="font-bold">Lưu ý:</span> Đơn hàng đã được thanh toán và
                                                đang chờ Shop xác nhận. Bạn có thể liên hệ trực tiếp với Shop để được xử
                                                lý nhanh hơn.
                                             </div>
                                          )}

                                          {(order.status === 'FailedDelivery' ||
                                             order.status === 'Returned to shop') && (
                                             <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-xl text-[11px] text-red-700 leading-relaxed">
                                                <span className="font-bold text-[13px] block mb-1">
                                                   Thông tin đơn hàng:
                                                </span>{' '}
                                                {order.status === 'Returned to shop'
                                                   ? 'Sản phẩm đã được trả về shop thành công.'
                                                   : 'Đơn hàng giao không thành công.'}{' '}
                                                {order.Payment?.status === 'Refunded' ? (
                                                   'Tiền đã được hoàn trả thành công.'
                                                ) : order.Payment?.status === 'RefundPending' ? (
                                                   <>
                                                      <p className="font-semibold mb-1">
                                                         Shop đang thực hiện hoàn tiền cho bạn.
                                                      </p>
                                                      <p>Vui lòng chờ xác nhận từ ngân hàng/ví điện tử của bạn.</p>
                                                   </>
                                                ) : order.Payment?.status === 'Success' ? (
                                                   'Vui lòng liên hệ shop để nhận thông tin về việc hoàn trả tiền.'
                                                ) : (
                                                   'Đơn hàng sẽ được xử lý theo quy định của shop.'
                                                )}
                                             </div>
                                          )}
                                       </div>
                                    )}
                                 </div>
                              );
                           });
                        })()}
                     </div>
                  </div>
               </div>

               {/* Back link */}
               <div className="mt-8 text-center">
                  <Link
                     to="/account"
                     className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 text-sm transition-colors"
                  >
                     <FiArrowLeft size={14} />
                     Quay về tài khoản
                  </Link>
               </div>
            </div>
         </div>

         <ConfirmModal
            isOpen={confirmModal.isOpen}
            title="Hủy đơn hàng"
            message={
               orders.find((o) => o.order_id === confirmModal.orderId)?.Payment?.status === 'Success'
                  ? 'Bạn có chắc chắn muốn hủy đơn hàng này không? Vì đơn hàng đã được thanh toán, vui lòng liên hệ Admin để được hỗ trợ hoàn tiền sau khi hủy. Hành động này không thể hoàn tác.'
                  : 'Bạn có chắc muốn hủy đơn hàng này không? Hành động này không thể hoàn tác.'
            }
            confirmLabel="Hủy đơn"
            cancelLabel="Giữ lại"
            confirmDanger={true}
            onConfirm={handleConfirmCancel}
            onCancel={() => setConfirmModal({ isOpen: false, orderId: null })}
         />

         <RatingModal
            isOpen={showRating}
            onClose={() => {
               setShowRating(false);
               setSelectedOrder(null);
            }}
            order={selectedOrder}
            onSuccess={() => {
               fetchData();
               setShowRating(false);
               setSelectedOrder(null);
            }}
         />
      </>
   );
}

export default OrderHistory;
