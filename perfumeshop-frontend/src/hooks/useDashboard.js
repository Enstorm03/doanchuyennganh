import { useState, useEffect } from 'react';
import api from '../services/api';

const useDashboard = () => {
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

  return {
    stats,
    recentOrders,
    loading,
    error,
    fetchDashboardData
  };
};

export default useDashboard;
