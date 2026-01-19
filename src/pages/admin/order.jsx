import React, { useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { toast } from 'react-toastify';
import ModalUpdateOrder from '../../components/modals/modal_update_order';

// Mock data matching your database structure
const MOCK_ORDERS = [
    {
        order_id: 1001,
        order_date: "2025-02-24 12:10:32",
        status: "Completed",
        total_amount: 280.00,
        user_id: 1,
        discount_id: null,
        order_items: [
            {
                order_item_id: 1,
                quantity: 1,
                price: 280.00,
                order_id: 1001,
                product_id: 101
            },
            {
                order_item_id: 2,
                quantity: 1,
                price: 280.00,
                order_id: 1001,
                product_id: 101
            }
        ]
    },
    {
        order_id: 1002,
        order_date: "2025-02-24 12:10:32",
        status: "Pending",
        total_amount: 250.00,
        user_id: 2,
        discount_id: null,
        order_items: [
            {
                order_item_id: 2,
                quantity: 1,
                price: 250.00,
                order_id: 1002,
                product_id: 103
            }
        ]
    }
];

const OrderAdmin = () => {
    const [orders, setOrders] = useState(MOCK_ORDERS);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(0);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [formData, setFormData] = useState({
        order_date: '',
        status: '',
        total_amount: '',
        user_id: '',
        discount_id: null,
        order_items: []
    });

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        if (isDetailModalVisible === order.order_id) {
            setIsDetailModalVisible(0);
        } else {
            setIsDetailModalVisible(order.order_id);
        }
    };

    const handleEdit = (order) => {
        setSelectedOrder(order);
        setFormData(order);
        setIsModalVisible(true);
    };

    const handleDelete = async (orderId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa đơn hàng này?')) {
            try {
                // API call to delete order
                toast.success('Xóa đơn hàng thành công');
            } catch (error) {
                toast.error('Có lỗi xảy ra khi xóa đơn hàng');
            }
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const getStatusBadgeClass = (status) => {
        switch (status.toLowerCase()) {
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

    const handleUpdateStatus = (orderId, status) => {
        console.log(orderId, status);
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">Quản lý đơn hàng</h1>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã đơn hàng</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày đặt</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng tiền</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã người dùng</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã giảm giá</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {orders.map(order => (
                            <>
                                <tr key={order.order_id} className="hover:bg-gray-50" onClick={() => handleViewDetails(order)}>
                                    <td className="px-6 py-4 whitespace-nowrap">{order.order_id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{order.order_date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(order.total_amount)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{order.user_id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{order.discount_id || 'Không có'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex gap-2">
                                            <button
                                                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded flex items-center gap-1 transition duration-200"
                                                onClick={() => handleEdit(order)}
                                            >
                                                <FaEdit /> Cập nhật trạng thái
                                            </button>
                                            <button
                                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1 transition duration-200"
                                                onClick={() => handleDelete(order.order_id)}
                                            >
                                                <FaTrash /> Xóa
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                {isDetailModalVisible === order.order_id && (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-4 bg-gray-50">
                                            <div className="text-sm text-gray-600">
                                                <div className="font-semibold mb-2">Chi tiết đơn hàng:</div>
                                                <table className="w-full">
                                                    <thead>
                                                        <tr>
                                                            <th className="text-left py-2">Mã sản phẩm</th>
                                                            <th className="text-left py-2">Số lượng</th>
                                                            <th className="text-left py-2">Đơn giá</th>
                                                            <th className="text-left py-2">Thành tiền</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {order.order_items.map(item => (
                                                            <tr key={item.order_item_id}>
                                                                <td className="py-2">{item.product_id}</td>
                                                                <td className="py-2">{item.quantity}</td>
                                                                <td className="py-2">{formatCurrency(item.price)}</td>
                                                                <td className="py-2">{formatCurrency(item.price * item.quantity)}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalVisible && (
                <ModalUpdateOrder
                    show={isModalVisible}
                    handleClose={() => setIsModalVisible(false)}
                    orderId={selectedOrder?.order_id}
                    currentStatus={selectedOrder?.status}
                    onUpdateStatus={handleUpdateStatus}
                />
            )}
        </div>
    );
};

export default OrderAdmin;
