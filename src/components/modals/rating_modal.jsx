import { useState } from 'react';
import { FaStar, FaCamera, FaTimes } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { toast } from 'react-toastify';
import FeedbackService from '../../services/feedback_service';

const RatingModal = ({ isOpen, onClose, order, onSuccess }) => {
   const [rating, setRating] = useState(0);
   const [hoveredStar, setHoveredStar] = useState(0);
   const [submitting, setSubmitting] = useState(false);
   const [comment, setComment] = useState('');
   const [image, setImage] = useState(null);
   const [imagePreview, setImagePreview] = useState(null);

   const user_id = localStorage.getItem('userId');

   if (!isOpen || !order) return null;

   const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
         if (file.size > 5 * 1024 * 1024) {
            toast.error('Kích thước ảnh không được vượt quá 5MB');
            return;
         }
         setImage(file);
         const reader = new FileReader();
         reader.onloadend = () => {
            setImagePreview(reader.result);
         };
         reader.readAsDataURL(file);
      }
   };

   const removeImage = () => {
      setImage(null);
      setImagePreview(null);
   };

   const handleSubmit = async () => {
      if (rating === 0) {
         toast.warning('Vui lòng chọn mức độ đánh giá!');
         return;
      }

      setSubmitting(true);
      try {
         // Đánh giá cho tất cả sản phẩm trong đơn hàng với cùng 1 rating và comment
         for (const item of order.order_items) {
            if (item.product_id) {
               try {
                  const formData = new FormData();
                  formData.append('rating', rating);
                  formData.append('comments', comment);
                  formData.append('product_id', item.product_id);
                  formData.append('user_id', parseInt(user_id));
                  formData.append('order_id', order.order_id);
                  if (image) {
                     formData.append('image', image);
                  }

                  await FeedbackService.create(formData);
               } catch (err) {
                  console.error('Error creating individual feedback:', err);
                  throw err;
               }
            }
         }
         toast.success('Cảm ơn bạn đã đánh giá đơn hàng!');
         if (onSuccess) onSuccess();
         onClose();
         // Reset state
         setRating(0);
         setComment('');
         setImage(null);
         setImagePreview(null);
      } catch (error) {
         console.error('Final handleSubmit error:', error);
         const errorMessage = error.response?.data?.EM || 'Lỗi khi gửi đánh giá. Vui lòng thử lại sau.';
         toast.error(errorMessage);
      } finally {
         setSubmitting(false);
      }
   };

   return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
         <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[500px] overflow-hidden animate-fadeIn relative max-h-[90vh] overflow-y-auto">
            {/* Close button */}
            <button
               onClick={onClose}
               className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
            >
               <IoMdClose size={24} />
            </button>

            <div className="p-8">
               <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                     <FaStar size={32} className="text-yellow-500" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800 mb-2">Đánh giá đơn hàng</h2>
                  <p className="text-gray-500 text-sm">
                     Bạn đánh giá thế nào về đơn hàng{' '}
                     <span className="font-semibold text-gray-700">#{order.order_id}</span>?
                  </p>
               </div>

               <div className="flex flex-col items-center gap-4 py-6 bg-slate-50 rounded-xl mb-6">
                  <div className="flex gap-3">
                     {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                           key={star}
                           size={40}
                           className={`cursor-pointer transition-all hover:scale-110 active:scale-90 ${
                              star <= (hoveredStar || rating) ? 'text-yellow-400' : 'text-gray-200'
                           }`}
                           onClick={() => setRating(star)}
                           onMouseEnter={() => setHoveredStar(star)}
                           onMouseLeave={() => setHoveredStar(0)}
                        />
                     ))}
                  </div>
                  {rating > 0 && (
                     <p className="text-sm font-bold text-yellow-600 animate-bounceIn">
                        {rating === 1 && 'Rất tệ'}
                        {rating === 2 && 'Tệ'}
                        {rating === 3 && 'Bình thường'}
                        {rating === 4 && 'Tốt'}
                        {rating === 5 && 'Tuyệt vời'}
                     </p>
                  )}
               </div>

               {/* Comment and Image fields */}
               <div className="space-y-4 mb-8">
                  <div>
                     <label className="block text-sm font-semibold text-gray-700 mb-2 text-left">
                        Nhận xét của bạn
                     </label>
                     <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all outline-none text-sm min-h-[100px] resize-none"
                     />
                  </div>

                  <div>
                     <label className="block text-sm font-semibold text-gray-700 mb-2 text-left">Thêm hình ảnh</label>
                     {!imagePreview ? (
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:bg-slate-50 hover:border-red-300 transition-all">
                           <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-400">
                              <FaCamera size={24} className="mb-2" />
                              <p className="text-xs">Nhấn để tải ảnh lên (tối đa 5MB)</p>
                           </div>
                           <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                        </label>
                     ) : (
                        <div className="relative inline-block mt-2">
                           <img
                              src={imagePreview}
                              alt="Preview"
                              className="w-32 h-32 object-cover rounded-xl border border-gray-200 shadow-sm"
                           />
                           <button
                              onClick={removeImage}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-md"
                           >
                              <FaTimes size={12} />
                           </button>
                        </div>
                     )}
                  </div>
               </div>

               <div className="flex gap-3">
                  <button
                     onClick={onClose}
                     className="flex-1 py-3 px-4 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors font-semibold text-sm"
                  >
                     Để sau
                  </button>
                  <button
                     onClick={handleSubmit}
                     disabled={submitting || rating === 0}
                     className="flex-[2] py-3 px-4 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all font-semibold text-sm shadow-lg shadow-red-200 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
                  >
                     {submitting ? (
                        <>
                           <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                           Đang gửi...
                        </>
                     ) : (
                        'Gửi đánh giá'
                     )}
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
};

export default RatingModal;
