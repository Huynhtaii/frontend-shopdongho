import { useCallback, useEffect, useState } from 'react';
import { FaStar, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import FeedbackService from '../../services/feedback_service';
import { toast } from 'react-toastify';

const ModalProductFeedback = ({ product, onClose }) => {
   const [feedbacks, setFeedbacks] = useState([]);
   const [loading, setLoading] = useState(true);
   const [lightbox, setLightbox] = useState({ isOpen: false, images: [], index: 0 });

   const fetchFeedbacks = useCallback(async () => {
      setLoading(true);
      try {
         const response = await FeedbackService.getFeedbacksByProductId(product.product_id);
         if (response && response.EC === '0') {
            setFeedbacks(response.DT);
         } else {
            toast.error(response?.EM || 'Lỗi tải đánh giá');
         }
      } catch (error) {
         console.error('Lỗi khi tải đánh giá:', error);
         toast.error('Có lỗi xảy ra khi tải đánh giá');
      } finally {
         setLoading(false);
      }
   }, [product]);

   const openLightbox = (imageString, index = 0) => {
      const images = imageString ? imageString.split(', ').filter(Boolean) : [];
      setLightbox({ isOpen: true, images, index });
   };

   const closeLightbox = () => setLightbox({ ...lightbox, isOpen: false });

   const nextLightboxImage = (e) => {
      e.stopPropagation();
      setLightbox((prev) => ({
         ...prev,
         index: (prev.index + 1) % prev.images.length,
      }));
   };

   const prevLightboxImage = (e) => {
      e.stopPropagation();
      setLightbox((prev) => ({
         ...prev,
         index: (prev.index - 1 + prev.images.length) % prev.images.length,
      }));
   };

   useEffect(() => {
      if (product) {
         fetchFeedbacks();
      }
   }, [product, fetchFeedbacks]);

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity duration-300">
         <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 scale-100 flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
               <div>
                  <h3 className="text-xl font-bold text-gray-800">Đánh giá sản phẩm</h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-1">{product.name}</p>
               </div>
               <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 text-gray-400 hover:text-gray-600"
               >
                  <FaTimes size={20} />
               </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
               {loading ? (
                  <div className="flex flex-col items-center justify-center py-12 space-y-4">
                     <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                     <p className="text-gray-500 font-medium">Đang tải đánh giá...</p>
                  </div>
               ) : feedbacks.length > 0 ? (
                  feedbacks.map((fb) => (
                     <div
                        key={fb.feedback_id}
                        className="bg-gray-50 rounded-xl p-5 border border-gray-100 hover:border-blue-200 transition-colors duration-200"
                     >
                        <div className="flex justify-between items-start mb-3">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg">
                                 {fb.User?.name?.charAt(0).toUpperCase() || 'U'}
                              </div>
                              <div>
                                 <h4 className="font-bold text-gray-800">{fb.User?.name || 'Người dùng ẩn danh'}</h4>
                                 <div className="flex items-center gap-1 mt-0.5">
                                    {[...Array(5)].map((_, i) => (
                                       <FaStar
                                          key={i}
                                          size={12}
                                          className={i < fb.rating ? 'text-yellow-400' : 'text-gray-200'}
                                       />
                                    ))}
                                    <span className="text-xs text-gray-400 ml-2">
                                       {new Date(fb.created_at).toLocaleDateString('vi-VN')}
                                    </span>
                                 </div>
                              </div>
                           </div>
                           {fb.is_resolved === 1 && (
                              <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                 Đã ẩn
                              </span>
                           )}
                        </div>

                        <p className="text-gray-700 text-sm leading-relaxed mb-4 italic">
                           "{fb.comments || 'Không có bình luận'}"
                        </p>

                        {fb.image && (
                           <div className="mt-2 flex flex-wrap gap-2">
                              {fb.image.split(', ').map((img, idx) => (
                                 <img
                                    key={idx}
                                    src={img}
                                    alt={`Feedback ${idx}`}
                                    className="w-20 h-20 object-cover rounded-lg shadow-sm border border-gray-100 hover:scale-[1.05] transition-transform duration-200 cursor-pointer"
                                    onClick={() => openLightbox(fb.image, idx)}
                                    title="Xem ảnh chi tiết"
                                 />
                              ))}
                           </div>
                        )}
                     </div>
                  ))
               ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
                     <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                        <FaStar size={40} />
                     </div>
                     <div>
                        <p className="text-gray-500 font-semibold text-lg">Chưa có đánh giá nào</p>
                        <p className="text-gray-400 text-sm">
                           Sản phẩm này hiện chưa nhận được phản hồi từ khách hàng.
                        </p>
                     </div>
                  </div>
               )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-end">
               <button
                  onClick={onClose}
                  className="px-6 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all duration-200 shadow-sm"
               >
                  Đóng
               </button>
            </div>
         </div>

         {/* Lightbox Modal */}
         {lightbox.isOpen && (
            <div
               className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center p-4 animate-fadeIn"
               onClick={closeLightbox}
            >
               <button
                  className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors"
                  onClick={closeLightbox}
               >
                  <IoMdClose size={32} />
               </button>

               {lightbox.images.length > 1 && (
                  <>
                     <button
                        className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all shadow-lg"
                        onClick={prevLightboxImage}
                     >
                        <FaChevronLeft size={24} />
                     </button>
                     <button
                        className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all shadow-lg"
                        onClick={nextLightboxImage}
                     >
                        <FaChevronRight size={24} />
                     </button>
                  </>
               )}

               <div className="max-w-4xl max-h-[80vh] flex flex-col items-center gap-4">
                  <img
                     src={lightbox.images[lightbox.index]}
                     alt="Full feedback"
                     className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-zoomIn"
                     onClick={(e) => e.stopPropagation()}
                  />
                  <div className="text-white font-medium bg-black/50 px-4 py-2 rounded-full text-sm">
                     {lightbox.index + 1} / {lightbox.images.length}
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};

export default ModalProductFeedback;
