import { useEffect, useState } from 'react';
import { PiMedalFill } from 'react-icons/pi';
import ProductListCol from './product_list_col';
import useProductByCategory from '../../hooks/use_product_by_category';
import CategoryService from '../../services/category_service';

const ProductTabs = () => {
   const [activeTab, setActiveTab] = useState('Nổi bật');
   const [tabs, setTabs] = useState([]);
   const { products, setCategory } = useProductByCategory(activeTab);

   useEffect(() => {
      setCategory(activeTab);
   }, [activeTab, setCategory]);

   useEffect(() => {
      const fetchTabs = async () => {
         try {
            const res = await CategoryService.getAll();
            if (res && res.EC === '0' && Array.isArray(res.DT)) {
               setTabs(res.DT.slice(0, 3).map((cat) => cat.name));
            }
         } catch (err) {
            console.error('Lỗi khi tải tab danh mục:', err);
         }
      };
      fetchTabs();
   }, []);

   return (
      <div className="layout-container">
         <div className="flex flex-col items-center">
            <h1 className="mt-12 uppercase text-[20px] text-[#333] pb-[10px]">Bộ sưu tập cho mùa hè</h1>
            <div className="flex items-center gap-3">
               {/* Tab cố định: Nổi bật */}
               <button
                  onClick={() => setActiveTab('Nổi bật')}
                  className={`text-sm font-[500] hover:shadow-md duration-50 border px-3 py-2 rounded-md flex items-center gap-1 ${activeTab === 'Nổi bật' ? 'border-primary text-primary' : 'text-[#717171]'}`}
               >
                  <PiMedalFill size={20} />
                  Nổi bật
               </button>

               {/* Tabs động từ categories */}
               {tabs.map((name) => (
                  <button
                     key={name}
                     onClick={() => setActiveTab(name)}
                     className={`text-sm font-[500] hover:shadow-md duration-50 border px-3 py-2 rounded-md ${activeTab === name ? 'border-primary text-primary' : 'text-[#717171]'}`}
                  >
                     {name}
                  </button>
               ))}
            </div>
         </div>
         <div className="mt-6 min-h-[200px]">{products && <ProductListCol products={products} />}</div>
      </div>
   );
};

export default ProductTabs;
