import { useState, useEffect } from 'react';
import { RiSearchLine } from 'react-icons/ri';
import MessageService from '../../services/message_service';

const ChatList = ({ selectedUser, onSelectUser }) => {
   const [searchTerm, setSearchTerm] = useState('');
   const [chatUsers, setChatUsers] = useState([]);
   const adminId = process.env.REACT_APP_ADMIN_ID;

   useEffect(() => {
      loadChatUsers();
   }, []);

   const loadChatUsers = async () => {
      try {
         console.log('1. Calling getAllChat API...');
         const response = await MessageService.getAllChat();
         console.log('2. API Response:', response);
         console.log('3. Admin ID:', adminId, 'Type:', typeof adminId);

         if ((response.EC === 0 || response.EC === '0') && Array.isArray(response.DT)) {
            // Debug first message
            const firstMessage = response.DT[0];
            console.log('4. First message structure:', {
               message: firstMessage,
               sender: firstMessage.sender,
               receiver: firstMessage.receiver,
               sender_id: firstMessage.sender_id,
               receiver_id: firstMessage.receiver_id,
            });

            const userLastMessages = new Map();
            const adminIdNum = Number(adminId);

            console.log('5. Processing messages with adminId:', adminIdNum);

            response.DT.forEach((message, index) => {
               console.log(`6. Processing message ${index}:`, {
                  sender_id: message.sender_id,
                  receiver_id: message.receiver_id,
                  content: message.content,
               });

               // Xác định người dùng (không phải admin)
               let userId, userName, userEmail;

               // Nếu người gửi là admin
               if (message.sender_id === adminIdNum) {
                  userId = message.receiver_id;
                  userName = message.receiver.name;
                  userEmail = message.receiver.email;
                  console.log('7a. Message from admin to:', userName);
               }
               // Nếu người nhận là admin
               else if (message.receiver_id === adminIdNum) {
                  userId = message.sender_id;
                  userName = message.sender.name;
                  userEmail = message.sender.email;
                  console.log('7b. Message to admin from:', userName);
               }

               // Bỏ qua tin nhắn không liên quan đến admin hoặc tin nhắn admin tự gửi
               if (!userId || userId === adminIdNum) {
                
                  return;
               }

               const existingMessage = userLastMessages.get(userId);
               if (!existingMessage || new Date(message.created_at) > new Date(existingMessage.lastMessageTime)) {
                  const userInfo = {
                     id: userId,
                     name: userName,
                     email: userEmail,
                     lastMessage: message.content,
                     lastMessageTime: message.created_at,
                  };
            
                  userLastMessages.set(userId, userInfo);
               }
            });

            const sortedUsers = Array.from(userLastMessages.values()).sort(
               (a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime),
            );

        
            setChatUsers(sortedUsers);
         } else {
            console.log('Invalid response format:', response);
         }
      } catch (error) {
         console.error('Error in loadChatUsers:', error);
      }
   };

   useEffect(() => {
      console.log('10. Current chatUsers:', chatUsers);
   }, [chatUsers]);

   const filteredUsers = chatUsers.filter((user) => user.name.toLowerCase().includes(searchTerm.toLowerCase()));

   useEffect(() => {
      console.log('11. Search term:', searchTerm);
      console.log('12. Filtered users:', filteredUsers);
   }, [searchTerm, filteredUsers]);

   const formatTime = (timestamp) => {
      const date = new Date(timestamp);
      return new Intl.DateTimeFormat('vi-VN', {
         hour: '2-digit',
         minute: '2-digit',
         day: '2-digit',
         month: '2-digit',
         year: 'numeric',
      }).format(date);
   };

   return (
      <div className="h-full flex flex-col">
         {/* Search */}
         <div className="p-4 border-b">
            <div className="relative">
               <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
               <input
                  type="text"
                  placeholder="Tìm kiếm người dùng..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>
         </div>

         {/* User List */}
         <div className="flex-1 overflow-y-auto">
            {filteredUsers.length > 0 ? (
               filteredUsers.map((user) => (
                  <div
                     key={user.id}
                     className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 border-b
                              ${selectedUser?.id === user.id ? 'bg-blue-50' : ''}`}
                     onClick={() => onSelectUser(user)}
                  >
                     {/* Avatar */}
                     <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                           {user.name.charAt(0).toUpperCase()}
                        </div>
                     </div>

                     {/* Info */}
                     <div className="flex-1 min-w-0">
                        <div className="flex justify-between">
                           <h3 className="font-medium truncate">{user.name}</h3>
                           <span className="text-xs text-gray-500">{formatTime(user.lastMessageTime)}</span>
                        </div>
                        <p className="text-sm text-gray-500 truncate">{user.lastMessage}</p>
                     </div>
                  </div>
               ))
            ) : (
               <div className="p-4 text-center text-gray-500">Không tìm thấy người dùng nào</div>
            )}
         </div>
      </div>
   );
};

export default ChatList;
