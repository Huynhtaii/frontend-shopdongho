import { useState } from 'react';
import ChatList from '../../components/chat/chat_list';
import ChatBox from '../../components/chat/chat_box';

const Chat = () => {
    const [selectedUser, setSelectedUser] = useState(null);

    return (
        <div className="h-[calc(100vh-120px)] flex gap-4">
            {/* Danh sách chat */}
            <div className="w-1/4 bg-white rounded-lg shadow">
                <ChatList 
                    selectedUser={selectedUser}
                    onSelectUser={setSelectedUser}
                />
            </div>

            {/* Khung chat */}
            <div className="flex-1 bg-white rounded-lg shadow">
                {selectedUser ? (
                    <ChatBox selectedUser={selectedUser} />
                ) : (
                    <div className="h-full flex items-center justify-center text-gray-500">
                        Chọn một cuộc trò chuyện để bắt đầu
                    </div>
                )}
            </div>
        </div>
    );
};

export default Chat; 