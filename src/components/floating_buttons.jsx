import { useEffect, useState, useContext, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import { IoChevronUp, IoSend } from 'react-icons/io5';
import { MdOutlineSupportAgent } from 'react-icons/md';
import socket, { connectSocket } from '../utils/socket';
import MessageService from '../services/message_service';
import AuthContext from '../context/auth.context';
import { toast } from 'react-toastify';
import AIService from '../services/ai_service';
import { RiRobot2Line } from 'react-icons/ri';
import ReactMarkdown from 'react-markdown';
import { v4 as uuidv4 } from 'uuid';

const FloatingButtons = () => {
   const [isVisible, setIsVisible] = useState(false);
   const [showChat, setShowChat] = useState(false);
   const [showAIChat, setShowAIChat] = useState(false);
   const adminId = process.env.REACT_APP_ADMIN_ID;
   const { auth } = useContext(AuthContext);

   useEffect(() => {
      const toggleVisibility = () => {
         setIsVisible(window.scrollY > 300);
      };
      window.addEventListener('scroll', toggleVisibility);
      return () => window.removeEventListener('scroll', toggleVisibility);
   }, []);

   return (
      <div className="fixed bottom-10 right-4 flex flex-col gap-3 z-50">
         <div className="relative w-10 h-10">
            <button
               onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
               className={`absolute w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg hover:scale-110 duration-300 top-1/2 left-1/2 -translate-x-1/2 ${isVisible ? '-translate-y-1/2 visible opacity-100' : '-translate-y-20 invisible opacity-0'}`}
            >
               <IoChevronUp size={24} />
            </button>
         </div>

         <div className="relative">
            {String(auth.user?.id) !== String(adminId) && (
               <div
                  onClick={() => setShowChat(!showChat)}
                  className={`w-10 h-10 ${showChat ? 'bg-yellow-500' : 'bg-yellow-400'} rounded-full flex items-center justify-center hover:scale-110 transition cursor-pointer shadow-lg`}
                  title="Chat với nhân viên"
               >
                  <MdOutlineSupportAgent size={24} />
               </div>
            )}
            {showChat && <Chat />}
         </div>

         <div className="relative">
            <div
               onClick={() => setShowAIChat(!showAIChat)}
               className={`w-10 h-10 ${showAIChat ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'} border-2 border-blue-600 rounded-full flex items-center justify-center hover:scale-110 transition cursor-pointer shadow-lg`}
               title="AI Tư vấn sản phẩm"
            >
               <RiRobot2Line size={24} />
            </div>
            {showAIChat && <AIChat />}
         </div>

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
   const adminId = process.env.REACT_APP_ADMIN_ID;
   const messagesEndRef = useRef(null);

   let userName = '';
   if (auth.isAuthenticated && auth.user?.id) {
      userName = auth.user.name;
   }

   useEffect(() => {
      if (messagesEndRef.current) {
         messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
   }, [messages]);

   const loadChatHistory = useCallback(async () => {
      try {
         const response = await MessageService.getChatHistory(auth.user.id);
         if (response.EC === '0') setMessages(response.DT);
      } catch (error) {
         console.error('Error loading chat history:', error);
      }
   }, [auth.user.id]);

   useEffect(() => {
      if (auth.isAuthenticated && auth.user?.id) {
         try {
            connectSocket();
            socket.emit('joinRoom', auth.user.id);
            loadChatHistory();

            const handleReceiveMessage = (message) => {
               if (message.receiver_id === auth.user.id || message.sender_id === auth.user.id) {
                  setMessages((prev) => [...prev, message]);
               }
            };

            socket.on('receiveMessage', handleReceiveMessage);
            socket.on('connect_error', () => toast.error('Không thể kết nối đến server chat'));

            return () => {
               socket.off('receiveMessage', handleReceiveMessage);
               socket.off('connect_error');
            };
         } catch (error) {
            console.error('Error in socket setup:', error);
            toast.error('Có lỗi xảy ra khi thiết lập kết nối chat');
         }
      }
   }, [auth.isAuthenticated, auth.user?.id, loadChatHistory]);

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
      try {
         const response = await MessageService.sendMessage(messageData);
         if (response.EC === '0') {
            setMessages((prev) => [...prev, messageData]);
            socket.emit('sendMessage', messageData);
            setNewMessage('');
         }
      } catch {
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
                              className={`flex items-start gap-2 ${msg.sender_id === auth.user.id ? 'flex-row-reverse' : ''}`}
                           >
                              <div
                                 className={`w-8 h-8 rounded-full ${msg.sender_id === auth.user.id ? 'bg-yellow-200' : 'bg-gray-200'} flex items-center justify-center`}
                              >
                                 {msg.sender_id === auth.user.id ? <FaUser /> : <MdOutlineSupportAgent size={20} />}
                              </div>
                              <div
                                 className={`p-2 rounded-lg max-w-[80%] ${msg.sender_id === auth.user.id ? 'bg-yellow-100' : 'bg-gray-100'}`}
                              >
                                 <div className="text-sm">
                                    <div
                                       className={`flex flex-col ${String(msg.sender_id) === String(adminId) ? 'items-start' : 'items-end'}`}
                                    >
                                       {String(msg.sender_id) === String(adminId) ? (
                                          <span className="font-bold">Admin</span>
                                       ) : (
                                          <span className="font-bold">{userName || 'Bạn'}</span>
                                       )}
                                       <p>{msg.content}</p>
                                    </div>
                                    <p className="text-xs flex items-end justify-end text-gray-500">
                                       {new Intl.DateTimeFormat('vi-VN', { hour: '2-digit', minute: '2-digit' }).format(
                                          new Date(msg.created_at),
                                       )}
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

const AIChat = () => {
   const { auth } = useContext(AuthContext);
   const [messages, setMessages] = useState([]);
   const [newMessage, setNewMessage] = useState('');
   const [loading, setLoading] = useState(false);
   const [historyLoading, setHistoryLoading] = useState(true);
   const messagesEndRef = useRef(null);

   const [sessionId] = useState(() => {
      let id = localStorage.getItem('ai_session_id');
      if (!id) {
         id = uuidv4();
         localStorage.setItem('ai_session_id', id);
      }
      return id;
   });

   const GREETING = {
      sender: 'ai',
      content: 'Xin chào! Tôi là trợ lý ảo của WatchStore. Tôi có thể giúp gì cho bạn trong việc chọn đồng hồ hôm nay?',
      created_at: new Date().toISOString(),
   };

   // Load chat history on mount
   useEffect(() => {
      const loadHistory = async () => {
         try {
            setHistoryLoading(true);
            const res = await AIService.getHistory(auth.user?.id, sessionId);
            if (res.EC === '0' && res.DT && res.DT.length > 0) {
               const mapped = res.DT.map((m) => ({
                  sender: m.role === 'assistant' ? 'ai' : 'user',
                  content: m.content,
                  created_at: m.created_at,
               }));
               setMessages(mapped);
            } else {
               setMessages([GREETING]);
            }
         } catch {
            setMessages([GREETING]);
         } finally {
            setHistoryLoading(false);
         }
      };
      loadHistory();
   }, [auth.user?.id, sessionId]); // eslint-disable-line react-hooks/exhaustive-deps

   // Scroll to bottom when messages change
   useEffect(() => {
      if (messagesEndRef.current) {
         messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
   }, [messages, loading]);

   const handleSend = async () => {
      if (!newMessage.trim() || loading) return;

      const userMsg = { sender: 'user', content: newMessage, created_at: new Date().toISOString() };
      setMessages((prev) => [...prev, userMsg]);
      setNewMessage('');
      setLoading(true);

      try {
         const response = await AIService.consult(newMessage, auth.user?.id, sessionId);
         if (response.EC === '0') {
            const aiMsg = { sender: 'ai', content: response.DT, created_at: new Date().toISOString() };
            setMessages((prev) => [...prev, aiMsg]);
         } else {
            toast.error('AI đang bận, vui lòng thử lại sau!');
         }
      } catch {
         toast.error('Lỗi kết nối AI!');
      } finally {
         setLoading(false);
      }
   };

   return (
      <div
         className="absolute bottom-12 right-0 w-80 h-[450px] bg-white rounded-xl shadow-2xl p-4 border border-blue-100 flex flex-col z-[1001]"
         onClick={(e) => e.stopPropagation()}
      >
         <div className="flex items-center gap-2 border-b pb-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
               <RiRobot2Line size={24} />
            </div>
            <div>
               <h3 className="font-bold text-gray-800">AI Consultant</h3>
               <p className="text-xs text-green-500 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Trực tuyến
               </p>
            </div>
         </div>

         <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {historyLoading ? (
               <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm gap-2">
                  <div className="flex gap-1">
                     <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></span>
                     <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                     <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                  <span>Đang tải lịch sử...</span>
               </div>
            ) : (
               <>
                  {messages.map((msg, index) => (
                     <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div
                           className={`max-w-[90%] p-3 rounded-2xl text-sm ${
                              msg.sender === 'user'
                                 ? 'bg-blue-600 text-white rounded-tr-none'
                                 : 'bg-gray-100 text-gray-800 rounded-tl-none border border-gray-200'
                           }`}
                        >
                           <div className="markdown-content">
                              <ReactMarkdown
                                 components={{
                                    a: ({ node, ...props }) => (
                                       <Link
                                          to={props.href}
                                          className="text-blue-600 font-bold underline hover:text-blue-800 transition-colors inline-block my-1"
                                       >
                                          {props.children}
                                       </Link>
                                    ),
                                    p: ({ node, ...props }) => (
                                       <p {...props} className="mb-2 last:mb-0 leading-relaxed" />
                                    ),
                                    strong: ({ node, ...props }) => <strong {...props} className="font-bold" />,
                                 }}
                              >
                                 {msg.content}
                              </ReactMarkdown>
                           </div>
                           <p
                              className={`text-[10px] mt-1 ${msg.sender === 'user' ? 'text-blue-100 text-right' : 'text-gray-400'}`}
                           >
                              {new Date(msg.created_at).toLocaleTimeString('vi-VN', {
                                 hour: '2-digit',
                                 minute: '2-digit',
                              })}
                           </p>
                        </div>
                     </div>
                  ))}
                  {loading && (
                     <div className="flex justify-start">
                        <div className="bg-gray-100 p-3 rounded-2xl rounded-tl-none border border-gray-200">
                           <div className="flex gap-1">
                              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                           </div>
                        </div>
                     </div>
                  )}
               </>
            )}
            <div ref={messagesEndRef} />
         </div>

         <div className="mt-3 relative">
            <input
               type="text"
               value={newMessage}
               onChange={(e) => setNewMessage(e.target.value)}
               onKeyPress={(e) => e.key === 'Enter' && handleSend()}
               placeholder="Hỏi AI về đồng hồ..."
               className="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
            <button
               onClick={handleSend}
               disabled={loading || !newMessage.trim()}
               className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 transition-all"
            >
               <IoSend size={16} />
            </button>
         </div>
      </div>
   );
};

export default FloatingButtons;
