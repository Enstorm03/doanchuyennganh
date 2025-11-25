import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ThanhToanPage = () => {
  const navigate = useNavigate();
  const [shippingDetails, setShippingDetails] = useState({
    name: '',
    address: '',
    phone: '',
    email: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('cod');

  const [summary, setSummary] = useState({
    subtotal: 0,
    shipping: 0,
    total: 0
  });

  const [loading, setLoading] = useState(true);

  // Fetch cart summary on component mount
  useEffect(() => {
    fetch('/api/cart')
      .then(res => res.json())
      .then(data => {
        if (data && data.summary) {
          setSummary({
            subtotal: data.summary.subtotal || 315,
            shipping: data.summary.shipping || 0,
            total: data.summary.total || 315
          });
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching cart summary:', error);
        // Set default values if API fails
        setSummary({
          subtotal: 315,
          shipping: 0,
          total: 315
        });
        setLoading(false);
      });
  }, []);

  // Handle input changes for shipping details
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setShippingDetails(prev => ({
      ...prev,
      [id]: value
    }));
  };

  // Handle payment method change
  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.id);
  };

  // Handle place order
  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    // Validation
    if (!shippingDetails.name || !shippingDetails.address || !shippingDetails.phone) {
      alert('Vui lòng nhập đầy đủ thông tin giao hàng');
      return;
    }

    try {
      const orderData = {
        ten_nguoi_nhan: shippingDetails.name,
        dia_chi_giao_hang: shippingDetails.address,
        so_dien_thoai: shippingDetails.phone,
        trang_thai_thanh_toan: paymentMethod === 'cod' ? 'Chờ thanh toán' : 'Chờ cọc',
        paymentMethod: paymentMethod
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add auth header if needed
        },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        // Clear cart (you might need to call an API for this)
        // navigate to thank you page or order details
        alert('Đặt hàng thành công!');
        navigate('/');
      } else {
        alert('Đặt hàng thất bại, vui lòng thử lại');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Có lỗi xảy ra, vui lòng thử lại');
    }
  };

  return (
    <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 text-sm">
          <Link className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary transition-colors" to="/">Trang chủ</Link>
          <span className="text-text-secondary-light dark:text-text-secondary-dark">/</span>
          <Link className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary transition-colors" to="/cart">Giỏ hàng</Link>
          <span className="text-text-secondary-light dark:text-text-secondary-dark">/</span>
          <span className="font-medium text-text-primary-light dark:text-text-primary-dark">Thanh toán</span>
        </div>
      </div>

      {/* PageHeading */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black tracking-[-0.033em]">Thanh toán</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12">
        {/* Shipping & Payment Details */}
        <div className="lg:col-span-2">
          {/* BACKEND-COMMENT: Dữ liệu của form này nên được quản lý bằng state của React.
              Tạo một state, ví dụ `const [shippingDetails, setShippingDetails] = useState({...});`
              Mỗi input sẽ có `value={shippingDetails.name}` và `onChange={handleInputChange}`.
              Hàm `handleInputChange` sẽ cập nhật state `shippingDetails` tương ứng.
              Khi người dùng nhấn nút đặt hàng, bạn sẽ lấy toàn bộ thông tin từ state này.
          */}
          <form className="flex flex-col gap-8">
            {/* Shipping Details */}
            <div className="bg-content-light dark:bg-content-dark p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-bold mb-6">Thông tin giao hàng</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label htmlFor="name" className="block text-sm font-medium mb-2">Họ và tên</label>
                  <input type="text" id="name" value={shippingDetails.name} onChange={handleInputChange} className="form-input w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark" placeholder="Nguyễn Văn A" />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium mb-2">Địa chỉ</label>
                  <input type="text" id="address" value={shippingDetails.address} onChange={handleInputChange} className="form-input w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark" placeholder="Số 1, Đường ABC, Phường XYZ, Quận 1" />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-2">Số điện thoại</label>
                  <input type="tel" id="phone" value={shippingDetails.phone} onChange={handleInputChange} className="form-input w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark" placeholder="09xxxxxxxx" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
                  <input type="email" id="email" value={shippingDetails.email} onChange={handleInputChange} className="form-input w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark" placeholder="email@example.com" />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            {/* BACKEND-COMMENT: Việc lựa chọn phương thức thanh toán cũng cần được lưu vào state.
                - "Thanh toán khi nhận hàng" (COD) là phương thức đơn giản nhất, chỉ cần lưu lựa chọn này vào đơn hàng.
                - Với các phương thức online (chuyển khoản, ví điện tử...), đây là một tính năng phức tạp.
                  Backend sẽ cần tích hợp với API của cổng thanh toán (ví dụ: Stripe, PayPal, VNPay, Momo...).
                  Frontend có thể sẽ cần hiển thị một giao diện đặc biệt (như mã QR, form nhập thẻ) từ cổng thanh toán đó.
            */}
            <div className="bg-content-light dark:bg-content-dark p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-bold mb-6">Phương thức thanh toán</h2>
              <div className="space-y-4">
                <div className="flex items-center p-4 border rounded-lg border-border-light dark:border-border-dark">
                  <input id="cod" name="paymentMethod" type="radio" checked={paymentMethod === 'cod'} onChange={handlePaymentMethodChange} className="form-radio h-4 w-4 text-primary focus:ring-primary" />
                  <label htmlFor="cod" className="ml-3 block text-sm font-medium">Thanh toán khi nhận hàng (COD)</label>
                </div>
                <div className="flex items-center p-4 border rounded-lg border-border-light dark:border-border-dark">
                  <input id="bank" name="paymentMethod" type="radio" checked={paymentMethod === 'bank'} onChange={handlePaymentMethodChange} className="form-radio h-4 w-4 text-primary focus:ring-primary" />
                  <label htmlFor="bank" className="ml-3 block text-sm font-medium">Chuyển khoản ngân hàng</label>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-content-light dark:bg-content-dark p-6 rounded-xl shadow-sm sticky top-28">
            {/* BACKEND-COMMENT: Tương tự trang giỏ hàng, các con số trong phần tóm tắt này (tạm tính, tổng cộng)
                nên được lấy từ state `summary` đã gọi từ API để đảm bảo chúng luôn chính xác.
            */}
            <h2 className="text-xl font-bold mb-6 border-b border-border-light dark:border-border-dark pb-4">Tóm tắt đơn hàng</h2>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary-light dark:text-text-secondary-dark">Tạm tính</span>
                <span className="font-medium">${summary.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary-light dark:text-text-secondary-dark">Phí vận chuyển</span>
                <span className="font-medium">{summary.shipping === 0 ? 'Miễn phí' : `$${summary.shipping.toFixed(2)}`}</span>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-border-light dark:border-border-dark">
              <div className="flex justify-between items-center text-base font-bold">
                <span>Tổng cộng</span>
                <span>${summary.total.toFixed(2)}</span>
              </div>
            </div>
            {/* BACKEND-COMMENT: Đây là nút quan trọng nhất trên trang.
                Nó cần một `onClick` handler, ví dụ `onClick={handlePlaceOrder}`.
                Hàm `handlePlaceOrder` sẽ thực hiện các bước sau:
                1. Thu thập tất cả dữ liệu:
                   - `shippingDetails` từ state của form.
                   - `paymentMethod` từ state của lựa chọn thanh toán.
                   - (Có thể cần lấy lại thông tin giỏ hàng để đảm bảo không có gì thay đổi).
                2. Kiểm tra dữ liệu (validation): Đảm bảo người dùng đã nhập đủ thông tin cần thiết.
                3. Gửi request POST tới backend để tạo đơn hàng:
                   `fetch('/api/orders', {`
                     `method: 'POST',`
                     `headers: { 'Content-Type': 'application/json' },`
                     `body: JSON.stringify({ shippingDetails, paymentMethod, cartToken: '...' })`
                   `})`
                4. Xử lý kết quả:
                   - Nếu thành công (response.ok): Chuyển hướng người dùng đến trang "Cảm ơn" hoặc "Chi tiết đơn hàng". Xóa giỏ hàng.
                   - Nếu thất bại: Hiển thị thông báo lỗi cho người dùng.
            */}
            <button onClick={handlePlaceOrder} className="w-full mt-6 bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary/90 transition-colors duration-300">
              Hoàn tất Đơn hàng
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ThanhToanPage;
