import React from 'react';
import { useCompare } from '../../context/compare_context';
import { useFavorite } from '../../context/favorite_context';
import { Link, useNavigate } from 'react-router-dom';
import useFormatPrice from '../../hooks/use_formatPrice';
import { IoTrashOutline, IoClose } from 'react-icons/io5';
import { MdFavoriteBorder } from 'react-icons/md';
import { toast } from 'react-toastify';

const Compare = () => {
   const { compareList, removeFromCompare } = useCompare();
   const { addAndRemoveToFavorite, findFavorite } = useFavorite();
   const { formatPrice } = useFormatPrice();
   const [onlyDifferences, setOnlyDifferences] = React.useState(false);
   const navigate = useNavigate();

   const specs = [
      { label: 'Thương hiệu', key: 'brand' },
      { label: 'Xuất xứ', key: 'origin' },
      { label: 'Đối tượng', key: 'target_audience' },
      { label: 'Dòng sản phẩm', key: 'product_line' },
      { label: 'Chống nước', key: 'water_resistance' },
      { label: 'Loại máy', key: 'movement_type' },
      { label: 'Chất liệu kính', key: 'glass_material' },
      { label: 'Chất liệu dây', key: 'strap_material' },
      { label: 'Size mặt', key: 'case_size' },
      { label: 'Độ dày', key: 'case_thickness' },
      { label: 'Tiện ích', key: 'utilities' },
   ];

   const getBrandName = (product) => {
      return product.brand || (product.Categories && product.Categories[0]?.name) || '-';
   };

   // Logic lọc các hàng giống nhau
   const filteredSpecs = onlyDifferences
      ? specs.filter((spec) => {
           const values = compareList.map((p) => (spec.key === 'brand' ? getBrandName(p) : p[spec.key] || '---'));
           return !values.every((v) => v === values[0]);
        })
      : specs;

   if (compareList.length === 0) {
      return (
         <div className="layout-container py-20 text-center">
            <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
               <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <IoTrashOutline size={40} className="text-gray-300" />
               </div>
               <h2 className="text-2xl font-bold text-gray-800 mb-2">Danh sách trống</h2>
               <p className="text-gray-500 mb-8">
                  Bạn chưa chọn sản phẩm nào để so sánh. Hãy quay lại cửa hàng và chọn tối đa 3 sản phẩm nhé.
               </p>
               <button
                  onClick={() => navigate('/category/all')}
                  className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
               >
                  Quay lại cửa hàng
               </button>
            </div>
         </div>
      );
   }

   return (
      <div className="pb-20 pt-10 bg-[#f8f9fa] min-h-screen">
         <div className="layout-container">
            {/* Header Compare */}
            <div className="flex flex-col lg:flex-row gap-8 mb-10 items-start">
               <div className="lg:w-1/4 pt-4">
                  <h2 className="text-gray-400 text-sm font-medium mb-4 uppercase tracking-wider">So sánh sản phẩm</h2>
                  <div className="space-y-4">
                     {compareList.map((product, idx) => (
                        <React.Fragment key={product.product_id}>
                           <p className="font-bold text-gray-800 leading-tight uppercase text-sm">{product.name}</p>
                           {idx < compareList.length - 1 && <span className="text-gray-400 font-light">&</span>}
                        </React.Fragment>
                     ))}
                  </div>

                  <div className="mt-8 flex items-center gap-2 bg-blue-50/50 p-2 rounded-lg border border-blue-100 w-fit">
                     <input
                        type="checkbox"
                        id="diff-toggle"
                        className="w-4 h-4 accent-blue-600 cursor-pointer"
                        checked={onlyDifferences}
                        onChange={(e) => setOnlyDifferences(e.target.checked)}
                     />
                     <label
                        htmlFor="diff-toggle"
                        className="text-xs font-bold text-gray-600 cursor-pointer select-none"
                     >
                        Chỉ xem điểm khác biệt
                     </label>
                  </div>
               </div>

               <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
                  {compareList.map((product) => (
                     <div
                        key={product.product_id}
                        className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 relative group"
                     >
                        <button
                           className="absolute top-4 right-4 z-10 p-1 bg-white/80 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 transition-colors shadow-sm"
                           onClick={() => removeFromCompare(product.product_id)}
                        >
                           <IoClose size={18} />
                        </button>

                        <div className="relative aspect-square mb-6 overflow-hidden rounded-xl">
                           <img
                              src={product.ProductImages[0]?.url}
                              alt=""
                              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                           />

                           <div
                              className="absolute top-0 left-0 p-2 cursor-pointer text-gray-400 hover:text-red-500 transition-colors"
                              onClick={() => addAndRemoveToFavorite(product)}
                           >
                              <MdFavoriteBorder
                                 size={22}
                                 className={findFavorite(product.product_id) ? 'text-red-500 fill-red-500' : ''}
                              />
                           </div>

                           {product.price && product.discount_price && (
                              <div className="absolute top-0 right-0 bg-gray-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">
                                 -{Math.round(((product.price - product.discount_price) / product.price) * 100)}%
                              </div>
                           )}
                        </div>

                        <div className="text-center px-2">
                           <h4 className="text-gray-500 text-[11px] mb-2 font-medium line-clamp-1">{product.name}</h4>
                           <div className="flex items-center justify-center gap-3">
                              <span className="text-red-600 font-extrabold text-base">
                                 {formatPrice(product.discount_price || product.price)}
                              </span>
                              {product.discount_price && (
                                 <span className="text-gray-300 line-through text-xs italic font-medium">
                                    {formatPrice(product.price)}
                                 </span>
                              )}
                           </div>
                        </div>
                     </div>
                  ))}
                  {Array.from({ length: 3 - compareList.length }).map((_, i) => (
                     <div
                        key={i}
                        className="bg-gray-50/50 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center min-h-[300px]"
                     >
                        <span className="text-gray-300 font-bold uppercase tracking-widest text-xs">Chờ chọn...</span>
                     </div>
                  ))}
               </div>
            </div>

            {/* Bảng thông số */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
               <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                     <thead>
                        <tr>
                           <th className="w-1/4 p-5 bg-gray-50/80 border-b border-gray-100 text-left">
                              <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-widest">
                                 <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-[10px]">
                                    ℹ
                                 </div>
                                 Thông tin sản phẩm
                              </div>
                           </th>
                           {compareList.map((product) => (
                              <th
                                 key={product.product_id}
                                 className="w-1/4 p-5 border-b border-gray-100 bg-gray-50/30"
                              ></th>
                           ))}
                           {Array.from({ length: 3 - compareList.length }).map((_, i) => (
                              <th key={i} className="w-1/4 border-b border-gray-100 bg-gray-50/10"></th>
                           ))}
                        </tr>
                     </thead>
                     <tbody>
                        {filteredSpecs.map((spec, index) => (
                           <tr key={spec.key} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}>
                              <td className="p-4 pl-6 font-bold text-gray-600 text-sm border-r border-b border-gray-100">
                                 {spec.label}
                              </td>
                              {compareList.map((product) => (
                                 <td
                                    key={product.product_id}
                                    className="p-4 text-sm text-gray-700 border-r border-b border-gray-100"
                                 >
                                    {spec.key === 'brand' ? getBrandName(product) : product[spec.key] || '---'}
                                 </td>
                              ))}
                              {Array.from({ length: 3 - compareList.length }).map((_, i) => (
                                 <td key={i} className="p-4 border-b border-gray-100 bg-gray-50/10"></td>
                              ))}
                           </tr>
                        ))}
                        <tr>
                           <td className="p-6 bg-gray-50/50 border-r border-gray-100"></td>
                           {compareList.map((product) => (
                              <td key={product.product_id} className="p-6 border-r border-gray-100">
                                 <div className="flex flex-col gap-3">
                                    <button
                                       className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-3 rounded-xl transition-all shadow-lg shadow-orange-100 uppercase text-xs"
                                       onClick={() => toast.success('Đã thêm vào giỏ hàng')}
                                    >
                                       MUA NGAY
                                    </button>
                                    <Link
                                       to={`/product/${product.product_id}`}
                                       className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-100 text-center uppercase text-xs"
                                    >
                                       XEM CHI TIẾT
                                    </Link>
                                 </div>
                              </td>
                           ))}
                           {Array.from({ length: 3 - compareList.length }).map((_, i) => (
                              <td key={i} className="p-6 bg-gray-50/10"></td>
                           ))}
                        </tr>
                     </tbody>
                  </table>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Compare;
