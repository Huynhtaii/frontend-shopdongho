import { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { toast } from 'react-toastify';
import FeedbackService from '../../services/feedback_service';

const RatingModal = ({ isOpen, onClose, cartItems }) => {
   // Lưu rating cho từng sản phẩm: { product_id: rating }
   const [ratings, setRatings] = useState({});
   const [hoveredStars, setHoveredStars] = useState({});
   const [submitting, setSubmitting] = useState(false);

   const user_id = localStorage.getItem('userId');

   if (!isOpen) return null;

   const handleStarClick = (productId, star) => {
      setRatings((prev) => ({ ...prev, [productId]: star }));
   };

   const handleStarHover = (productId, star) => {
      setHoveredStars((prev) => ({ ...prev, [productId]: star }));
   };

   const handleStarLeave = (productId) => {
      setHoveredStars((prev) => ({ ...prev, [productId]: 0 }));
   };

   const handleSubmit = async () => {
      const hasRatings = Object.keys(ratings).length > 0;
      if (!hasRatings) {
         toast.warning('Vui lòng đánh giá ít nhất 1 sản phẩm!');
         return;
      }

      setSubmitting(true);
      try {
         for (const item of cartItems) {
            const rating = ratings[item.product_id];
            if (rating) {
               await FeedbackService.create({
                  rating,
                  comments: '',
                  product_id: item.product_id,
                  user_id: parseInt(user_id),
                  order_id: item.order_id || null,
               });
            }
         }
         toast.success('Cảm ơn bạn đã đánh giá!');
         onClose();
      } catch (error) {
         console.error('Lỗi khi gửi đánh giá:', error);
         toast.error('Có lỗi xảy ra khi gửi đánh giá!');
      } finally {
         setSubmitting(false);
      }
   };

   return (
      <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
         <div className="bg-white rounded-xl shadow-2xl w-full max-w-[450px] max-h-[85vh] overflow-y-auto p-8 animate-fadeIn text-center">
            <h2 className="text-2xl font-bold mb-2 text-[#333]">Đặt hàng thành công!</h2>
            <p className="text-gray-500 text-sm mb-8">Hãy đánh giá sản phẩm để nhận ưu đãi nhé!</p>

            <div className="space-y-8">
               {cartItems.map((item) => (
                  <div key={item.product_id} className="flex flex-col items-center gap-4 py-4 border-b last:border-0">
                     <p className="text-base font-semibold text-[#444] line-clamp-2 px-2">{item.productData?.name}</p>
                     <div className="flex flex-col items-center gap-3">
                        <div className="flex gap-2">
                           {[1, 2, 3, 4, 5].map((star) => (
                              <FaStar
                                 key={star}
                                 size={32}
                                 className={`cursor-pointer transition-all hover:scale-110 active:scale-95 ${
                                    star <= (hoveredStars[item.product_id] || ratings[item.product_id] || 0)
                                       ? 'text-yellow-400'
                                       : 'text-gray-200'
                                 }`}
                                 onClick={() => handleStarClick(item.product_id, star)}
                                 onMouseEnter={() => handleStarHover(item.product_id, star)}
                                 onMouseLeave={() => handleStarLeave(item.product_id)}
                              />
                           ))}
                        </div>
                        {ratings[item.product_id] > 0 && (
                           <span className="text-sm font-bold text-yellow-600">{ratings[item.product_id]} / 5 sao</span>
                        )}
                     </div>
                  </div>
               ))}
            </div>

            <div className="flex gap-4 mt-8">
               <button
                  onClick={onClose}
                  className="flex-1 py-3.5 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors font-bold"
               >
                  Bỏ qua
               </button>
               <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-1 py-3.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-bold shadow-lg shadow-red-200 disabled:opacity-50 flex items-center justify-center gap-2"
               >
                  {submitting ? (
                     <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Đang gửi...
                     </>
                  ) : (
                     'Gửi đánh giá'
                  )}
               </button>
            </div>
         </div>
      </div>
   );
};

export default RatingModal;
