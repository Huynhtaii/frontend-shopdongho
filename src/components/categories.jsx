import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import CategoryService from '../services/category_service';
import { toast } from 'react-toastify';

const Categories = () => {
   const [categories, setCategories] = useState([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchAllCategories = async () => {
         try {
            setLoading(true);
            const data = await CategoryService.getAllCategories();
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
            <div className="mt-10 w-[70%] m-auto">Đang tải...</div>
         </div>
      );
   return (
      <div className="flex justify-center items-center mt-10 bg-white">
         <div className="w-[80%] flex flex-col item-center">
            <div className="flex flex-col items-center text-center">
               <h1
                  className="uppercase text-[24px] font-bold animate-fadeInDown hover:scale-105 transition-all duration-300 cursor-default
                  bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent 
                  hover:from-pink-500 hover:via-purple-500 hover:to-blue-600 
                  animate-gradient relative group"
               >
                  Chọn đồng hồ phù hợp
                  <div
                     className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 
                     transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
                  ></div>
               </h1>
               <span
                  className="mt-6 text-lg animate-fadeInUp hover:scale-105 transition-all duration-300 cursor-default
                  bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 bg-clip-text text-transparent
                  hover:from-cyan-500 hover:via-emerald-500 hover:to-teal-500
                  animate-gradient relative group inline-block"
               >
                  WatchStore cung cấp đa dạng mẫu đồng hồ theo nhiều phong cách khác nhau
                  <div
                     className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500
                     transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
                  ></div>
               </span>
            </div>
            <div className="flex flex-wrap gap-4 mt-10 place-items-center w-[50%] justify-between">
               {categories.map((category, index) => (
                  <div key={index} className="text-center transform hover:scale-105 transition-all duration-300">
                     <Link to={`/category/${category.name}`}>
                        <img
                           src={category.image}
                           alt={category.name}
                           className="w-[180px] h-[110px] object-cover rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                        />
                     </Link>
                     <h3 className="mt-2 text-sm font-medium hover:text-gray-700 transition-colors duration-200">
                        {category.name}
                     </h3>
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
};

export default Categories;
