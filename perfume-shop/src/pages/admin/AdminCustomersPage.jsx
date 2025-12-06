import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

const AdminCustomersPage = () => {
  const { isAdmin } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({
    tenDangNhap: '',
    matKhau: '',
    hoTen: '',
    soDienThoai: '',
    diaChi: ''
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Role-based access control - Only admins can access this page
  if (!isAdmin()) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-xl font-bold mb-4">🚫 Truy cập bị từ chối</div>
          <p className="text-gray-600 mb-4">Bạn không có quyền truy cập trang quản lý khách hàng.</p>
          <p className="text-sm text-gray-500">Chỉ Admin mới có thể xem trang này.</p>
        </div>
      </div>
    );
  }

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await api.getCustomers();
      setCustomers(data || []);
    } catch (err) {
      setError('Không thể tải danh sách khách hàng');
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateCustomer = async (e) => {
    e.preventDefault();
    try {
      await api.createCustomer(formData);
      alert('Tạo khách hàng thành công!');
      setShowCreateModal(false);
      setFormData({ tenDangNhap: '', matKhau: '', hoTen: '', soDienThoai: '', diaChi: '' });
      fetchCustomers();
    } catch (error) {
      alert('Tạo khách hàng thất bại: ' + (error.message || 'Vui lòng thử lại'));
    }
  };

  const handleUpdateCustomer = async (customerId) => {
    try {
      await api.updateCustomer(customerId, {
        hoTen: formData.hoTen,
        soDienThoai: formData.soDienThoai,
        diaChi: formData.diaChi
      });
      alert('Cập nhật khách hàng thành công!');
      setEditingCustomer(null);
      setFormData({ tenDangNhap: '', matKhau: '', hoTen: '', soDienThoai: '', diaChi: '' });
      fetchCustomers();
    } catch (error) {
      alert('Cập nhật khách hàng thất bại: ' + (error.message || 'Vui lòng thử lại'));
    }
  };

  const handleResetPassword = async (customerId) => {
    const newPassword = prompt('Nhập mật khẩu mới:');
    if (!newPassword || newPassword.trim() === '') {
      alert('Vui lòng nhập mật khẩu mới');
      return;
    }

    try {
      await api.resetCustomerPassword(customerId, { newPassword: newPassword.trim() });
      alert('Đặt lại mật khẩu thành công!');
    } catch (error) {
      alert('Đặt lại mật khẩu thất bại: ' + (error.message || 'Vui lòng thử lại'));
    }
  };

  const handleDeleteCustomer = async (customerId, customerName) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa khách hàng "${customerName}"?`)) {
      return;
    }

    try {
      await api.deleteCustomer(customerId);
      alert('Xóa khách hàng thành công!');
      fetchCustomers();
    } catch (error) {
      alert('Xóa khách hàng thất bại: ' + (error.message || 'Vui lòng thử lại'));
    }
  };

  const openCreateModal = () => {
    setFormData({ tenDangNhap: '', matKhau: '', hoTen: '', soDienThoai: '', diaChi: '' });
    setShowCreateModal(true);
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setFormData({ tenDangNhap: '', matKhau: '', hoTen: '', soDienThoai: '', diaChi: '' });
  };

  const startEditing = (customer) => {
    setEditingCustomer(customer.idNguoiDung);
    setFormData({
      hoTen: customer.hoTen || '',
      soDienThoai: customer.soDienThoai || '',
      diaChi: customer.diaChi || ''
    });
  };

  const cancelEditing = () => {
    setEditingCustomer(null);
    setFormData({ tenDangNhap: '', matKhau: '', hoTen: '', soDienThoai: '', diaChi: '' });
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
          onClick={fetchCustomers}
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
        <h1 className="text-2xl font-bold">Quản lý khách hàng</h1>
        <button
          onClick={openCreateModal}
          className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors"
        >
          + Thêm khách hàng
        </button>
      </div>

      {/* Customers Table */}
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
                  SĐT
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Địa chỉ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customers.map((customer) => (
                <tr key={customer.idNguoiDung} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {customer.idNguoiDung}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {customer.tenDangNhap}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {editingCustomer === customer.idNguoiDung ? (
                      <input
                        type="text"
                        name="hoTen"
                        value={formData.hoTen}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                      />
                    ) : (
                      customer.hoTen || 'Chưa cập nhật'
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {editingCustomer === customer.idNguoiDung ? (
                      <input
                        type="tel"
                        name="soDienThoai"
                        value={formData.soDienThoai}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                      />
                    ) : (
                      customer.soDienThoai || 'Chưa cập nhật'
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                    {editingCustomer === customer.idNguoiDung ? (
                      <input
                        type="text"
                        name="diaChi"
                        value={formData.diaChi}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                      />
                    ) : (
                      <div className="truncate" title={customer.diaChi}>
                        {customer.diaChi || 'Chưa cập nhật'}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {editingCustomer === customer.idNguoiDung ? (
                      <>
                        <button
                          onClick={() => handleUpdateCustomer(customer.idNguoiDung)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Lưu
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          Hủy
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEditing(customer)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleResetPassword(customer.idNguoiDung)}
                          className="text-purple-600 hover:text-purple-900"
                        >
                          Đặt lại MK
                        </button>
                        <button
                          onClick={() => handleDeleteCustomer(customer.idNguoiDung, customer.hoTen)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Xóa
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {customers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Chưa có khách hàng nào</p>
          </div>
        )}
      </div>

      {/* Create Customer Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Thêm khách hàng mới</h2>
            <form onSubmit={handleCreateCustomer} className="space-y-4">
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
                <label className="block text-sm font-medium mb-1">Số điện thoại</label>
                <input
                  type="tel"
                  name="soDienThoai"
                  value={formData.soDienThoai}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Địa chỉ</label>
                <input
                  type="text"
                  name="diaChi"
                  value={formData.diaChi}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
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

export default AdminCustomersPage;
