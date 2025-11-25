

import React from 'react';
import { Link } from 'react-router-dom';

// BACKEND-COMMENT: Danh sách các thương hiệu nên được lấy động từ backend
// thay vì hardcode như thế này. Việc này giúp bạn có thể dễ dàng thêm/sửa/xóa
// các thương hiệu từ database mà không cần sửa code.
/*
1. Tạo state để lưu danh sách thương hiệu:
   const [brands, setBrands] = useState([]);
   const [loading, setLoading] = useState(true);

2. Dùng useEffect để gọi API khi component được render:
   useEffect(() => {
     fetch('/api/brands') // API endpoint ví dụ để lấy tất cả thương hiệu
       .then(res => res.json())
       .then(data => {
         setBrands(data);
         setLoading(false);
       })
       .catch(error => console.error("Lỗi khi lấy danh sách thương hiệu:", error));
   }, []); // Mảng rỗng đảm bảo useEffect chỉ chạy 1 lần.
*/

// Dữ liệu mẫu cho các thương hiệu
const brands = [
  { name: 'Chanel', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Chanel_logo.svg/1200px-Chanel_logo.svg.png' },
  { name: 'Dior', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Dior_logo.svg/1200px-Dior_logo.svg.png' },
  { name: 'Gucci', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Gucci_logo.svg/1200px-Gucci_logo.svg.png' },
  { name: 'Versace', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Versace.svg/1200px-Versace.svg.png' },
  { name: 'Tom Ford', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/3/3d/Tom_Ford_logo.svg/1200px-Tom_Ford_logo.svg.png' },
  { name: 'Creed', logo: 'https://logowik.com/content/uploads/images/creed-perfume-new-20232712.logowik.com.webp' },
  { name: 'YSL', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Yves_Saint_Laurent_logo.svg/1200px-Yves_Saint_Laurent_logo.svg.png' },
  { name: 'Paco Rabanne', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Paco_Rabanne_logo.svg/2560px-Paco_Rabanne_logo.svg.png' },
];

const ThuongHieuPage = () => {
  return (
    <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 text-sm">
          <Link className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary transition-colors" to="/">Trang chủ</Link>
          <span className="text-text-secondary-light dark:text-text-secondary-dark">/</span>
          <span className="font-medium text-text-primary-light dark:text-text-primary-dark">Thương hiệu</span>
        </div>
      </div>

      {/* PageHeading */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-black tracking-[-0.033em]">Tất Cả Thương Hiệu</h1>
        <p className="mt-2 text-text-subtle-light dark:text-text-subtle-dark">Khám phá thế giới hương thơm từ các nhà mốt danh tiếng.</p>
      </div>

      {/* Brands Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {brands.map((brand) => (
          <Link to={`/category?brand=${brand.name.toLowerCase()}`} key={brand.name} className="group flex justify-center items-center p-6 bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark aspect-video transition-all duration-300 hover:shadow-lg hover:border-primary">
            <img 
              src={brand.logo} 
              alt={`${brand.name} logo`} 
              className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-110" 
            />
          </Link>
        ))}
      </div>
    </main>
  );
};

export default ThuongHieuPage;