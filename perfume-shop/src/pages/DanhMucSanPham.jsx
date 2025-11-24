import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProductCard from '../components/product/ProductCard';

// Import ảnh (hoặc dùng link placeholder nếu chưa có đủ ảnh)
import chanelImg from '../assets/images/unnamed.png';
import diorImg from '../assets/images/dior.png';


// Dữ liệu giả cho danh mục
const productsData = [
  { id: 2, name: "Sauvage EDP", brand: "Dior", price: 120, image:diorImg},
  { id: 1, name: "Bleu de Chanel", brand: "Chanel", price: 150, image: chanelImg },
  { id: 3, name: "Versace Eros", brand: "Versace", price: 95, image: "https://placehold.co/400x400?text=Versace" },
  { id: 4, name: "Tom Ford Oud Wood", brand: "Tom Ford", price: 250, image: "https://placehold.co/400x400?text=TomFord" },
  { id: 5, name: "Creed Aventus", brand: "Creed", price: 350, image: "https://placehold.co/400x400?text=Creed" },
  { id: 6, name: "Acqua di Gio", brand: "Giorgio Armani", price: 110, image: "https://placehold.co/400x400?text=Armani" },
  { id: 7, name: "YSL Y EDP", brand: "YSL", price: 130, image: "https://placehold.co/400x400?text=YSL" },
  { id: 8, name: "Invictus", brand: "Paco Rabanne", price: 90, image: "https://placehold.co/400x400?text=Paco" },
];

const CategoryPage = () => {
  const [priceRange, setPriceRange] = useState(2500000); // State cho thanh trượt giá
  const { category } = useParams();

  let categoryName = "";
  if (category === "men") categoryName = "Nam";
  else if (category === "women") categoryName = "Nữ";
  else categoryName = "Unisex";

  return (
    <main className="container mx-auto px-4 py-8 min-h-screen bg-background-light dark:bg-background-dark">
      
      {/* --- BREADCRUMBS & HEADING --- */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 mb-4">
          <Link className="text-gray-500 dark:text-gray-400 text-sm font-medium hover:text-primary" to="/">Trang chủ</Link>
          <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">/</span>
          <span className="text-gray-800 dark:text-gray-200 text-sm font-medium">{`Nước Hoa ${categoryName}`}</span>
        </div>
        <div className="flex flex-wrap justify-between items-center gap-3">
          <p className="text-gray-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]}">{`Nước Hoa ${categoryName}`}</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* --- SIDEBAR (BỘ LỌC) --- */}
        <aside className="w-full lg:w-1/4 xl:w-1/5">
          <div className="sticky top-28 p-6 bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Bộ lọc</h3>
              <button className="text-sm text-primary hover:underline">Xóa bộ lọc</button>
            </div>

            {/* Filter: Brand */}
            <div className="py-4 border-b border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold mb-3 text-gray-800 dark:text-gray-200">Thương hiệu</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {['Chanel', 'Dior', 'Gucci', 'Versace', 'Tom Ford', 'Creed'].map((brand) => (
                   <label key={brand} className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300 cursor-pointer">
                      <input type="checkbox" className="form-checkbox rounded text-primary focus:ring-primary/50" />
                      <span>{brand}</span>
                   </label>
                ))}
              </div>
            </div>

            {/* Filter: Price */}
            <div className="py-4 border-b border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold mb-4 text-gray-800 dark:text-gray-200">Mức giá tối đa</h4>
              <input 
                type="range" 
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-primary"
                min="0" max="10000000" step="100000"
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                <span>0đ</span>
                <span className="font-bold text-primary">{parseInt(priceRange).toLocaleString()}đ</span>
              </div>
            </div>

            {/* Filter: Concentration */}
            <div className="py-4 border-b border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold mb-3 text-gray-800 dark:text-gray-200">Nồng độ</h4>
              <div className="space-y-2">
                {['Eau de Parfum (EDP)', 'Eau de Toilette (EDT)', 'Extrait de Parfum'].map((type) => (
                    <label key={type} className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300 cursor-pointer">
                        <input type="checkbox" className="form-checkbox rounded text-primary focus:ring-primary/50" />
                        <span>{type}</span>
                    </label>
                ))}
              </div>
            </div>

            {/* Apply Button */}
            <div className="pt-6">
              <button className="w-full h-10 flex items-center justify-center rounded-lg bg-primary text-white text-sm font-bold hover:bg-opacity-90 transition-colors">
                Áp dụng
              </button>
            </div>
          </div>
        </aside>

        {/* --- MAIN CONTENT (LƯỚI SẢN PHẨM) --- */}
        <div className="w-full lg:w-3/4 xl:w-4/5">
          
          {/* Sorting Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 p-4 bg-white dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark">
            <p className="text-gray-600 dark:text-gray-400 text-sm">Hiển thị {productsData.length} sản phẩm</p>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sắp xếp:</span>
              <select className="form-select text-sm rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-gray-200 focus:border-primary focus:ring-primary/50 py-1.5 pl-3 pr-8">
                <option>Mới nhất</option>
                <option>Bán chạy nhất</option>
                <option>Giá: Tăng dần</option>
                <option>Giá: Giảm dần</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {productsData.map((product) => (
              <ProductCard 
                key={product.id}
                id={product.id}
                name={product.name}
                brand={product.brand}
                price={product.price}
                image={product.image}
              />
            ))}
          </div>

          {/* Pagination */}
          <nav aria-label="Pagination" className="flex justify-center mt-12">
            <ul className="inline-flex items-center -space-x-px text-sm">
              <li><button className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"><span className="material-symbols-outlined text-base">chevron_left</span></button></li>
              <li><button className="px-3 h-8 text-white bg-primary border border-primary">1</button></li>
              <li><button className="px-3 h-8 text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400">2</button></li>
              <li><button className="px-3 h-8 text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400">3</button></li>
              <li><button className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"><span className="material-symbols-outlined text-base">chevron_right</span></button></li>
            </ul>
          </nav>

        </div>
      </div>
    </main>
  );
};

export default CategoryPage;
