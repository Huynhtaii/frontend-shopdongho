import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CategoryService from '../services/category_service';
import { toast } from 'react-toastify';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Categories = () => {
   const [categories, setCategories] = useState([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchAllCategories = async () => {
         try {
            setLoading(true);
            const data = await CategoryService.getAll();
            setCategories(data.DT);
         } catch (err) {
            toast.error(err.message || 'Có lỗi xảy ra khi tải sản phẩm');
         } finally {
            setLoading(false);
         }
      };
      fetchAllCategories();
   }, []);

   if (loading)
      return (
         <div className="layout-container">
            <div className="mt-10 w-[70%] m-auto text-center py-10">
               <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
               <p className="mt-2 text-gray-500">Đang tải danh mục...</p>
            </div>
         </div>
      );

   return (
      <div className="flex justify-center items-center mt-12 bg-white pb-10">
         <div className="w-[90%] md:w-[85%] lg:w-[80%] flex flex-col items-center">
            <div className="flex flex-col items-center text-center mb-12">
               <h1
                  className="uppercase text-2xl md:text-3xl font-bold animate-fadeInDown hover:scale-105 transition-all duration-300 cursor-default
                  bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent 
                  animate-gradient relative group pb-1"
               >
                  Chọn đồng hồ phù hợp
                  <div
                     className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 
                     transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
                  ></div>
               </h1>
               <span className="mt-4 text-sm md:text-base text-gray-500 animate-fadeInUp max-w-2xl">
                  WatchStore cung cấp đa dạng mẫu đồng hồ theo nhiều phong cách khác nhau, giúp bạn dễ dàng tìm thấy
                  mảnh ghép hoàn hảo cho phong cách cá nhân.
               </span>
            </div>

            <div className="w-full category-swiper-container">
               <Swiper
                  modules={[Navigation, Autoplay]}
                  spaceBetween={20}
                  slidesPerGroup={1}
                  navigation={true}
                  pagination={{ clickable: true }}
                  autoplay={{
                     delay: 3000,
                     disableOnInteraction: false,
                     pauseOnMouseEnter: true,
                  }}
                  breakpoints={{
                     320: { slidesPerView: 2, spaceBetween: 10 },
                     480: { slidesPerView: 3, spaceBetween: 15 },
                     768: { slidesPerView: 4, spaceBetween: 20 },
                     1024: { slidesPerView: 5, spaceBetween: 20 },
                     1280: { slidesPerView: 6, spaceBetween: 24 },
                  }}
                  className="!px-2"
               >
                  {categories.map((category, index) => (
                     <SwiperSlide key={index}>
                        <div className="group text-center flex flex-col items-center">
                           <Link
                              to={`/category/${category.name}`}
                              className="relative block w-full overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-500 aspect-[16/10]"
                           >
                              <img
                                 src={category.image}
                                 alt={category.name}
                                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-300"></div>
                           </Link>
                           <h3 className="mt-4 text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors duration-300">
                              {category.name}
                           </h3>
                        </div>
                     </SwiperSlide>
                  ))}
               </Swiper>
            </div>
         </div>
      </div>
   );
};

export default Categories;
