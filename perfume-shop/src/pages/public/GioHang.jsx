import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

const GioHangPage = () => {
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingItem, setUpdatingItem] = useState(null);

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setLoading(false);
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError('');
      const cartData = await api.getCart(user.id_nguoi_dung);
      setCart(cartData);
    } catch (err) {
      setError('Không thể tải giỏ hàng');
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateItemQuantity = async (sanPhamId, newQuantity) => {
    if (newQuantity < 1) {
      removeItem(sanPhamId);
      return;
    }

    try {
      setUpdatingItem(sanPhamId);
      console.log('Updating quantity to:', newQuantity);

      // Use API service method
      await api.updateCartItem(user.id_nguoi_dung, sanPhamId, newQuantity);
      await fetchCart(); // Refresh cart
    } catch (error) {
      console.error('Update quantity error:', error);
      alert('Không thể cập nhật số lượng: ' + error.message);
    } finally {
      setUpdatingItem(null);
    }
  };

  const removeItem = async (sanPhamId) => {
    try {
      setUpdatingItem(sanPhamId);

      // Use API service method
      await api.removeCartItem(user.id_nguoi_dung, sanPhamId);
      await fetchCart(); // Refresh cart
    } catch (error) {
      alert('Không thể xóa sản phẩm: ' + error.message);
    } finally {
      setUpdatingItem(null);
    }
  };

  const clearCart = async () => {
    if (!window.confirm('Bạn có chắc muốn xóa toàn bộ giỏ hàng?')) return;

    try {
      setLoading(true);
      await api.clearCart(user.id_nguoi_dung);
      setCart(null);
    } catch (error) {
      alert('Không thể xóa giỏ hàng: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    if (!cart || !cart.chiTiet) return 0;
    return cart.chiTiet.reduce((total, item) => {
      return total + (item.giaTaiThoiDiemMua * item.soLuong);
    }, 0);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Yêu cầu đăng nhập</h2>
          <p className="text-gray-600 mb-6">Vui lòng đăng nhập để xem giỏ hàng của bạn.</p>
          <Link to="/login" className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90">
            Đăng nhập
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">Lỗi tải giỏ hàng</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchCart}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  const isEmptyCart = !cart || !cart.chiTiet || cart.chiTiet.length === 0;

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-text-light dark:text-text-dark">
            Giỏ hàng của bạn
          </h1>
          {!isEmptyCart && (
            <button
              onClick={clearCart}
              className="text-red-500 hover:text-red-700 flex items-center gap-2"
            >
              <span className="material-symbols-outlined">delete_sweep</span>
              Xóa toàn bộ
            </button>
          )}
        </div>

        {isEmptyCart ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl text-gray-400">shopping_cart</span>
            </div>
            <h2 className="text-2xl font-semibold text-text-light dark:text-text-dark mb-2">
              Giỏ hàng trống
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm.
            </p>
            <Link
              to="/products"
              className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 inline-flex items-center gap-2"
            >
              <span className="material-symbols-outlined">shopping_bag</span>
              Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.chiTiet.map((item, index) => {
                const itemId = item.sanPhamId || item.idSanPham || item.id;
                return (
                  <div key={itemId || `item-${index}`} className="bg-white dark:bg-content-dark rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center gap-4">
                    {/* Product Image */}
                    <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.urlHinhAnh || "https://placehold.co/80x80?text=No+Image"}
                        alt={item.tenSanPham}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-text-light dark:text-text-dark truncate">
                        {item.tenSanPham}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Thương hiệu: {item.tenThuongHieu || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Dung tích: {item.dungTichMl}ml • Nồng độ: {item.nongDo}
                      </p>
                      <p className="text-lg font-bold text-primary mt-1">
                        {item.giaTaiThoiDiemMua.toLocaleString('vi-VN')}₫
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const newQty = Math.max(0, item.soLuong - 1);
                          updateItemQuantity(item.sanPhamId, newQty);
                        }}
                        disabled={updatingItem === item.sanPhamId}
                        className="w-8 h-8 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                      >
                        -
                      </button>
                      <span className="w-12 text-center font-medium">
                        {updatingItem === item.sanPhamId ? '...' : item.soLuong}
                      </span>
                      <button
                        onClick={() => {
                          const newQty = item.soLuong + 1;
                          updateItemQuantity(item.sanPhamId, newQty);
                        }}
                        disabled={updatingItem === item.sanPhamId}
                        className="w-8 h-8 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                      >
                        +
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right">
                      <p className="font-bold text-lg text-text-light dark:text-text-dark">
                        {(item.giaTaiThoiDiemMua * item.soLuong).toLocaleString('vi-VN')}₫
                      </p>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.sanPhamId)}
                      disabled={updatingItem === item.sanPhamId}
                      className="w-8 h-8 flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                </div>
              );
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-content-dark rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-4">
                <h3 className="text-lg font-semibold mb-4">Tóm tắt đơn hàng</h3>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span>Tạm tính ({cart.chiTiet.length} sản phẩm):</span>
                    <span className="font-medium">{calculateTotal().toLocaleString('vi-VN')}₫</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phí vận chuyển:</span>
                    <span className="font-medium">Miễn phí</span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Tổng cộng:</span>
                      <span className="text-primary">{calculateTotal().toLocaleString('vi-VN')}₫</span>
                    </div>
                  </div>
                </div>

                <Link
                  to="/thanh-toan"
                  className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary/90 transition-colors inline-flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined">shopping_cart_checkout</span>
                  Tiến hành thanh toán
                </Link>

                <div className="mt-4 text-center">
                  <Link to="/products" className="text-primary hover:underline text-sm">
                    Tiếp tục mua sắm
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GioHangPage;
