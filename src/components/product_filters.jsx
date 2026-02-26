import { useEffect, useState } from 'react';

import { IoIosArrowDown } from 'react-icons/io';
import { FaCheck } from 'react-icons/fa6';
import CategoryService from '../services/category_service';

const ProductFilters = ({ setFilter, setCategoryName, categoryName }) => {
   const [priceRange, setPriceRange] = useState('all');
   const [type, setType] = useState(categoryName);
   const [categories, setCategories] = useState([{ id: 'all', name: 'Tất cả' }]);
   const [showFilter, setShowFilter] = useState({
      price: false,
      type: false,
   });

   useEffect(() => {
      setFilter({
         price: priceRange,
      });
      setCategoryName(type);
   }, [priceRange, showFilter, type, setFilter, setCategoryName]);

   useEffect(() => {
      setType(categoryName);
   }, [categoryName]);

   useEffect(() => {
      const fetchCategories = async () => {
         try {
            const res = await CategoryService.getAll();
            if (res && res.EC === '0' && Array.isArray(res.DT)) {
               const fetched = res.DT.map((cat) => ({
                  id: cat.name,
                  name: cat.name,
               }));
               setCategories([{ id: 'all', name: 'Tất cả' }, ...fetched]);
            }
         } catch (error) {
            console.error('Lỗi khi tải danh mục:', error);
         }
      };
      fetchCategories();
   }, []);

   const prices = [
      { id: 'all', name: 'Tất cả' },
      { id: '0-1000000', name: 'Dưới 1 triệu' },
      { id: '1000000-5000000', name: '1 triệu - 5 triệu' },
      { id: '5000000-10000000', name: '5 triệu - 10 triệu' },
      { id: '10000000-20000000', name: '10 triệu - 20 triệu' },
      { id: '20000000', name: 'Trên 20 triệu' },
   ];

   const toggleFilter = (filter) => {
      setShowFilter((prev) => ({
         price: false,
         brand: false,
         type: false,
         [filter]: !prev[filter],
      }));
   };

   return (
      <div className="layout-container py-8">
         <h1 className="mt-6 mb-1">Lọc sản phẩm</h1>
         <div className="flex flex-wrap gap-4">
            {/* Filter by Price */}
            <div className="relative">
               <button
                  onClick={() => toggleFilter('price')}
                  className="flex items-center gap-2 px-4 py-2 border rounded-md hover:border-primary"
               >
                  <span className="text-sm">Giá</span>
                  <IoIosArrowDown
                     className={`transition-transform duration-300 ${showFilter.price ? 'rotate-180' : ''}`}
                  />
               </button>
               {showFilter.price && (
                  <div className="absolute z-10 w-48 mt-2 bg-white border rounded-md shadow-lg">
                     {prices.map((item) => (
                        <div
                           key={item.id}
                           onClick={() => {
                              setPriceRange(item.id);
                              toggleFilter('price');
                           }}
                           className="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-gray-50"
                        >
                           <span className="text-sm">{item.name}</span>
                           {priceRange === item.id && <FaCheck className="text-primary" size={12} />}
                        </div>
                     ))}
                  </div>
               )}
            </div>

            {/* Filter by Type */}
            <div className="relative">
               <button
                  onClick={() => toggleFilter('type')}
                  className="flex items-center gap-2 px-4 py-2 border rounded-md hover:border-primary"
               >
                  <span className="text-sm">Loại</span>
                  <IoIosArrowDown
                     className={`transition-transform duration-300 ${showFilter.type ? 'rotate-180' : ''}`}
                  />
               </button>
               {showFilter.type && (
                  <div className="absolute z-10 w-48 mt-2 bg-white border rounded-md shadow-lg">
                     {categories.map((item) => (
                        <div
                           key={item.id}
                           onClick={() => {
                              setType(item.id);
                              toggleFilter('type');
                           }}
                           className="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-gray-50"
                        >
                           <span className="text-sm">{item.name}</span>
                           {type === item.id && <FaCheck className="text-primary" size={12} />}
                        </div>
                     ))}
                  </div>
               )}
            </div>
         </div>

         {/* Selected Filters */}
         <div className="flex flex-wrap gap-2 mt-4">
            {priceRange !== 'all' && (
               <div className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 rounded-full">
                  <span>Giá: {prices.find((x) => x.id === priceRange)?.name}</span>
                  <button onClick={() => setPriceRange('all')} className="text-gray-500 hover:text-red-500">
                     ×
                  </button>
               </div>
            )}
            {type !== 'all' && (
               <div className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 rounded-full">
                  <span>Loại: {categories.find((x) => x.id === type)?.name}</span>
                  <button onClick={() => setType('all')} className="text-gray-500 hover:text-red-500">
                     ×
                  </button>
               </div>
            )}
         </div>
      </div>
   );
};

export default ProductFilters;
