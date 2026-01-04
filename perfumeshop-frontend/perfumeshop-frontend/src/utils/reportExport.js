// Report export utilities

export const exportReportToCSV = (reportData, dateRange) => {
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
    ['Chờ hàng', reportData.orderStats.deposit],
    ['', ''],
    ['Sản phẩm bán chạy', 'Số lượng', 'Doanh thu'],
    ...reportData.topProducts.slice(0, 10).map(product => [
      product.name,
      product.quantity,
      `${product.revenue.toLocaleString('vi-VN')}₫`
    ])
  ];

  const csvContent = csvData.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `bao-cao-${dateRange.startDate}-den-${dateRange.endDate}.csv`;
  link.click();
};

export const exportReportToJSON = (reportData, dateRange) => {
  const jsonData = {
    dateRange,
    summary: {
      totalRevenue: reportData.totalRevenue,
      totalOrders: reportData.totalOrders,
      averageOrderValue: reportData.averageOrderValue,
      totalCustomers: reportData.customerStats.totalCustomers,
      conversionRate: reportData.totalOrders > 0 ? (reportData.orderStats.completed / reportData.totalOrders) * 100 : 0
    },
    orderStats: reportData.orderStats,
    topProducts: reportData.topProducts,
    revenueByStatus: reportData.revenueByStatus,
    generatedAt: new Date().toISOString()
  };

  const jsonContent = JSON.stringify(jsonData, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `bao-cao-${dateRange.startDate}-den-${dateRange.endDate}.json`;
  link.click();
};
