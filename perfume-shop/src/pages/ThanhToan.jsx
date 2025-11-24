import React from 'react';
import { Link } from 'react-router-dom';

const ThanhToanPage = () => {
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
          <form className="flex flex-col gap-8">
            {/* Shipping Details */}
            <div className="bg-content-light dark:bg-content-dark p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-bold mb-6">Thông tin giao hàng</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label htmlFor="name" className="block text-sm font-medium mb-2">Họ và tên</label>
                  <input type="text" id="name" className="form-input w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark" placeholder="Nguyễn Văn A" />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium mb-2">Địa chỉ</label>
                  <input type="text" id="address" className="form-input w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark" placeholder="Số 1, Đường ABC, Phường XYZ, Quận 1" />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-2">Số điện thoại</label>
                  <input type="tel" id="phone" className="form-input w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark" placeholder="09xxxxxxxx" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
                  <input type="email" id="email" className="form-input w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark" placeholder="email@example.com" />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-content-light dark:bg-content-dark p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-bold mb-6">Phương thức thanh toán</h2>
              <div className="space-y-4">
                <div className="flex items-center p-4 border rounded-lg border-border-light dark:border-border-dark">
                  <input id="cod" name="paymentMethod" type="radio" className="form-radio h-4 w-4 text-primary focus:ring-primary" defaultChecked />
                  <label htmlFor="cod" className="ml-3 block text-sm font-medium">Thanh toán khi nhận hàng (COD)</label>
                </div>
                <div className="flex items-center p-4 border rounded-lg border-border-light dark:border-border-dark">
                  <input id="bank" name="paymentMethod" type="radio" className="form-radio h-4 w-4 text-primary focus:ring-primary" />
                  <label htmlFor="bank" className="ml-3 block text-sm font-medium">Chuyển khoản ngân hàng</label>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-content-light dark:bg-content-dark p-6 rounded-xl shadow-sm sticky top-28">
            <h2 className="text-xl font-bold mb-6 border-b border-border-light dark:border-border-dark pb-4">Tóm tắt đơn hàng</h2>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary-light dark:text-text-secondary-dark">Tạm tính</span>
                <span className="font-medium">$315.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary-light dark:text-text-secondary-dark">Phí vận chuyển</span>
                <span className="font-medium">Miễn phí</span>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-border-light dark:border-border-dark">
              <div className="flex justify-between items-center text-base font-bold">
                <span>Tổng cộng</span>
                <span>$315.00</span>
              </div>
            </div>
            <button className="w-full mt-6 bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary/90 transition-colors duration-300">
              Hoàn tất Đơn hàng
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ThanhToanPage;