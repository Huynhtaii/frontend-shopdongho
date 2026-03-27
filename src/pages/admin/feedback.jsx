import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import FeedbackService from '../../services/feedback_service';
import Pagination from '../../components/pagination';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const FeedbackAdmin = () => {
   const [feedbacks, setFeedbacks] = useState([]);
   const [currentPage, setCurrentPage] = useState(1);
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

   const handleToggleStatus = async (id, currentStatus) => {
      const action = currentStatus === 1 ? 'hiện' : 'ẩn';
      if (window.confirm(`Bạn có chắc chắn muốn ${action} đánh giá này?`)) {
         try {
            const res = await FeedbackService.toggleFeedbackStatus(id);
            if (res && res.EC === '0') {
               toast.success(res.EM);
               fetchData();
            } else {
               toast.error(res?.EM || 'Thao tác thất bại');
            }
         } catch (error) {
            toast.error('Có lỗi xảy ra');
         }
      }
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
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Đánh giá lúc</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Sản phẩm</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Khách hàng</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Số sao</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Bình luận</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Ảnh đính kèm</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Tình trạng</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Thao tác</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                     {paginatedFeedbacks.length > 0 ? (
                        paginatedFeedbacks.map((fb) => (
                           <tr key={fb.feedback_id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                                 {new Date(fb.created_at).toLocaleDateString('vi-VN')} {new Date(fb.created_at).toLocaleTimeString('vi-VN')}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-800 font-medium">
                                 <div className="flex items-center gap-2">
                                    <img src={fb.Product?.ProductImages?.[0]?.url || 'https://via.placeholder.com/40'} alt="sp" className="w-8 h-8 rounded border object-cover" />
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
                              <td className="px-4 py-3 text-sm text-gray-600 max-w-[200px] truncate" title={fb.comments}>
                                 {fb.comments || <span className="italic text-gray-400">Không có bình luận</span>}
                              </td>
                              <td className="px-4 py-3 text-center">
                                 {fb.image ? (
                                    <a href={fb.image} target="_blank" rel="noreferrer">
                                       <img src={fb.image} alt="feedback" className="w-10 h-10 object-cover rounded mx-auto border hover:opacity-80 transition" />
                                    </a>
                                 ) : (
                                    <span className="text-gray-400 text-xs italic">Không có</span>
                                 )}
                              </td>
                              <td className="px-4 py-3 text-center text-sm">
                                 <span className={`px-2 py-1 rounded-full text-xs font-bold whitespace-nowrap ${fb.is_resolved === 1 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                    {fb.is_resolved === 1 ? 'Đã ẩn' : 'Hiển thị'}
                                 </span>
                              </td>
                              <td className="px-4 py-3 text-right text-sm">
                                 <div className="flex justify-end">
                                    <button
                                       className={`${
                                          fb.is_resolved === 1
                                             ? 'bg-blue-500 hover:bg-blue-600'
                                             : 'bg-orange-500 hover:bg-orange-600'
                                       } text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition duration-200 whitespace-nowrap`}
                                       onClick={() => handleToggleStatus(fb.feedback_id, fb.is_resolved)}
                                    >
                                       {fb.is_resolved === 1 ? <><FaEye /> Hiện lại</> : <><FaEyeSlash /> Ẩn đi</>}
                                    </button>
                                 </div>
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
      </div>
   );
};

export default FeedbackAdmin;
