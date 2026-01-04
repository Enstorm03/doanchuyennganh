import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const useOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      // For user order history, use getUserOrdersHistoryDto with user ID
      // For admin, use getOrders (all orders)
      let data;
      if (user && user.id_nguoi_dung) {
        // User is logged in, fetch their order history
        data = await api.getUserOrdersHistoryDto(user.id_nguoi_dung, statusFilter === 'All' ? null : statusFilter);
      } else {
        // Fallback to admin endpoint (shouldn't happen in user context)
        data = await api.getOrders(statusFilter === 'All' ? null : statusFilter);
      }

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
  }, [statusFilter, user]);

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

  return {
    orders,
    loading,
    error,
    searchTerm,
    statusFilter,
    currentPage,
    currentOrders,
    totalPages,
    filteredOrders,
    setSearchTerm,
    setStatusFilter,
    paginate,
    fetchOrders
  };
};

export default useOrders;
