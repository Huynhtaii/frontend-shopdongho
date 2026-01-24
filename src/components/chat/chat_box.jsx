import { useState, useEffect, useRef, useContext } from 'react';
import { RiSendPlaneFill } from 'react-icons/ri';
import { FaUser } from 'react-icons/fa';
import { MdOutlineSupportAgent } from 'react-icons/md';
import MessageService from '../../services/message_service';
import AuthContext from '../../context/auth.context';
import socket from '../../utils/socket';
import { toast } from 'react-toastify';

const ChatBox = ({ selectedUser }) => {
   const [message, setMessage] = useState('');
   const [messages, setMessages] = useState([]);
   const { auth } = useContext(AuthContext);
   const messagesEndRef = useRef(null);
   const adminId = process.env.REACT_APP_ADMIN_ID;

   useEffect(() => {
      if (selectedUser?.id) {
         loadChatHistory();
      }
   }, [selectedUser]);

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
         }
      } catch (error) {
         console.error('Error loading chat history:', error);
         toast.error('Không thể tải lịch sử chat');
      }
   };

   useEffect(() => {
      socket.on('receiveMessage', (newMessage) => {
         console.log('Received new message:', newMessage);
         if (newMessage.sender_id === selectedUser?.id || newMessage.receiver_id === selectedUser?.id) {
            setMessages((prev) => [...prev, newMessage]);
         }
      });

      return () => {
         socket.off('receiveMessage');
      };
   }, [selectedUser]);

   const handleSend = async () => {
      if (!message.trim()) return;

      const messageData = {
         sender_id: Number(adminId), // Đảm bảo admin là người gửi
         receiver_id: selectedUser.id,
         content: message.trim(),
         created_at: new Date().toISOString(), // Thêm thời gian gửi
      };

      try {
         console.log('Sending message:', messageData);
         const response = await MessageService.sendMessage(messageData);

         if (response.EC === 0 || response.EC === '0') {
            // Thêm thông tin sender và receiver vào tin nhắn
            const newMessage = {
               ...messageData,
               sender: {
                  user_id: Number(adminId),
                  name: 'Admin',
                  email: 'admin@gmail.com',
               },
               receiver: {
                  user_id: selectedUser.id,
                  name: selectedUser.name,
                  email: selectedUser.email,
               },
            };

            setMessages((prev) => [...prev, newMessage]);
            socket.emit('sendMessage', newMessage);
            setMessage('');
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
