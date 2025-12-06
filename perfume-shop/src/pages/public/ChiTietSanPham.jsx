import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

// Breadcrumbs Component
const Breadcrumbs = ({ productName }) => (
  <nav className="mb-8">
    <ol className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
      <li><a href="/" className="hover:text-primary">Trang chủ</a></li>
      <li><span className="material-symbols-outlined text-xs">chevron_right</span></li>
      <li><a href="/products" className="hover:text-primary">Sản phẩm</a></li>
      <li><span className="material-symbols-outlined text-xs">chevron_right</span></li>
      <li className="text-gray-900 dark:text-gray-100 font-medium">{productName}</li>
    </ol>
  </nav>
);

// ProductSpecs Component
const ProductSpecs = ({ product, brandName, isOutOfStock }) => (
  <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
    <div className="flex items-center gap-2">
      <span className="material-symbols-outlined text-sm text-gray-500">local_shipping</span>
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wide">Vận chuyển</p>
        <p className="text-sm font-medium">Miễn phí giao hàng</p>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <span className="material-symbols-outlined text-sm text-gray-500">verified</span>
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wide">Bảo hành</p>
        <p className="text-sm font-medium">12 tháng</p>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <span className="material-symbols-outlined text-sm text-gray-500">local_mall</span>
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wide">Thương hiệu</p>
        <p className="text-sm font-medium">{brandName}</p>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <span className="material-symbols-outlined text-sm text-gray-500">science</span>
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wide">Nồng độ</p>
        <p className="text-sm font-medium">{product.nong_do}</p>
      </div>
    </div>
  </div>
);

// ActionButton Component
const ActionButton = ({ onClick, loading, variant, children, ...props }) => {
  const baseClasses = "px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50";
  const variants = {
    primary: "bg-primary text-white hover:bg-primary/90",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white",
    warning: "bg-orange-500 text-white hover:bg-orange-600"
  };

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`${baseClasses} ${variants[variant]}`}
      {...props}
    >
      {loading ? 'Đang xử lý...' : children}
    </button>
  );
};

// ServiceFeatures Component
const ServiceFeatures = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
    <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
      <span className="material-symbols-outlined text-2xl text-primary">local_shipping</span>
      <div>
        <h4 className="font-semibold">Giao hàng tận nơi</h4>
        <p className="text-sm text-gray-600 dark:text-gray-400"></p>
      </div>
    </div>
    <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
      <span className="material-symbols-outlined text-2xl text-primary">security</span>
      <div>
        <h4 className="font-semibold">Bảo mật thanh toán</h4>
        <p className="text-sm text-gray-600 dark:text-gray-400"></p>
      </div>
    </div>
    <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
      <span className="material-symbols-outlined text-2xl text-primary">support_agent</span>
      <div>
        <h4 className="font-semibold">Hỗ trợ 24/7</h4>
        <p className="text-sm text-gray-600 dark:text-gray-400"></p>
      </div>
    </div>
  </div>
);

