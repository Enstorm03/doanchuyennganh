import React from 'react';

const DashboardPage = () => {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        {/* Example Card */}
        <div className="rounded-xl border bg-surface-light text-card-foreground shadow border-border-light dark:border-border-dark dark:bg-surface-dark">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium text-text-subtle-light dark:text-text-subtle-dark">Tổng doanh thu</h3>
            <span className="material-symbols-outlined text-text-subtle-light dark:text-text-subtle-dark">paid</span>
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold text-text-light dark:text-text-dark">$45,231.89</div>
            <p className="text-xs text-text-subtle-light dark:text-text-subtle-dark pt-1">+20.1% so với tháng trước</p>
          </div>
        </div>
        {/* More cards can be added here */}
      </div>
    </div>
  );
};

export default DashboardPage;