import { useState, useEffect, useRef, useContext } from 'react';
import { RiSendPlaneFill } from 'react-icons/ri';
import { FaUser } from 'react-icons/fa';
import { MdOutlineSupportAgent } from 'react-icons/md';
import MessageService from '../../services/message_service';
import AuthContext from '../../context/auth.context';
import socket from '../../utils/socket';
import { toast } from 'react-toastify';
import { connectSocket } from '../../utils/socket';

const ChatBox = ({ selectedUser, onMessageSent }) => {
   const [message, setMessage] = useState('');
   const [messages, setMessages] = useState([]);
   const { auth } = useContext(AuthContext);
   const messagesEndRef = useRef(null);
   const adminId = process.env.REACT_APP_ADMIN_ID;

   // Load chat history khi selectedUser thay đổi
   useEffect(() => {
      if (selectedUser?.id) {
         loadChatHistory();
      }
   }, [selectedUser]);

   // Xử lý socket connection và events
   useEffect(() => {
      try {
         console.log('=== ChatBox Socket Setup Start ===');
         console.log('Selected User:', selectedUser);
         console.log('Admin ID:', adminId);

         // Kết nối socket
         connectSocket();
         console.log('Socket connected status:', socket.connected);

         // Join room khi có selectedUser
         if (selectedUser?.id) {
            console.log('Joining rooms for:', {
               adminRoom: Number(adminId),
               userRoom: selectedUser.id,
            });
            socket.emit('joinRoom', Number(adminId));
            socket.emit('joinRoom', selectedUser.id);
         }

         // Lắng nghe tin nhắn mới
         const handleReceiveMessage = (newMessage) => {
            console.log('=== New Message Received ===');
            console.log('Message data:', newMessage);
            console.log('Current selected user:', selectedUser?.id);
            console.log('Current admin:', adminId);
            console.log('Sender ID:', newMessage.sender_id);
            console.log('Receiver ID:', newMessage.receiver_id);

            // Convert IDs to numbers for comparison
            const senderId = Number(newMessage.sender_id);
            const receiverId = Number(newMessage.receiver_id);
            const selectedUserId = Number(selectedUser?.id);
            const adminIdNum = Number(adminId);

            console.log('Converted IDs:', {
               senderId,
               receiverId,
               selectedUserId,
               adminIdNum,
            });

            // Kiểm tra chi tiết điều kiện
            const isFromSelectedUser = senderId === selectedUserId;
            const isToAdmin = receiverId === adminIdNum;
            const isFromAdmin = senderId === adminIdNum;
            const isToSelectedUser = receiverId === selectedUserId;

            console.log('Message conditions:', {
               isFromSelectedUser,
               isToAdmin,
               isFromAdmin,
               isToSelectedUser,
            });

            const isRelevantMessage = (isFromSelectedUser && isToAdmin) || (isFromAdmin && isToSelectedUser);
            console.log('Is relevant message:', isRelevantMessage);

            if (isRelevantMessage) {
               console.log('Processing relevant message...');
               setMessages((prev) => {
                  // Kiểm tra xem tin nhắn đã tồn tại chưa
                  const messageExists = prev.some(
                     (msg) =>
                        msg.content === newMessage.content &&
                        msg.created_at === newMessage.created_at &&
                        Number(msg.sender_id) === senderId,
                  );

                  console.log('Message exists check:', messageExists);

                  if (!messageExists) {
                     console.log('Adding new message to state');
                     const updatedMessages = [...prev, newMessage];
                     console.log('Updated messages:', updatedMessages);
                     setTimeout(scrollToBottom, 100);
                     return updatedMessages;
                  }
                  return prev;
               });
            }
         };

         // Đăng ký lắng nghe sự kiện receiveMessage
         socket.on('receiveMessage', handleReceiveMessage);
         console.log('Registered receiveMessage handler');

         // Cleanup function
         return () => {
            console.log('=== ChatBox Socket Cleanup ===');
            if (selectedUser?.id) {
               console.log('Leaving rooms:', {
                  adminRoom: Number(adminId),
                  userRoom: selectedUser.id,
               });
               socket.emit('leaveRoom', Number(adminId));
               socket.emit('leaveRoom', selectedUser.id);
            }
            socket.off('receiveMessage', handleReceiveMessage);
            console.log('Removed receiveMessage handler');
         };
      } catch (error) {
         console.error('Error in ChatBox socket setup:', error);
         toast.error('Có lỗi xảy ra khi thiết lập kết nối chat');
      }
   }, [selectedUser, adminId]);

   // Debug messages state changes
   useEffect(() => {
      console.log('=== Messages State Updated ===');
      console.log('Current messages:', messages);
   }, [messages]);

   useEffect(() => {
      scrollToBottom();
   }, [messages]);

   const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
   };

   const loadChatHistory = async () => {
      try {
         console.log('Loading chat history for user:', selectedUser.id);
         const response = await MessageService.getChatHistory(selectedUser.id);
         console.log('Chat history response:', response);

         if (response.EC === 0 || response.EC === '0') {
            setMessages(response.DT || []);
            scrollToBottom();
         }
      } catch (error) {
         console.error('Error loading chat history:', error);
         toast.error('Không thể tải lịch sử chat');
      }
   };

   const handleSend = async () => {
      if (!message.trim()) return;

      const messageData = {
         sender_id: Number(adminId),
         receiver_id: selectedUser.id,
         content: message.trim(),
         created_at: new Date().toISOString(),
         sender: {
            user_id: Number(adminId),
            name: 'Admin',
            email: 'admin@example.com',
         },
         receiver: {
            user_id: selectedUser.id,
            name: selectedUser.name,
            email: selectedUser.email,
         },
      };

      try {
         const response = await MessageService.sendMessage(messageData);
         if (response.EC === 0 || response.EC === '0') {
            // Thêm tin nhắn mới vào state ngay lập tức
            setMessages((prev) => [...prev, messageData]);
            // Emit tin nhắn qua socket
            socket.emit('sendMessage', messageData);
            setMessage('');
            scrollToBottom();
            onMessageSent();
         }
      } catch (error) {
         console.error('Error sending message:', error);
         toast.error('Không thể gửi tin nhắn');
      }
   };

   const formatTime = (timestamp) => {
      if (!timestamp) return '';
      const date = new Date(timestamp);
      return new Intl.DateTimeFormat('vi-VN', {
         hour: '2-digit',
         minute: '2-digit',
      }).format(date);
   };

   // Kiểm tra xem tin nhắn có phải của admin không
   const isAdminMessage = (msg) => {
      return msg.sender_id === Number(adminId);
   };

   return (
      <div className="h-full flex flex-col">
         <div className="p-4 border-b">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  {selectedUser.name.charAt(0).toUpperCase()}
               </div>
               <div>
                  <h3 className="font-medium">{selectedUser.name}</h3>
                  <p className="text-sm text-gray-500">{selectedUser.email}</p>
               </div>
            </div>
         </div>

         <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => (
               <div key={index} className={`flex items-start gap-2 ${isAdminMessage(msg) ? 'flex-row-reverse' : ''}`}>
                  <div
                     className={`w-8 h-8 rounded-full flex items-center justify-center
                        ${isAdminMessage(msg) ? 'bg-yellow-200' : 'bg-gray-200'}`}
                  >
                     {isAdminMessage(msg) ? <MdOutlineSupportAgent size={20} /> : <FaUser />}
                  </div>
                  <div
                     className={`p-2 rounded-lg max-w-[80%] ${isAdminMessage(msg) ? 'bg-yellow-100' : 'bg-gray-100'}`}
                  >
                     <div className="text-sm">
                        <p>{msg.content}</p>
                        <p className="text-xs text-gray-500 text-right">{formatTime(msg.created_at)}</p>
                     </div>
                  </div>
               </div>
            ))}
            <div ref={messagesEndRef} />
         </div>

         <div className="p-4 border-t">
            <div className="flex items-center gap-2">
               <input
                  type="text"
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 p-2 border rounded-full focus:outline-none focus:border-blue-500"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
               />
               <button className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600" onClick={handleSend}>
                  <RiSendPlaneFill size={20} />
               </button>
            </div>
         </div>
      </div>
   );
};

export default ChatBox;
