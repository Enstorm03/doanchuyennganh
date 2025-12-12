import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ProductCard from '../../components/product/ProductCard';
import api from '../../services/api';


const CategoryPage = () => {
  const [priceRange, setPriceRange] = useState(10000000); // State cho thanh trượt giá
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('category');
  const brandId = searchParams.get('brand');
  const searchQuery = searchParams.get('search');

  // Filter states
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedConcentrations, setSelectedConcentrations] = useState([]);
  const [maxPrice, setMaxPrice] = useState(10000000); // Show all products initially
  const [sortBy, setSortBy] = useState('Mới nhất');

  const getCategoryName = (id) => {
    const category = categories.find(cat => cat.idDanhMuc === parseInt(id));
    return category ? category.tenDanhMuc : "Tất cả sản phẩm";
  };

  const getBrandName = (id) => {
    const brand = brands.find(b => b.idThuongHieu === parseInt(id));
    return brand ? brand.tenThuongHieu : "Tất cả thương hiệu";
  };

  // Fetch categories and brands on component mount
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [fetchedCategories, fetchedBrands] = await Promise.all([
          api.getCategories(),
          api.getBrands()
        ]);
        setCategories(fetchedCategories);
        setBrands(fetchedBrands);
      } catch (err) {
        console.error('Error fetching metadata:', err);
      }
    };

    fetchMetadata();
  }, []);

  // Fetch products based on category, brand, or search
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        let fetchedProducts;
        if (searchQuery) {
          fetchedProducts = await api.searchProducts(searchQuery);
        } else if (brandId) {
          fetchedProducts = await api.searchProducts('', '', brandId);
        } else if (categoryId) {
          fetchedProducts = await api.searchProducts('', categoryId);
        } else {
          fetchedProducts = await api.getAllProducts();
        }
        setProducts(fetchedProducts);
        setFilteredProducts(fetchedProducts); // Set filtered products initially
      } catch (err) {
        setError('Không thể tải sản phẩm. Vui lòng thử lại sau.');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId, brandId, searchQuery]);

  // Apply filters and sorting to products
  useEffect(() => {
    let filtered = [...products];

    // Filter by brands
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(product =>
        selectedBrands.includes(product.id_thuong_hieu)
      );
    }

    // Filter by price
    filtered = filtered.filter(product => product.gia_ban <= maxPrice);

    // Filter by concentration
    if (selectedConcentrations.length > 0) {
      filtered = filtered.filter(product => {
        const nongDo = product.nong_do;
        return selectedConcentrations.some(type => {
          switch (type) {
            case 'Eau de Toilette (EDT)':
              return nongDo >= 5 && nongDo <= 15;
            case 'Eau de Parfum (EDP )':
              return nongDo >= 15 && nongDo <= 20;
            case 'Extrait de Parfum ':
              return nongDo >= 20 && nongDo <= 40;
            default:
              return false;
          }
        });
      });
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'Giá: Tăng dần':
          return a.gia_ban - b.gia_ban;
        case 'Giá: Giảm dần':
          return b.gia_ban - a.gia_ban;
        case 'Bán chạy nhất':
          // Assuming we have a sales field, otherwise keep original order
          return (b.so_luong_da_ban || 0) - (a.so_luong_da_ban || 0);
        case 'Mới nhất':
        default:
          // Assuming products have id or created date, sort by id descending for newest
          return b.id_san_pham - a.id_san_pham;
      }
    });

    setFilteredProducts(filtered);
  }, [products, selectedBrands, maxPrice, selectedConcentrations, sortBy]);

  // Handle brand checkbox change
  const handleBrandChange = (brandId, checked) => {
    if (checked) {
      setSelectedBrands(prev => [...prev, brandId]);
    } else {
      setSelectedBrands(prev => prev.filter(id => id !== brandId));
    }
  };

  // Handle concentration checkbox change
  const handleConcentrationChange = (type, checked) => {
    if (checked) {
      setSelectedConcentrations(prev => [...prev, type]);
    } else {
      setSelectedConcentrations(prev => prev.filter(t => t !== type));
    }
  };

  // Apply filters
  const handleApplyFilters = () => {
    setMaxPrice(priceRange);
  };

  // Clear filters
  const handleClearFilters = () => {
    setSelectedBrands([]);
    setSelectedConcentrations([]);
    setMaxPrice(10000000);
    setPriceRange(10000000);
  };

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
          <p className="text-gray-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]}">
            {searchQuery ? `Kết quả tìm kiếm: "${searchQuery}"` : brandId ? getBrandName(brandId) : categoryId ? getCategoryName(categoryId) : "Tất cả sản phẩm"}
          </p>
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
              <button
                onClick={handleClearFilters}
                className="text-sm text-primary hover:underline"
              >
                Xóa bộ lọc
              </button>
            </div>

            {/* Filter: Brand */}
            <div className="py-4 border-b border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold mb-3 text-gray-800 dark:text-gray-200">Thương hiệu</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {brands.map((brand) => (
                   <label key={brand.idThuongHieu} className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand.idThuongHieu)}
                        onChange={(e) => handleBrandChange(brand.idThuongHieu, e.target.checked)}
                        className="form-checkbox rounded text-primary focus:ring-primary/50"
                      />
                      <span>{brand.tenThuongHieu}</span>
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
                {['Eau de Parfum (EDP 5-15%)', 'Eau de Toilette (EDT 15-20%)', 'Extrait de Parfum 20-40%'].map((type) => (
                    <label key={type} className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedConcentrations.includes(type)}
                          onChange={(e) => handleConcentrationChange(type, e.target.checked)}
                          className="form-checkbox rounded text-primary focus:ring-primary/50"
                        />
                        <span>{type}</span>
                    </label>
                ))}
              </div>
            </div>

            {/* Apply Button */}
            <div className="pt-6">
              <button
                onClick={handleApplyFilters}
                className="w-full h-10 flex items-center justify-center rounded-lg bg-primary text-white text-sm font-bold hover:bg-opacity-90 transition-colors"
              >
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
              {loading ? 'Đang tải...' : error ? 'Lỗi tải sản phẩm' : `Hiển thị ${filteredProducts.length} sản phẩm`}
            </p>
            {/* BACKEND-COMMENT: Tương tự bộ lọc, việc thay đổi dropdown này sẽ cập nhật state `sortBy`.
                Ví dụ: `<select onChange={(e) => setSortBy(e.target.value)} ...>`
                Việc `setSortBy` sẽ kích hoạt `useEffect` gọi lại API với tham số `sortBy` mới.
            */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sắp xếp:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="form-select text-sm rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-gray-200 focus:border-primary focus:ring-primary/50 py-1.5 pl-3 pr-8"
              >
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
              {filteredProducts.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">Không có sản phẩm nào.</p>
                </div>
              ) : (
                filteredProducts.map((product) => (
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
