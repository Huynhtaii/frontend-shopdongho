import { useState } from "react";

const Order = () => {
    const [activeTab, setActiveTab] = useState('all');

    // Mock data - thay thế bằng dữ liệu thực từ API
    const orders = [
        {
            id: "DH001",
            date: "2024-03-15",
            total: 2800000,
            status: "pending",
            items: [
                {
                    id: 1,
                    name: "Đồng hồ Nam Casio MTP-1375L-1AVDF",
                    image: "https://www.watchstore.vn/images/products/2024/08/22/resized/8131g-ch-n-1_1724295651.webp",
                    price: 1400000,
                    quantity: 2
                },
                {
                    id: 1,
                    name: "Đồng hồ Nam Casio MTP-1375L-1AVDF",
                    image: "https://www.watchstore.vn/images/products/2024/08/22/resized/8131g-ch-n-1_1724295651.webp",
                    price: 1400000,
                    quantity: 2
                }
            ]
        },
        {
            id: "DH002",
            date: "2024-03-14",
            total: 5600000,
            status: "completed",
            items: [
                {
                    id: 2,
                    name: "Đồng hồ Nữ Casio LTP-V007L-7E1UDF",
                    image: "https://www.watchstore.vn/images/products/2024/08/22/resized/8131g-ch-n-1_1724295651.webp",
                    price: 2800000,
                    quantity: 2
                }
            ]
        }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'completed':
                return 'Đã giao';
            case 'pending':
                return 'Đang xử lý';
            case 'cancelled':
                return 'Đã hủy';
            default:
                return 'Không xác định';
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    return (
        <div className="layout-container !pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 my-3">
                <h1 className="text-xl font-[600]">Đơn hàng của tôi</h1>
            </div>

            {/* Filter tabs */}
            <div className="flex gap-2 border-b mb-6">
                <button
                    onClick={() => setActiveTab('all')}
                    className={`px-4 py-2 text-sm font-medium ${activeTab === 'all' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
                >
                    Tất cả
                </button>
                <button
                    onClick={() => setActiveTab('pending')}
                    className={`px-4 py-2 text-sm font-medium ${activeTab === 'pending' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
                >
                    Đang xử lý
                </button>
                <button
                    onClick={() => setActiveTab('completed')}
                    className={`px-4 py-2 text-sm font-medium ${activeTab === 'completed' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
                >
                    Đã giao
                </button>
                <button
                    onClick={() => setActiveTab('cancelled')}
                    className={`px-4 py-2 text-sm font-medium ${activeTab === 'cancelled' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
                >
                    Đã hủy
                </button>
            </div>

            {/* Order list */}
            <div className="space-y-4">
                {orders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4">
                        {/* Order header */}
                        <div className="flex justify-between items-center pb-4 border-b">
                            <div>
                                <p className="text-sm text-gray-500">Mã đơn hàng: {order.id}</p>
                                <p className="text-sm text-gray-500">Ngày đặt: {formatDate(order.date)}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                {getStatusText(order.status)}
                            </span>
                        </div>

                        {/* Order items */}
                        {order.items.map((item) => (
                            <div key={item.id} className="flex items-center gap-4 py-4 border-b">
                                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
                                <div className="flex-1">
                                    <h3 className="text-sm font-medium">{item.name}</h3>
                                    <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                                    <p className="text-sm font-medium text-primary">{formatPrice(item.price)}</p>
                                </div>
                            </div>
                        ))}

                        {/* Order footer */}
                        <div className="flex justify-between items-center pt-4">
                            <div className="text-sm">
                                <span className="text-gray-500">Tổng tiền:</span>
                                <span className="ml-2 font-medium text-primary">{formatPrice(order.total)}</span>
                            </div>
                            <div className="flex gap-2">
                                {order.status === 'pending' && (
                                    <button className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-600">
                                        Hủy đơn
                                    </button>
                                )}
                                {order.status === 'completed' && (
                                    <button className="px-4 py-2 text-sm font-medium text-white bg-primary rounded hover:bg-red-600">
                                        Mua lại
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Order;