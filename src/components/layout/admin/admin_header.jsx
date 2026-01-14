import { RiMenu2Line, RiNotification3Line, RiUserLine } from 'react-icons/ri';

const AdminHeader = ({ toggleSidebar }) => {
    return (
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6">
            <button onClick={toggleSidebar} className="p-2 hover:bg-gray-100 rounded-lg">
                <RiMenu2Line size={24} />
            </button>
            
            <div className="flex items-center gap-4">
                <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                    <RiNotification3Line size={24} />
                    <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                        3
                    </span>
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <RiUserLine size={24} />
                </button>
            </div>
        </header>
    );
};

export default AdminHeader; 