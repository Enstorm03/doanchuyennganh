import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import HomePage from './pages/TrangChu';
import ProductDetail from './pages/ChiTietSanPham';
import CategoryPage from './pages/DanhMucSanPham';
import GioHangPage from './pages/GioHang';
import ThanhToanPage from './pages/ThanhToan';


import './assets/styles/App.css';

function App() {
  return (
    <Router>
      <div className="relative flex min-h-screen w-full flex-col group/design-root overflow-x-hidden">
        <Header brandName="Aura" />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/category" element={<CategoryPage />} />
          <Route path="/cart" element={<GioHangPage />} />
          <Route path="/thanh-toan" element={<ThanhToanPage />} />
          <Route path="/product/:id" element={<ProductDetail />} />
        </Routes>
        <Footer brandName="Aura" />
      </div>
    </Router>
  );
}

export default App;
