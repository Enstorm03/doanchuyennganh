import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const POSPage = () => {
  const { staff } = useAuth();

  // Sample product data - theo schema San_Pham table với đầy đủ fields
  const [products] = useState([
    { id_san_pham: 1, ten_san_pham: "Bleu de Chanel", mo_ta: "Nước hoa nam tính", url_hinh_anh: "https://placehold.co/400x400?text=Chanel", gia_ban: 150, dung_tich_ml: 100, nong_do: "EDP", so_luong_ton_kho: 10, id_danh_muc: 1, id_thuong_hieu: 1 },
    { id_san_pham: 2, ten_san_pham: "Sauvage EDP", mo_ta: "Nước hoa nam tinh tế", url_hinh_anh: "https://placehold.co/400x400?text=Dior", gia_ban: 120, dung_tich_ml: 60, nong_do: "EDP", so_luong_ton_kho: 15, id_danh_muc: 1, id_thuong_hieu: 2 },
    { id_san_pham: 3, ten_san_pham: "Versace Eros", mo_ta: "Nước hoa quyến rũ", url_hinh_anh: "https://placehold.co/400x400?text=Versace", gia_ban: 95, dung_tich_ml: 50, nong_do: "EDT", so_luong_ton_kho: 8, id_danh_muc: 1, id_thuong_hieu: 3 },
    { id_san_pham: 4, ten_san_pham: "Tom Ford Oud Wood", mo_ta: "Nước hoa sang trọng", url_hinh_anh: "https://placehold.co/400x400?text=TomFord", gia_ban: 250, dung_tich_ml: 50, nong_do: "EDP", so_luong_ton_kho: 5, id_danh_muc: 1, id_thuong_hieu: 4 },
    { id_san_pham: 5, ten_san_pham: "Creed Aventus", mo_ta: "Nước hoa huyền thoại", url_hinh_anh: "https://placehold.co/400x400?text=Creed", gia_ban: 350, dung_tich_ml: 100, nong_do: "EDP", so_luong_ton_kho: 3, id_danh_muc: 1, id_thuong_hieu: 5 },
    { id_san_pham: 6, ten_san_pham: "Acqua di Gio", mo_ta: "Nước hoa tươi mát", url_hinh_anh: "https://placehold.co/400x400?text=Armani", gia_ban: 110, dung_tich_ml: 75, nong_do: "EDT", so_luong_ton_kho: 12, id_danh_muc: 1, id_thuong_hieu: 6 },
    { id_san_pham: 7, ten_san_pham: "YSL Y EDP", mo_ta: "Nước hoa nữ tính", url_hinh_anh: "https://placehold.co/400x400?text=YSL", gia_ban: 130, dung_tich_ml: 50, nong_do: "EDP", so_luong_ton_kho: 7, id_danh_muc: 1, id_thuong_hieu: 7 },
    { id_san_pham: 8, ten_san_pham: "Invictus", mo_ta: "Nước hoa thể thao", url_hinh_anh: "https://placehold.co/400x400?text=Paco", gia_ban: 90, dung_tich_ml: 100, nong_do: "EDT", so_luong_ton_kho: 20, id_danh_muc: 1, id_thuong_hieu: 8 },
  ]);

  // Brand and category data for display
  const brands = {
    1: "Chanel",
    2: "Dior",
    3: "Versace",
    4: "Tom Ford",
    5: "Creed",
    6: "Giorgio Armani",
    7: "YSL",
    8: "Paco Rabanne"
  };

  const categories = {
    1: "Nam giới"
  };

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

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('pos-cart', JSON.stringify(cart));
  }, [cart]);

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

  // Complete sale with database schema and payment methods
  const completeSale = () => {
    // Validation dựa trên phương thức thanh toán
    if (paymentMethod === 'cash' && cashReceivedNum < total) {
      alert('Số tiền nhận chưa đủ!');
      return;
    }

    if (paymentMethod === 'deposit') {
      const depositNum = parseFloat(depositAmount) || 0;
      if (depositNum <= 0 || depositNum >= total) {
        alert('Số tiền đặt cọc phải lớn hơn 0 và nhỏ hơn tổng tiền!');
        return;
      }
    }

    // Generate order ID
    const id_don_hang = `POS-${Date.now()}`;

    // Determine payment status and operation status based on payment method
    let trang_thai_thanh_toan, trang_thai_van_hanh, tien_dat_coc;

    switch (paymentMethod) {
      case 'cash':
        trang_thai_thanh_toan = "Da_Thanh_Toan";
        trang_thai_van_hanh = "Hoan_Thanh";
        tien_dat_coc = 0;
        break;
      case 'card':
      case 'online':
        trang_thai_thanh_toan = "Da_Thanh_Toan";
        trang_thai_van_hanh = "Hoan_Thanh";
        tien_dat_coc = total; // Thanh toán đầy đủ online
        break;
      case 'deposit':
        trang_thai_thanh_toan = "Da_Coc";
        trang_thai_van_hanh = "Cho_Hang";
        tien_dat_coc = parseFloat(depositAmount);
        break;
      default:
        trang_thai_thanh_toan = "Da_Thanh_Toan";
        trang_thai_van_hanh = "Hoan_Thanh";
        tien_dat_coc = 0;
    }

    // Create Don_Hang record theo database schema
    const donHang = {
      id_don_hang,
      id_nguoi_dung: null, // Khách vãng lai, không có tài khoản
      id_nhan_vien: staff.id_nhan_vien, // Nhân viên xử lý đơn hàng
      trang_thai_van_hanh,
      trang_thai_thanh_toan,
      tong_tien: total,
      tien_dat_coc,
      ten_khach_vang_lai,
      ngay_dat_hang: new Date().toISOString(),
      phuong_thuc_thanh_toan: paymentMethod, // Thêm field này để track phương thức
      chi_tiet_don_hang: cart.map(item => ({
        id_san_pham: item.id_san_pham,
        so_luong: item.quantity,
        gia_tai_thoi_diem_mua: item.gia_ban
      }))
    };

    // Save order to localStorage for records (FUTURE: save to database)
    const orders = JSON.parse(localStorage.getItem('pos-orders') || '[]');
    orders.push(donHang);
    localStorage.setItem('pos-orders', JSON.stringify(orders));

    // Show receipt
    setShowReceipt(true);
    clearCart();
    setShowCheckout(false);
    setten_khach_vang_lai('');
    setso_dien_thoai('');
    setCashReceived('');
    setPaymentMethod('cash');
    setDepositAmount('');
  };

  // Print receipt (mock)
  const printReceipt = () => {
    window.print();
  };

  if (showReceipt) {
    return (
      <main className="min-h-screen bg-background-light dark:bg-background-dark p-4">
        <div className="max-w-md mx-auto bg-white dark:bg-content-dark p-6 rounded-lg shadow-lg" id="receipt">
          <div className="text-center mb-4">
            <h1 className="text-2xl font-bold">CỬA HÀNG NƯỚC HOA</h1>
            <p className="text-sm text-gray-600">Đơn hàng #{Date.now()}</p>
          </div>

          <div className="mb-4">
            <p><strong>Khách hàng:</strong> {ten_khach_vang_lai}</p>
            {so_dien_thoai && <p><strong>SĐT:</strong> {so_dien_thoai}</p>}
            <p><strong>Nhân viên:</strong> {staff?.ho_ten} ({staff?.vai_tro})</p>
            <p><strong>Ngày:</strong> {new Date().toLocaleString('vi-VN')}</p>
          </div>

          <div className="border-t border-b py-2 mb-4">
            {cart.map(item => (
              <div key={item.id_san_pham} className="flex justify-between text-sm mb-1">
                <span>{item.ten_san_pham} x{item.quantity}</span>
                <span>${(item.gia_ban * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="space-y-1 text-sm mb-4">
            <div className="flex justify-between">
              <span>Tạm tính:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Thuế (10%):</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Tổng cộng:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="border-t pt-2 mb-4 text-sm">
            <div className="flex justify-between">
              <span>Số tiền nhận:</span>
              <span>${cashReceivedNum.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tiền thừa:</span>
              <span>${change.toFixed(2)}</span>
            </div>
          </div>

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
                    <span className="font-bold text-green-600">${product.gia_ban}</span>
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
                        <p className="text-xs text-gray-500">${item.gia_ban}</p>
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
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Thuế (10%):</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold border-t pt-2">
                    <span>Tổng cộng:</span>
                    <span>${total.toFixed(2)}</span>
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
                <div className="grid grid-cols-2 gap-2">
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={paymentMethod === 'cash'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-2"
                    />
                    <div>
                      <span className="font-medium">💵 Tiền mặt</span>
                      <p className="text-xs text-gray-500">Thanh toán ngay</p>
                    </div>
                  </label>

                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-2"
                    />
                    <div>
                      <span className="font-medium">💳 Thẻ</span>
                      <p className="text-xs text-gray-500">Thanh toán thẻ</p>
                    </div>
                  </label>

                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="online"
                      checked={paymentMethod === 'online'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-2"
                    />
                    <div>
                      <span className="font-medium">📱 Online</span>
                      <p className="text-xs text-gray-500">Ví điện tử/ZaloPay</p>
                    </div>
                  </label>

                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="deposit"
                      checked={paymentMethod === 'deposit'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-2"
                    />
                    <div>
                      <span className="font-medium">🏦 Đặt cọc</span>
                      <p className="text-xs text-gray-500">Đặt hàng trước</p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Tổng tiền:</span>
                  <span className="font-bold">${total.toFixed(2)}</span>
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
                        <span className="font-bold text-green-600">${change.toFixed(2)}</span>
                      </div>
                    )}
                  </>
                )}

                {paymentMethod === 'deposit' && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Số tiền đặt cọc:</label>
                    <input
                      type="number"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-primary bg-white dark:bg-background-dark"
                      step="0.01"
                      min="1"
                      max={total - 1}
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Còn lại: ${(total - parseFloat(depositAmount || 0)).toFixed(2)}
                    </p>
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
                  disabled={
                    paymentMethod === 'cash' && cashReceivedNum < total ||
                    paymentMethod === 'deposit' && (!depositAmount || parseFloat(depositAmount) <= 0)
                  }
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
