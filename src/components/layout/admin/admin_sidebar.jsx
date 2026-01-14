import { Link, useLocation } from 'react-router-dom';
import { RiDashboardLine, RiUserLine, RiShoppingCart2Line, RiMessage2Line, RiProductHuntLine } from 'react-icons/ri';

const AdminSidebar = ({ isOpen, setIsOpen }) => {
    const location = useLocation();
    
    const menuItems = [
        { path: '/admin/dashboard', icon: <RiDashboardLine size={24} />, label: 'Dashboard' },
        { path: '/admin/products', icon: <RiProductHuntLine size={24} />, label: 'Sản phẩm' },
        { path: '/admin/orders', icon: <RiShoppingCart2Line size={24} />, label: 'Đơn hàng' },
        { path: '/admin/users', icon: <RiUserLine size={24} />, label: 'Người dùng' },
        { path: '/admin/chat', icon: <RiMessage2Line size={24} />, label: 'Tin nhắn' },
    ];

    return (
        <aside className={`fixed left-0 top-0 h-screen bg-[#1a1a1a] text-white transition-all duration-300 
            ${isOpen ? 'w-64' : 'w-20'}`}>
            {/* Logo */}
            <div className="h-16 flex items-center justify-center border-b border-gray-700">
                <img src="/logo-watchstore.webp" alt="Logo" className={`${isOpen ? 'w-40' : 'w-12'} transition-all duration-300`} />
            </div>

            {/* Menu Items */}
            <nav className="mt-6">
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center px-6 py-3 cursor-pointer transition-colors
                            ${location.pathname === item.path 
                                ? 'bg-blue-600 text-white' 
                                : 'text-gray-300 hover:bg-gray-700'}
                            ${!isOpen && 'justify-center'}`}
                    >
                        <span className="inline-block">{item.icon}</span>
                        {isOpen && <span className="ml-3">{item.label}</span>}
                    </Link>
                ))}
            </nav>
        </aside>
    );
};

export default AdminSidebar; 