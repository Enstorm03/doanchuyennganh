import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const getStatusClass = (status) => {
  switch (status) {
    case 'Hoàn thành':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'Đang giao hàng':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'Đã hủy':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    case 'Đang chờ':
    case 'Đã xác nhận':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'Chờ hàng':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Hiển thị 10 đơn hàng mỗi trang

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await api.getOrders(statusFilter === 'All' ? null : statusFilter);
      console.log('Orders data received:', data);

      // Ensure data is an array and handle different response formats
      let ordersArray = [];
      if (Array.isArray(data)) {
        ordersArray = data;
      } else if (data && typeof data === 'object') {
        // Handle single object response
        ordersArray = [data];
      }

      setOrders(ordersArray);
    } catch (err) {
      setError('Không thể tải danh sách đơn hàng');
      console.error('Error fetching orders:', err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  // Fetch orders on component mount and when filter changes
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filteredOrders = orders.filter(order => {
    const term = searchTerm.toLowerCase();
    return (
      (order.idDonHang || order.id_don_hang)?.toString().toLowerCase().includes(term) ||
      (order.tenNguoiNhan || order.ten_nguoi_nhan)?.toLowerCase().includes(term) ||
      (order.tenKhachVangLai || order.ten_khach_vang_lai)?.toLowerCase().includes(term)
    );
  });

  // Logic phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
          onClick={fetchOrders}
          className="bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center">
        <h1 className="font-semibold text-lg md:text-2xl text-text-light dark:text-text-dark">
          Quản Lý Đơn Hàng
        </h1>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark">
        <input
          type="text"
          placeholder="Tìm theo mã ĐH, tên khách hàng..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-input w-full sm:flex-1 rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark"
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="form-select w-full sm:w-auto rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark">
          <option value="All">Tất cả trạng thái</option>
          <option value="Đang chờ">Đang chờ</option>
          <option value="Đã xác nhận">Đã xác nhận</option>
          <option value="Đang giao hàng">Đang giao hàng</option>
          <option value="Chờ hàng">Chờ hàng</option>
          <option value="Hoàn thành">Hoàn thành</option>
          <option value="Đã hủy">Đã hủy</option>
        </select>
      </div>

      <div className="rounded-xl border bg-surface-light text-card-foreground shadow border-border-light dark:border-border-dark dark:bg-surface-dark">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b [&_tr]:border-border-light dark:[&_tr]:border-border-dark">
              <tr className="text-text-subtle-light dark:text-text-subtle-dark">
                <th className="h-12 px-4 text-left align-middle font-medium">Mã đơn hàng</th>
                <th className="h-12 px-4 text-left align-middle font-medium hidden md:table-cell">Khách hàng</th>
                <th className="h-12 px-4 text-left align-middle font-medium hidden md:table-cell">Ngày đặt</th>
                <th className="h-12 px-4 text-left align-middle font-medium hidden sm:table-cell">Trạng thái</th>
                <th className="h-12 px-4 text-right align-middle font-medium">Tổng tiền</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {currentOrders.length > 0 ? (
                currentOrders.map((order) => (
                  <tr key={order.idDonHang || order.id_don_hang || Math.random()} className="border-b border-border-light dark:border-border-dark transition-colors hover:bg-background-light dark:hover:bg-background-dark">
                    <td className="p-4 align-middle font-medium">
                      <Link to={`/admin/orders/${order.idDonHang || order.id_don_hang}`} className="text-primary hover:underline">
                        #{order.idDonHang || order.id_don_hang || 'N/A'}
                      </Link>
                    </td>
                    <td className="p-4 align-middle hidden md:table-cell text-text-light dark:text-text-dark">
                      {order.tenNguoiNhan || order.ten_nguoi_nhan || order.tenKhachVangLai || order.ten_khach_vang_lai || 'N/A'}
                    </td>
                    <td className="p-4 align-middle hidden md:table-cell text-text-subtle-light dark:text-text-subtle-dark">
                      {order.ngayDatHang || order.ngay_dat_hang ? new Date(order.ngayDatHang || order.ngay_dat_hang).toLocaleDateString('vi-VN') : 'N/A'}
                    </td>
                    <td className="p-4 align-middle hidden sm:table-cell">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(order.trangThaiVanHanh || order.trang_thai_van_hanh)}`}>
                        {order.trangThaiVanHanh || order.trang_thai_van_hanh || 'N/A'}
                      </span>
                    </td>
                    <td className="p-4 align-middle text-right font-bold text-text-light dark:text-text-dark">
                      {order.tongTien || order.tong_tien ? (order.tongTien || order.tong_tien).toLocaleString('vi-VN') + '₫' : 'N/A'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-text-subtle-light dark:text-text-subtle-dark">
                    <div className="flex flex-col items-center">
                      <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">receipt_long</span>
                      <p className="text-lg font-medium">Không có đơn hàng nào</p>
                      <p className="text-sm text-gray-500">Chưa có đơn hàng nào được tạo hoặc phù hợp với bộ lọc.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <nav aria-label="Pagination" className="flex justify-center mt-4">
          <ul className="inline-flex items-center -space-x-px text-sm">
            <li>
              <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700">
                <span className="material-symbols-outlined text-base">chevron_left</span>
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => (
              <li key={i}>
                <button onClick={() => paginate(i + 1)} className={`px-3 h-8 border ${currentPage === i + 1 ? 'text-white bg-primary border-primary' : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400'}`}>
                  {i + 1}
                </button>
              </li>
            ))}
            <li>
              <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700">
                <span className="material-symbols-outlined text-base">chevron_right</span>
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default AdminOrdersPage;
