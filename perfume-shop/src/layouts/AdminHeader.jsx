import React from 'react';
import { Link } from 'react-router-dom';

const AdminHeader = () => {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-surface-light dark:bg-surface-dark px-4 lg:h-[60px] lg:px-6">
      {/* Có thể thêm nút mở/đóng sidebar trên mobile ở đây */}
      <div className="w-full flex-1">
        {/* Có thể thêm thanh tìm kiếm ở đây */}
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium">Admin User</span>
        <Link to="/" title="Quay về trang chủ">
          <span className="material-symbols-outlined">logout</span>
        </Link>
      </div>
    </header>
  );
};

export default AdminHeader;