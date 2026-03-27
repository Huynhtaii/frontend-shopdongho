import { Link, useLocation } from 'react-router-dom';
import {
   RiDashboardLine,
   RiUserLine,
   RiShoppingCart2Line,
   RiMessage2Line,
   RiProductHuntLine,
   RiPriceTag3Line,
   RiApps2Line,
   RiBarChartLine,
   RiStarLine,
} from 'react-icons/ri';

const AdminSidebar = ({ isOpen, setIsOpen }) => {
   const location = useLocation();

   const menuItems = [
      { path: '/admin', icon: <RiDashboardLine size={24} />, label: 'Dashboard' },
      { path: '/admin/statistics', icon: <RiBarChartLine size={24} />, label: 'Thống kê' },
      { path: '/admin/products', icon: <RiProductHuntLine size={24} />, label: 'Sản phẩm' },
      { path: '/admin/categories', icon: <RiApps2Line size={24} />, label: 'Danh mục' },
      { path: '/admin/brands', icon: <RiPriceTag3Line size={24} />, label: 'Thương hiệu' },
      { path: '/admin/orders', icon: <RiShoppingCart2Line size={24} />, label: 'Đơn hàng' },
      { path: '/admin/feedbacks', icon: <RiStarLine size={24} />, label: 'Đánh giá' },
      { path: '/admin/users', icon: <RiUserLine size={24} />, label: 'Người dùng' },
      { path: '/admin/chat', icon: <RiMessage2Line size={24} />, label: 'Tin nhắn' },
   ];

   return (
      <>
         <aside
            className={`fixed left-0 top-0 h-screen bg-[#333333] text-white transition-all duration-300 z-50
               ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0 lg:w-20 w-64'}`}
         >
            {/* Logo */}
            <Link to="/" className="h-16 flex items-center justify-center border-b border-gray-700">
               <div className="w-[230px] h-[80px] overflow-hidden">
                  <img src="/logo-w2.webp" alt="" className="w-full h-auto -translate-y-9" />
               </div>
            </Link>

            {/* Menu Items */}
            <nav className="mt-6">
               {menuItems.map((item) => (
                  <Link
                     key={item.path}
                     to={item.path}
                     onClick={() => {
                        if (window.innerWidth < 1024) {
                           setIsOpen(false);
                        }
                     }}
                     className={`flex items-center px-6 py-3 cursor-pointer transition-colors
                            ${
                               location.pathname === item.path
                                  ? 'bg-blue-600 text-white'
                                  : 'text-gray-300 hover:bg-gray-700'
                            }
                            ${!isOpen && 'justify-center'}`}
                  >
                     <span className="inline-block">{item.icon}</span>
                     {isOpen && <span className="ml-3">{item.label}</span>}
                  </Link>
               ))}
            </nav>
         </aside>
      </>
   );
};

export default AdminSidebar;
