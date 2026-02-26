import { useState } from 'react';
import AdminSidebar from './admin_sidebar';
import AdminHeader from './admin_header';

const AdminLayout = ({ children }) => {
   const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);

   const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

   return (
      <div className="flex h-screen bg-gray-100 overflow-hidden">
         {/* Sidebar */}
         <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

         {/* Backdrop for mobile */}
         {sidebarOpen && (
            <div
               className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
               onClick={() => setSidebarOpen(false)}
            />
         )}

         {/* Main Content */}
         <div
            className={`flex-1 flex flex-col transition-all duration-300 min-w-0 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'} ml-0`}
         >
            <AdminHeader toggleSidebar={toggleSidebar} />
            <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
         </div>
      </div>
   );
};

export default AdminLayout;
