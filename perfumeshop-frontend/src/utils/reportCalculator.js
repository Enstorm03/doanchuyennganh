// Report calculation utilities

export const calculateRevenueMetrics = (orders) => {
  const totalRevenue = orders
    .filter(order => order.trangThaiVanHanh === 'Hoàn thành')
    .reduce((sum, order) => sum + (order.tongTien || order.tong_tien || 0), 0);

  const totalOrders = orders.length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return {
    totalRevenue,
    totalOrders,
    averageOrderValue
  };
};

export const calculateOrderStats = (orders) => ({
  pending: orders.filter(o => o.trangThaiVanHanh === 'Đang chờ').length,
  confirmed: orders.filter(o => o.trangThaiVanHanh === 'Đã xác nhận').length,
  shipping: orders.filter(o => o.trangThaiVanHanh === 'Đang giao hàng').length,
  completed: orders.filter(o => o.trangThaiVanHanh === 'Hoàn thành').length,
  cancelled: orders.filter(o => o.trangThaiVanHanh === 'Đã hủy').length,
  deposit: orders.filter(o => o.trangThaiVanHanh === 'Chờ hàng').length
});

export const calculateTopProducts = (orders) => {
  const productSales = {};

  orders.forEach(order => {
    if (order.chiTiet || order.chiTietDonHangs) {
      const orderItems = order.chiTiet || order.chiTietDonHangs || [];
      orderItems.forEach(item => {
        const productId = item.sanPhamId || item.idSanPham || item.sanPham?.id_san_pham;
        const quantity = item.soLuong || 0;
        const revenue = (item.giaTaiThoiDiemMua || item.gia_tai_thoi_diem_mua || 0) * quantity;

        if (!productSales[productId]) {
          productSales[productId] = {
            id: productId,
            name: item.tenSanPham || item.ten_san_pham || 'Unknown Product',
            quantity: 0,
            revenue: 0
          };
        }
        productSales[productId].quantity += quantity;
        productSales[productId].revenue += revenue;
      });
    }
  });

  return Object.values(productSales)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 10);
};

export const calculateCustomerStats = (orders) => {
  const customerIds = new Set(orders.map(order => order.idNguoiDung || order.id_nguoi_dung).filter(id => id));
  const totalCustomers = customerIds.size;

  // Simplified calculations - could be enhanced with more complex logic
  return {
    totalCustomers,
    newCustomers: totalCustomers, // Simplified
    repeatCustomers: totalCustomers // Simplified
  };
};

export const calculateRevenueByStatus = (orders, orderStats) => {
  const totalRevenue = orders
    .filter(order => order.trangThaiVanHanh === 'Hoàn thành')
    .reduce((sum, order) => sum + (order.tongTien || order.tong_tien || 0), 0);

  return [
    { status: 'Hoàn thành', amount: totalRevenue, count: orderStats.completed },
    { status: 'Đang giao hàng', amount: 0, count: orderStats.shipping },
    { status: 'Đã xác nhận', amount: 0, count: orderStats.confirmed },
    { status: 'Đang chờ', amount: 0, count: orderStats.pending }
  ];
};

export const calculateConversionRate = (totalOrders, completedOrders) => {
  return totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0;
};
