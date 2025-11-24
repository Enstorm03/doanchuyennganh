import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layouts
import PublicLayout from './PublicLayout';
import AdminLayout from './AdminLayout';

// Public Pages
import HomePage from './pages/TrangChu';
import ProductDetail from './pages/ChiTietSanPham';
import CategoryPage from './pages/DanhMucSanPham';
import GioHangPage from './pages/GioHang';
import ThanhToanPage from './pages/ThanhToan';

// Auth Pages
import DangNhapPage from './DangNhapPage';
import DangKyPage from './DangKyPage';

// Admin Pages
import DashboardPage from './DashboardPage';
import AdminProductsPage from './AdminProductsPage';
import AdminOrdersPage from './AdminOrdersPage';
import AdminOrderDetailPage from './AdminOrderDetailPage';

import './assets/styles/App.css';

function App() {
  return (
    <Router>
      <div className="relative flex min-h-screen w-full flex-col group/design-root overflow-x-hidden">
        <Routes>
          {/* Public Routes with Layout */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/category" element={<CategoryPage />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<GioHangPage />} />
            <Route path="/thanh-toan" element={<ThanhToanPage />} />
          </Route>

          {/* Auth Routes without Layout */}
          <Route path="/login" element={<DangNhapPage />} />
          <Route path="/register" element={<DangKyPage />} />

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="orders/:orderId" element={<AdminOrderDetailPage />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
