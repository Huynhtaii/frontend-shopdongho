import axios from 'axios';

const instance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    timeout: 1000,
    headers: { 'Content-Type': 'application/json' }
});

// Interceptor Request: Xử lý trước khi gửi request
instance.interceptors.request.use(
    async (config) => {
        // Thêm Authorization token vào header nếu có
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error); // Nếu có lỗi trong request
    }
);

// Interceptor Response: Xử lý khi nhận response
instance.interceptors.response.use(
    (response) => {
        // Bạn có thể xử lý dữ liệu hoặc thông báo từ server ở đây
        return response;
    },
    (error) => {
        if (!error.response) {
            console.error("Lỗi kết nối mạng hoặc server không phản hồi.");
            return Promise.reject({ message: "Lỗi mạng, vui lòng thử lại." });
        }

        const { status } = error.response;
        if (status === 401) {
            console.warn("🔑 Token hết hạn hoặc không hợp lệ!");
            // 🚀 Nếu có refresh token flow, thực hiện refresh ở đây
        } else if (status === 403) {
            console.warn("🚫 Không có quyền truy cập!");
        } else if (status === 404) {
            console.warn("❌ Không tìm thấy dữ liệu!");
        } else if (status === 500) {
            console.error("🔥 Lỗi server! Vui lòng thử lại sau.");
        }

        return null;
    }
);

export default instance;