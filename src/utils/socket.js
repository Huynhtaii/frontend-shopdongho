import { io } from 'socket.io-client';

const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:6969', {
   withCredentials: true, // Cho phép gửi cookies & token nếu có
   transports: ['websocket'], // Ưu tiên WebSocket
});

export default socket;
