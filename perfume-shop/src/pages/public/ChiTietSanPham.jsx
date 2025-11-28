import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../../services/api';

// Map brand IDs to names (same as in ProductCard)
const brands = {
  1: "Chanel",
  2: "Dior",
  3: "Versace",
  4: "Tom Ford",
  5: "Creed",
  6: "Giorgio Armani",
  7: "YSL",
  8: "Paco Rabanne"
};

// Map concentration IDs to names
const concentrations = {
  1: "EDP (Eau de Parfum)",
  2: "EDT (Eau de Toilette)",
  3: "Extrait de Parfum"
};

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const productData = await api.getProductById(parseInt(id));
        setProduct(productData);
      } catch (err) {
        setError('Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <main className="flex justify-center items-center min-h-screen bg-background-light dark:bg-background-dark">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Đang tải sản phẩm...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex justify-center items-center min-h-screen bg-background-light dark:bg-background-dark">
        <div className="text-center">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md mx-auto">
            <p className="text-red-800 dark:text-red-200 font-medium mb-2">Lỗi tải sản phẩm</p>
            <p className="text-red-600 dark:text-red-300 text-sm">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
            >
              Thử lại
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (!product || !product.ten_san_pham) {
    return (
      <main className="flex justify-center items-center min-h-screen bg-background-light dark:bg-background-dark">
        <div className="text-center">
          <h2 className="text-xl font-bold">Không tìm thấy sản phẩm này!</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Kiểm tra console để xem dữ liệu API trả về.
          </p>
          <Link to="/products" className="text-primary hover:underline mt-2 inline-block">
            Quay lại danh sách sản phẩm
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="px-4 sm:px-6 md:px-10 lg:px-20 py-5 sm:py-8 flex flex-1 justify-center min-h-screen bg-background-light dark:bg-background-dark">
      <div className="layout-content-container flex flex-col w-full max-w-6xl flex-1">
        
        {/* --- BREADCRUMBS ĐỘNG --- */}
        <div className="flex flex-wrap gap-2 px-4 py-2 mb-8">
          <Link className="text-subtle-light dark:text-subtle-dark text-sm font-medium leading-normal hover:text-primary transition-colors" to="/">Trang chủ</Link>
          <span className="text-subtle-light dark:text-subtle-dark text-sm font-medium leading-normal">/</span>
          <Link className="text-subtle-light dark:text-subtle-dark text-sm font-medium leading-normal hover:text-primary transition-colors" to="/products">Nước hoa</Link>
          <span className="text-subtle-light dark:text-subtle-dark text-sm font-medium leading-normal">/</span>
          {/* Tên sản phẩm lấy từ dữ liệu */}
          <span className="text-text-light dark:text-text-dark text-sm font-medium leading-normal font-bold">
            {product.ten_san_pham}
          </span>
        </div>

        {/* --- NỘI DUNG CHÍNH (GRID LAYOUT) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 px-4">

          {/* CỘT TRÁI: HÌNH ẢNH */}
          <div className="w-full bg-surface-light dark:bg-surface-dark rounded-xl overflow-hidden shadow-sm p-4">
             <img
              src={product.url_hinh_anh || "https://placehold.co/600x800?text=No+Image"}
              alt={product.ten_san_pham}
              className="w-full h-auto object-cover rounded-lg aspect-[3/4]"
            />
          </div>

          {/* CỘT PHẢI: THÔNG TIN */}
          <div className="flex flex-col gap-6 py-4">
            <div>
              <h2 className="text-sm font-medium text-primary uppercase tracking-wide">{brands[product.id_thuong_hieu]}</h2>
              <h1 className="text-3xl md:text-4xl font-black text-text-light dark:text-text-dark mt-2">{product.ten_san_pham}</h1>
            </div>

            <p className="text-3xl font-bold text-primary">
              {product.gia_ban ? product.gia_ban.toLocaleString('vi-VN') : 'Liên hệ'}₫
            </p>

            {/* Thông tin chi tiết sản phẩm */}
            <div className="grid grid-cols-2 gap-4 py-4 border-y border-border-light dark:border-border-dark">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 dark:text-gray-400">Dung tích</span>
                <span className="font-medium">{product.dung_tich_ml || 'N/A'}ml</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 dark:text-gray-400">Nồng độ</span>
                <span className="font-medium">{concentrations[product.nong_do] || product.nong_do || 'N/A'}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 dark:text-gray-400">Tồn kho</span>
                <span className={`font-medium ${(product.so_luong_ton_kho || 0) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {(product.so_luong_ton_kho || 0) > 0 ? `${product.so_luong_ton_kho} sản phẩm` : 'Hết hàng'}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 dark:text-gray-400">Thương hiệu</span>
                <span className="font-medium">{brands[product.id_thuong_hieu] || 'N/A'}</span>
              </div>
            </div>

            {product.mo_ta && (
              <div>
                <h3 className="text-lg font-bold mb-2">Mô tả sản phẩm</h3>
                <p className="text-text-subtle-light dark:text-text-subtle-dark leading-relaxed">
                  {product.mo_ta}
                </p>
              </div>
            )}

            {/* Các nút bấm */}
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <button
                className={`flex-1 font-bold py-4 px-8 rounded-lg transition-all transform hover:-translate-y-1 shadow-md ${
                  product.so_luong_ton_kho > 0
                    ? 'bg-primary text-white hover:bg-opacity-90'
                    : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                }`}
                disabled={product.so_luong_ton_kho <= 0}
              >
                {product.so_luong_ton_kho > 0 ? 'Thêm vào giỏ hàng' : 'Hết hàng'}
              </button>
              <button
                className={`flex-1 border-2 font-bold py-4 px-8 rounded-lg transition-all ${
                  product.so_luong_ton_kho > 0
                    ? 'border-primary text-primary hover:bg-primary hover:text-white'
                    : 'border-gray-400 text-gray-400 cursor-not-allowed'
                }`}
                disabled={product.so_luong_ton_kho <= 0}
              >
                Mua ngay
              </button>
            </div>

            {/* Thông tin thêm (Icon) */}
            <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-border-light dark:border-border-dark">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">local_shipping</span>
                <span className="text-sm font-medium">Freeship toàn quốc</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">verified_user</span>
                <span className="text-sm font-medium">Chính hãng 100%</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">refresh</span>
                <span className="text-sm font-medium">Đổi trả trong 30 ngày</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">support_agent</span>
                <span className="text-sm font-medium">Hỗ trợ 24/7</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
};

export default ProductDetail;
