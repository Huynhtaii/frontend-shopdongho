# 🕰️ WatchStore - Website Bán Đồng Hồ Full-Stack

## 📋 Tổng quan dự án

WatchStore là một website thương mại điện tử chuyên bán đồng hồ được xây dựng với React.js (Frontend) và Node.js (Backend). Dự án cung cấp đầy đủ các tính năng của một cửa hàng trực tuyến hiện đại với giao diện thân thiện và trải nghiệm người dùng mượt mà.

## ✨ Các chức năng chính

### 🛍️ **Chức năng khách hàng (Customer Features)**

#### 🔐 **Xác thực & Quản lý tài khoản**

-  Đăng ký tài khoản mới với xác thực email
-  Đăng nhập/đăng xuất với JWT authentication
-  Quản lý thông tin cá nhân (tên, số điện thoại, địa chỉ)
-  Lịch sử mua hàng với theo dõi trạng thái đơn hàng

#### 🛒 **Mua sắm & Giỏ hàng**

-  Duyệt danh mục sản phẩm đa dạng (Nam, Nữ, Treo tường, Xu hướng 2025)
-  Tìm kiếm sản phẩm thông minh
-  Bộ lọc sản phẩm theo giá, loại, đánh giá
-  Thêm/xóa/cập nhật số lượng sản phẩm trong giỏ hàng
-  Danh sách yêu thích (Wishlist)
-  Xem chi tiết sản phẩm với hình ảnh, mô tả, đánh giá

#### 💳 **Thanh toán đa dạng**

-  **Thanh toán COD**: Trả tiền khi nhận hàng
-  **Thanh toán QR Code**: Chuyển khoản ngân hàng qua QR
   -  Tự động tạo mã QR với thông tin chuyển khoản
   -  Kiểm tra thanh toán tự động qua Google Sheets API
   -  Xác nhận thanh toán thời gian thực

#### 💬 **Hỗ trợ khách hàng**

-  **Chat realtime** với admin sử dụng Socket.io
-  Floating chat button luôn sẵn sàng hỗ trợ
-  Gửi/nhận tin nhắn tức thì
-  Lịch sử chat được lưu trữ

#### 🎯 **Tính năng chung**

-  Responsive design cho mọi thiết bị
-  Slider banner quảng cáo
-  Sản phẩm đã xem gần đây
-  Scroll to top button
-  Toast notifications
-  Loading states

### 🔧 **Chức năng quản trị (Admin Features)**

#### 📊 **Dashboard & Thống kê**

-  Tổng quan doanh thu, đơn hàng, sản phẩm, khách hàng
-  Biểu đồ doanh thu theo thời gian (Chart.js)
-  Thống kê trạng thái đơn hàng
-  Báo cáo tương tác trực quan

#### 📦 **Quản lý sản phẩm**

-  Thêm/sửa/xóa sản phẩm
-  Upload hình ảnh sản phẩm
-  Quản lý danh mục, giá gốc, giá khuyến mãi
-  Tự động tạo mã SKU
-  Chuyển đổi số thành chữ cho giá tiền

#### 📋 **Quản lý đơn hàng**

-  Xem danh sách tất cả đơn hàng
-  Cập nhật trạng thái đơn hàng (Pending, Shipped, Completed, Cancelled)
-  Chi tiết đơn hàng và thông tin khách hàng
-  Xóa đơn hàng

#### 👥 **Quản lý người dùng**

-  Thêm/sửa/xóa tài khoản người dùng
-  Phân quyền vai trò (Admin, Customer)
-  Quản lý thông tin liên hệ

#### 💬 **Quản lý tin nhắn**

-  Xem tất cả cuộc hội thoại với khách hàng
-  Chat realtime với khách hàng
-  Lịch sử tin nhắn đầy đủ

## 🛠️ **Công nghệ sử dụng**

### **Frontend**

-  **React 19.0.0** - UI Framework
-  **React Router Dom** - Navigation
-  **TailwindCSS** - Styling
-  **Socket.io Client** - Real-time communication
-  **Axios** - HTTP requests
-  **Chart.js** - Data visualization
-  **Swiper** - Image sliders
-  **React Icons** - Icon library
-  **React Toastify** - Notifications

### **Backend Integration**

-  JWT Authentication
-  RESTful API
-  Real-time WebSocket
-  File upload (Multer)
-  Google Sheets API (Payment tracking)

### **Payment Integration**

-  VietQR API for QR code generation
-  Google Apps Script for payment verification
-  Multiple payment methods support

## 🌟 **Tính năng nổi bật**

1. **💰 Thanh toán thông minh**: Tích hợp QR code với xác minh tự động
2. **💬 Chat realtime**: Hỗ trợ khách hàng 24/7 với Socket.io
3. **📱 Responsive**: Tối ưu cho mọi thiết bị từ mobile đến desktop
4. **🔍 Tìm kiếm thông minh**: Lọc và tìm kiếm sản phẩm đa tiêu chí
5. **📊 Dashboard admin**: Quản lý toàn diện với biểu đồ thống kê
6. **🛡️ Bảo mật**: JWT authentication và role-based access control
7. **⚡ Performance**: Optimized loading và lazy loading components

## 📁 **Cấu trúc dự án**

```
src/
├── components/          # Các component tái sử dụng
├── pages/              # Các trang chính
├── services/           # API services
├── context/            # React Context (Auth, Cart, Favorite)
├── hooks/              # Custom hooks
├── utils/              # Utilities và helpers
├── constants/          # Dữ liệu constants
└── routers/            # Route configuration
```

## 🚀 **Hướng dẫn chạy dự án**

1. **Clone repository**

   ```bash
   git clone [repository-url]
   cd frontend-shopdongho
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Setup environment variables**

   ```bash
   # Tạo file .env với các biến môi trường
   REACT_APP_ADMIN_ID=your_admin_id
   REACT_APP_BANK_ID=your_bank_id
   REACT_APP_ACCOUNT_NO=your_account_number
   ```

4. **Start development server**
   ```bash
   npm start
   ```

## 👥 **Đối tượng sử dụng**

-  **Khách hàng**: Mua sắm đồng hồ trực tuyến với trải nghiệm mượt mà
-  **Admin**: Quản lý toàn bộ hoạt động kinh doanh qua dashboard
-  **Nhân viên hỗ trợ**: Chat tư vấn khách hàng realtime

## 🔮 **Tính năng tương lai**

-  Tích hợp AI chatbot tư vấn sản phẩm
-  Hệ thống review và rating
-  Notifications push
-  Multi-language support
-  Advanced analytics
