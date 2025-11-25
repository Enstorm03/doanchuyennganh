import { Routes, Route } from 'react-router-dom';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import HomePage from './pages/public/TrangChu';
import ProductDetail from './pages/public/ChiTietSanPham';
import CategoryPage from './pages/public/DanhMucSanPham';
import GioHangPage from './pages/public/GioHang';
import ThanhToanPage from './pages/public/ThanhToan';
import ThuongHieuPage from './pages/public/ThuongHieuPage';
import POSPage from './pages/public/POSPage';

// Auth Pages
import DangNhapPage from './pages/auth/DangNhapPage';
import DangKyPage from './pages/auth/DangKyPage';

// Admin Pages
import DashboardPage from './pages/admin/DashboardPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminOrderDetailPage from './pages/admin/AdminOrderDetailPage';
import AdminReportPage from './pages/admin/AdminReportPage';

import './assets/styles/App.css';

function App() {
  return (
    <div className="relative flex min-h-screen w-full flex-col group/design-root overflow-x-hidden">
      <Routes>
        {/* Public Routes with Layout */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/category" element={<CategoryPage />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<GioHangPage />} />
          <Route path="/thanh-toan" element={<ThanhToanPage />} />
          <Route path="/brands" element={<ThuongHieuPage />} />
        </Route>

        {/* Auth Routes without Layout */}
        <Route path="/login" element={<DangNhapPage />} />
        <Route path="/register" element={<DangKyPage />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="orders/:orderId" element={<AdminOrderDetailPage />} />
          <Route path="reports" element={<AdminReportPage />} />
          <Route path="pos" element={<POSPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
