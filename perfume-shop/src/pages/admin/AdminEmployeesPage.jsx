import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

const AdminEmployeesPage = () => {
  const { isAdmin } = useAuth();

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({
    tenDangNhap: '',
    matKhau: '',
    hoTen: '',
    vaiTro: 'NhanVien'
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Role-based access control - Only admins can access this page
  if (!isAdmin()) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-xl font-bold mb-4">🚫 Truy cập bị từ chối</div>
          <p className="text-gray-600 mb-4">Bạn không có quyền truy cập trang quản lý nhân viên.</p>
          <p className="text-sm text-gray-500">Chỉ Admin mới có thể xem trang này.</p>
        </div>
      </div>
    );
  }

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await api.getEmployees();
      setEmployees(data || []);
    } catch (err) {
      setError('Không thể tải danh sách nhân viên');
      console.error('Error fetching employees:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateEmployee = async (e) => {
    e.preventDefault();
    try {
      await api.createEmployee(formData);
      alert('Tạo nhân viên thành công!');
      setShowCreateModal(false);
      setFormData({ tenDangNhap: '', matKhau: '', hoTen: '', vaiTro: 'NhanVien' });
      fetchEmployees();
    } catch (error) {
      alert('Tạo nhân viên thất bại: ' + (error.message || 'Vui lòng thử lại'));
    }
  };

  const handleUpdateRole = async (employeeId, newRole) => {
    try {
      await api.updateEmployeeRole(employeeId, { vaiTro: newRole });
      alert('Cập nhật vai trò thành công!');
      fetchEmployees();
    } catch (error) {
      alert('Cập nhật vai trò thất bại: ' + (error.message || 'Vui lòng thử lại'));
    }
  };

  const handleResetPassword = async (employeeId) => {
    const newPassword = prompt('Nhập mật khẩu mới:');
    if (!newPassword || newPassword.trim() === '') {
      alert('Vui lòng nhập mật khẩu mới');
      return;
    }

    try {
      await api.resetEmployeePassword(employeeId, { newPassword: newPassword.trim() });
      alert('Đặt lại mật khẩu thành công!');
    } catch (error) {
      alert('Đặt lại mật khẩu thất bại: ' + (error.message || 'Vui lòng thử lại'));
    }
  };

  const handleDeleteEmployee = async (employeeId, employeeName) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa nhân viên "${employeeName}"?`)) {
      return;
    }

    try {
      await api.deleteEmployee(employeeId);
      alert('Xóa nhân viên thành công!');
      fetchEmployees();
    } catch (error) {
      alert('Xóa nhân viên thất bại: ' + (error.message || 'Vui lòng thử lại'));
    }
  };

  const openCreateModal = () => {
    setFormData({ tenDangNhap: '', matKhau: '', hoTen: '', vaiTro: 'NhanVien' });
    setShowCreateModal(true);
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setFormData({ tenDangNhap: '', matKhau: '', hoTen: '', vaiTro: 'NhanVien' });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={fetchEmployees}
          className="bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Quản lý nhân viên</h1>
        <button
          onClick={openCreateModal}
          className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors"
        >
          + Thêm nhân viên
        </button>
      </div>

      {/* Employees Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên đăng nhập
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Họ tên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vai trò
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employees.map((employee) => (
                <tr key={employee.idNhanVien} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {employee.idNhanVien}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {employee.tenDangNhap}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {employee.hoTen}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={employee.vaiTro}
                      onChange={(e) => handleUpdateRole(employee.idNhanVien, e.target.value)}
                      className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="NhanVien">Nhân viên</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleResetPassword(employee.idNhanVien)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Đặt lại MK
                    </button>
                    <button
                      onClick={() => handleDeleteEmployee(employee.idNhanVien, employee.hoTen)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {employees.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Chưa có nhân viên nào</p>
          </div>
        )}
      </div>

      {/* Create Employee Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Thêm nhân viên mới</h2>
            <form onSubmit={handleCreateEmployee} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tên đăng nhập</label>
                <input
                  type="text"
                  name="tenDangNhap"
                  value={formData.tenDangNhap}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Mật khẩu</label>
                <input
                  type="password"
                  name="matKhau"
                  value={formData.matKhau}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Họ tên</label>
                <input
                  type="text"
                  name="hoTen"
                  value={formData.hoTen}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Vai trò</label>
                <select
                  name="vaiTro"
                  value={formData.vaiTro}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="NhanVien">Nhân viên</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-primary text-white font-bold py-2 px-4 rounded hover:bg-primary/90 transition-colors"
                >
                  Tạo
                </button>
                <button
                  type="button"
                  onClick={closeCreateModal}
                  className="flex-1 bg-gray-500 text-white font-bold py-2 px-4 rounded hover:bg-gray-600 transition-colors"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEmployeesPage;
