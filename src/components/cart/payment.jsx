import { useCallback, useEffect, useState } from 'react';
import AccountService from '../../services/account_service';
import ModalPayment from '../modalPayment/modalPayment';
import PaymentOption from './PaymentOption';
import useFormatPrice from '../../hooks/use_formatPrice';
import { toast } from 'react-toastify';
import { paymentCompleted } from '../../services/payment_service';
import { useCart } from '../../context/cart_context';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/auth.context';
import { useContext } from 'react';
import address_service from '../../services/address_service';
import ModalAddressSelector from '../../components/modals/ModalAddressSelector';
import { RiMapPinLine } from 'react-icons/ri';

const Payment = ({ totalPrice, cartItem, onOrderSuccess }) => {
   const { fetchCart } = useCart();
   const navigate = useNavigate();
   const { auth } = useContext(AuthContext);
   const [paymentMethod, setPaymentMethod] = useState('cod');
   const [userOrder, setUserOrder] = useState(null);
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [transferContent, setTransferContent] = useState('');
   const [loading, setLoading] = useState(false);
   const [selectedAddress, setSelectedAddress] = useState(null);
   const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
   const { formatPrice } = useFormatPrice();

   // Lấy id tài khoản đã đăng nhập
   const user_id = localStorage.getItem('userId');

   const fetchUser = useCallback(async () => {
      try {
         const response = await AccountService.getInforAccount(user_id);
         if (response.EC === '0') {
            setUserOrder(response.DT);
         }
      } catch (error) {
         console.error('Lỗi khi gọi API:', error);
      }
   }, [user_id]);

   const fetchAddresses = useCallback(async () => {
      try {
         const res = await address_service.getUserAddresses(user_id);
         if (res.EC === 0 && res.DT.length > 0) {
            const defaultAddr = res.DT.find((a) => a.is_default) || res.DT[0];
            setSelectedAddress(defaultAddr);
         }
      } catch (error) {
         console.error('Fetch addresses error:', error);
      }
   }, [user_id]);

   useEffect(() => {
      if (user_id) {
         fetchUser();
         fetchAddresses();
      }
   }, [fetchAddresses, fetchUser, user_id]);

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

   const handleValidateForm = () => {
      if (!selectedAddress) {
         toast.warning('Vui lòng chọn hoặc thêm địa chỉ nhận hàng!');
         return false;
      }
      return true;
   };

   const handleOrderProduct = () => {
      if (!auth.isAuthenticated) {
         toast.error('Vui lòng đăng nhập để đặt hàng!');
         navigate('/login');
         return;
      }
      if (handleValidateForm()) {
         if (paymentMethod === 'cod') {
            handleOrderCodSuccess();
         } else {
            const content = createTransferContent();
            setTransferContent(content);
            setIsModalOpen(true);
            console.log('Transfer content:', content);
         }
      }
   };

   const handleRegenerateQR = () => {
      const newContent = createTransferContent();
      setTransferContent(newContent);
      console.log('Regenerated Transfer content:', newContent);
      return newContent;
   };

   const handleCloseModal = () => {
      console.log('Handling modal close....');
      setIsModalOpen(false);
   };

   const handleOrderCodSuccess = async () => {
      setLoading(true);
      try {
         const shippingInfo = {
            name: selectedAddress.recipient_name,
            phone: selectedAddress.recipient_phone,
            email: selectedAddress.recipient_email || userOrder.email,
            address: selectedAddress.address,
         };
         const res = await paymentCompleted(
            user_id,
            shippingInfo.email,
            totalPrice,
            cartItem,
            paymentMethod,
            shippingInfo,
         );
         
         if (res && res.EC === 0) {
            // Lấy order_id từ response trả về (res đã là body từ axios interceptor)
            const order_id = res.DT?.order_id || null;
            // Lưu lại cartItem kèm order_id trước khi clear
            const itemsToRate = cartItem.map((item) => ({
               product_id: item.product_id,
               productData: item.productData,
               order_id,
            }));
            fetchCart();
            if (onOrderSuccess) {
               onOrderSuccess(itemsToRate);
            }
            toast.success('Đặt hàng thành công, vui lòng kiểm tra email!');
         } else {
            toast.error(res?.EM || 'Có lỗi xảy ra khi đặt hàng!');
         }
      } catch (error) {
         console.error('🔥 Lỗi khi đặt hàng:', error);
         toast.error('Có lỗi xảy ra khi đặt hàng!');
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="flex flex-col">
         <div className="mt-5 border-b pb-6">
            <div className="flex items-center justify-between mb-4">
               <div className="flex items-center gap-2 text-blue-600 font-bold">
                  <RiMapPinLine size={20} />
                  <h3 className="text-[16px] uppercase tracking-tight">Địa chỉ nhận hàng</h3>
               </div>
               <button
                  onClick={() => setIsAddressModalOpen(true)}
                  className="text-blue-500 text-sm font-semibold hover:underline bg-blue-50 px-3 py-1 rounded-full transition-all"
               >
                  {selectedAddress ? 'Thay đổi' : 'Thêm địa chỉ'}
               </button>
            </div>

            {selectedAddress ? (
               <div className="bg-gray-50/50 p-4 rounded-xl border border-dashed border-gray-200">
                  <div className="flex items-center gap-3 mb-2">
                     <span className="font-bold text-gray-800">{selectedAddress.recipient_name}</span>
                     <span className="text-gray-300">|</span>
                     <span className="text-gray-600 font-medium">{selectedAddress.recipient_phone}</span>
                  </div>
                  <div className="text-sm text-gray-500 leading-relaxed mb-1">{selectedAddress.address}</div>
                  {selectedAddress.is_default && (
                     <span className="text-[10px] text-red-500 font-bold border border-red-500 px-2 py-0.5 rounded uppercase">
                        Mặc định
                     </span>
                  )}
               </div>
            ) : (
               <div
                  className="text-center py-6 border-2 border-dashed border-gray-100 rounded-xl cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-all"
                  onClick={() => setIsAddressModalOpen(true)}
               >
                  <p className="text-gray-400 text-sm italic">Bấm để thêm địa chỉ giao hàng</p>
               </div>
            )}
         </div>
         <div className="flex justify-between border-b py-5">
            <h3 className="text-[14px] font-[600]">Cần thanh toán:</h3>
            <p className="text-[#ed1c24] font-[600] text-[14px]">{formatPrice(totalPrice)}</p>
         </div>
         <PaymentOption paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} />
         <button
            className="bg-blue-600 py-3 px-5 text-white rounded-md m-auto flex flex-col items-center text-[20px] disabled:opacity-70 disabled:cursor-not-allowed min-w-[200px]"
            onClick={handleOrderProduct}
            disabled={loading}
         >
            {loading ? (
               <div className="flex items-center gap-2">
                  <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="font-[500]">Đang xử lý...</span>
               </div>
            ) : (
               <>
                  <h1 className="font-[500]">Đặt hàng</h1>
                  <span className="text-xs pb-2">(Bằng cách đặt hàng bạn đồng ý với các điều khoản của chúng tôi)</span>
               </>
            )}
         </button>

         {paymentMethod === 'qr_code' && (
            <ModalPayment
               cartItem={cartItem}
               isOpen={isModalOpen}
               onClose={handleCloseModal}
               totalAmount={totalPrice}
               transferContent={transferContent}
               paymentMethod={paymentMethod}
               onOrderSuccess={onOrderSuccess}
               onRegenerate={handleRegenerateQR}
               shippingInfo={{
                  name: selectedAddress.recipient_name,
                  phone: selectedAddress.recipient_phone,
                  email: selectedAddress.recipient_email || userOrder.email,
                  address: selectedAddress.address,
               }}
            />
         )}

         <ModalAddressSelector
            isOpen={isAddressModalOpen}
            onClose={() => setIsAddressModalOpen(false)}
            userId={user_id}
            currentAddressId={selectedAddress?.id}
            onSelect={(addr) => {
               setSelectedAddress(addr);
               setIsAddressModalOpen(false);
            }}
         />
      </div>
   );
};

export default Payment;
