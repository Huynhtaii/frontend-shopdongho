import { Link } from 'react-router-dom';
import useSearchProduct from '../../../hooks/use_search_product';

const SearchResult = ({ keyword, setShowSearchResult, setKeyword }) => {
   const { products, loading, error } = useSearchProduct(keyword);

   console.log('>>>>>>>>>>>products', products);

   return (
      <>
         <div className="absolute z-[999] top-full left-0 w-[300px] max-h-[400px] bg-white shadow-lg rounded-md mt-1 p-2 overflow-y-auto">
            <div className="flex flex-col gap-2">
               <div className="text-sm text-gray-500 font-medium">Kết quả tìm kiếm</div>

               {/* Hiển thị trạng thái loading */}
               {loading && <div className="text-sm text-gray-400">Đang tìm kiếm...</div>}

               {/* Hiển thị lỗi nếu có */}
               {error && <div className="text-sm text-red-500">Có lỗi xảy ra!</div>}

               {/* Hiển thị danh sách sản phẩm */}
               {!loading && !error && products.length > 0 ? (
                  <div className="flex flex-col gap-1">
                     {products.map((product) => (
                        <Link
                           key={product.product_id}
                           to={`/product/${product.product_id}`}
                           onClick={() => {
                              setShowSearchResult(false);
                              setKeyword('');
                           }}
                           className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md cursor-pointer"
                        >
                           <img
                              src={
                                 product.ProductImages?.length > 0
                                    ? product.ProductImages[0].url
                                    : 'https://via.placeholder.com/40'
                              }
                              className="w-10 h-10 object-cover rounded-md"
                              alt={product.name}
                           />

                           <div>
                              <div className="text-sm font-medium">{product.name}</div>
                              <div className="text-xs text-gray-500">
                                 {product.discount_price ? (
                                    <>
                                       <span className="text-red-500 font-semibold">
                                          {parseFloat(product.discount_price).toLocaleString()} VNĐ
                                       </span>
                                       <span className="text-gray-400 line-through ml-1">
                                          {parseFloat(product.price).toLocaleString()} VNĐ
                                       </span>
                                    </>
                                 ) : (
                                    `${parseFloat(product.price).toLocaleString()} VNĐ`
                                 )}
                              </div>
                           </div>
                        </Link>
                     ))}
                  </div>
               ) : (
                  !loading && !error && <div className="text-sm text-gray-500">Chưa tìm thấy sản phẩm nào.</div>
               )}
            </div>
         </div>
      </>
   );
};

export default SearchResult;
