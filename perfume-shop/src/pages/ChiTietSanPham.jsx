import React from 'react';
import { Link, useParams } from 'react-router-dom';
import unnamedImg from '../assets/images/unnamed.png';
import diorImg from '../assets/images/dior.png';

// --- 1. DỮ LIỆU GIẢ (MOCK DATA) ---
// (Sau này phần này sẽ được thay thế bằng việc gọi API từ Spring Boot)
// Lưu ý: ID ở đây phải khớp với ID bạn đã gán ở HomePage
const productsData = [
  { 
    id: 1, 
    name: "Chanel N°5", 
    brand: "Chanel",
    price: 150, 
    description: "Hương thơm biểu tượng của sự nữ tính vượt thời gian. Một bó hoa rực rỡ được chế tác xung quanh hoa May Rose và hoa Jasmine.",
    image: unnamedImg// Nhớ thay bằng đường dẫn ảnh thật của bạn
  },
  { 
    id: 2, 
    name: "Dior Sauvage", 
    brand: "Dior",
    price: 120, 
    description: "Một thành phần mạnh mẽ và tươi mới. Sauvage là một hành động sáng tạo lấy cảm hứng từ không gian rộng mở.",
    image: diorImg
  },
  // Thêm các sản phẩm khác...
];

const ProductDetail = () => {
  // --- 2. LẤY ID TỪ URL ---
  const { id } = useParams(); 
  
  // --- 3. TÌM SẢN PHẨM TRONG DANH SÁCH ---
  // useParams trả về string, nên cần đổi sang number bằng parseInt
  const product = productsData.find(p => p.id === parseInt(id));

  // Nếu gõ bừa ID không tồn tại (ví dụ /product/999)
  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h2 className="text-xl font-bold">Không tìm thấy sản phẩm này!</h2>
      </div>
    );
  }

  return (
    <main className="px-4 sm:px-6 md:px-10 lg:px-20 py-5 sm:py-8 flex flex-1 justify-center min-h-screen bg-background-light dark:bg-background-dark">
      <div className="layout-content-container flex flex-col w-full max-w-6xl flex-1">
        
        {/* --- BREADCRUMBS ĐỘNG --- */}
        <div className="flex flex-wrap gap-2 px-4 py-2 mb-8">
          <Link className="text-subtle-light dark:text-subtle-dark text-sm font-medium leading-normal hover:text-primary transition-colors" to="/">Trang chủ</Link>
          <span className="text-subtle-light dark:text-subtle-dark text-sm font-medium leading-normal">/</span>
          <span className="text-subtle-light dark:text-subtle-dark text-sm font-medium leading-normal">Nước hoa</span>
          <span className="text-subtle-light dark:text-subtle-dark text-sm font-medium leading-normal">/</span>
          {/* Tên sản phẩm lấy từ dữ liệu */}
          <span className="text-text-light dark:text-text-dark text-sm font-medium leading-normal font-bold">
            {product.name}
          </span>
        </div>

        {/* --- NỘI DUNG CHÍNH (GRID LAYOUT) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 px-4">
          
          {/* CỘT TRÁI: HÌNH ẢNH */}
          <div className="w-full bg-surface-light dark:bg-surface-dark rounded-xl overflow-hidden shadow-sm p-4">
             {/* Nếu chưa có ảnh thật, dùng ảnh placeholder online để test */}
            <img 
              src={product.image || "https://placehold.co/600x800?text=No+Image"} 
              alt={product.name} 
              className="w-full h-auto object-cover rounded-lg aspect-[3/4]"
            />
          </div>

          {/* CỘT PHẢI: THÔNG TIN */}
          <div className="flex flex-col gap-6 py-4">
            <div>
              <h2 className="text-sm font-medium text-primary uppercase tracking-wide">{product.brand}</h2>
              <h1 className="text-3xl md:text-4xl font-black text-text-light dark:text-text-dark mt-2">{product.name}</h1>
            </div>

            <p className="text-3xl font-bold text-primary">${product.price}</p>

            <p className="text-text-subtle-light dark:text-text-subtle-dark leading-relaxed text-lg">
              {product.description}
            </p>

            {/* Các nút bấm */}
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <button className="flex-1 bg-primary text-white font-bold py-4 px-8 rounded-lg hover:bg-opacity-90 transition-all transform hover:-translate-y-1 shadow-md">
                Thêm vào giỏ hàng
              </button>
              <button className="flex-1 border-2 border-primary text-primary font-bold py-4 px-8 rounded-lg hover:bg-primary/10 transition-all">
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
            </div>
          </div>
        </div>

      </div>
    </main>
  );
};

export default ProductDetail;