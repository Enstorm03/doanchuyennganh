import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

// Dữ liệu mẫu chi tiết hơn
const mockOrders = [
  {
    id: '#3210',
    customer: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    shippingAddress: '123 Đường ABC, Phường 1, Quận 1, TP. HCM',
    date: '2024-07-28',
    total: '3,500,000đ',
    status: 'Hoàn thành',
    products: [
      { id: 'prod_1', name: 'Chanel N°5', quantity: 1, price: '3,500,000đ' },
    ]
  },
  {
    id: '#3209',
    customer: 'Trần Thị B',
    email: 'tranthib@example.com',
    shippingAddress: '456 Đường XYZ, Phường 2, Quận 3, TP. HCM',
    date: '2024-07-28',
    total: '2,800,000đ',
    status: 'Đang giao',
    products: [
      { id: 'prod_2', name: 'Dior Sauvage', quantity: 1, price: '2,800,000đ' },
    ]
  },
  // Thêm các đơn hàng khác nếu cần
];

const statuses = ['Chờ xử lý', 'Đang giao', 'Hoàn thành', 'Đã hủy'];

const AdminOrderDetailPage = () => {
  const { orderId } = useParams();
  
  // Tìm đơn hàng ban đầu từ dữ liệu mẫu
  // Tìm đơn hàng ban đầu từ dữ liệu mẫu
  const initialOrder = mockOrders.find(o => o.id === `#${orderId}`);
  
  // Sử dụng state để quản lý dữ liệu đơn hàng, cho phép cập nhật
  const [order, setOrder] = useState(initialOrder);
  const [selectedStatus, setSelectedStatus] = useState(initialOrder ? initialOrder.status : '');

  if (!order) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold">Không tìm thấy đơn hàng!</h2>
        <Link to="/admin/orders" className="text-primary hover:underline mt-4 inline-block">Quay lại danh sách</Link>
      </div>
    );
  }

  const handleUpdateStatus = () => {
    // Trong ứng dụng thực tế, bạn sẽ gọi API để cập nhật trạng thái ở đây
    console.log(`Updating status for order ${order.id} to ${selectedStatus}`);
    setOrder(prevOrder => ({ ...prevOrder, status: selectedStatus }));
    alert('Cập nhật trạng thái thành công!');
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center gap-4">
        <Link to="/admin/orders" className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <h1 className="font-semibold text-lg md:text-2xl text-text-light dark:text-text-dark">
          Chi tiết Đơn hàng {order.id}
        </h1>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Cột chính: Danh sách sản phẩm */}
        <div className="md:col-span-2">
          <div className="rounded-xl border bg-surface-light text-card-foreground shadow border-border-light dark:border-border-dark dark:bg-surface-dark p-6">
            <h3 className="text-lg font-bold mb-4">Các sản phẩm</h3>
            <div className="space-y-4">
              {order.products.map(product => (
                <div key={product.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-text-subtle-light dark:text-text-subtle-dark">Số lượng: {product.quantity}</p>
                  </div>
                  <p className="font-medium">{product.price}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cột phụ: Thông tin khách hàng và đơn hàng */}
        <div className="md:col-span-1 flex flex-col gap-8">
          <div className="rounded-xl border bg-surface-light text-card-foreground shadow border-border-light dark:border-border-dark dark:bg-surface-dark p-6">
            <h3 className="text-lg font-bold mb-4">Thông tin khách hàng</h3>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Tên:</span> {order.customer}</p>
              <p><span className="font-medium">Email:</span> {order.email}</p>
              <p><span className="font-medium">Địa chỉ giao hàng:</span> {order.shippingAddress}</p>
            </div>
          </div>
          <div className="rounded-xl border bg-surface-light text-card-foreground shadow border-border-light dark:border-border-dark dark:bg-surface-dark p-6">
            <h3 className="text-lg font-bold mb-4">Tóm tắt đơn hàng</h3>
            <div className="space-y-2 text-sm">
              <p className="flex justify-between"><span>Ngày đặt:</span> <span>{order.date}</span></p>
              <div className="flex justify-between items-center">
                <span>Trạng thái hiện tại:</span> 
                <span className="font-semibold">{order.status}</span>
              </div>
              <p className="flex justify-between text-base font-bold mt-4 pt-4 border-t border-border-light dark:border-border-dark">
                <span>Tổng tiền:</span> <span>{order.total}</span>
              </p>
            </div>
            <div className="mt-6 pt-6 border-t border-border-light dark:border-border-dark">
              <label htmlFor="status-select" className="block text-sm font-medium mb-2">Thay đổi trạng thái</label>
              <select 
                id="status-select"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="form-select w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark"
              >
                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <button onClick={handleUpdateStatus} className="w-full mt-4 bg-primary text-white font-bold py-2 rounded-lg hover:bg-primary/90 transition-colors">Cập nhật</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetailPage;