import React, { useState } from 'react';
import { FaUserPlus, FaEdit, FaTrash } from 'react-icons/fa';
import ModalAddUpdateUser from '../../components/modals/modal_add_update_user';
import { toast } from 'react-toastify';
import { FiPlus } from 'react-icons/fi';


const MOCK_USERS = [
    {
        user_id: 1,
        name: "admin",
        email: "admin@example.com",
        password: "123",
        phone: "0909090909",
        address: "Hà Nội",
        role: "Admin"
    },
    {
        user_id: 2,
        name: "johndoe",
        email: "john.doe@example.com",
        password: "123",
        phone: "0909090909",
        address: "Hà Nội",
        role: "User"
    },
    {
        user_id: 3,
        name: "janesmith",
        email: "jane.smith@example.com",
        password: "123",
        phone: "0909090909",
        address: "Hà Nội",
        role: "Editor"
    },
    {
        user_id: 4,
        name: "robertjohnson",
        email: "robert.j@example.com",
        password: "123",
        phone: "0909090909",
        address: "Hà Nội",
        role: "User"
    },
    {
        user_id: 5,
        name: "sarahwilliams",
        email: "sarah.w@example.com",
        password: "123",
        phone: "0909090909",
        address: "Hà Nội",
        role: "Manager"
    }
];


const UserAdmin = () => {
    const [users, setUsers] = useState(MOCK_USERS);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        role: ''
    });

    const handleAdd = () => {
        setEditingUser(null);
        setFormData({ name: '', email: '', password: '', phone: '', address: '', role: '' });
        setIsModalVisible(true);
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setFormData(user);
        setIsModalVisible(true);
    };

    const handleDelete = async (userId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
            try {
                // Thêm logic xóa người dùng
                toast.success('Xóa người dùng thành công');
            } catch (error) {
                toast.error('Có lỗi xảy ra khi xóa người dùng');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingUser) {
                // Thêm logic cập nhật người dùng
            } else {
                // Thêm logic tạo người dùng mới
            }
            setIsModalVisible(false);
            toast.success(`${editingUser ? 'Cập nhật' : 'Thêm'} người dùng thành công`);
        } catch (error) {
            toast.error('Có lỗi xảy ra');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">Quản lý người dùng</h1>
                <button
                    onClick={handleAdd}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                    <FiPlus /> Thêm người dùng
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã người dùng</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên người dùng</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số điện thoại</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Địa chỉ</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vai trò</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {users.map(user => (
                            <tr key={user.user_id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">{user.user_id}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{user.phone}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{user.address}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex gap-2">
                                        <button
                                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded flex items-center gap-1 transition duration-200"
                                            onClick={() => handleEdit(user)}
                                        >
                                            <FaEdit /> Sửa
                                        </button>
                                        <button
                                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1 transition duration-200"
                                            onClick={() => handleDelete(user.id)}
                                        >
                                            <FaTrash /> Xóa
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalVisible && (
                <ModalAddUpdateUser
                    editingUser={editingUser}
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleSubmit={handleSubmit}
                    setIsModalVisible={setIsModalVisible} />
            )}
        </div>
    );
};

export default UserAdmin;
