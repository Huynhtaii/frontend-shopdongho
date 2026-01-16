import axios from "axios";

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      // Server trả về lỗi
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // Không nhận được response
      return Promise.reject({
        message: "Lỗi mạng, vui lòng thử lại.",
      });
    } else {
      // Lỗi khi setup request
      return Promise.reject({
        message: "Có lỗi xảy ra, vui lòng thử lại.",
      });
    }
  }
);

export default instance;
