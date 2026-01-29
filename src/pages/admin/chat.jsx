import { useState, useEffect } from 'react';
import ChatList from '../../components/chat/chat_list';
import ChatBox from '../../components/chat/chat_box';
import socket from '../../utils/socket';
import { toast } from 'react-toastify';

const Chat = () => {
   const [selectedUser, setSelectedUser] = useState(null);
   const [shouldRefresh, setShouldRefresh] = useState(false);

   useEffect(() => {
      // Kết nối socket khi component mount
      socket.connect();

      // Lắng nghe sự kiện có tin nhắn mới
      socket.on('receiveMessage', (newMessage) => {
         console.log('New message received in Chat component:', newMessage);
         // Trigger refresh cho ChatList
         setShouldRefresh((prev) => !prev);
      });

      return () => {
         socket.off('receiveMessage');
         socket.disconnect();
      };
   }, [selectedUser]);

   return (
      <div className="h-[calc(100vh-120px)] flex gap-4">
         <div className="w-1/4 bg-white rounded-lg shadow">
            <ChatList selectedUser={selectedUser} onSelectUser={setSelectedUser} refreshTrigger={shouldRefresh} />
         </div>

         <div className="flex-1 bg-white rounded-lg shadow">
            {selectedUser ? (
               <ChatBox selectedUser={selectedUser} onMessageSent={() => setShouldRefresh((prev) => !prev)} />
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
