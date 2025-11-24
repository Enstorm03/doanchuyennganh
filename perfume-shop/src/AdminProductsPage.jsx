import React, { useState } from 'react';

const mockProducts = [
  {
    id: 'prod_1',
    name: 'Chanel N°5',
    category: 'Nước hoa nữ',
    price: '3,500,000đ',
    stock: 150,
    status: 'Còn hàng',
  },
  {
    id: 'prod_2',
    name: 'Dior Sauvage',
    category: 'Nước hoa nam',
    price: '2,800,000đ',
    stock: 80,
    status: 'Còn hàng',
  },
  {
    id: 'prod_3',
    name: 'Creed Aventus',
    category: 'Nước hoa nam',
    price: '7,200,000đ',
    stock: 0,
    status: 'Hết hàng',
  },
  {
    id: 'prod_4',
    name: 'Tom Ford Black Orchid',
    category: 'Nước hoa Unisex',
    price: '4,100,000đ',
    stock: 45,
    status: 'Còn hàng',
  },
];

// Modal Component
const ProductModal = ({ product, onClose, onSave }) => {
  const [formData, setFormData] = useState(
    product || {
      name: '',
      category: '',
      price: '',
      stock: 0,
      status: 'Còn hàng',
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
      <div className="bg-surface-light dark:bg-surface-dark rounded-lg shadow-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-text-light dark:text-text-dark">
          {product ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input name="name" value={formData.name} onChange={handleChange} placeholder="Tên sản phẩm" className="form-input w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark" required />
          <input name="category" value={formData.category} onChange={handleChange} placeholder="Danh mục" className="form-input w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark" required />
          <input name="price" value={formData.price} onChange={handleChange} placeholder="Giá" className="form-input w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark" required />
          <input name="stock" type="number" value={formData.stock} onChange={handleChange} placeholder="Tồn kho" className="form-input w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark" required />
          <select name="status" value={formData.status} onChange={handleChange} className="form-select w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark">
            <option>Còn hàng</option>
            <option>Hết hàng</option>
          </select>
          <div className="flex justify-end gap-4 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md text-sm font-medium bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600">Hủy</button>
            <button type="submit" className="px-4 py-2 rounded-md text-sm font-medium bg-primary text-white hover:bg-primary/90">Lưu</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AdminProductsPage = () => {
  const [products, setProducts] = useState(mockProducts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const handleOpenModal = (product = null) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSaveProduct = (productData) => {
    if (editingProduct) {
      // Update
      setProducts(products.map(p => p.id === editingProduct.id ? { ...p, ...productData } : p));
    } else {
      // Add new
      const newProduct = { ...productData, id: `prod_${Date.now()}` };
      setProducts([newProduct, ...products]);
    }
    handleCloseModal();
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      setProducts(products.filter(p => p.id !== productId));
    }
  };

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
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-border-light dark:border-border-dark transition-colors hover:bg-background-light dark:hover:bg-background-dark">
                    <td className="p-4 align-middle font-medium text-text-light dark:text-text-dark">{product.name}</td>
                    <td className="p-4 align-middle hidden md:table-cell">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        product.status === 'Còn hàng' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="p-4 align-middle hidden md:table-cell text-text-subtle-light dark:text-text-subtle-dark">{product.price}</td>
                    <td className="p-4 align-middle hidden sm:table-cell text-text-subtle-light dark:text-text-subtle-dark">{product.stock}</td>
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
                          onClick={() => handleDeleteProduct(product.id)}
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
      </div>
      {isModalOpen && (
        <ProductModal 
          product={editingProduct} 
          onClose={handleCloseModal} 
          onSave={handleSaveProduct} 
        />
      )}
    </>
  );
};

export default AdminProductsPage;