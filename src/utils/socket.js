import { io } from 'socket.io-client';

// Tạo base URL cho socket
const getSocketURL = () => {
   const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:6969/api';
   // Loại bỏ '/api' từ URL nếu có
   return apiUrl.replace('/api', '');
};

const socket = io(getSocketURL(), {
   withCredentials: true, // Cho phép gửi cookies & token nếu có
   transports: ['polling', 'websocket'], // Đổi thứ tự, thử polling trước
   autoConnect: false, // Không tự động kết nối khi khởi tạo
   reconnection: true, // Tự động kết nối lại khi mất kết nối
   reconnectionAttempts: 3, // Số lần thử kết nối lại
   reconnectionDelay: 2000, // Thời gian chờ giữa các lần kết nối lại
   timeout: 10000,
});

let isConnected = false;

// Debug socket connection
socket.on('connect', () => {
   console.log('Socket connected:', socket.id);
   isConnected = true;
});

socket.on('disconnect', () => {
   console.log('Socket disconnected');
   isConnected = false;
});

socket.on('connect_error', (error) => {
   console.error('Socket connection error:', error);
   // Thử kết nối lại với polling nếu websocket thất bại
   if (socket.io.opts.transports[0] === 'websocket') {
      console.log('Falling back to polling transport');
      socket.io.opts.transports = ['polling'];
   }
});

socket.io.on('reconnect_attempt', () => {
   console.log('Attempting to reconnect...');
});

socket.io.on('reconnect', (attempt) => {
   console.log('Reconnected on attempt: ' + attempt);
});

socket.io.on('reconnect_error', (error) => {
   console.error('Reconnection error:', error);
});

export const connectSocket = () => {
   if (!isConnected) {
      socket.connect();
   }
};

export default socket;
