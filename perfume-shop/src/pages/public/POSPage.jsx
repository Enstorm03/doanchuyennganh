import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

const POSPage = () => {
  const { staff } = useAuth();

  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('pos-cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [showCheckout, setShowCheckout] = useState(false);
  const [ten_khach_vang_lai, setten_khach_vang_lai] = useState('');
  const [so_dien_thoai, setso_dien_thoai] = useState('');
  const [cashReceived, setCashReceived] = useState('');
  const [showReceipt, setShowReceipt] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash'); // 'cash', 'card', 'online'
  const [depositAmount, setDepositAmount] = useState('');

  // Load products and brands on component mount
  useEffect(() => {
    loadProductsAndBrands();
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('pos-cart', JSON.stringify(cart));
  }, [cart]);

  const loadProductsAndBrands = async () => {
    try {
      setLoading(true);
      setError('');

      // Load products and brands in parallel
      const [productsData, brandsData] = await Promise.all([
        api.getAllProducts(),
        api.getBrands()
      ]);

      // Create brand mapping
      const brandMap = {};
      brandsData.forEach(brand => {
        brandMap[brand.idThuongHieu] = brand.tenThuongHieu;
      });

      setProducts(productsData);
      setBrands(brandMap);
    } catch (err) {
      setError('Không thể tải dữ liệu sản phẩm');
      console.error('Error loading products/brands:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add product to cart with database field names
  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id_san_pham === product.id_san_pham);
      if (existingItem && existingItem.quantity < product.so_luong_ton_kho) {
        return prevCart.map(item =>
          item.id_san_pham === product.id_san_pham
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else if (!existingItem) {
        return [...prevCart, { ...product, quantity: 1 }];
      }
      return prevCart;
    });
  };

  // Update quantity in cart
  const updateQuantity = (id_san_pham, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(id_san_pham);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item => {
        if (item.id_san_pham === id_san_pham) {
          const maxQuantity = item.so_luong_ton_kho || 10;
          return {
            ...item,
            quantity: Math.min(newQuantity, maxQuantity)
          };
        }
        return item;
      })
    );
  };

  // Remove item from cart
  const removeFromCart = (id_san_pham) => {
    setCart(prevCart => prevCart.filter(item => item.id_san_pham !== id_san_pham));
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('pos-cart');
  };

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + (item.gia_ban * item.quantity), 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  // Calculate change
  const cashReceivedNum = parseFloat(cashReceived) || 0;
  const change = cashReceivedNum - total;

  // Filter products by search (simple implementation)
  const [searchTerm, setSearchTerm] = useState('');
  const filteredProducts = products.filter(product =>
    product.ten_san_pham.toLowerCase().includes(searchTerm.toLowerCase()) ||
    brands[product.id_thuong_hieu]?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle checkout with database validation
  const handleCheckout = () => {
    if (cart.length === 0) return;

    if (!ten_khach_vang_lai.trim()) {
      alert('Vui lòng nhập tên khách hàng');
      return;
    }

    if (!staff) {
      alert('Chỉ nhân viên mới được phép sử dụng POS');
      return;
    }

    setShowCheckout(true);
  };

  // Complete sale with backend API integration
  const completeSale = async () => {
    // Validation dựa trên phương thức thanh toán
    if (paymentMethod === 'cash' && cashReceivedNum < total) {
      alert('Số tiền nhận chưa đủ!');
      return;
    }

    // No validation needed for deposit - backend auto-calculates 50%

    try {
      // Debug: Check staff data
      console.log('Staff data:', staff);
      console.log('Staff ID:', staff?.id_nhan_vien);

      // Prepare items data for backend - matching ItemInput format
      const itemsInput = cart.map(item => ({
        sanPhamId: item.id_san_pham,
        soLuong: item.quantity,
        gia: item.gia_ban
      }));

      console.log('Items input:', itemsInput);
      console.log('Payment method:', paymentMethod);
      console.log('Customer name:', ten_khach_vang_lai);

      let orderData;

      // Call appropriate backend POS API based on payment method
      if (paymentMethod === 'deposit') {
        // Use POS Order API (deposit - 50% payment, wait for stock)
        console.log('Calling createPosOrder with params:', {
          employeeId: staff?.id_nhan_vien,
          customerId: null,
          customerName: ten_khach_vang_lai,
          items: itemsInput
        });
        orderData = await api.createPosOrder(
          staff?.id_nhan_vien,
          null, // No customer ID for walk-in customers
          ten_khach_vang_lai,
          itemsInput
        );
      } else {
        // Use POS Sale API (full payment, complete immediately)
        console.log('Calling createPosBanLe with params:', {
          employeeId: staff?.id_nhan_vien,
          customerId: null,
          customerName: ten_khach_vang_lai,
          items: itemsInput
        });
        orderData = await api.createPosBanLe(
          staff?.id_nhan_vien,
          null, // No customer ID for walk-in customers
          ten_khach_vang_lai,
          itemsInput
        );
      }

      console.log('Order created successfully:', orderData);

      // Show receipt with order data
      setShowReceipt(true);
      clearCart();
      setShowCheckout(false);
      setten_khach_vang_lai('');
      setso_dien_thoai('');
      setCashReceived('');
      setPaymentMethod('cash');
      setDepositAmount('');

      alert('Đơn hàng đã được tạo thành công!');

    } catch (error) {
      console.error('Error creating POS order:', error);
      alert('Không thể tạo đơn hàng: ' + error.message);
    }
  };

  // Print receipt (mock)
  const printReceipt = () => {
    window.print();
  };

  // Show loading state while fetching data
  if (loading) {
    return (
      <main className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Đang tải dữ liệu sản phẩm...</p>
        </div>
      </main>
    );
  }

  // Show error state
  if (error) {
    return (
      <main className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <h2 className="text-xl font-bold text-red-600 mb-4">Không thể tải dữ liệu</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadProductsAndBrands}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
          >
            Thử lại
          </button>
        </div>
      </main>
    );
  }

  if (showReceipt) {
    const isDepositOrder = paymentMethod === 'deposit';

    return (
      <main className="min-h-screen bg-background-light dark:bg-background-dark p-4">
        <div className="max-w-md mx-auto bg-white dark:bg-content-dark p-6 rounded-lg shadow-lg" id="receipt">
          <div className="text-center mb-4">
            <h1 className="text-2xl font-bold text-primary">CỬA HÀNG NƯỚC HOA</h1>
            <p className="text-sm text-gray-600">Đơn hàng #{Date.now()}</p>
          </div>

          <div className="mb-4">
            <p><strong>Khách hàng:</strong> {ten_khach_vang_lai}</p>
            {so_dien_thoai && <p><strong>SĐT:</strong> {so_dien_thoai}</p>}
            <p><strong>Nhân viên:</strong> {staff?.ho_ten} ({staff?.vai_tro})</p>
            <p><strong>Ngày:</strong> {new Date().toLocaleString('vi-VN')}</p>
            <p><strong>Loại:</strong>
              <span className={isDepositOrder ? "text-orange-600 font-bold" : "text-green-600 font-bold"}>
                {isDepositOrder ? " ĐẶT CỌC 50%" : " THANH TOÁN ĐẦY ĐỦ"}
              </span>
            </p>
          </div>

          <div className="border-t border-b py-2 mb-4">
            {cart.map(item => (
              <div key={item.id_san_pham} className="flex justify-between text-sm mb-1">
                <span>{item.ten_san_pham} x{item.quantity}</span>
                <span>{(item.gia_ban * item.quantity).toLocaleString('vi-VN')}₫</span>
              </div>
            ))}
          </div>

          <div className="space-y-1 text-sm mb-4">
            <div className="flex justify-between">
              <span>Tạm tính:</span>
              <span>{subtotal.toLocaleString('vi-VN')}₫</span>
            </div>
            <div className="flex justify-between">
              <span>Thuế (10%):</span>
              <span>{tax.toLocaleString('vi-VN')}₫</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Tổng cộng:</span>
              <span>{total.toLocaleString('vi-VN')}₫</span>
            </div>
          </div>

          {/* Payment details based on method */}
          {isDepositOrder ? (
            <div className="border-t pt-2 mb-4 text-sm bg-orange-50 dark:bg-orange-900/20 p-3 rounded">
              <div className="flex justify-between font-bold text-orange-700 dark:text-orange-300">
                <span>Đặt cọc (50%):</span>
                <span>{(total * 0.5).toLocaleString('vi-VN')}₫</span>
              </div>
              <div className="flex justify-between text-orange-600 dark:text-orange-400">
                <span>Còn lại:</span>
                <span>{(total * 0.5).toLocaleString('vi-VN')}₫</span>
              </div>
              <p className="text-xs text-orange-600 mt-1">
                🏦 Hàng sẽ về sau 7-10 ngày. Nhân viên sẽ liên hệ thu phần còn lại.
              </p>
            </div>
          ) : paymentMethod === 'cash' ? (
            <div className="border-t pt-2 mb-4 text-sm">
              <div className="flex justify-between">
                <span>Số tiền nhận:</span>
                <span>{cashReceivedNum.toLocaleString('vi-VN')}₫</span>
              </div>
              <div className="flex justify-between text-green-600 font-bold">
                <span>Tiền thừa:</span>
                <span>{change.toLocaleString('vi-VN')}₫</span>
              </div>
            </div>
          ) : (
            <div className="border-t pt-2 mb-4 text-sm bg-green-50 dark:bg-green-900/20 p-3 rounded">
              <div className="flex justify-between font-bold text-green-700 dark:text-green-300">
                <span>Thanh toán:</span>
                <span>{total.toLocaleString('vi-VN')}₫</span>
              </div>
              <p className="text-xs text-green-600 mt-1">
                {paymentMethod === 'card' ? '💳 Thanh toán bằng thẻ tín dụng' : '📱 Thanh toán bằng ví điện tử'}
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={printReceipt}
              className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              In hóa đơn
            </button>
            <button
              onClick={() => setShowReceipt(false)}
              className="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600"
            >
              Bán hàng mới
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background-light dark:bg-background-dark">
      <div className="container mx-auto p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">POS - Bán hàng tại quầy</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Nhân viên: {staff?.ho_ten} ({staff?.vai_tro})
            </p>
          </div>
          <Link
            to="/admin"
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
          >
            Quay về Admin
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Products Section */}
          <div className="lg:col-span-2">
            {/* Search */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm theo tên hoặc thương hiệu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-content-dark"
              />
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id_san_pham}
                  className="bg-white dark:bg-content-dark p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => addToCart(product)}
                >
                  <div className="w-full h-32 bg-center bg-cover rounded mb-3" style={{ backgroundImage: `url("${product.url_hinh_anh}")` }}></div>
                  <h3 className="font-semibold text-sm mb-1 truncate">{product.ten_san_pham}</h3>
                  <p className="text-xs text-gray-500 mb-2">{brands[product.id_thuong_hieu]}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-green-600">{product.gia_ban.toLocaleString('vi-VN')}₫</span>
                    <span className="text-xs text-gray-500">Còn {product.so_luong_ton_kho}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Section */}
          <div className="space-y-4">
            {/* Customer Info - theo schema database */}
            <div className="bg-white dark:bg-content-dark p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-3">Thông tin khách hàng (Vãng lai)</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Tên khách"
                  value={ten_khach_vang_lai}
                  onChange={(e) => setten_khach_vang_lai(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-primary bg-white dark:bg-background-dark"
                  required
                />
                <input
                  type="tel"
                  placeholder="Số điện thoại (tùy chọn)"
                  value={so_dien_thoai}
                  onChange={(e) => setso_dien_thoai(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-primary bg-white dark:bg-background-dark"
                />
              </div>
            </div>

            {/* Cart Items */}
            <div className="bg-white dark:bg-content-dark p-4 rounded-lg shadow-sm flex-1">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold">Giỏ hàng ({cart.length} sản phẩm)</h3>
                {cart.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-red-500 text-sm hover:text-red-700"
                  >
                    Xóa tất cả
                  </button>
                )}
              </div>

              <div className="max-h-64 overflow-y-auto space-y-2">
                {cart.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">Chưa có sản phẩm nào</p>
                ) : (
                  cart.map((item) => (
                    <div key={item.id_san_pham} className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex-1">
                        <p className="font-medium text-sm truncate">{item.ten_san_pham}</p>
                        <p className="text-xs text-gray-500">{item.gia_ban.toLocaleString('vi-VN')}₫</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id_san_pham, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full text-sm hover:bg-gray-300"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id_san_pham, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full text-sm hover:bg-gray-300"
                          disabled={item.quantity >= item.so_luong_ton_kho}
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id_san_pham)}
                          className="w-6 h-6 flex items-center justify-center bg-red-100 text-red-600 rounded-full text-sm hover:bg-red-200 ml-1"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Totals and Checkout */}
            {cart.length > 0 && (
              <div className="bg-white dark:bg-content-dark p-4 rounded-lg shadow-sm">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Tạm tính:</span>
                    <span>{subtotal.toLocaleString('vi-VN')}₫</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Thuế (10%):</span>
                    <span>{tax.toLocaleString('vi-VN')}₫</span>
                  </div>
                  <div className="flex justify-between font-bold border-t pt-2">
                    <span>Tổng cộng:</span>
                    <span>{total.toLocaleString('vi-VN')}₫</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors mt-4"
                >
                  Thanh toán
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Checkout Modal */}
        {showCheckout && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-content-dark p-6 rounded-lg shadow-xl max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">Xác nhận thanh toán</h3>

              {/* Payment Method Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Phương thức thanh toán:</label>
                <div className="grid grid-cols-1 gap-3">
                  <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={paymentMethod === 'cash'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3 w-4 h-4"
                    />
                    <div>
                      <span className="font-medium text-lg">💵 Tiền mặt</span>
                      <p className="text-sm text-gray-500">Thanh toán ngay - hoàn thành đơn hàng</p>
                    </div>
                  </label>

                  <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3 w-4 h-4"
                    />
                    <div>
                      <span className="font-medium text-lg">💳 Thẻ tín dụng</span>
                      <p className="text-sm text-gray-500">Thanh toán thẻ - hoàn thành đơn hàng</p>
                    </div>
                  </label>

                  <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="online"
                      checked={paymentMethod === 'online'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3 w-4 h-4"
                    />
                    <div>
                      <span className="font-medium text-lg">📱 Ví điện tử</span>
                      <p className="text-sm text-gray-500">ZaloPay, MoMo - hoàn thành đơn hàng</p>
                    </div>
                  </label>

                  <label className="flex items-center p-4 border-2 border-orange-300 bg-orange-50 dark:bg-orange-900/20 rounded-lg cursor-pointer hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="deposit"
                      checked={paymentMethod === 'deposit'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3 w-4 h-4"
                    />
                    <div>
                      <span className="font-bold text-lg text-orange-600">🏦 ĐẶT CỌC 50%</span>
                      <p className="text-sm text-orange-700 dark:text-orange-300">Đặt hàng trước - thanh toán 50% - chờ hàng về</p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Tổng tiền:</span>
                  <span className="font-bold">{total.toLocaleString('vi-VN')}₫</span>
                </div>

                {/* Conditional Fields Based on Payment Method */}
                {paymentMethod === 'cash' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-1">Số tiền nhận:</label>
                      <input
                        type="number"
                        value={cashReceived}
                        onChange={(e) => setCashReceived(e.target.value)}
                        placeholder="0.00"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-primary bg-white dark:bg-background-dark"
                        step="0.01"
                        min={total}
                        required
                      />
                    </div>

                    {cashReceivedNum >= total && (
                      <div className="flex justify-between text-sm">
                        <span>Tiền thừa:</span>
                        <span className="font-bold text-green-600">{change.toLocaleString('vi-VN')}₫</span>
                      </div>
                    )}
                  </>
                )}

                {paymentMethod === 'deposit' && (
                  <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-orange-800 dark:text-orange-200">Đặt cọc (50%):</span>
                      <span className="font-bold text-orange-900 dark:text-orange-100">{(total * 0.5).toLocaleString('vi-VN')}₫</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-orange-700 dark:text-orange-300">Còn lại:</span>
                      <span className="font-semibold text-orange-800 dark:text-orange-200">{(total * 0.5).toLocaleString('vi-VN')}₫</span>
                    </div>
                  </div>
                )}

                {(paymentMethod === 'card' || paymentMethod === 'online') && (
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                    <p className="text-sm text-green-800 dark:text-green-200">
                      ✅ Thanh toán đầy đủ bằng {paymentMethod === 'card' ? 'thẻ' : 'ví điện tử'}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowCheckout(false)}
                  className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
                >
                  Hủy
                </button>
                <button
                  onClick={completeSale}
                  disabled={paymentMethod === 'cash' && cashReceivedNum < total}
                  className="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
                >
                  Hoàn thành
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default POSPage;
