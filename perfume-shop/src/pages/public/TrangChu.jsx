import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/product/ProductCard';
import api from '../../services/api';

// 1. Import hình ảnh (Đảm bảo tên file trong máy bạn đúng là banner-home.png hay .jpg nhé)
import bannerImg from '../../assets/images/banner-home.png';
import chanelImg from '../../assets/images/unnamed.png';
import diorImg from '../../assets/images/dior.png';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const allProducts = await api.getAllProducts();
        // Take first 4 products as featured products
        setFeaturedProducts(allProducts.slice(0, 4));
      } catch (err) {
        setError('Không thể tải sản phẩm nổi bật');
        console.error('Error fetching featured products:', err);
        // Fallback to some default products if API fails
        setFeaturedProducts([
          { id_san_pham: 1, ten_san_pham: "Sản phẩm mẫu", gia_ban: 100000, url_hinh_anh: chanelImg, id_thuong_hieu: 1 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);
  return (
    <main className="flex-1 bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">
      
      {/* === HERO SECTION (BANNER) === */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="relative rounded-xl overflow-hidden">
                      <div
                        className="flex min-h-[520px] flex-col gap-6 bg-cover bg-center items-center justify-center p-6 text-center"
                        // [QUAN TRỌNG] Đã sửa dòng này để dùng ảnh trong máy của bạn:
                        // Cú pháp: url(${ten_bien})
                        style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.6)), url(${bannerImg})` }}
                      >
                        {/* BACKEND-COMMENT: Nội dung của banner (tiêu đề, mô tả, ảnh nền) cũng nên được lấy từ backend.
                            Điều này giúp bạn có thể thay đổi banner cho các chiến dịch marketing mà không cần sửa code.
                            Bạn có thể tạo một API ví dụ: /api/banners?page=homepage
                        */}
                        <div className="flex flex-col gap-4 max-w-3xl z-10">
                          <h1 className="text-white text-4xl font-black leading-tight tracking-tighter md:text-6xl">
                              Bộ Sưu Tập Mùa Hè 2024
                          </h1>
                          <h2 className="text-white/90 text-base md:text-lg font-medium">
                              Tỏa Sáng Dưới Nắng Vàng. Giảm giá 30%.
                          </h2>              </div>
             <Link
                    to="/products"
                    className="z-10 mt-4 h-12 px-8 bg-primary text-white font-bold rounded-lg hover:bg-opacity-90 transition-all shadow-lg flex items-center justify-center"
                  >
                    Khám Phá Ngay
                  </Link>
            </div>
        </div>
      </section>

      {/* === PRODUCTS SECTION === */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <h2 className="text-3xl font-bold tracking-tight px-4 pb-6">Sản Phẩm Bán Chạy Nhất</h2>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Đang tải sản phẩm...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-800 dark:text-red-200 font-medium mb-2">Lỗi tải sản phẩm</p>
              <p className="text-red-600 dark:text-red-300 text-sm">{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">Không có sản phẩm nào.</p>
              </div>
            ) : (
              featuredProducts.map((product) => (
                <ProductCard
                    key={product.id_san_pham}
                    id_san_pham={product.id_san_pham}
                    ten_san_pham={product.ten_san_pham}
                    gia_ban={product.gia_ban}
                    url_hinh_anh={product.url_hinh_anh}
                    id_thuong_hieu={product.id_thuong_hieu}
                />
              ))
            )}
          </div>
        )}
      </section>

      {/* === CATEGORIES SECTION (Đã sửa lại dùng Link) === */}
      {/* BACKEND-COMMENT: Tương tự như sản phẩm, danh sách các danh mục (category) và hình ảnh
          cũng nên được lấy từ backend. API có thể là /api/categories.
          Việc này giúp bạn dễ dàng thêm/bớt danh mục mà không cần can thiệp vào code.
      */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <h2 className="text-3xl font-bold tracking-tight px-4 pb-6">Khám Phá Theo Phong Cách</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Category 1: Nam */}
            <Link to="/products" className="relative block rounded-lg overflow-hidden group h-64">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                     style={{backgroundImage: `url(${diorImg})`}}></div>
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                    <h3 className="text-white text-2xl font-bold tracking-wide">Nam Giới</h3>
                </div>
            </Link>

            {/* Category 2: Nữ */}
            <Link to="/products" className="relative block rounded-lg overflow-hidden group h-64">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                     style={{backgroundImage: `url(${chanelImg})`}}></div>
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                    <h3 className="text-white text-2xl font-bold tracking-wide">Nữ Giới</h3>
                </div>
            </Link>

            {/* Category 3: Unisex */}
            <Link to="/products" className="relative block rounded-lg overflow-hidden group h-64">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                     style={{backgroundImage:`url(${bannerImg})`}}></div>
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                    <h3 className="text-white text-2xl font-bold tracking-wide">Unisex</h3>
                </div>
            </Link>

        </div>
      </section>

    </main>
  );
};

export default HomePage;
