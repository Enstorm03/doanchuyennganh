import React from 'react';

const AdminReportPage = () => {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="font-semibold text-lg md:text-2xl text-text-light dark:text-text-dark">
          Báo cáo & Thống kê
        </h1>
        <div className="flex items-center gap-2">
          <input 
            type="date" 
            className="form-input rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-sm"
          />
          <span className="text-text-subtle-light dark:text-text-subtle-dark">-</span>
          <input 
            type="date" 
            className="form-input rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-sm"
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        {/* Card 1: Total Revenue */}
        <div className="rounded-xl border bg-surface-light text-card-foreground shadow border-border-light dark:border-border-dark dark:bg-surface-dark p-6">
          <div className="flex items-center justify-between pb-2">
            <h3 className="tracking-tight text-sm font-medium text-text-subtle-light dark:text-text-subtle-dark">Tổng doanh thu</h3>
            <span className="material-symbols-outlined text-text-subtle-light dark:text-text-subtle-dark">paid</span>
          </div>
          <div className="pt-0">
            <div className="text-2xl font-bold text-text-light dark:text-text-dark">150,231,000đ</div>
            <p className="text-xs text-green-500 pt-1">+15.2% so với kỳ trước</p>
          </div>
        </div>
        {/* Card 2: New Orders */}
        <div className="rounded-xl border bg-surface-light text-card-foreground shadow border-border-light dark:border-border-dark dark:bg-surface-dark p-6">
          <div className="flex items-center justify-between pb-2">
            <h3 className="tracking-tight text-sm font-medium text-text-subtle-light dark:text-text-subtle-dark">Đơn hàng mới</h3>
            <span className="material-symbols-outlined text-text-subtle-light dark:text-text-subtle-dark">shopping_cart</span>
          </div>
          <div className="pt-0">
            <div className="text-2xl font-bold text-text-light dark:text-text-dark">+1,205</div>
            <p className="text-xs text-text-subtle-light dark:text-text-subtle-dark pt-1">Trong 30 ngày qua</p>
          </div>
        </div>
        {/* Add more cards as needed */}
      </div>

      {/* Charts Section */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* Sales Chart */}
        <div className="rounded-xl border bg-surface-light text-card-foreground shadow border-border-light dark:border-border-dark dark:bg-surface-dark p-6">
          <h3 className="text-lg font-bold mb-4">Biểu đồ doanh thu</h3>
          <div className="h-64 bg-background-light dark:bg-background-dark rounded-lg flex items-center justify-center">
            <p className="text-text-subtle-light dark:text-text-subtle-dark">
              {/* Trong thực tế, bạn sẽ dùng thư viện biểu đồ như Chart.js, Recharts... */}
              Biểu đồ sẽ được hiển thị ở đây
            </p>
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="rounded-xl border bg-surface-light text-card-foreground shadow border-border-light dark:border-border-dark dark:bg-surface-dark p-6">
          <h3 className="text-lg font-bold mb-4">Sản phẩm bán chạy</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="font-medium">Dior Sauvage</p>
              <p className="text-sm text-text-subtle-light dark:text-text-subtle-dark">Đã bán: 150</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="font-medium">Chanel N°5</p>
              <p className="text-sm text-text-subtle-light dark:text-text-subtle-dark">Đã bán: 120</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="font-medium">Creed Aventus</p>
              <p className="text-sm text-text-subtle-light dark:text-text-subtle-dark">Đã bán: 95</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReportPage;