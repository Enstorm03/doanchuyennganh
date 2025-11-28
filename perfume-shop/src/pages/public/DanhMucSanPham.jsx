import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProductCard from '../../components/product/ProductCard';
import api from '../../services/api';

// Import ảnh (hoặc dùng link placeholder nếu chưa có đủ ảnh)
import chanelImg from '../../assets/images/unnamed.png';
import diorImg from '../../assets/images/dior.png';


// BACKEND-COMMENT: Đây là phần quan trọng nhất của trang này.
// Toàn bộ logic để hiển thị, lọc, sắp xếp sản phẩm sẽ nằm ở đây.
// Bạn sẽ cần nhiều `useState` để quản lý trạng thái của trang.
/*
Ví dụ về các state cần quản lý:

const [products, setProducts] = useState([]); // Dữ liệu sản phẩm lấy từ API
const [loading, setLoading] = useState(true);

// State cho bộ lọc
const [selectedBrands, setSelectedBrands] = useState([]);
const [priceRange, setPriceRange] = useState(10000000);
const [selectedConcentrations, setSelectedConcentrations] = useState([]);

// State cho sắp xếp
const [sortBy, setSortBy] = useState('newest'); // 'newest', 'price_asc', 'price_desc'

// State cho phân trang
const [currentPage, setCurrentPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
*/

// Bạn sẽ dùng `useEffect` để gọi API mỗi khi các state trên thay đổi.
/*
useEffect(() => {
  setLoading(true);

  // 1. Xây dựng URL API với các tham số (query parameters)
  const params = new URLSearchParams();
  params.append('page', currentPage);
  params.append('sortBy', sortBy);
  if (category) params.append('category', category); // category lấy từ useParams()
  if (priceRange < 10000000) params.append('maxPrice', priceRange);
  selectedBrands.forEach(brand => params.append('brand', brand));
  selectedConcentrations.forEach(conc => params.append('concentration', conc));

  const apiUrl = `/api/products?${params.toString()}`;

  // 2. Gọi API
  fetch(apiUrl)
    .then(res => res.json())
    .then(data => {
      setProducts(data.products); // API nên trả về object chứa cả sản phẩm và thông tin phân trang
      setTotalPages(data.totalPages);
      setLoading(false);
    })
    .catch(error => {
      console.error("Lỗi khi lấy dữ liệu:", error);
      setLoading(false);
    });

}, [category, currentPage, sortBy, selectedBrands, priceRange, selectedConcentrations]); // Dependency array
*/



const CategoryPage = () => {
  const [priceRange, setPriceRange] = useState(2500000); // State cho thanh trượt giá
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { category } = useParams();

  let categoryName = "";
  if (category === "men") categoryName = "Nam";
  else if (category === "women") categoryName = "Nữ";
  else categoryName = "Unisex";

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedProducts = await api.getAllProducts();
        setProducts(fetchedProducts);
      } catch (err) {
        setError('Không thể tải sản phẩm. Vui lòng thử lại sau.');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <main className="container mx-auto px-4 py-8 min-h-screen bg-background-light dark:bg-background-dark">
      
      {/* --- BREADCRUMBS & HEADING --- */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 mb-4">
          <Link className="text-gray-500 dark:text-gray-400 text-sm font-medium hover:text-primary" to="/">Trang chủ</Link>
          <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">/</span>
          <span className="text-gray-800 dark:text-gray-200 text-sm font-medium">{`San pham`}</span>
        </div>
        <div className="flex flex-wrap justify-between items-center gap-3">
          <p className="text-gray-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]}">{`Nước Hoa ${categoryName}`}</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* --- SIDEBAR (BỘ LỌC) --- */}
        <aside className="w-full lg:w-1/4 xl:w-1/5">
          {/* BACKEND-COMMENT: Toàn bộ phần sidebar này dùng để cập nhật các state cho việc lọc.
              - Danh sách các thương hiệu và nồng độ cũng nên được lấy từ API (ví dụ: /api/brands, /api/concentrations)
                thay vì hardcode, để bạn có thể dễ dàng quản lý trong database.
              - Khi người dùng tick vào các checkbox hoặc kéo thanh giá, bạn sẽ cập nhật các state tạm thời.
              - Khi nhấn nút "Áp dụng", bạn sẽ cập nhật các state chính (ví dụ: `setSelectedBrands`, `setPriceRange`).
                Việc cập nhật state chính này sẽ khiến `useEffect` ở trên tự động chạy lại và gọi API với bộ lọc mới.
              - Nút "Xóa bộ lọc" sẽ reset tất cả các state lọc về giá trị mặc định.
          */}
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
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {loading ? 'Đang tải...' : error ? 'Lỗi tải sản phẩm' : `Hiển thị ${products.length} sản phẩm`}
            </p>
            {/* BACKEND-COMMENT: Tương tự bộ lọc, việc thay đổi dropdown này sẽ cập nhật state `sortBy`.
                Ví dụ: `<select onChange={(e) => setSortBy(e.target.value)} ...>`
                Việc `setSortBy` sẽ kích hoạt `useEffect` gọi lại API với tham số `sortBy` mới.
            */}
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

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Đang tải sản phẩm...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
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
          )}

          {/* Product Grid */}
          {!loading && !error && (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">Không có sản phẩm nào.</p>
                </div>
              ) : (
                products.map((product) => (
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

          {/* Pagination */}
          {/* BACKEND-COMMENT: Phần phân trang này sẽ được render động dựa vào `totalPages` nhận được từ API.
              Bạn sẽ tạo một mảng các số trang (ví dụ: `Array.from({ length: totalPages }, (_, i) => i + 1)`)
              và lặp qua mảng đó để render các nút bấm.
              Mỗi nút sẽ có một `onClick` handler để gọi `setCurrentPage(pageNumber)`.
              Việc này sẽ kích hoạt `useEffect` và lấy dữ liệu cho trang mới.
          */}
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
