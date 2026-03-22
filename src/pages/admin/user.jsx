import { useEffect, useState } from 'react';
import ModalAddUpdateUser from '../../components/modals/modal_add_update_user';
import ModalUserOrders from '../../components/modals/modal_user_orders';
import { toast } from 'react-toastify';
import { FiPlus, FiEye } from 'react-icons/fi';
import UserService from '../../services/user_service';
import RoleService from '../../services/role_service';

const UserAdmin = () => {
   const [users, setUsers] = useState([]);
   const [isModalVisible, setIsModalVisible] = useState(false);
   const [editingUser, setEditingUser] = useState(null);
   const [roles, setRoles] = useState([]);
   const [isOrdersModalVisible, setIsOrdersModalVisible] = useState(false);
   const [selectedUser, setSelectedUser] = useState(null);
   const [userOrders, setUserOrders] = useState([]);
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
      setFormData({
         name: '',
         email: '',
         password: '',
         phone: '',
         address: '',
         role_id: roles.length > 0 ? roles[0].role_id : '',
      });
      setIsModalVisible(true);
   };

   const handleToggleStatus = async (userId) => {
      if (window.confirm('Bạn có chắc chắn muốn thay đổi trạng thái người dùng này?')) {
         try {
            const res = await UserService.toggleUserStatus(userId);
            if (res && res.EC === '0') {
               fetchData();
               toast.success(res.EM);
            } else {
               toast.error(res.EM || 'Thao tác thất bại');
            }
         } catch (error) {
            toast.error('Có lỗi xảy ra');
         }
      }
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      try {
         let res;
         if (editingUser) {
            res = await UserService.updateUser(editingUser.user_id, formData);
         } else {
            const newFromData = { ...formData, created_at: new Date().toISOString() };
            res = await UserService.addUser(newFromData);
         }

         if (res && res.EC === '0') {
            fetchData();
            setIsModalVisible(false);
            toast.success(`${editingUser ? 'Cập nhật' : 'Thêm'} người dùng thành công`);
         } else {
            toast.error(res?.EM || 'Có lỗi xảy ra');
         }
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
   const handleViewOrders = async (user) => {
      try {
         const res = await UserService.getUserWithOrders(user.user_id);
         if (res && res.EC === '0') {
            setSelectedUser(res.DT);
            setUserOrders(res.DT.orders || []);
            setIsOrdersModalVisible(true);
         } else {
            toast.error(res?.EM || 'Không thể lấy dữ liệu đơn hàng');
         }
      } catch (error) {
         toast.error('Có lỗi xảy ra khi tải đơn hàng');
      }
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
                           <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
                              Trạng thái
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
                              <td className="px-4 py-3 whitespace-nowrap text-sm">
                                 <span
                                    className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                                       user.status === 'active'
                                          ? 'bg-green-100 text-green-700'
                                          : 'bg-red-100 text-red-700'
                                    }`}
                                 >
                                    {user.status === 'active' ? 'Hoạt động' : 'Bị khoá'}
                                 </span>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                                 <div className="flex gap-2 justify-end">
                                    <button
                                       className={`${
                                          user.status === 'active'
                                             ? 'bg-red-500 hover:bg-red-600'
                                             : 'bg-green-500 hover:bg-green-600'
                                       } text-white px-3 py-1.5 rounded-lg text-xs font-bold transition duration-200`}
                                       onClick={() => handleToggleStatus(user.user_id)}
                                    >
                                       {user.status === 'active' ? 'Vô hiệu hoá' : 'Kích hoạt'}
                                    </button>
                                    <button
                                       className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition duration-200 flex items-center gap-1"
                                       onClick={() => handleViewOrders(user)}
                                    >
                                       <FiEye /> Xem đơn hàng
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

         {isOrdersModalVisible && (
            <ModalUserOrders
               user={selectedUser}
               orders={userOrders}
               onClose={() => setIsOrdersModalVisible(false)}
            />
         )}
      </div>
   );
};

export default UserAdmin;
