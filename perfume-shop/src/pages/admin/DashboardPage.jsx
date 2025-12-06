import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    totalEmployees: 0,
    pendingOrders: 0,
    shippingOrders: 0,
    completedOrders: 0,
    pendingReturns: 0,
    approvedReturns: 0,
    totalReturns: 0
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all data in parallel
      const [
        ordersData,
        productsData,
        customersData,
        employeesData,
        returnsData
      ] = await Promise.all([
        api.getOrders(),
        api.getAllProducts(),
        api.getCustomers(),
        api.getEmployees(),
        api.getPendingReturns().catch(() => []) // Handle case where returns API might not be available
      ]);

      // Calculate statistics
      const totalRevenue = ordersData
        .filter(order => order.trangThaiVanHanh === 'Hoàn thành')
        .reduce((sum, order) => sum + (order.tongTien || 0), 0);

      const totalOrders = ordersData.length;
      const totalProducts = productsData.length;
      const totalCustomers = customersData.length;
      const totalEmployees = employeesData.length;

      const pendingOrders = ordersData.filter(order => order.trangThaiVanHanh === 'Đang chờ').length;
      const shippingOrders = ordersData.filter(order => order.trangThaiVanHanh === 'Đang giao hàng').length;
      const completedOrders = ordersData.filter(order => order.trangThaiVanHanh === 'Hoàn thành').length;

      // Calculate return statistics
      const pendingReturns = Array.isArray(returnsData) ? returnsData.filter(r => r.trangThai === 'Chờ duyệt').length : 0;
      const approvedReturns = Array.isArray(returnsData) ? returnsData.filter(r => r.trangThai === 'Đã duyệt').length : 0;
      const totalReturns = Array.isArray(returnsData) ? returnsData.length : 0;

      setStats({
        totalRevenue,
        totalOrders,
        totalProducts,
        totalCustomers,
        totalEmployees,
        pendingOrders,
        shippingOrders,
        completedOrders,
        pendingReturns,
        approvedReturns,
        totalReturns
      });

      // Get recent orders (last 5)
      const recentOrdersData = ordersData
        .sort((a, b) => new Date(b.ngayDatHang) - new Date(a.ngayDatHang))
        .slice(0, 5);

      setRecentOrders(recentOrdersData);

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Không thể tải dữ liệu dashboard');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Hoàn thành': return 'text-green-600';
      case 'Đang giao hàng': return 'text-blue-600';
      case 'Đang chờ': return 'text-yellow-600';
      case 'Đã xác nhận': return 'text-purple-600';
      case 'Chờ hàng': return 'text-orange-600';
      case 'Đã hủy': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Hoàn thành': return 'bg-green-100 text-green-800';
      case 'Đang giao hàng': return 'bg-blue-100 text-blue-800';
      case 'Đang chờ': return 'bg-yellow-100 text-yellow-800';
      case 'Đã xác nhận': return 'bg-purple-100 text-purple-800';
      case 'Chờ hàng': return 'bg-orange-100 text-orange-800';
      case 'Đã hủy': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">Lỗi tải dữ liệu</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-light dark:text-text-dark">Dashboard</h1>
          <p className="text-text-secondary-light dark:text-text-secondary-dark mt-1">
            Tổng quan hệ thống cửa hàng nước hoa
          </p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
        >
          <span className="material-symbols-outlined mr-2">refresh</span>
          Làm mới
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-5">
        {/* Total Revenue */}
        <div className="rounded-xl border bg-surface-light text-card-foreground shadow border-border-light dark:border-border-dark dark:bg-surface-dark">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium text-text-subtle-light dark:text-text-subtle-dark">Tổng doanh thu</h3>
            <span className="material-symbols-outlined text-green-600">paid</span>
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold text-text-light dark:text-text-dark">
              {stats.totalRevenue.toLocaleString('vi-VN')}₫
            </div>
            <p className="text-xs text-text-subtle-light dark:text-text-subtle-dark pt-1">
              Từ {stats.completedOrders} đơn hàng hoàn thành
            </p>
          </div>
        </div>

        {/* Total Orders */}
        <div className="rounded-xl border bg-surface-light text-card-foreground shadow border-border-light dark:border-border-dark dark:bg-surface-dark">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium text-text-subtle-light dark:text-text-subtle-dark">Tổng đơn hàng</h3>
            <span className="material-symbols-outlined text-blue-600">shopping_cart</span>
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold text-text-light dark:text-text-dark">{stats.totalOrders}</div>
            <p className="text-xs text-text-subtle-light dark:text-text-subtle-dark pt-1">
              {stats.pendingOrders} đang chờ, {stats.shippingOrders} đang giao
            </p>
          </div>
        </div>

        {/* Total Products */}
        <div className="rounded-xl border bg-surface-light text-card-foreground shadow border-border-light dark:border-border-dark dark:bg-surface-dark">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium text-text-subtle-light dark:text-text-subtle-dark">Sản phẩm</h3>
            <span className="material-symbols-outlined text-purple-600">inventory_2</span>
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold text-text-light dark:text-text-dark">{stats.totalProducts}</div>
            <p className="text-xs text-text-subtle-light dark:text-text-subtle-dark pt-1">
              Đang kinh doanh
            </p>
          </div>
        </div>

        {/* Total Customers */}
        <div className="rounded-xl border bg-surface-light text-card-foreground shadow border-border-light dark:border-border-dark dark:bg-surface-dark">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium text-text-subtle-light dark:text-text-subtle-dark">Khách hàng</h3>
            <span className="material-symbols-outlined text-orange-600">people</span>
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold text-text-light dark:text-text-dark">{stats.totalCustomers}</div>
            <p className="text-xs text-text-subtle-light dark:text-text-subtle-dark pt-1">
              Đã đăng ký
            </p>
          </div>
        </div>

        {/* Returns */}
        <div className="rounded-xl border bg-surface-light text-card-foreground shadow border-border-light dark:border-border-dark dark:bg-surface-dark">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium text-text-subtle-light dark:text-text-subtle-dark">Đổi trả</h3>
            <span className="material-symbols-outlined text-red-600">assignment_return</span>
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold text-text-light dark:text-text-dark">{stats.pendingReturns}</div>
            <p className="text-xs text-text-subtle-light dark:text-text-subtle-dark pt-1">
              {stats.approvedReturns} đã duyệt, {stats.totalReturns} tổng số
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border bg-surface-light text-card-foreground shadow border-border-light dark:border-border-dark dark:bg-surface-dark p-6">
        <h3 className="text-lg font-semibold mb-4">Thao tác nhanh</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Link
            to="/admin/products"
            className="flex items-center gap-3 p-4 border border-border-light dark:border-border-dark rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <span className="material-symbols-outlined text-blue-600">add_box</span>
            <div>
              <p className="font-medium">Thêm sản phẩm</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Thêm sản phẩm mới</p>
            </div>
          </Link>

          <Link
            to="/admin/orders"
            className="flex items-center gap-3 p-4 border border-border-light dark:border-border-dark rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <span className="material-symbols-outlined text-green-600">shopping_cart</span>
            <div>
              <p className="font-medium">Quản lý đơn hàng</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Xem và xử lý đơn</p>
            </div>
          </Link>

          <Link
            to="/admin/returns"
            className="flex items-center gap-3 p-4 border border-border-light dark:border-border-dark rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <span className="material-symbols-outlined text-red-600">assignment_return</span>
            <div>
              <p className="font-medium">Quản lý đổi trả</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Duyệt yêu cầu đổi trả</p>
            </div>
          </Link>

          <Link
            to="/admin/employees"
            className="flex items-center gap-3 p-4 border border-border-light dark:border-border-dark rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <span className="material-symbols-outlined text-purple-600">people</span>
            <div>
              <p className="font-medium">Quản lý nhân viên</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Thêm/sửa nhân viên</p>
            </div>
          </Link>

          <Link
            to="/pos"
            className="flex items-center gap-3 p-4 border border-border-light dark:border-border-dark rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <span className="material-symbols-outlined text-orange-600">point_of_sale</span>
            <div>
              <p className="font-medium">POS - Bán hàng</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Bán tại quầy</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="rounded-xl border bg-surface-light text-card-foreground shadow border-border-light dark:border-border-dark dark:bg-surface-dark">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Đơn hàng gần đây</h3>
            <Link
              to="/admin/orders"
              className="text-primary hover:underline text-sm"
            >
              Xem tất cả
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="text-center py-8">
              <span className="material-symbols-outlined text-4xl text-gray-300 mb-2 block">shopping_cart</span>
              <p className="text-gray-500 dark:text-gray-400">Chưa có đơn hàng nào</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.idDonHang} className="flex items-center justify-between p-4 border border-border-light dark:border-border-dark rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-gray-600">shopping_bag</span>
                    </div>
                    <div>
                      <p className="font-medium">Đơn hàng #{order.idDonHang}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {order.tenNguoiNhan} • {order.tongTien?.toLocaleString('vi-VN')}₫
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(order.trangThaiVanHanh)}`}>
                      {order.trangThaiVanHanh}
                    </span>
                    <Link
                      to={`/admin/orders/${order.idDonHang}`}
                      className="text-primary hover:underline text-sm"
                    >
                      Chi tiết
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Order Status Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Pending Orders */}
        <div className="rounded-xl border bg-surface-light text-card-foreground shadow border-border-light dark:border-border-dark dark:bg-surface-dark p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-subtle-light dark:text-text-subtle-dark">Đang chờ</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</p>
            </div>
            <span className="material-symbols-outlined text-yellow-600 text-3xl">schedule</span>
          </div>
        </div>

        {/* Confirmed Orders */}
        <div className="rounded-xl border bg-surface-light text-card-foreground shadow border-border-light dark:border-border-dark dark:bg-surface-dark p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-subtle-light dark:text-text-subtle-dark">Đã xác nhận</p>
              <p className="text-2xl font-bold text-purple-600">
                {recentOrders.filter(o => o.trangThaiVanHanh === 'Đã xác nhận').length}
              </p>
            </div>
            <span className="material-symbols-outlined text-purple-600 text-3xl">check_circle</span>
          </div>
        </div>

        {/* Shipping Orders */}
        <div className="rounded-xl border bg-surface-light text-card-foreground shadow border-border-light dark:border-border-dark dark:bg-surface-dark p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-subtle-light dark:text-text-subtle-dark">Đang giao</p>
              <p className="text-2xl font-bold text-blue-600">{stats.shippingOrders}</p>
            </div>
            <span className="material-symbols-outlined text-blue-600 text-3xl">local_shipping</span>
          </div>
        </div>

        {/* Completed Orders */}
        <div className="rounded-xl border bg-surface-light text-card-foreground shadow border-border-light dark:border-border-dark dark:bg-surface-dark p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-subtle-light dark:text-text-subtle-dark">Hoàn thành</p>
              <p className="text-2xl font-bold text-green-600">{stats.completedOrders}</p>
            </div>
            <span className="material-symbols-outlined text-green-600 text-3xl">done_all</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
