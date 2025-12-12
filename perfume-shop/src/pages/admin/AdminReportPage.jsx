import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const AdminReportPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
    endDate: new Date().toISOString().split('T')[0] // Today
  });

  const [reportData, setReportData] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    topProducts: [],
    revenueByStatus: [],
    dailyRevenue: [],
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
      const startDate = new Date(dateRange.startDate);
      const endDate = new Date(dateRange.endDate);
      endDate.setHours(23, 59, 59, 999); // End of day

      const filteredOrders = ordersData.filter(order => {
        const orderDate = new Date(order.ngayDatHang);
        return orderDate >= startDate && orderDate <= endDate;
      });

      // Calculate revenue metrics
      const totalRevenue = filteredOrders
        .filter(order => order.trangThaiVanHanh === 'Hoàn thành')
        .reduce((sum, order) => sum + (order.tongTien || 0), 0);

      const totalOrders = filteredOrders.length;
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      // Calculate order statistics
      const orderStats = {
        pending: filteredOrders.filter(o => o.trangThaiVanHanh === 'Đang chờ').length,
        confirmed: filteredOrders.filter(o => o.trangThaiVanHanh === 'Đã xác nhận').length,
        shipping: filteredOrders.filter(o => o.trangThaiVanHanh === 'Đang giao hàng').length,
        completed: filteredOrders.filter(o => o.trangThaiVanHanh === 'Hoàn thành').length,
        cancelled: filteredOrders.filter(o => o.trangThaiVanHanh === 'Đã hủy').length,
        deposit: filteredOrders.filter(o => o.trangThaiVanHanh === 'Chờ hàng').length
      };

      // Calculate top selling products
      const productSales = {};
      filteredOrders.forEach(order => {
        if (order.chiTiet) {
          order.chiTiet.forEach(item => {
            const productId = item.sanPhamId || item.idSanPham;
            const quantity = item.soLuong || 0;
            const revenue = (item.giaTaiThoiDiemMua || 0) * quantity;

            if (!productSales[productId]) {
              productSales[productId] = {
                id: productId,
                name: item.tenSanPham || 'Unknown Product',
                quantity: 0,
                revenue: 0
              };
            }
            productSales[productId].quantity += quantity;
            productSales[productId].revenue += revenue;
          });
        }
      });

      const topProducts = Object.values(productSales)
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 10);

      // Calculate customer statistics
      const customerIds = new Set(filteredOrders.map(order => order.idNguoiDung).filter(id => id));
      const customerStats = {
        totalCustomers: customerIds.size,
        newCustomers: customerIds.size, // Simplified - could calculate based on registration date
        repeatCustomers: customerIds.size // Simplified - could calculate based on order count
      };

      // Revenue by status
      const revenueByStatus = [
        { status: 'Hoàn thành', amount: totalRevenue, count: orderStats.completed },
        { status: 'Đang giao hàng', amount: 0, count: orderStats.shipping },
        { status: 'Đã xác nhận', amount: 0, count: orderStats.confirmed },
        { status: 'Đang chờ', amount: 0, count: orderStats.pending }
      ];

      setReportData({
        totalRevenue,
        totalOrders,
        averageOrderValue,
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

  const exportReport = () => {
    // Simple CSV export
    const csvData = [
      ['Metric', 'Value'],
      ['Tổng doanh thu', `${reportData.totalRevenue.toLocaleString('vi-VN')}₫`],
      ['Tổng đơn hàng', reportData.totalOrders],
      ['Giá trị trung bình', `${reportData.averageOrderValue.toLocaleString('vi-VN')}₫`],
      ['Khách hàng', reportData.customerStats.totalCustomers],
      ['', ''],
      ['Trạng thái đơn hàng', 'Số lượng'],
      ['Đang chờ', reportData.orderStats.pending],
      ['Đã xác nhận', reportData.orderStats.confirmed],
      ['Đang giao hàng', reportData.orderStats.shipping],
      ['Hoàn thành', reportData.orderStats.completed],
      ['Đã hủy', reportData.orderStats.cancelled],
      ['Chờ hàng', reportData.orderStats.deposit]
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `bao-cao-${dateRange.startDate}-den-${dateRange.endDate}.csv`;
    link.click();
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
            onClick={fetchReportData}
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="font-semibold text-lg md:text-2xl text-text-light dark:text-text-dark">
          Báo cáo & Thống kê
        </h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => handleDateRangeChange('startDate', e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm"
            />
            <span className="text-text-subtle-light dark:text-text-subtle-dark">-</span>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => handleDateRangeChange('endDate', e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm"
            />
          </div>
          <button
            onClick={exportReport}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            <span className="material-symbols-outlined mr-2">download</span>
            Xuất báo cáo
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        {/* Total Revenue */}
        <div className="rounded-xl border bg-surface-light text-card-foreground shadow border-border-light dark:border-border-dark dark:bg-surface-dark p-6">
          <div className="flex items-center justify-between pb-2">
            <h3 className="tracking-tight text-sm font-medium text-text-subtle-light dark:text-text-subtle-dark">Tổng doanh thu</h3>
            <span className="material-symbols-outlined text-green-600">paid</span>
          </div>
          <div className="pt-0">
            <div className="text-2xl font-bold text-text-light dark:text-text-dark">
              {reportData.totalRevenue.toLocaleString('vi-VN')}₫
            </div>
            <p className="text-xs text-green-600 pt-1">
              Từ {reportData.orderStats.completed} đơn hoàn thành
            </p>
          </div>
        </div>

        {/* Total Orders */}
        <div className="rounded-xl border bg-surface-light text-card-foreground shadow border-border-light dark:border-border-dark dark:bg-surface-dark p-6">
          <div className="flex items-center justify-between pb-2">
            <h3 className="tracking-tight text-sm font-medium text-text-subtle-light dark:text-text-subtle-dark">Tổng đơn hàng</h3>
            <span className="material-symbols-outlined text-blue-600">shopping_cart</span>
          </div>
          <div className="pt-0">
            <div className="text-2xl font-bold text-text-light dark:text-text-dark">{reportData.totalOrders}</div>
            <p className="text-xs text-blue-600 pt-1">
              Trung bình: {reportData.averageOrderValue.toLocaleString('vi-VN')}₫/đơn
            </p>
          </div>
        </div>

        {/* Total Customers */}
        <div className="rounded-xl border bg-surface-light text-card-foreground shadow border-border-light dark:border-border-dark dark:bg-surface-dark p-6">
          <div className="flex items-center justify-between pb-2">
            <h3 className="tracking-tight text-sm font-medium text-text-subtle-light dark:text-text-subtle-dark">Khách hàng</h3>
            <span className="material-symbols-outlined text-orange-600">people</span>
          </div>
          <div className="pt-0">
            <div className="text-2xl font-bold text-text-light dark:text-text-dark">{reportData.customerStats.totalCustomers}</div>
            <p className="text-xs text-orange-600 pt-1">
              Trong khoảng thời gian
            </p>
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="rounded-xl border bg-surface-light text-card-foreground shadow border-border-light dark:border-border-dark dark:bg-surface-dark p-6">
          <div className="flex items-center justify-between pb-2">
            <h3 className="tracking-tight text-sm font-medium text-text-subtle-light dark:text-text-subtle-dark">Tỷ lệ hoàn thành</h3>
            <span className="material-symbols-outlined text-purple-600">trending_up</span>
          </div>
          <div className="pt-0">
            <div className="text-2xl font-bold text-text-light dark:text-text-dark">
              {reportData.totalOrders > 0 ? Math.round((reportData.orderStats.completed / reportData.totalOrders) * 100) : 0}%
            </div>
            <p className="text-xs text-purple-600 pt-1">
              {reportData.orderStats.completed}/{reportData.totalOrders} đơn
            </p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* Order Status Chart */}
        <div className="rounded-xl border bg-surface-light text-card-foreground shadow border-border-light dark:border-border-dark dark:bg-surface-dark p-6">
          <h3 className="text-lg font-bold mb-4">Trạng thái đơn hàng</h3>
          <div className="space-y-3">
            {Object.entries(reportData.orderStats).map(([status, count]) => {
              const statusNames = {
                pending: 'Đang chờ',
                confirmed: 'Đã xác nhận',
                shipping: 'Đang giao hàng',
                completed: 'Hoàn thành',
                cancelled: 'Đã hủy',
                deposit: 'Chờ hàng'
              };

              const statusColors = {
                pending: 'bg-yellow-500',
                confirmed: 'bg-purple-500',
                shipping: 'bg-blue-500',
                completed: 'bg-green-500',
                cancelled: 'bg-red-500',
                deposit: 'bg-orange-500'
              };

              const percentage = reportData.totalOrders > 0 ? (count / reportData.totalOrders) * 100 : 0;

              return (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-4 h-4 rounded ${statusColors[status]}`}></div>
                    <span className="text-sm">{statusNames[status]}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${statusColors[status]}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium w-12 text-right">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="rounded-xl border bg-surface-light text-card-foreground shadow border-border-light dark:border-border-dark dark:bg-surface-dark p-6">
          <h3 className="text-lg font-bold mb-4">Sản phẩm bán chạy</h3>
          <div className="space-y-4">
            {reportData.topProducts.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Chưa có dữ liệu bán hàng</p>
            ) : (
              reportData.topProducts.slice(0, 5).map((product, index) => (
                <div key={product.id} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium truncate max-w-32">{product.name}</p>
                      <p className="text-xs text-gray-500">Doanh thu: {product.revenue.toLocaleString('vi-VN')}₫</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">{product.quantity}</p>
                    <p className="text-xs text-gray-500">đã bán</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Detailed Statistics */}
      <div className="grid gap-8 md:grid-cols-3">
        {/* Revenue Breakdown */}
        <div className="rounded-xl border bg-surface-light text-card-foreground shadow border-border-light dark:border-border-dark dark:bg-surface-dark p-6">
          <h3 className="text-lg font-bold mb-4">Phân tích doanh thu</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm">Doanh thu thực tế:</span>
              <span className="font-medium text-green-600">{reportData.totalRevenue.toLocaleString('vi-VN')}₫</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Giá trị trung bình/đơn:</span>
              <span className="font-medium">{reportData.averageOrderValue.toLocaleString('vi-VN')}₫</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Số đơn hoàn thành:</span>
              <span className="font-medium">{reportData.orderStats.completed}</span>
            </div>
          </div>
        </div>

        {/* Customer Insights */}
        <div className="rounded-xl border bg-surface-light text-card-foreground shadow border-border-light dark:border-border-dark dark:bg-surface-dark p-6">
          <h3 className="text-lg font-bold mb-4">Phân tích khách hàng</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm">Tổng khách hàng:</span>
              <span className="font-medium text-orange-600">{reportData.customerStats.totalCustomers}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Khách hàng mới:</span>
              <span className="font-medium text-blue-600">{reportData.customerStats.newCustomers}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Khách hàng quay lại:</span>
              <span className="font-medium text-purple-600">{reportData.customerStats.repeatCustomers}</span>
            </div>
          </div>
        </div>

        {/* Period Summary */}
        <div className="rounded-xl border bg-surface-light text-card-foreground shadow border-border-light dark:border-border-dark dark:bg-surface-dark p-6">
          <h3 className="text-lg font-bold mb-4">Tóm tắt kỳ</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm">Từ ngày:</span>
              <span className="font-medium">{new Date(dateRange.startDate).toLocaleDateString('vi-VN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Đến ngày:</span>
              <span className="font-medium">{new Date(dateRange.endDate).toLocaleDateString('vi-VN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Tổng đơn:</span>
              <span className="font-medium text-blue-600">{reportData.totalOrders}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReportPage;
