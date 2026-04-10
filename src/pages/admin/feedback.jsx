import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import FeedbackService from '../../services/feedback_service';
import Pagination from '../../components/pagination';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';

const FeedbackAdmin = () => {
   const [feedbacks, setFeedbacks] = useState([]);
   const [currentPage, setCurrentPage] = useState(1);
   const [lightbox, setLightbox] = useState({ isOpen: false, images: [], index: 0 });
   const itemsPerPage = 10;

   const fetchData = async () => {
      try {
         const response = await FeedbackService.getAllFeedbacks();
         if (response && response.EC === '0') {
            setFeedbacks(response.DT);
         } else {
            toast.error(response?.EM || 'Lỗi tải đánh giá');
         }
      } catch (error) {
         toast.error('Có lỗi xảy ra khi tải đánh giá');
      }
   };

   useEffect(() => {
      fetchData();
   }, []);

   const totalPages = Math.ceil(feedbacks.length / itemsPerPage);
   const paginatedFeedbacks = feedbacks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

   const openLightbox = (imageString, index = 0) => {
      const images = imageString ? imageString.split(', ').filter(Boolean) : [];
      setLightbox({ isOpen: true, images, index });
   };

   const closeLightbox = () => setLightbox({ ...lightbox, isOpen: false });

   const nextImage = (e) => {
      e.stopPropagation();
      setLightbox((prev) => ({
         ...prev,
         index: (prev.index + 1) % prev.images.length,
      }));
   };

   const prevImage = (e) => {
      e.stopPropagation();
      setLightbox((prev) => ({
         ...prev,
         index: (prev.index - 1 + prev.images.length) % prev.images.length,
      }));
   };

   return (
      <div className="p-4 sm:p-6">
         <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <h1 className="text-xl sm:text-2xl font-semibold">Quản lý đánh giá</h1>
         </div>

         <div className="w-full rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
               <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                     <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
                           Đánh giá lúc
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
                           Sản phẩm
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
                           Khách hàng
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
                           Số sao
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
                           Bình luận
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
                           Ảnh đính kèm
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
                           Tình trạng
                        </th>
                        {/* <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
                           Thao tác
                        </th> */}
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                     {paginatedFeedbacks.length > 0 ? (
                        paginatedFeedbacks.map((fb) => (
                           <tr key={fb.feedback_id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                                 {new Date(fb.created_at).toLocaleDateString('vi-VN')}{' '}
                                 {new Date(fb.created_at).toLocaleTimeString('vi-VN')}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-800 font-medium">
                                 <div className="flex items-center gap-2">
                                    <img
                                       src={fb.Product?.ProductImages?.[0]?.url || 'https://via.placeholder.com/40'}
                                       alt="sp"
                                       className="w-8 h-8 rounded border object-cover"
                                    />
                                    <span>{fb.Product?.name || 'Sản phẩm đã xoá'}</span>
                                 </div>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-800">
                                 <div className="flex flex-col">
                                    <span className="font-medium">{fb.User?.name || 'Vô danh'}</span>
                                    <span className="text-xs text-gray-500">{fb.User?.email}</span>
                                 </div>
                              </td>
                              <td className="px-4 py-3 text-sm text-center font-bold text-yellow-500 whitespace-nowrap">
                                 {fb.rating} ★
                              </td>
                              <td
                                 className="px-4 py-3 text-sm text-gray-600 max-w-[200px] truncate"
                                 title={fb.comments}
                              >
                                 {fb.comments || <span className="italic text-gray-400">Không có bình luận</span>}
                              </td>
                              <td className="px-4 py-3 text-center">
                                 {fb.image ? (
                                    <div className="flex justify-center -space-x-4 hover:space-x-1 transition-all">
                                       {fb.image
                                          .split(', ')
                                          .map((img, idx) => (
                                             <div
                                                key={idx}
                                                className="relative group cursor-pointer"
                                                onClick={() => openLightbox(fb.image, idx)}
                                             >
                                                <img
                                                   src={img}
                                                   alt={`feedback-${idx}`}
                                                   className="w-10 h-10 object-cover rounded border-2 border-white shadow-sm group-hover:scale-110 transition-transform"
                                                />
                                                {idx === 2 && fb.image.split(', ').length > 3 && (
                                                   <div className="absolute inset-0 bg-black/40 rounded flex items-center justify-center text-[10px] text-white font-bold">
                                                      +{fb.image.split(', ').length - 3}
                                                   </div>
                                                )}
                                             </div>
                                          ))
                                          .slice(0, 3)}
                                    </div>
                                 ) : (
                                    <span className="text-gray-400 text-xs italic">Không có</span>
                                 )}
                              </td>
                              <td className="px-4 py-3 text-center text-sm">
                                 <span
                                    className={`px-2 py-1 rounded-full text-xs font-bold whitespace-nowrap ${fb.is_resolved === 1 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
                                 >
                                    {fb.is_resolved === 1 ? 'Đã ẩn' : 'Hiển thị'}
                                 </span>
                              </td>
                           </tr>
                        ))
                     ) : (
                        <tr>
                           <td colSpan="8" className="px-4 py-12 text-center text-gray-500 italic">
                              Chưa có đánh giá nào.
                           </td>
                        </tr>
                     )}
                  </tbody>
               </table>
            </div>
         </div>

         <Pagination page={currentPage} totalPages={totalPages} setPage={setCurrentPage} />

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
                        className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all"
                        onClick={prevImage}
                     >
                        <FaChevronLeft size={24} />
                     </button>
                     <button
                        className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all"
                        onClick={nextImage}
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

export default FeedbackAdmin;
