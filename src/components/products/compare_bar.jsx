import { useState } from 'react';
import { useCompare } from '../../context/compare_context';
import { IoClose, IoChevronDown } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

const CompareBar = () => {
   const { compareList, removeFromCompare, clearAllCompare } = useCompare();
   const [isExpanded, setIsExpanded] = useState(true);
   const navigate = useNavigate();

   if (compareList.length === 0) return null;

   return (
      <>
         {/* Badge khi thu gọn */}
         {!isExpanded && (
            <div
               className="fixed bottom-6 right-6 z-[101] bg-blue-600 text-white px-4 py-2 rounded-full shadow-2xl cursor-pointer flex items-center gap-2 hover:bg-blue-700 transition-all duration-300 animate-bounce"
               onClick={() => setIsExpanded(true)}
            >
               <span className="text-sm font-bold uppercase tracking-wider">So sánh</span>
               <span className="bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                  {compareList.length}
               </span>
            </div>
         )}

         <div
            className={`fixed bottom-0 left-0 right-0 z-[100] bg-white border-t-2 border-primary shadow-[0_-5px_15px_rgba(0,0,0,0.1)] transition-all duration-500 transform ${isExpanded ? 'translate-y-0' : 'translate-y-full'}`}
         >
            <div className="layout-container relative">
               {/* Nút thu gọn */}
               {isExpanded && (
                  <div
                     className="absolute -top-10 right-0 bg-white border-t-2 border-x-2 border-primary px-3 py-1.5 rounded-t-lg cursor-pointer flex items-center gap-2 text-sm font-bold text-gray-700 shadow-md transition-hover hover:text-primary"
                     onClick={() => setIsExpanded(false)}
                  >
                     Thu gọn <IoChevronDown size={14} />
                  </div>
               )}

               <div className="flex flex-col md:flex-row items-center py-4 gap-6">
                  <div className="flex-1 grid grid-cols-3 gap-4 w-full">
                     {[0, 1, 2].map((index) => {
                        const product = compareList[index];
                        return (
                           <div
                              key={index}
                              className="flex gap-3 items-center border border-dashed border-gray-300 rounded-lg p-2 min-h-[80px] relative bg-gray-50/50"
                           >
                              {product ? (
                                 <>
                                    <div className="w-14 h-14 flex-shrink-0 bg-white rounded border overflow-hidden">
                                       <img
                                          src={product.ProductImages[0]?.url}
                                          alt=""
                                          className="w-full h-full object-contain"
                                       />
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                       <p className="text-xs font-medium text-gray-700 line-clamp-2 leading-tight">
                                          {product.name}
                                       </p>
                                    </div>
                                    <button
                                       className="absolute -top-2 -right-2 bg-gray-500 text-white rounded-full p-0.5 hover:bg-red-500 transition-colors shadow-sm"
                                       onClick={() => removeFromCompare(product.product_id)}
                                    >
                                       <IoClose size={14} />
                                    </button>
                                 </>
                              ) : (
                                 <div className="flex w-full items-center justify-center text-gray-300">
                                    <span className="text-[10px] uppercase font-bold">Chờ chọn...</span>
                                 </div>
                              )}
                           </div>
                        );
                     })}
                  </div>

                  <div className="flex flex-col gap-2 min-w-[180px] w-full md:w-auto">
                     <button
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded text-sm transition-colors shadow-md active:scale-95"
                        onClick={() => {
                           setIsExpanded(false);
                           navigate('/compare');
                        }}
                     >
                        SO SÁNH NGAY
                     </button>
                     <button
                        className="text-blue-600 hover:text-red-500 text-xs font-semibold underline decoration-dotted transition-colors"
                        onClick={clearAllCompare}
                     >
                        Xóa tất cả sản phẩm
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </>
   );
};

export default CompareBar;
