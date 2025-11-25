import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminHeader = () => {
  const { staff, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-surface-light dark:bg-surface-dark px-4 lg:h-[60px] lg:px-6">
      {/* Có thể thêm nút mở/đóng sidebar trên mobile ở đây */}
      <div className="w-full flex-1 flex items-center gap-4">
        <Link
          to="/admin/pos"
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          title="Truy cập POS - Bán hàng tại quầy"
        >
          <span className="material-symbols-outlined text-base">point_of_sale</span>
          POS System
        </Link>
      </div>
      <div className="flex items-center gap-4">
        {staff && (
          <>
            <span className="text-sm font-medium">
              {staff.ho_ten} ({staff.vai_tro === 'admin' ? 'Admin' : 'Staff'})
            </span>
            <button
              onClick={handleLogout}
              className="hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors"
              title="Đăng xuất"
            >
              <span className="material-symbols-outlined">logout</span>
            </button>
          </>
        )}
        <Link to="/" title="Quay về trang chủ" className="hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors">
          <span className="material-symbols-outlined">home</span>
        </Link>
      </div>
    </header>
  );
};

export default AdminHeader;