const ChiTietSanPham = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [brandDetails, setBrandDetails] = useState({});
  const [cartLoading, setCartLoading] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    fetchProductDetail();
    fetchBrands();
  }, [id]);

  const fetchProductDetail = async () => {
    try {
      setLoading(true);
      setError('');
      const productData = await api.getProductById(parseInt(id));
      setProduct(productData);
      await fetchRelatedProducts(productData.id_thuong_hieu);
    } catch (err) {
      setError('Không thể tải thông tin sản phẩm');
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBrands = async () => {
    try {
      const brands = await api.getBrands();
      const brandMap = {};
      brands.forEach(brand => {
        brandMap[brand.idThuongHieu] = brand.tenThuongHieu;
      });
      setBrandDetails(brandMap);
    } catch (err) {
      console.error('Error fetching brands:', err);
    }
  };

  const fetchRelatedProducts = async (brandId) => {
    try {
      const allProducts = await api.getAllProducts();
      const related = allProducts
        .filter(p => p.id_thuong_hieu === brandId && p.id_san_pham !== parseInt(id))
        .slice(0, 4)
        .map(p => ({
          id_san_pham: p.id_san_pham,
          ten_san_pham: p.ten_san_pham,
          gia_ban: p.gia_ban,
          url_hinh_anh: p.url_hinh_anh,
          so_luong_ton_kho: p.so_luong_ton_kho
        }));
      setRelatedProducts(related);
    } catch (err) {
      console.error('Error fetching related products:', err);
    }
  };

  const processCartAction = async (actionType) => {
    if (!user) {
      alert('Vui lòng đăng nhập để thực hiện thao tác này');
      return;
    }

    if (quantity > product.so_luong_ton_kho) {
      alert('Số lượng vượt quá tồn kho');
      return;
    }

    try {
      setCartLoading(true);

      if (actionType === 'add_to_cart') {
        await api.addCartItem({
          userId: user.id_nguoi_dung,
          sanPhamId: product.id_san_pham,
          soLuong: quantity
        });
        alert('Đã thêm sản phẩm vào giỏ hàng!');
      } else if (actionType === 'buy_now') {
        // Add to cart first, then redirect to checkout
        await api.addCartItem({
          userId: user.id_nguoi_dung,
          sanPhamId: product.id_san_pham,
          soLuong: quantity
        });
        navigate('/thanh-toan');
      } else if (actionType === 'pre_order') {
        const preOrderData = {
          isPreOrder: true,
          items: [{
            id_san_pham: product.id_san_pham,
            ten_san_pham: product.ten_san_pham,
            url_hinh_anh: product.url_hinh_anh,
            gia_ban: product.gia_ban,
            quantity: 1
          }],
          paymentMethod: 'deposit',
          depositAmount: product.gia_ban * 0.5,
          total: product.gia_ban,
          ghiChu: `Đặt hàng trước - ${product.ten_san_pham}`
        };

        localStorage.setItem('pre-order-data', JSON.stringify(preOrderData));
        navigate('/thanh-toan');
      }
    } catch (error) {
      console.error('Cart action error:', error);
      alert('Không thể thực hiện thao tác: ' + error.message);
    } finally {
      setCartLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">Không tìm thấy sản phẩm</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <a href="/" className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90">
            Về trang chủ
          </a>
        </div>
      </div>
    );
  }

  const isOutOfStock = product.so_luong_ton_kho === 0;
  const brandName = brandDetails[product.id_thuong_hieu] || 'N/A';

  return (
    <main className="px-4 sm:px-6 md:px-10 lg:px-20 py-5 sm:py-8 flex flex-1 justify-center min-h-screen bg-background-light dark:bg-background-dark">
      <div className="layout-content-container flex flex-col w-full max-w-6xl flex-1">

        {/* Breadcrumbs */}
        <Breadcrumbs productName={product.ten_san_pham} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 px-4">
          {/* Image Section */}
          <div className="w-full bg-surface-light dark:bg-surface-dark rounded-xl overflow-hidden shadow-sm p-4">
             <img
              src={product.url_hinh_anh || "https://placehold.co/600x800?text=No+Image"}
              alt={product.ten_san_pham}
              className="w-full h-auto object-cover rounded-lg aspect-[3/4]"
            />
          </div>

          {/* Info Section */}
          <div className="flex flex-col gap-6 py-4">
            <div>
              <h2 className="text-sm font-medium text-primary uppercase tracking-wide">
                {brandName}
              </h2>
              <h1 className="text-3xl md:text-4xl font-black text-text-light dark:text-text-dark mt-2">
                {product.ten_san_pham}
              </h1>
            </div>

            <p className="text-3xl font-bold text-primary">
              {product.gia_ban ? product.gia_ban.toLocaleString('vi-VN') : 'Liên hệ'}₫
            </p>

            {/* Quantity Selector */}
            {!isOutOfStock && (
              <div className="flex items-center gap-4 py-4">
                <label className="font-medium">Số lượng:</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded border border-border-light dark:border-border-dark flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <span className="material-symbols-outlined text-sm">remove</span>
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={product.so_luong_ton_kho || 999}
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 1;
                      setQuantity(Math.max(1, Math.min(val, product.so_luong_ton_kho || 999)));
                    }}
                    className="w-16 text-center px-2 py-1 border border-border-light dark:border-border-dark rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    onClick={() => setQuantity(Math.min(product.so_luong_ton_kho || 999, quantity + 1))}
                    className="w-8 h-8 rounded border border-border-light dark:border-border-dark flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <span className="material-symbols-outlined text-sm">add</span>
                  </button>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  (Còn {product.so_luong_ton_kho || 0} sản phẩm)
                </span>
              </div>
            )}

            <ProductSpecs product={product} brandName={brandName} isOutOfStock={isOutOfStock} />

            {product.mo_ta && (
              <div>
                <h3 className="text-lg font-bold mb-2">Mô tả sản phẩm</h3>
                <p className="text-text-subtle-light dark:text-text-subtle-dark leading-relaxed whitespace-pre-line">
                  {product.mo_ta}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            {!isOutOfStock ? (
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <ActionButton
                  onClick={() => processCartAction('add_to_cart')}
                  loading={cartLoading}
                  variant="primary"
                >
                  Thêm vào giỏ hàng
                </ActionButton>
                <ActionButton
                  onClick={() => processCartAction('buy_now')}
                  loading={cartLoading}
                  variant="outline"
                >
                  Thanh toán ngay
                </ActionButton>
              </div>
            ) : (
              <div className="mt-4">
                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3 mb-4">
                  <p className="text-sm text-orange-800 dark:text-orange-200 font-medium">
                    🚚 Hàng sẽ về sau 7-10 ngày
                  </p>
                  <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">
                    Cần thanh toán 50% tiền cọc để xác nhận đặt hàng
                  </p>
                </div>
                <ActionButton
                  onClick={() => processCartAction('pre_order')}
                  loading={cartLoading}
                  variant="warning"
                >
                  Đặt hàng trước
                </ActionButton>
              </div>
            )}

            <ServiceFeatures />
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 px-4">
            <h2 className="text-2xl font-bold mb-8 text-center">Sản phẩm cùng thương hiệu</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <div
                  key={p.id_san_pham}
                  className="bg-white dark:bg-surface-dark rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/product/${p.id_san_pham}`)}
                >
                  <img
                    src={p.url_hinh_anh || "https://placehold.co/200x200?text=No+Image"}
                    alt={p.ten_san_pham}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-sm mb-2 line-clamp-2">{p.ten_san_pham}</h3>
                    <p className="text-primary font-bold">{p.gia_ban.toLocaleString('vi-VN')}₫</p>
                    <p className="text-xs text-gray-500 mt-1">Còn {p.so_luong_ton_kho || 0} sản phẩm</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

export default ChiTietSanPham;
