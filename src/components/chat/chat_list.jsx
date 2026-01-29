import { useState } from 'react';
import { RiSearchLine } from 'react-icons/ri';

const ChatList = ({ selectedUser, onSelectUser }) => {
    const [searchTerm, setSearchTerm] = useState('');

    // Data mẫu - sau này sẽ lấy từ API
    const users = [
        {
            id: 1,
            name: 'Nguyễn Văn A',
            avatar: 'https://ui-avatars.com/api/?name=A',
            lastMessage: 'Xin chào shop',
            time: '5 phút',
            unread: 2,
            online: true
        },
        {
            id: 2,
            name: 'Trần Thị B',
            avatar: 'https://ui-avatars.com/api/?name=B',
            lastMessage: 'Sản phẩm này còn hàng không ạ?',
            time: '2 giờ',
            unread: 0,
            online: false
        },
        // Thêm users khác...
    ];

    return (
        <div className="h-full flex flex-col">
            {/* Search */}
            <div className="p-4 border-b">
                <div className="relative">
                    <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:border-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* User List */}
            <div className="flex-1 overflow-y-auto">
                {users.map(user => (
                    <div
                        key={user.id}
                        className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 border-b
                            ${selectedUser?.id === user.id ? 'bg-blue-50' : ''}`}
                        onClick={() => onSelectUser(user)}
                    >
                        {/* Avatar */}
                        <div className="relative">
                            <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-12 h-12 rounded-full"
                            />
                            {user.online && (
                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                            <div className="flex justify-between">
                                <h3 className="font-medium">{user.name}</h3>
                                <span className="text-xs text-gray-500">{user.time}</span>
                            </div>
                            <div className="flex justify-between">
                                <p className="text-sm text-gray-500 truncate">{user.lastMessage}</p>
                                {user.unread > 0 && (
                                    <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        {user.unread}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChatList; 