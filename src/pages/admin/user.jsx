import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import ModalAddUpdateUser from '../../components/modals/modal_add_update_user';
import { toast } from 'react-toastify';
import { FiPlus } from 'react-icons/fi';
import UserService from '../../services/user_service';
import RoleService from '../../services/role_service';

const UserAdmin = () => {
   const [users, setUsers] = useState([]);
   const [isModalVisible, setIsModalVisible] = useState(false);
   const [editingUser, setEditingUser] = useState(null);
   const [roles, setRoles] = useState([]);
   const [formData, setFormData] = useState({
      name: '',
      email: '',
      password: '',
      phone: '',
      address: '',
      role_id: '',
   });

   const fetchData = async () => {
      try {
         const usersData = await UserService.getAllUsers();
         setUsers(usersData.DT);
      } catch (error) {
         toast.error('Có lỗi xảy ra khi tải dữ liệu người dùng');
      }
   };

   useEffect(() => {
      const fetchRoles = async () => {
         const rolesData = await RoleService.getAllRoles();
         setRoles(rolesData.DT);
      };
      fetchRoles();
   }, []);

   useEffect(() => {
      fetchData();
   }, []);

   const handleAdd = () => {
      setEditingUser(null);
      setFormData({ name: '', email: '', password: '', phone: '', address: '', role_id: '' });
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
            const res = await UserService.deleteUser(userId);
            console.log(res);
            fetchData();
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
            await UserService.updateUser(editingUser.user_id, formData);
         } else {
            const newFromData = { ...formData, created_at: new Date().toISOString() };
            await UserService.addUser(newFromData);
         }
         fetchData();
         setIsModalVisible(false);
         toast.success(`${editingUser ? 'Cập nhật' : 'Thêm'} người dùng thành công`);
      } catch (error) {
         toast.error('Có lỗi xảy ra');
      }
   };

   const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
         ...prev,
         [name]: value,
      }));
   };

   return (
      <div className="p-4 sm:p-6">
         <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <h1 className="text-xl sm:text-2xl font-semibold">Quản lý người dùng</h1>
            <button
               onClick={handleAdd}
               className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
            >
               <FiPlus /> Thêm người dùng
            </button>
         </div>

         {/* Table wrapper with fixed width and horizontal scroll */}
         <div className="w-full rounded-lg border border-gray-200 bg-white">
            <div className="overflow-x-auto">
               <div className="inline-block min-w-full">
                  <table className="min-w-full divide-y divide-gray-200">
                     <thead className="bg-gray-50">
                        <tr>
                           <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
                              Mã
                           </th>
                           <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
                              Tên
                           </th>
                           <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
                              Email
                           </th>
                           <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
                              SĐT
                           </th>
                           <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
                              Địa chỉ
                           </th>
                           <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
                              Vai trò
                           </th>
                           <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
                              Thao tác
                           </th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-200">
                        {users?.map((user) => (
                           <tr key={user.user_id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{user.user_id}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{user.name}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{user.phone}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{user.address}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                 {roles?.find((role) => role.role_id === user.role_id)?.name}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                                 <div className="flex gap-2 justify-end">
                                    <button
                                       className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded flex items-center gap-1 transition duration-200"
                                       onClick={() => handleEdit(user)}
                                    >
                                       <FaEdit className="sm:mr-1" />
                                       <span className="hidden sm:inline">Sửa</span>
                                    </button>
                                    <button
                                       className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded flex items-center gap-1 transition duration-200"
                                       onClick={() => handleDelete(user.user_id)}
                                    >
                                       <FaTrash className="sm:mr-1" />
                                       <span className="hidden sm:inline">Xóa</span>
                                    </button>
                                 </div>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
         </div>

         {/* Modal */}
         {isModalVisible && (
            <ModalAddUpdateUser
               editingUser={editingUser}
               formData={formData}
               handleInputChange={handleInputChange}
               handleSubmit={handleSubmit}
               setIsModalVisible={setIsModalVisible}
               roles={roles}
            />
         )}
      </div>
   );
};

export default UserAdmin;
