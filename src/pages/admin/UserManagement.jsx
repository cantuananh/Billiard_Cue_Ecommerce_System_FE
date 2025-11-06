import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  MoreVertical,
  UserCheck,
  UserX,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import UserModal from '../../components/admin/UserModal';
import ConfirmModal from '../../components/ui/ConfirmModal';
import { adminUserService } from '../../services/adminUserService';
import { useDebounce } from '../../hooks/useDebounce';
import toast from 'react-hot-toast';

const UserManagement = () => {
  const [usersData, setUsersData] = useState({
    content: [],
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
    first: true,
    last: true,
    empty: true
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedUsers, setSelectedUsers] = useState([]);
  
  // Debounce search term - chỉ search sau 500ms khi user ngừng gõ
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  
  // Modal states
  const [userModal, setUserModal] = useState({ isOpen: false, user: null, loading: false });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, user: null, action: null, loading: false });

  // Fetch users data
  const fetchUsers = async (page = currentPage) => {
    try {
      setLoading(true);
      const params = {
        page,
        size: 10,
        search: debouncedSearchTerm, // Sử dụng debounced search term
        role: filterRole === 'all' ? undefined : filterRole,
        status: filterStatus,
        sortBy: 'createdAt',
        sortDir: 'desc'
      };
      
      const response = await adminUserService.getAllUsers(params);
      setUsersData(response);
    } catch (error) {
      toast.error('Lỗi khi tải danh sách người dùng');
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Effect để fetch data khi debounced search term thay đổi
  useEffect(() => {
    fetchUsers(0);
    setCurrentPage(0);
  }, [debouncedSearchTerm, filterRole, filterStatus]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchKeyPress = (e) => {
    // Nếu nhấn Enter, tìm kiếm ngay lập tức
    if (e.key === 'Enter') {
      fetchUsers(0);
      setCurrentPage(0);
    }
  };

  const handleRoleFilter = (e) => {
    setFilterRole(e.target.value);
  };

  const handleStatusFilter = (e) => {
    const value = e.target.value;
    setFilterStatus(value === 'all' ? null : value === 'active');
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === usersData.content.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(usersData.content.map(user => user.id));
    }
  };

  // User CRUD operations
  const handleCreateUser = () => {
    setUserModal({ isOpen: true, user: null, loading: false });
  };

  const handleEditUser = (user) => {
    setUserModal({ isOpen: true, user, loading: false });
  };

  const handleUserSubmit = async (userData) => {
    try {
      setUserModal(prev => ({ ...prev, loading: true }));
      
      if (userModal.user) {
        // Update user
        await adminUserService.updateUser(userModal.user.id, userData);
        toast.success('Cập nhật người dùng thành công');
      } else {
        // Create user
        await adminUserService.createUser(userData);
        toast.success('Tạo người dùng thành công');
      }
      
      setUserModal({ isOpen: false, user: null, loading: false });
      fetchUsers(currentPage);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setUserModal(prev => ({ ...prev, loading: false }));
    }
  };

  const handleToggleUserStatus = (user) => {
    setConfirmModal({
      isOpen: true,
      user,
      action: 'toggle',
      loading: false
    });
  };

  const handleDeleteUser = (user) => {
    setConfirmModal({
      isOpen: true,
      user,
      action: 'delete',
      loading: false
    });
  };

  const handleConfirmAction = async () => {
    try {
      setConfirmModal(prev => ({ ...prev, loading: true }));
      
      if (confirmModal.action === 'toggle') {
        await adminUserService.toggleUserStatus(confirmModal.user.id);
        toast.success(`${confirmModal.user.isEnabled ? 'Vô hiệu hóa' : 'Kích hoạt'} người dùng thành công`);
      } else if (confirmModal.action === 'delete') {
        await adminUserService.deleteUser(confirmModal.user.id);
        toast.success('Xóa người dùng thành công');
      }
      
      setConfirmModal({ isOpen: false, user: null, action: null, loading: false });
      fetchUsers(currentPage);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setConfirmModal(prev => ({ ...prev, loading: false }));
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchUsers(newPage);
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'ADMIN': return 'Quản trị viên';
      case 'STAFF': return 'Nhân viên';
      case 'CUSTOMER': return 'Khách hàng';
      default: return role;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Quản lý người dùng</h1>
          <p className="mt-1 text-sm text-gray-500">
            Quản lý tài khoản người dùng và phân quyền trong hệ thống
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            type="button"
            onClick={handleCreateUser}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Thêm người dùng
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tìm kiếm
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Tìm theo tên, email, số điện thoại... (Nhấn Enter để tìm ngay)"
                  value={searchTerm}
                  onChange={handleSearch}
                  onKeyPress={handleSearchKeyPress}
                  className="block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {/* Loading indicator khi đang chờ debounce */}
                {searchTerm !== debouncedSearchTerm && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                  </div>
                )}
              </div>
              {searchTerm && (
                <p className="mt-1 text-xs text-gray-500">
                  {searchTerm !== debouncedSearchTerm 
                    ? 'Đang tìm kiếm...' 
                    : `Tìm kiếm: "${debouncedSearchTerm}"`
                  }
                </p>
              )}
            </div>

            {/* Role filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vai trò
              </label>
              <select
                value={filterRole}
                onChange={handleRoleFilter}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="all">Tất cả vai trò</option>
                <option value="ADMIN">Quản trị viên</option>
                <option value="STAFF">Nhân viên</option>
                <option value="CUSTOMER">Khách hàng</option>
              </select>
            </div>

            {/* Status filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trạng thái
              </label>
              <select 
                value={filterStatus === null ? 'all' : filterStatus ? 'active' : 'inactive'} 
                onChange={handleStatusFilter}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="inactive">Vô hiệu hóa</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Users table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              Danh sách người dùng ({usersData.totalElements})
            </h3>
            {selectedUsers.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  Đã chọn {selectedUsers.length} người dùng
                </span>
                <button className="text-red-600 hover:text-red-900 text-sm font-medium">
                  Xóa đã chọn
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === usersData.content.length && usersData.content.length > 0}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Người dùng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vai trò
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Đăng nhập cuối
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {usersData.content.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        {user.avatarUrl ? (
                          <img 
                            className="h-10 w-10 rounded-full" 
                            src={user.avatarUrl} 
                            alt={user.fullName}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center">
                            <span className="text-sm font-medium text-white">
                              {user.fullName?.charAt(0)?.toUpperCase() || 'U'}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.fullName}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                        <div className="text-sm text-gray-500">{user.phoneNumber}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.role === 'ADMIN' 
                        ? 'bg-purple-100 text-purple-800' 
                        : user.role === 'STAFF'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {getRoleDisplayName(user.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.isEnabled 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.isEnabled ? 'Hoạt động' : 'Vô hiệu hóa'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString('vi-VN') : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        onClick={() => handleEditUser(user)}
                        className="text-gray-600 hover:text-gray-900"
                        title="Chỉnh sửa"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleToggleUserStatus(user)}
                        className={`${user.isEnabled ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                        title={user.isEnabled ? 'Vô hiệu hóa' : 'Kích hoạt'}
                      >
                        {user.isEnabled ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={usersData.first}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
              Trước
            </button>
            <button 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={usersData.last}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sau
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Hiển thị <span className="font-medium">{currentPage * usersData.size + 1}</span> đến{' '}
                <span className="font-medium">
                  {Math.min((currentPage + 1) * usersData.size, usersData.totalElements)}
                </span>{' '}
                trong tổng số <span className="font-medium">{usersData.totalElements}</span> kết quả
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={usersData.first}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                
                {/* Page numbers */}
                {Array.from({ length: Math.min(5, usersData.totalPages) }, (_, i) => {
                  const pageNum = Math.max(0, Math.min(currentPage - 2, usersData.totalPages - 5)) + i;
                  if (pageNum >= usersData.totalPages) return null;
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        pageNum === currentPage
                          ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum + 1}
                    </button>
                  );
                })}
                
                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={usersData.last}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* User Modal */}
      <UserModal
        isOpen={userModal.isOpen}
        onClose={() => setUserModal({ isOpen: false, user: null, loading: false })}
        onSubmit={handleUserSubmit}
        user={userModal.user}
        loading={userModal.loading}
      />

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, user: null, action: null, loading: false })}
        onConfirm={handleConfirmAction}
        title={
          confirmModal.action === 'delete' 
            ? 'Xác nhận xóa người dùng' 
            : confirmModal.action === 'toggle' && confirmModal.user?.isEnabled
            ? 'Xác nhận vô hiệu hóa'
            : 'Xác nhận kích hoạt'
        }
        message={
          confirmModal.action === 'delete'
            ? `Bạn có chắc chắn muốn xóa người dùng "${confirmModal.user?.fullName}"? Hành động này không thể hoàn tác.`
            : confirmModal.action === 'toggle' && confirmModal.user?.isEnabled
            ? `Bạn có chắc chắn muốn vô hiệu hóa tài khoản của "${confirmModal.user?.fullName}"?`
            : `Bạn có chắc chắn muốn kích hoạt tài khoản của "${confirmModal.user?.fullName}"?`
        }
        confirmText={
          confirmModal.action === 'delete' 
            ? 'Xóa' 
            : confirmModal.action === 'toggle' && confirmModal.user?.isEnabled
            ? 'Vô hiệu hóa'
            : 'Kích hoạt'
        }
        type={confirmModal.action === 'delete' ? 'danger' : 'warning'}
        loading={confirmModal.loading}
      />
    </div>
  );
};

export default UserManagement;