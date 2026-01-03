import { useState, useEffect } from 'react';
import api from '../services/api';
import { getDefaultDateRange, filterOrdersByDateRange } from '../utils/dateRange';
import {
  calculateRevenueMetrics,
  calculateOrderStats,
  calculateTopProducts,
  calculateCustomerStats,
  calculateRevenueByStatus,
  calculateConversionRate
} from '../utils/reportCalculator';

const useReport = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState(getDefaultDateRange());

  const [reportData, setReportData] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    topProducts: [],
    revenueByStatus: [],
    customerStats: {
      totalCustomers: 0,
      newCustomers: 0,
      repeatCustomers: 0
    },
    orderStats: {
      pending: 0,
      confirmed: 0,
      shipping: 0,
      completed: 0,
      cancelled: 0,
      deposit: 0
    }
  });

  useEffect(() => {
    fetchReportData();
  }, [dateRange]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchReportData = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch all required data
      const [ordersData] = await Promise.all([
        api.getOrders()
      ]);

      // Filter orders by date range
      const filteredOrders = filterOrdersByDateRange(ordersData, dateRange.startDate, dateRange.endDate);

      // Calculate all metrics using utility functions
      const revenueMetrics = calculateRevenueMetrics(filteredOrders);
      const orderStats = calculateOrderStats(filteredOrders);
      const topProducts = calculateTopProducts(filteredOrders);
      const customerStats = calculateCustomerStats(filteredOrders);
      const revenueByStatus = calculateRevenueByStatus(filteredOrders, orderStats);

      setReportData({
        ...revenueMetrics,
        topProducts,
        revenueByStatus,
        customerStats,
        orderStats
      });

    } catch (err) {
      console.error('Error fetching report data:', err);
      setError('Không thể tải dữ liệu báo cáo');
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = (field, value) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getConversionRate = () => {
    return calculateConversionRate(reportData.totalOrders, reportData.orderStats.completed);
  };

  return {
    loading,
    error,
    dateRange,
    reportData,
    fetchReportData,
    handleDateRangeChange,
    getConversionRate
  };
};

export default useReport;
