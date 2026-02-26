import React, { useCallback, useEffect, useState } from 'react';
import { RiShoppingCart2Line, RiHeartLine } from 'react-icons/ri';
import { useParams } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import ProductService from '../../services/product_service';
import { useFavorite } from '../../context/favorite_context';
import { useCart } from '../../context/cart_context';
import useFormatPrice from '../../hooks/use_formatPrice';
import ProductListSlider from '../../components/products/product_list_slider';
import useRecentProduct from '../../hooks/use_recent_product';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
function ProductDetail() {
   const { addAndRemoveToFavorite, findFavorite } = useFavorite();
   const { addToCart } = useCart();
   const [product, setProduct] = useState(null);
   const [loading, setLoading] = useState(true);
   const [isFavorite, setIsFavorite] = useState(findFavorite(product?.product_id));
   const [activeTab, setActiveTab] = useState('specs');
   const [thumbsSwiper, setThumbsSwiper] = useState(null);
   const { id } = useParams();

   const { formatPrice } = useFormatPrice();
   const { products } = useRecentProduct();

   useEffect(() => {
      setIsFavorite(findFavorite(product?.product_id));
   }, [product?.product_id, findFavorite]);

   // Định nghĩa hàm addRecentProduct trước khi sử dụng
   const addRecentProduct = (productId) => {
      // Lấy mảng đã lưu từ localStorage, nếu chưa có thì khởi tạo là mảng rỗng
      const stored = localStorage.getItem('recentProduct');
      let recentProducts = stored ? JSON.parse(stored) : [];

      // Nếu sản phẩm đã có trong mảng thì loại bỏ đi để sau đó thêm lại ở đầu
      recentProducts = recentProducts.filter((id) => id !== productId);

      // Thêm sản phẩm mới vào đầu mảng
      recentProducts.unshift(productId);

      // Giới hạn mảng tối đa 8 phần tử
      if (recentProducts.length > 8) {
         recentProducts = recentProducts.slice(0, 8);
      }

      // Lưu lại vào localStorage
      localStorage.setItem('recentProduct', JSON.stringify(recentProducts));
   };

   const fetchProductById = useCallback(async () => {
      try {
         setLoading(true);
         const response = await ProductService.getProductById(id);
         if (response.EC === '0') {
            setProduct(response.DT);
         }
      } catch (error) {
         console.error('Error fetching product:', error);
      } finally {
         setLoading(false);
      }
   }, [id]);

   useEffect(() => {
      fetchProductById();
      addRecentProduct(id);
   }, [id, fetchProductById]);

   if (loading) {
      return (
         <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
         </div>
      );
   }

   if (!product) {
      return <div>Không tìm thấy sản phẩm</div>;
   }

   const renderStars = (rating) => {
      return [...Array(5)].map((_, index) => (
         <FaStar key={index} className={`${index < rating ? 'text-yellow-400' : 'text-gray-300'} inline-block`} />
      ));
   };

   const calculateDiscount = (original, discounted) => {
      const originalPrice = parseFloat(original);
      const discountPrice = parseFloat(discounted);
      return Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
   };

   const handleAddToCart = async () => {
      const cart_item = {
         product_id: product.product_id,
         quantity: 1,
         created_at: new Date().toISOString(),
      };
      addToCart(cart_item, product);
   };

   return (
      <div className="layout-container mx-auto px-4 !py-8">
         <div className="flex flex-col md:flex-row gap-8">
            {/* Ảnh sản phẩm */}
            <div className="md:w-1/2">
               <div className="product-images-container space-y-4">
                  {/* Main Slider */}
                  <div className="bg-white p-4 rounded-lg shadow main-image-slider">
                     <Swiper
                        style={{
                           '--swiper-navigation-color': '#EF4444',
                           '--swiper-pagination-color': '#EF4444',
                        }}
                        spaceBetween={10}
                        navigation={true}
                        thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                        modules={[FreeMode, Navigation, Thumbs]}
                        className="mySwiper2"
                     >
                        {product.ProductImages?.length > 0 ? (
                           product.ProductImages.map((image, index) => (
                              <SwiperSlide key={index}>
                                 <img
                                    src={image.url}
                                    alt={`${product.name} ${index + 1}`}
                                    className="w-full h-[400px] object-contain"
                                 />
                              </SwiperSlide>
                           ))
                        ) : (
                           <SwiperSlide>
                              <div className="w-full h-[400px] flex items-center justify-center bg-gray-100 rounded">
                                 Không có ảnh
                              </div>
                           </SwiperSlide>
                        )}
                     </Swiper>
                  </div>

                  {/* Thumbs Slider */}
                  <div className="thumbs-slider-container">
                     <Swiper
                        onSwiper={setThumbsSwiper}
                        spaceBetween={10}
                        slidesPerView={5}
                        freeMode={true}
                        watchSlidesProgress={true}
                        modules={[FreeMode, Navigation, Thumbs]}
                        className="mySwiper"
                     >
                        {product.ProductImages?.map((image, index) => (
                           <SwiperSlide key={index} className="cursor-pointer">
                              <div className="thumbnail-box rounded-md border-2 border-transparent hover:border-red-500 overflow-hidden bg-white p-1 shadow-sm transition-all duration-300">
                                 <img
                                    src={image.url}
                                    alt={`${product.name} shadow ${index + 1}`}
                                    className="w-full h-20 object-contain"
                                 />
                              </div>
                           </SwiperSlide>
                        ))}
                     </Swiper>
                  </div>
               </div>
            </div>

            {/* Thông tin sản phẩm */}
            <div className="md:w-1/2">
               <h1 className="text-2xl font-semibold mb-4">{product.name}</h1>

               <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center">
                     {renderStars(product.rating)}
                     <span className="ml-2">{product.rating}/5</span>
                  </div>
                  <div className="text-gray-500">SKU: {product.sku}</div>
               </div>

               <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <div className="flex items-baseline gap-2">
                     <span className="text-3xl font-bold text-red-600">
                        {formatPrice(product.discount_price || product.price)}
                     </span>
                     {product.discount_price && (
                        <>
                           <span className="text-gray-500 line-through">{formatPrice(product.price)}</span>
                           <span className="text-red-600 bg-red-50 px-2 py-1 rounded">
                              -{calculateDiscount(product.price, product.discount_price)}%
                           </span>
                        </>
                     )}
                  </div>
               </div>

               <div className="mb-6">
                  <div className="flex items-center gap-4 mb-2">
                     <span className="text-gray-500 w-24">Danh mục:</span>
                     <span>{product.Categories[0]?.name}</span>
                  </div>
                  <div className="flex items-center gap-4 mb-4">
                     <span className="text-gray-500 w-24">Mô tả:</span>
                     <span>{product.description}</span>
                  </div>
               </div>

               {/* Buttons */}
               <div className="flex gap-4">
                  <button
                     onClick={handleAddToCart}
                     className="flex-1 bg-red-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-red-700 transition-colors"
                  >
                     <RiShoppingCart2Line size={20} />
                     Thêm vào giỏ hàng
                  </button>
                  <button
                     onClick={() => {
                        addAndRemoveToFavorite(product);
                        setIsFavorite(!isFavorite);
                     }}
                     className={`w-12 h-12 border border-gray-300 
              rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors 
              ${isFavorite ? 'bg-red-600 text-white' : ''}`}
                  >
                     <RiHeartLine size={20} />
                  </button>
               </div>

               {/* Cam kết */}
               <div className="mt-8 bg-white p-4 rounded-lg border">
                  <h3 className="font-semibold mb-4">CAM KẾT CỦA WATCHSTORE.VN</h3>
                  <ul className="space-y-2">
                     <li className="flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        Bảo hành chính hãng {product.name}
                     </li>
                     <li className="flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        Không bán hàng fake, chỉ bán hàng chính hãng
                     </li>
                     <li className="flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        Freeship toàn quốc, thanh toán khi nhận hàng
                     </li>
                  </ul>
               </div>
            </div>
         </div>

         {/* Tabs Section */}
         <div className="mt-12 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex border-b">
               <button
                  onClick={() => setActiveTab('specs')}
                  className={`flex-1 py-4 text-center font-bold text-lg transition-all ${
                     activeTab === 'specs'
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/30'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
               >
                  Thông số kỹ thuật
               </button>
               <button
                  onClick={() => setActiveTab('guide')}
                  className={`flex-1 py-4 text-center font-bold text-lg transition-all ${
                     activeTab === 'guide'
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/30'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
               >
                  Hướng dẫn chọn size
               </button>
            </div>

            <div className="p-6">
               {activeTab === 'specs' ? (
                  <div className="animate-fadeIn">
                     <h2 className="text-xl font-bold mb-6 text-gray-800">Thông số sản phẩm - {product.name}</h2>
                     <div className="space-y-0 border rounded-lg overflow-hidden border-gray-100 max-w-4xl mx-auto">
                        <div className="flex bg-gray-100 p-3 items-center">
                           <div className="w-1/2 flex items-center">
                              <span className="font-semibold text-gray-700 text-sm mr-1">Thương hiệu:</span>
                              <span className="text-blue-600 hover:underline cursor-pointer text-sm">
                                 {product.Categories[0]?.name || 'Đang cập nhật'}
                              </span>
                           </div>
                           <div className="w-1/2 flex items-center border-l pl-4 border-gray-300">
                              <span className="font-semibold text-gray-700 text-sm mr-1">Xuất xứ:</span>
                              <span className="text-sm">{product.origin || 'Đang cập nhật'}</span>
                           </div>
                        </div>
                        <div className="flex bg-white p-3 items-center">
                           <div className="w-1/2 flex items-center">
                              <span className="font-semibold text-gray-700 text-sm mr-1">Đối tượng:</span>
                              <span className="text-sm">{product.target_audience || 'Đang cập nhật'}</span>
                           </div>
                           <div className="w-1/2 flex items-center border-l pl-4 border-gray-300">
                              <span className="font-semibold text-gray-700 text-sm mr-1">Dòng sản phẩm:</span>
                              <span className="text-sm">{product.product_line || 'Đang cập nhật'}</span>
                           </div>
                        </div>
                        <div className="flex bg-gray-100 p-3 items-center">
                           <div className="w-1/2 flex items-center">
                              <span className="font-semibold text-gray-700 text-sm mr-1">Kháng nước:</span>
                              <span className="text-sm">{product.water_resistance || 'Đang cập nhật'}</span>
                           </div>
                           <div className="w-1/2 flex items-center border-l pl-4 border-gray-300">
                              <span className="font-semibold text-gray-700 text-sm mr-1">Loại máy:</span>
                              <span className="text-sm">{product.movement_type || 'Đang cập nhật'}</span>
                           </div>
                        </div>
                        <div className="flex bg-white p-3 items-center">
                           <div className="w-1/2 flex items-center">
                              <span className="font-semibold text-gray-700 text-sm mr-1">Chất liệu kính:</span>
                              <span className="text-sm">{product.glass_material || 'Đang cập nhật'}</span>
                           </div>
                           <div className="w-1/2 flex items-center border-l pl-4 border-gray-300">
                              <span className="font-semibold text-gray-700 text-sm mr-1">Chất liệu dây:</span>
                              <span className="text-sm">{product.strap_material || 'Đang cập nhật'}</span>
                           </div>
                        </div>
                        <div className="flex bg-gray-100 p-3 items-center">
                           <div className="w-1/2 flex items-center">
                              <span className="font-semibold text-gray-700 text-sm mr-1">Size mặt:</span>
                              <span className="text-sm">{product.case_size || 'Đang cập nhật'}</span>
                           </div>
                           <div className="w-1/2 flex items-center border-l pl-4 border-gray-300">
                              <span className="font-semibold text-gray-700 text-sm mr-1">Độ dày:</span>
                              <span className="text-sm">{product.case_thickness || 'Đang cập nhật'}</span>
                           </div>
                        </div>
                        <div className="flex bg-white p-3 items-center">
                           <div className="w-full flex items-center">
                              <span className="font-semibold text-gray-700 text-sm mr-1">Tiện ích:</span>
                              <span className="text-sm">{product.utilities || 'Đang cập nhật'}</span>
                           </div>
                        </div>
                     </div>
                  </div>
               ) : (
                  <div className="animate-fadeIn max-w-4xl mx-auto">
                     <div className="text-gray-600 text-sm leading-relaxed space-y-8">
                        <p className="text-base">
                           Sở thích của mỗi người khác nhau, có người tay nhỏ thích đeo đồng hồ size to, có người tay to
                           lại thích size nhỏ. Để chọn đồng hồ thẩm mỹ nhất, bạn nên tham khảo cách chọn size dưới đây:
                        </p>

                        <div className="space-y-4">
                           <h3 className="font-bold text-gray-800 text-lg border-l-4 border-blue-600 pl-4">
                              Hướng dẫn đo cổ tay bằng thước giấy WatchStore
                           </h3>
                           <img
                              src="/huong-dan-do-size-co-tay-bang-thuoc-giay-watchstore.jpg"
                              alt="Hướng dẫn đo cổ tay bằng thước giấy WatchStore"
                              className="w-full rounded-xl border border-gray-100 shadow-md"
                           />
                           <p className="text-xs text-center italic text-gray-500">
                              Chọn size mặt đồng hồ phù hợp nhất với tay - Ảnh 1
                           </p>
                        </div>

                        <div className="space-y-6 pt-6 border-t border-gray-100">
                           <h3 className="font-bold text-gray-800 text-lg border-l-4 border-blue-600 pl-4 uppercase tracking-wider">
                              Hướng dẫn đo cổ tay bằng thước dây
                           </h3>

                           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div className="space-y-3">
                                 <p className="font-bold text-blue-600 text-base">Bước 1: Đo chu vi cổ tay</p>
                                 <img
                                    src="/Q9lydDN.png"
                                    alt="Bước 1: Đo chu vi cổ tay"
                                    className="w-full rounded-xl border border-gray-100 shadow-md"
                                 />
                                 <p className="text-xs text-center italic text-gray-500">
                                    Chọn size mặt đồng hồ phù hợp nhất với tay - Ảnh 1
                                 </p>
                              </div>

                              <div className="space-y-3">
                                 <p className="font-bold text-blue-600 text-base">
                                    Bước 2: So sánh size cổ tay để chọn mặt đồng hồ phù hợp
                                 </p>
                                 <img
                                    src="/VAOlz7D.png"
                                    alt="Bước 2: So sánh size cổ tay"
                                    className="w-full rounded-xl border border-gray-100 shadow-md"
                                 />
                                 <p className="text-xs text-center italic text-gray-500">
                                    Chọn size mặt đồng hồ phù hợp nhất với tay - Ảnh 2
                                 </p>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               )}
            </div>
         </div>
         <div className="mt-12">
            <ProductListSlider title="Sản phẩm đã xem" products={products} />
         </div>
      </div>
   );
}

export default ProductDetail;
