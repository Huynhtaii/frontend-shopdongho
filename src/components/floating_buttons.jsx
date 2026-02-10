import { useEffect, useState, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import { IoChevronUp, IoSend } from 'react-icons/io5';
import { MdOutlineSupportAgent } from 'react-icons/md';
import socket, { connectSocket } from '../utils/socket';
import MessageService from '../services/message_service';
import AuthContext from '../context/auth.context';
import { toast } from 'react-toastify';

const FloatingButtons = () => {
   const [isVisible, setIsVisible] = useState(false);
   const [showChat, setShowChat] = useState(false);
   const adminId = process.env.REACT_APP_ADMIN_ID;
   const { auth } = useContext(AuthContext);
   useEffect(() => {
      const toggleVisibility = () => {
         if (window.scrollY > 300) {
            setIsVisible(true);
         } else {
            setIsVisible(false);
         }
      };
      window.addEventListener('scroll', toggleVisibility);
      return () => window.removeEventListener('scroll', toggleVisibility);
   }, []);

   return (
      <div className="fixed bottom-10 right-4 flex flex-col gap-3 z-50">
         <div className="relative w-10 h-10">
            <button
               onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
               className={`absolute w-10 h-10 bg-yellow-400 rounded-full 
                    flex items-center justify-center shadow-lg 
                    hover:scale-110 duration-300
                    top-1/2 left-1/2 -translate-x-1/2
                     ${isVisible ? '-translate-y-1/2 visible opacity-100' : '-translate-y-20 invisible opacity-0'}
                   `}
            >
               <IoChevronUp size={24} />
            </button>
         </div>
         <div className="relative">
            {/* /nếu là admin thì không hiển thị chat */}
            {String(auth.user?.id) !== String(adminId) && (
               <div
                  onClick={() => setShowChat(!showChat)}
                  className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center hover:scale-110 transition cursor-pointer"
               >
                  <MdOutlineSupportAgent size={24} />
               </div>
            )}
            {showChat && <Chat />}
         </div>
         {/*  {/* /nếu là admin thì không hiển thị chat zalo */}
         {String(auth.user?.id) !== String(adminId) && (
            <Link href="#" target="_blank" className="flex items-center justify-center hover:scale-110 transition">
               <img
                  src="https://bizweb.dktcdn.net/100/521/820/themes/957130/assets/addthis-zalo.svg?1736826036594"
                  alt="Zalo"
                  className="w-10 h-10"
               />
            </Link>
         )}
      </div>
   );
};

const Chat = () => {
   const [messages, setMessages] = useState([]);
   const [newMessage, setNewMessage] = useState('');
   const { auth } = useContext(AuthContext);
   //lấy ra tên của người dùng đang nhắn tin
   let userName = '';
   if (auth.isAuthenticated && auth.user?.id) {
      userName = auth.user.name;
   }
   const adminId = process.env.REACT_APP_ADMIN_ID; // ID của admin
   const messagesEndRef = useRef(null);
   console.log('>>>>>>>check auth in Chat component:', auth); // Thêm log này
   useEffect(() => {
      scrollToBottom();
   }, [messages]);
   const scrollToBottom = () => {
      if (messagesEndRef.current) {
         messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
   };
   useEffect(() => {
      console.log('>>>>>>>check auth condition:', {
         isAuthenticated: auth.isAuthenticated,
         userId: auth.user?.id,
      });

      if (auth.isAuthenticated && auth.user?.id) {
         console.log('>>>>>>>check auth condition2:', {
            isAuthenticated: auth.isAuthenticated,
            userId: auth.user?.id,
         });
         try {
            connectSocket();
            socket.emit('joinRoom', auth.user.id);
            loadChatHistory();

            const handleReceiveMessage = (message) => {
               console.log('📥 Nhận tin nhắn từ socket:', message);
               if (message.receiver_id === auth.user.id || message.sender_id === auth.user.id) {
                  setMessages((prev) => [...prev, message]);
                  scrollToBottom();
               }
            };

            socket.on('receiveMessage', handleReceiveMessage);

            // Thêm xử lý lỗi kết nối
            socket.on('connect_error', (error) => {
               console.error('Socket connection error:', error);
               toast.error('Không thể kết nối đến server chat');
            });

            return () => {
               socket.off('receiveMessage', handleReceiveMessage);
               socket.off('connect_error');
            };
         } catch (error) {
            console.error('Error in socket setup:', error);
            toast.error('Có lỗi xảy ra khi thiết lập kết nối chat');
         }
      }
   }, [auth.isAuthenticated, auth.user?.id]);

   const loadChatHistory = async () => {
      console.log('>>>>>>>loadChatHistory is called');
      try {
         const response = await MessageService.getChatHistory(auth.user.id);
         console.log('>>>>>>>check auth', auth.user.id);
         console.log('>>>>>>>check response check get chat history', response);
         if (response.EC === '0') {
            setMessages(response.DT);
         }
      } catch (error) {
         console.error('Error loading chat history:', error);
      }
   };

   const handleSendMessage = async () => {
      if (!auth.isAuthenticated) {
         toast.error('Vui lòng đăng nhập để chat với chúng tôi!');
         return;
      }

      if (!newMessage.trim()) return;

      const messageData = {
         sender_id: auth.user.id,
         receiver_id: adminId,
         content: newMessage,
         created_at: new Date().toISOString(),
      };
      // console.log('🚀 Gửi tin nhắn:', messageData);
      try {
         const response = await MessageService.sendMessage(messageData);
         // console.log('>>>>>>>check response send message', response);
         if (response.EC === '0') {
            setMessages((prev) => [...prev, messageData]);
            socket.emit('sendMessage', messageData);
            setNewMessage('');
         }
      } catch (error) {
         toast.error('Không thể gửi tin nhắn. Vui lòng thử lại!');
      }
   };

   return (
      <div className="absolute bottom-12 right-0 w-72 h-96 bg-white rounded-lg shadow-lg p-4 border border-gray-200">
         <div className="flex flex-col h-full">
            <div className="text-lg font-medium mb-2">Hỗ trợ khách hàng</div>
            {auth.isAuthenticated ? (
               <>
                  <div className="flex-1 overflow-y-auto">
                     <div className="flex flex-col gap-2">
                        {messages.map((msg, index) => (
                           <div
                              key={index}
                              className={`flex items-start gap-2 ${
                                 msg.sender_id === auth.user.id ? 'flex-row-reverse' : ''
                              }`}
                           >
                              <div
                                 className={`w-8 h-8 rounded-full ${
                                    msg.sender_id === auth.user.id ? 'bg-yellow-200' : 'bg-gray-200'
                                 } flex items-center justify-center`}
                              >
                                 {msg.sender_id === auth.user.id ? <FaUser /> : <MdOutlineSupportAgent size={20} />}
                              </div>
                              <div
                                 className={`p-2 rounded-lg max-w-[80%] ${
                                    msg.sender_id === auth.user.id ? 'bg-yellow-100' : 'bg-gray-100'
                                 }`}
                              >
                                 <div className="text-sm">
                                    <div
                                       className={`flex flex-col ${
                                          String(msg.sender_id) === String(adminId) ? 'items-start' : 'items-end'
                                       }`}
                                    >
                                       {/* Phân biệt giữa người dùng và admin */}
                                       {String(msg.sender_id) === String(adminId) ? (
                                          <span className="font-bold">Admin</span>
                                       ) : (
                                          <span className="font-bold">{userName || 'Bạn'}</span>
                                       )}

                                       <p>{msg.content}</p>
                                    </div>

                                    <p className="text-xs flex items-end justify-end text-gray-500">
                                       {' '}
                                       {new Intl.DateTimeFormat('vi-VN', {
                                          hour: '2-digit',
                                          minute: '2-digit',
                                       }).format(new Date(msg.created_at))}
                                    </p>
                                 </div>
                              </div>
                           </div>
                        ))}
                        <div ref={messagesEndRef} />
                     </div>
                  </div>
                  <div className="mt-2 relative">
                     <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Nhập tin nhắn..."
                        className="w-full p-2 pr-10 border border-gray-300 rounded-md"
                     />
                     <button
                        onClick={handleSendMessage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                     >
                        <IoSend size={20} />
                     </button>
                  </div>
               </>
            ) : (
               <div className="flex flex-col h-full items-center justify-center">
                  <p className="text-sm text-gray-500 text-center">Đăng nhập tài khoản để bắt đầu chat với chúng tôi</p>
                  <Link to="/login" className="text-primary">
                     Đăng nhập
                  </Link>
               </div>
            )}
         </div>
      </div>
   );
};

export default FloatingButtons;
