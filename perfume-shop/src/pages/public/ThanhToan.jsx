import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

const ThanhToanPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [preOrderData, setPreOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);

  // Form data
  const [shippingInfo, setShippingInfo] = useState({
    tenNguoiNhan: '',
    diaChiGiaoHang: '',
    soDienThoai: '',
    ghiChu: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('cod'); // cod, online, card

  useEffect(() => {
    const loadCheckoutData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // First, try to fetch cart data
        const cartData = await api.getCart(user.id_nguoi_dung);

        if (cartData && cartData.chiTiet && cartData.chiTiet.length > 0) {
          // User has cart items - proceed with cart checkout
          setCart(cartData);
          setPreOrderData(null); // Ensure no pre-order data interferes
          setLoading(false);
        } else {
          // No cart items - check for pre-order data
          const savedPreOrderData = localStorage.getItem('pre-order-data');
          if (savedPreOrderData) {
            try {
              const preOrder = JSON.parse(savedPreOrderData);
              setPreOrderData(preOrder);
              setPaymentMethod(preOrder.paymentMethod || 'deposit');
            } catch (error) {
              console.error('Error parsing pre-order data:', error);
              localStorage.removeItem('pre-order-data');
            }
          }
          setLoading(false);
        }
      } catch (error) {
        console.error('Error loading checkout data:', error);
        setError('Không thể tải dữ liệu thanh toán');
        setLoading(false);
      }
    };

    loadCheckoutData();
  }, [user]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError('');
      const cartData = await api.getCart(user.id_nguoi_dung);

      if (!cartData || !cartData.chiTiet || cartData.chiTiet.length === 0) {
        navigate('/cart');
        return;
      }

      setCart(cartData);
    } catch (err) {
      setError('Không thể tải giỏ hàng');
      console.error('Error fetching cart:', err);
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

  const handleShippingInfoChange = (field, value) => {
    setShippingInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!shippingInfo.tenNguoiNhan.trim()) {
      alert('Vui lòng nhập tên người nhận');
      return false;
    }

    if (!shippingInfo.diaChiGiaoHang.trim()) {
      alert('Vui lòng nhập địa chỉ giao hàng');
      return false;
    }

    if (!shippingInfo.soDienThoai.trim()) {
      alert('Vui lòng nhập số điện thoại');
      return false;
    }

    // Phone number validation
   

    return true;
  };

  const handleSubmitOrder = async () => {
    if (!validateForm()) return;

    try {
      setProcessing(true);

      let result;

      if (preOrderData) {
        // Handle pre-order
        const preOrderPayload = {
          idNguoiDung: user.id_nguoi_dung,
          tenNguoiNhan: shippingInfo.tenNguoiNhan.trim(),
          diaChiGiaoHang: shippingInfo.diaChiGiaoHang.trim(),
          soDienThoai: shippingInfo.soDienThoai.trim(),
          ghiChu: preOrderData.ghiChu || shippingInfo.ghiChu.trim(),
          phuongThucThanhToan: paymentMethod,
          items: preOrderData.items.map(item => ({
            sanPhamId: item.id_san_pham,
            soLuong: item.quantity,
            giaTaiThoiDiemMua: item.gia_ban
          }))
        };

        result = await api.placeOrder(preOrderPayload);

        // Clear pre-order data
        localStorage.removeItem('pre-order-data');
      } else {
        // Handle regular cart checkout
        console.log('User object:', user);
        console.log('User ID:', user?.id_nguoi_dung);

        const orderData = {
          userId: user?.id_nguoi_dung,
          tenNguoiNhan: shippingInfo.tenNguoiNhan.trim(),
          diaChiGiaoHang: shippingInfo.diaChiGiaoHang.trim(),
          soDienThoai: shippingInfo.soDienThoai.trim(),
          ghiChu: shippingInfo.ghiChu.trim(),
          phuongThucThanhToan: paymentMethod
        };

        console.log('Order data to send:', orderData);

        result = await api.checkoutCart(orderData);
      }

      // Redirect to order success page or show success message
      alert('Đặt hàng thành công! Mã đơn hàng: ' + result.idDonHang);
      navigate('/lich-su-don-hang');

    } catch (error) {
      alert('Không thể đặt hàng: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Yêu cầu đăng nhập</h2>
          <p className="text-gray-600 mb-6">Vui lòng đăng nhập để thanh toán.</p>
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
          <h2 className="text-xl font-bold text-red-600 mb-4">Lỗi tải dữ liệu</h2>
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

  // Check if we have either cart items or pre-order data
  const hasItems = (preOrderData && preOrderData.items && preOrderData.items.length > 0) ||
                   (cart && cart.chiTiet && cart.chiTiet.length > 0);

  if (!hasItems) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">Không có sản phẩm để thanh toán</h2>
          <p className="text-gray-600 mb-6">Vui lòng chọn sản phẩm trước khi thanh toán.</p>
          <Link to="/products" className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90">
            Mua sắm ngay
          </Link>
        </div>
      </div>
    );
  }

  const isPreOrder = !!preOrderData;
  const itemsToShow = preOrderData ? preOrderData.items : cart.chiTiet;
  const totalAmount = preOrderData ? preOrderData.total : calculateTotal();

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link to={isPreOrder ? `/product/${preOrderData.items[0]?.id_san_pham}` : "/cart"} className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h1 className="text-3xl font-bold text-text-light dark:text-text-dark">
            {isPreOrder ? 'Đặt hàng trước' : 'Thanh toán'}
          </h1>
        </div>

        {isPreOrder && (
          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-orange-600">🛒</span>
              <h3 className="font-medium text-orange-800 dark:text-orange-200">Đơn hàng đặt trước</h3>
            </div>
            <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
              Sản phẩm sẽ về trong 7-10 ngày. Bạn chỉ cần thanh toán 50% giá trị trước.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Forms */}
          <div className="space-y-6">
            {/* Shipping Information */}
            <div className="bg-white dark:bg-content-dark rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold mb-4">Thông tin giao hàng</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Tên người nhận *</label>
                  <input
                    type="text"
                    value={shippingInfo.tenNguoiNhan}
                    onChange={(e) => handleShippingInfoChange('tenNguoiNhan', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-background-dark"
                    placeholder="Nhập tên người nhận"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Địa chỉ giao hàng *</label>
                  <textarea
                    value={shippingInfo.diaChiGiaoHang}
                    onChange={(e) => handleShippingInfoChange('diaChiGiaoHang', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-background-dark"
                    placeholder="Nhập địa chỉ chi tiết"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Số điện thoại *</label>
                  <input
                    type="number"
                    value={shippingInfo.soDienThoai}
                    onChange={(e) => handleShippingInfoChange('soDienThoai', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-background-dark"
                    placeholder="Nhập số điện thoại"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Ghi chú (tùy chọn)</label>
                  <textarea
                    value={shippingInfo.ghiChu}
                    onChange={(e) => handleShippingInfoChange('ghiChu', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-background-dark"
                    placeholder="Ghi chú về đơn hàng..."
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white dark:bg-content-dark rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold mb-4">Phương thức thanh toán</h3>
              <div className="space-y-3">
                <label className="flex items-center p-4 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <span className="font-medium">💵 Thanh toán khi nhận hàng (COD)</span>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Thanh toán bằng tiền mặt khi nhận hàng</p>
                  </div>
                </label>

                <label className="flex items-center p-4 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="online"
                    checked={paymentMethod === 'online'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <span className="font-medium">📱 Ví điện tử/ZaloPay/MoMo</span>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Thanh toán online an toàn</p>
                  </div>
                </label>

                <label className="flex items-center p-4 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <span className="font-medium">💳 Thẻ tín dụng/ghi nợ</span>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Thanh toán bằng thẻ</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            {/* Order Items */}
            <div className="bg-white dark:bg-content-dark rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold mb-4">Sản phẩm trong đơn hàng</h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {itemsToShow.map((item) => {
                  const itemData = isPreOrder ? item : item; // preOrder uses different field names
                  return (
                    <div key={isPreOrder ? item.id_san_pham : item.idSanPham} className="flex items-center gap-4 py-2">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={(isPreOrder ? item.url_hinh_anh : item.urlHinhAnh) || "https://placehold.co/64x64?text=No+Image"}
                          alt={isPreOrder ? item.ten_san_pham : item.tenSanPham}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-text-light dark:text-text-dark truncate">
                          {isPreOrder ? item.ten_san_pham : item.tenSanPham}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Số lượng: {isPreOrder ? item.quantity : item.soLuong}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">
                          {((isPreOrder ? item.gia_ban : item.giaTaiThoiDiemMua) * (isPreOrder ? item.quantity : item.soLuong)).toLocaleString('vi-VN')}₫
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white dark:bg-content-dark rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold mb-4">Tóm tắt đơn hàng</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Tạm tính ({itemsToShow.length} sản phẩm):</span>
                  <span className="font-medium">{totalAmount.toLocaleString('vi-VN')}₫</span>
                </div>
                <div className="flex justify-between">
                  <span>Phí vận chuyển:</span>
                  <span className="font-medium text-green-600">Miễn phí</span>
                </div>
                {isPreOrder && (
                  <div className="flex justify-between">
                    <span>Đặt cọc (50%):</span>
                    <span className="font-medium text-orange-600">-{preOrderData.depositAmount.toLocaleString('vi-VN')}₫</span>
                  </div>
                )}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                  <div className="flex justify-between text-xl font-bold">
                    <span>{isPreOrder ? 'Cần thanh toán:' : 'Tổng cộng:'}</span>
                    <span className="text-primary">
                      {isPreOrder
                        ? preOrderData.depositAmount.toLocaleString('vi-VN')
                        : totalAmount.toLocaleString('vi-VN')
                      }₫
                    </span>
                  </div>
                  {isPreOrder && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Còn lại: {(totalAmount - preOrderData.depositAmount).toLocaleString('vi-VN')}₫ (thanh toán khi nhận hàng)
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={handleSubmitOrder}
                disabled={processing}
                className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary/90 transition-colors mt-6 disabled:opacity-50"
              >
                {processing ? 'Đang xử lý...' : (isPreOrder ? 'Đặt cọc ngay' : 'Đặt hàng ngay')}
              </button>

              <div className="mt-4 text-center">
                <Link to={isPreOrder ? `/product/${preOrderData.items[0]?.id_san_pham}` : "/cart"} className="text-primary hover:underline text-sm">
                  {isPreOrder ? 'Quay lại sản phẩm' : 'Quay lại giỏ hàng'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThanhToanPage;
