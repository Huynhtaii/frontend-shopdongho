import { RiMenu2Line, RiNotification3Line, RiUserLine } from 'react-icons/ri';

const AdminHeader = ({ toggleSidebar }) => {
    return (
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6">
            <button onClick={toggleSidebar} className="p-2 hover:bg-gray-100 rounded-lg">
                <RiMenu2Line size={24} />
            </button>
            
            <div className="flex items-center gap-4">
            
            </div>
        </header>
    );
};

export default AdminHeader; 