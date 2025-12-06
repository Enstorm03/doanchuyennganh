import React, { useState, useEffect } from 'react';
import api from '../../services/api';

// Modal Component
const ProductModal = ({ product, onClose, onSave, saving, categories, brands }) => {
  const [formData, setFormData] = useState(
    product ? {
      tenSanPham: product.ten_san_pham || '',
      giaBan: product.gia_ban || '',
      soLuongTonKho: product.so_luong_ton_kho || 0,
      moTa: product.mo_ta || '',
      dungTichMl: product.dung_tich_ml || '',
      nongDo: product.nong_do || '',
      idDanhMuc: product.id_danh_muc || '',
      idThuongHieu: product.id_thuong_hieu || ''
    } : {
      tenSanPham: '',
      giaBan: '',
      soLuongTonKho: 0,
      moTa: '',
      dungTichMl: '',
      nongDo: '',
      idDanhMuc: '',
      idThuongHieu: ''
    }
  );
  const [imageUrl, setImageUrl] = useState(product?.url_hinh_anh || '');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUrlChange = (e) => {
    setImageUrl(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare form data with image URL and proper category/brand objects
    const selectedCategory = categories?.find(cat => cat.idDanhMuc === parseInt(formData.idDanhMuc));
    const selectedBrand = brands?.find(br => br.idThuongHieu === parseInt(formData.idThuongHieu));

    const productData = {
      ...formData,
      urlHinhAnh: imageUrl, // Add the image URL
      danhMuc: selectedCategory || null, // Add full category object
      thuongHieu: selectedBrand || null, // Add full brand object
    };

    onSave(productData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
      <div className="bg-surface-light dark:bg-surface-dark rounded-lg shadow-xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-text-light dark:text-text-dark">
          {product ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tên sản phẩm</label>
            <input
              name="tenSanPham"
              value={formData.tenSanPham}
              onChange={handleChange}
              className="form-input w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Giá bán</label>
            <input
              name="giaBan"
              type="number"
              value={formData.giaBan}
              onChange={handleChange}
              className="form-input w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tồn kho</label>
            <input
              name="soLuongTonKho"
              type="number"
              value={formData.soLuongTonKho}
              onChange={handleChange}
              className="form-input w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Dung tích (ml)</label>
            <input
              name="dungTichMl"
              type="number"
              value={formData.dungTichMl}
              onChange={handleChange}
              className="form-input w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Nồng độ</label>
            <input
              name="nongDo"
              value={formData.nongDo}
              onChange={handleChange}
              className="form-input w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Danh mục</label>
            <select
              name="idDanhMuc"
              value={formData.idDanhMuc}
              onChange={handleChange}
              className="form-select w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark"
              required
            >
              <option value="">Chọn danh mục</option>
              {categories?.map(category => (
                <option key={category.idDanhMuc} value={category.idDanhMuc}>
                  {category.tenDanhMuc}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Thương hiệu</label>
            <select
              name="idThuongHieu"
              value={formData.idThuongHieu}
              onChange={handleChange}
              className="form-select w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark"
              required
            >
              <option value="">Chọn thương hiệu</option>
              {brands?.map(brand => (
                <option key={brand.idThuongHieu} value={brand.idThuongHieu}>
                  {brand.tenThuongHieu}
                </option>
              ))}
            </select>
          </div>
          <div>
            {/* <label className="block text-sm font-medium mb-1">URL hình ảnh sản phẩm</label>
            <input
              type="url"
              value={imageUrl}
              onChange={handleImageUrlChange}
              placeholder="http://localhost/uploads/?.png"
              className="form-input w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark"
            />
            {imageUrl && (
              <div className="mt-3">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="max-w-full h-48 object-contain rounded-lg border border-border-light dark:border-border-dark"
                  onError={(e) => {
                    e.target.src = '/placeholder-image.png'; // Fallback image
                  }}
                />
              </div>
            )} */}
            <label className="block text-sm font-medium mb-1">Hình ảnh URL</label>

<input
  type="text"
  value={imageUrl}
  onChange={handleImageUrlChange}
  placeholder="http://..."
  className="form-input w-full rounded-lg"
/>

{imageUrl && (
  <div className="mt-3">
    <img
      src={imageUrl}
      alt="Preview"
      className="max-w-full h-48 object-contain rounded-lg border"
      onError={(e) => {
        e.target.src = '/placeholder-image.png';
      }}
    />
  </div>
)}

          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Mô tả</label>
            <textarea
              name="moTa"
              value={formData.moTa}
              onChange={handleChange}
              rows={3}
              className="form-textarea w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark"
            />
          </div>
          <div className="flex justify-end gap-4 mt-4">
            <button type="button" onClick={onClose} disabled={saving} className="px-4 py-2 rounded-md text-sm font-medium bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50">Hủy</button>
            <button type="submit" disabled={saving} className="px-4 py-2 rounded-md text-sm font-medium bg-primary text-white hover:bg-primary/90 disabled:opacity-50">
              {saving ? 'Đang lưu...' : 'Lưu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Hiển thị 10 sản phẩm mỗi trang

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch products, categories, and brands in parallel
      const [productsData, categoriesData, brandsData] = await Promise.all([
        api.getAllProducts(),
        api.getCategories(),
        api.getBrands()
      ]);

      setProducts(productsData || []);
      setCategories(categoriesData || []);
      setBrands(brandsData || []);
    } catch (err) {
      setError('Không thể tải dữ liệu');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await api.getAllProducts();
      setProducts(data || []);
    } catch (err) {
      setError('Không thể tải danh sách sản phẩm');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product = null) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSaveProduct = async (productData) => {
    try {
      setSaving(true);
      if (editingProduct) {
        // Update existing product - remove IDs since we're sending full objects
        const { idDanhMuc, idThuongHieu, ...updateData } = productData;
        await api.updateProduct(editingProduct.id_san_pham, updateData);
        alert('Cập nhật sản phẩm thành công!');
        handleCloseModal();
        fetchData(); // Refresh all data
      } else {
        // Create new product - remove IDs since we're sending full objects
        const { idDanhMuc, idThuongHieu, ...createData } = productData;
        await api.createProduct(createData);
        alert('Thêm sản phẩm thành công!');
        handleCloseModal();
        fetchData(); // Refresh all data
      }
    } catch (error) {
      alert('Lỗi khi lưu sản phẩm: ' + (error.message || 'Vui lòng thử lại'));
      console.error('Error saving product:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      return;
    }

    try {
      await api.deleteProduct(productId);
      alert('Xóa sản phẩm thành công!');
      fetchProducts(); // Refresh list
    } catch (error) {
      alert('Lỗi khi xóa sản phẩm: ' + (error.message || 'Vui lòng thử lại'));
      console.error('Error deleting product:', error);
    }
  };

  // Lọc và tìm kiếm
  const filteredProducts = products
    .filter(product => {
      if (categoryFilter === 'All') return true;
      return product.ten_san_pham?.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .filter(product =>
      product.ten_san_pham?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) setCurrentPage(pageNumber);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={fetchProducts}
          className="bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center">
          <h1 className="font-semibold text-lg md:text-2xl text-text-light dark:text-text-dark">
            Quản Lý Sản Phẩm
          </h1>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center justify-center gap-2 h-9 px-4 text-sm font-medium rounded-md bg-primary text-white hover:bg-primary/90"
            >
              <span className="material-symbols-outlined text-base">add_circle</span>
              Thêm Sản Phẩm
            </button>
          </div>
        </div>

        {/* Filter and Search Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark">
          <input
            type="text"
            placeholder="Tìm theo tên sản phẩm..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="form-input w-full sm:flex-1 rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark"
          />
          <select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }} className="form-select w-full sm:w-auto rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark">
            <option value="All">Tất cả danh mục</option>
            <option value="Nước hoa nữ">Nước hoa nữ</option>
            <option value="Nước hoa nam">Nước hoa nam</option>
            <option value="Nước hoa Unisex">Nước hoa Unisex</option>
          </select>
        </div>

        <div className="rounded-xl border bg-surface-light text-card-foreground shadow border-border-light dark:border-border-dark dark:bg-surface-dark">
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b [&_tr]:border-border-light dark:[&_tr]:border-border-dark">
                <tr className="text-text-subtle-light dark:text-text-subtle-dark">
                  <th className="h-12 px-4 text-left align-middle font-medium">Tên sản phẩm</th>
                  <th className="h-12 px-4 text-left align-middle font-medium hidden md:table-cell">Trạng thái</th>
                  <th className="h-12 px-4 text-left align-middle font-medium hidden md:table-cell">Giá</th>
                  <th className="h-12 px-4 text-left align-middle font-medium hidden sm:table-cell">Tồn kho</th>
                  <th className="h-12 px-4 text-right align-middle font-medium">Hành động</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {currentProducts.map((product) => (
                  <tr key={product.id_san_pham} className="border-b border-border-light dark:border-border-dark transition-colors hover:bg-background-light dark:hover:bg-background-dark">
                    <td className="p-4 align-middle font-medium text-text-light dark:text-text-dark">{product.ten_san_pham}</td>
                    <td className="p-4 align-middle hidden md:table-cell">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        (product.so_luong_ton_kho || 0) > 0 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                      }`}>
                        {(product.so_luong_ton_kho || 0) > 0 ? 'Còn hàng' : 'Hết hàng'}
                      </span>
                    </td>
                    <td className="p-4 align-middle hidden md:table-cell text-text-subtle-light dark:text-text-subtle-dark">
                      {product.gia_ban ? product.gia_ban.toLocaleString('vi-VN') + '₫' : 'Liên hệ'}
                    </td>
                    <td className="p-4 align-middle hidden sm:table-cell text-text-subtle-light dark:text-text-subtle-dark">{product.so_luong_ton_kho || 0}</td>
                    <td className="p-4 align-middle text-right">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => handleOpenModal(product)}
                          className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
                          title="Sửa"
                        >
                          <span className="material-symbols-outlined text-lg text-blue-500">edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id_san_pham)}
                          className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
                          title="Xóa"
                        >
                          <span className="material-symbols-outlined text-lg text-red-500">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <nav aria-label="Pagination" className="flex justify-center mt-4">
            <ul className="inline-flex items-center -space-x-px text-sm">
              <li>
                <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700">
                  <span className="material-symbols-outlined text-base">chevron_left</span>
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => (
                <li key={i}>
                  <button onClick={() => paginate(i + 1)} className={`px-3 h-8 border ${currentPage === i + 1 ? 'text-white bg-primary border-primary' : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400'}`}>
                    {i + 1}
                  </button>
                </li>
              ))}
              <li>
                <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700">
                  <span className="material-symbols-outlined text-base">chevron_right</span>
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>
      {isModalOpen && (
        <ProductModal
          product={editingProduct}
          onClose={handleCloseModal}
          onSave={handleSaveProduct}
          saving={saving}
          categories={categories}
          brands={brands}
        />
      )}
    </>
  );
};

export default AdminProductsPage;
