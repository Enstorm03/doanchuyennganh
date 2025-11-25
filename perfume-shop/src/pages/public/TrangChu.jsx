import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/product/ProductCard';

// 1. Import hình ảnh (Đảm bảo tên file trong máy bạn đúng là banner-home.png hay .jpg nhé)
import bannerImg from '../../assets/images/banner-home.png';
import chanelImg from '../../assets/images/unnamed.png';
import diorImg from '../../assets/images/dior.png';

// BACKEND-COMMENT: Chỗ này là nơi dữ liệu sản phẩm đang được hardcode (viết thẳng vào code).
// Khi có backend, bạn sẽ xóa mảng `featuredProducts` này đi.
// Thay vào đó, bạn sẽ dùng `useState` và `useEffect` của React để gọi API lấy danh sách sản phẩm.
// Ví dụ:
// const [featuredProducts, setFeaturedProducts] = useState([]);
//
// useEffect(() => {
//   // fetch('/api/products?featured=true')  // Đây là đường dẫn API ví dụ
//   //   .then(res => res.json())
//   //   .then(data => setFeaturedProducts(data));
// }, []);

const featuredProducts = [
  { id_san_pham: 1, ten_san_pham: "Chanel N°5", gia_ban: 150, url_hinh_anh: chanelImg },
  { id_san_pham: 2, ten_san_pham: "Dior Sauvage", gia_ban: 120, url_hinh_anh: diorImg },
  { id_san_pham: 3, ten_san_pham: "Creed Aventus", gia_ban: 350, url_hinh_anh: "https://placehold.co/300x400?text=Creed" },
  { id_san_pham: 4, ten_san_pham: "Jo Malone", gia_ban: 145, url_hinh_anh: "https://placehold.co/300x400?text=JoMalone" },
];

const HomePage = () => {
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
                    to="/category"
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {featuredProducts.map((product) => (
            <ProductCard
                key={product.id_san_pham}
                id_san_pham={product.id_san_pham}
                ten_san_pham={product.ten_san_pham}
                gia_ban={product.gia_ban}
                url_hinh_anh={product.url_hinh_anh}
                id_thuong_hieu={product.id_thuong_hieu}
            />
          ))}
        </div>
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
            <Link to="/category" className="relative block rounded-lg overflow-hidden group h-64">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" 
                     style={{backgroundImage: `url(${diorImg})`}}></div>
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                    <h3 className="text-white text-2xl font-bold tracking-wide">Nam Giới</h3>
                </div>
            </Link>

            {/* Category 2: Nữ */}
            <Link to="/category" className="relative block rounded-lg overflow-hidden group h-64">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" 
                     style={{backgroundImage: `url(${chanelImg})`}}></div>
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                    <h3 className="text-white text-2xl font-bold tracking-wide">Nữ Giới</h3>
                </div>
            </Link>

            {/* Category 3: Unisex */}
            <Link to="/category" className="relative block rounded-lg overflow-hidden group h-64">
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
