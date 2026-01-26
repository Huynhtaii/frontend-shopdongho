import { useState, useEffect } from 'react';
import { RiSearchLine } from 'react-icons/ri';
import MessageService from '../../services/message_service';

const ChatList = ({ selectedUser, onSelectUser, refreshTrigger }) => {
   const [searchTerm, setSearchTerm] = useState('');
   const [chatUsers, setChatUsers] = useState([]);
   const adminId = process.env.REACT_APP_ADMIN_ID;

   useEffect(() => {
      loadChatUsers();
   }, [refreshTrigger]);

   const loadChatUsers = async () => {
      try {
         const response = await MessageService.getAllChat();

         if ((response.EC === 0 || response.EC === '0') && Array.isArray(response.DT)) {
            const userLastMessages = new Map();
            const adminIdNum = Number(adminId);

            response.DT.forEach((message) => {
               let userId, userName, userEmail;

               if (message.sender_id === adminIdNum) {
                  userId = message.receiver_id;
                  userName = message.receiver.name;
                  userEmail = message.receiver.email;
               } else if (message.receiver_id === adminIdNum) {
                  userId = message.sender_id;
                  userName = message.sender.name;
                  userEmail = message.sender.email;
               }

               if (!userId || userId === adminIdNum) return;

               const existingMessage = userLastMessages.get(userId);
               if (!existingMessage || new Date(message.created_at) > new Date(existingMessage.lastMessageTime)) {
                  userLastMessages.set(userId, {
                     id: userId,
                     name: userName,
                     email: userEmail,
                     lastMessage: message.content,
                     lastMessageTime: message.created_at,
                  });
               }
            });

            const sortedUsers = Array.from(userLastMessages.values()).sort(
               (a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime),
            );

            setChatUsers(sortedUsers);
         }
      } catch (error) {
         console.error('Error loading chat users:', error);
      }
   };

   const handleUserSelect = (user) => {
      onSelectUser(user);
   };

   const filteredUsers = chatUsers.filter((user) => user.name.toLowerCase().includes(searchTerm.toLowerCase()));

   const formatTime = (timestamp) => {
      if (!timestamp) return '';
      const date = new Date(timestamp);
      return new Intl.DateTimeFormat('vi-VN', {
         hour: '2-digit',
         minute: '2-digit',
      }).format(date);
   };

   return (
      <div className="h-full flex flex-col">
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

         <div className="flex-1 overflow-y-auto">
            {filteredUsers.length > 0 ? (
               filteredUsers.map((user) => (
                  <div
                     key={user.id}
                     className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 border-b
                        ${selectedUser?.id === user.id ? 'bg-blue-50' : ''}`}
                     onClick={() => handleUserSelect(user)}
                  >
                     <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                           {user.name.charAt(0).toUpperCase()}
                        </div>
                     </div>
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
