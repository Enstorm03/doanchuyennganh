import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

const getStatusClass = (status) => {
  switch (status) {
    case 'Hoàn thành':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'Đang giao hàng':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'Đã hủy':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    case 'Đang chờ':
    case 'Đã xác nhận':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'Chờ hàng':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

const AdminOrderDetailPage = () => {
  const { orderId } = useParams();
  const { user } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [productDetails, setProductDetails] = useState({});
  const [brandDetails, setBrandDetails] = useState({});

  // Action states
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showShipDialog, setShowShipDialog] = useState(false);
  const [showTrackingDialog, setShowTrackingDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showMoveToPendingDialog, setShowMoveToPendingDialog] = useState(false);
  const [showUpdateRecipientDialog, setShowUpdateRecipientDialog] = useState(false);
  const [showPaymentCollectedDialog, setShowPaymentCollectedDialog] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [cancelReason, setCancelReason] = useState('');

  // Recipient info for editing
  const [recipientName, setRecipientName] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const orderData = await api.getOrderDetails(parseInt(orderId));
      console.log('Raw order details:', orderData);
      console.log('Order chiTiet:', orderData.chiTiet);
      console.log('Order chiTietDonHangs:', orderData.chiTietDonHangs);
      console.log('First chiTietDonHang item:', orderData.chiTietDonHangs?.[0]);
      console.log('First chiTietDonHang item structure:', orderData.chiTietDonHangs?.[0] ? Object.keys(orderData.chiTietDonHangs[0]) : 'No items');

      // Fetch product details for each item to get brand, volume, concentration
      if (orderData.chiTietDonHangs && orderData.chiTietDonHangs.length > 0) {
        const productIds = orderData.chiTietDonHangs.map(item => item.sanPhamId);
        console.log('Fetching product details for IDs:', productIds);

        try {
          const [allProducts, allBrands] = await Promise.all([
            api.getAllProducts(),
            api.getBrands()
          ]);

          const productMap = {};
          const brandMap = {};

          // Create a map of product details by ID
          allProducts.forEach(product => {
            productMap[product.id_san_pham] = product;
          });

          // Create a map of brand details by ID
          allBrands.forEach(brand => {
            brandMap[brand.idThuongHieu] = brand.tenThuongHieu;
          });

          console.log('Product map created:', productMap);
          console.log('Brand map created:', brandMap);

          // Store product and brand details
          setProductDetails(productMap);
          setBrandDetails(brandMap);
        } catch (productError) {
          console.error('Error fetching product/brand details:', productError);
          // Continue without product details
        }
      }

      setOrder(orderData);
    } catch (err) {
      setError('Không thể tải chi tiết đơn hàng');
      console.error('Error fetching order details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmOrder = async () => {
    try {
      setProcessing(true);
      const updatedOrder = await api.confirmOrder(parseInt(orderId), user?.id_nhan_vien || 1);
      setOrder(updatedOrder);
      setShowConfirmDialog(false);
      alert('Đơn hàng đã được xác nhận thành công!');
    } catch (error) {
      alert('Không thể xác nhận đơn hàng: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleShipOrder = async () => {
    try {
      setProcessing(true);
      const updatedOrder = await api.shipOrder(parseInt(orderId));
      setOrder(updatedOrder);
      setShowShipDialog(false);
      alert('Đơn hàng đã được chuyển sang trạng thái đang giao!');
    } catch (error) {
      alert('Không thể chuyển trạng thái đơn hàng: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleUpdateTracking = async () => {
    if (!trackingNumber.trim()) {
      alert('Vui lòng nhập mã vận đơn');
      return;
    }

    try {
      setProcessing(true);
      const updatedOrder = await api.updateTracking(parseInt(orderId), trackingNumber.trim());
      setOrder(updatedOrder);
      setShowTrackingDialog(false);
      setTrackingNumber('');
      alert('Mã vận đơn đã được cập nhật!');
    } catch (error) {
      alert('Không thể cập nhật mã vận đơn: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleCompleteOrder = async () => {
    try {
      setProcessing(true);
      const updatedOrder = await api.completeOrder(parseInt(orderId));
      setOrder(updatedOrder);
      alert('Đơn hàng đã được hoàn thành!');
    } catch (error) {
      alert('Không thể hoàn thành đơn hàng: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) {
      alert('Vui lòng nhập lý do hủy');
      return;
    }

    try {
      setProcessing(true);
      const updatedOrder = await api.cancelOrder(parseInt(orderId), cancelReason.trim());
      setOrder(updatedOrder);
      setShowCancelDialog(false);
      setCancelReason('');
      alert('Đơn hàng đã được hủy!');
    } catch (error) {
      alert('Không thể hủy đơn hàng: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleMoveToPending = async () => {
    try {
      setProcessing(true);
      const updatedOrder = await api.moveToPending(parseInt(orderId));
      setOrder(updatedOrder);
      setShowMoveToPendingDialog(false);
      alert('Đơn hàng đã được chuyển sang trạng thái đang chờ!');
    } catch (error) {
      alert('Không thể chuyển trạng thái đơn hàng: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleUpdateRecipient = async () => {
    if (!recipientName.trim() || !recipientAddress.trim()) {
      alert('Vui lòng nhập đầy đủ tên người nhận và địa chỉ giao hàng');
      return;
    }

    try {
      setProcessing(true);
      const recipientData = {
        tenNguoiNhan: recipientName.trim(),
        diaChiGiaoHang: recipientAddress.trim()
      };
      const updatedOrder = await api.updateOrderRecipient(parseInt(orderId), recipientData);
      setOrder(updatedOrder);
      setShowUpdateRecipientDialog(false);
      setRecipientName('');
      setRecipientAddress('');
      alert('Thông tin người nhận đã được cập nhật!');
    } catch (error) {
      alert('Không thể cập nhật thông tin người nhận: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handlePaymentCollected = async () => {
    try {
      setProcessing(true);
      const updatedOrder = await api.markPaymentCollected(parseInt(orderId));
      setOrder(updatedOrder);
      setShowPaymentCollectedDialog(false);
      alert('Đã xác nhận thu đủ tiền còn lại!');
    } catch (error) {
      alert('Không thể cập nhật trạng thái thanh toán: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-red-600">Không thể tải đơn hàng!</h2>
        <p className="text-gray-600 mt-2">{error}</p>
        <div className="mt-4 space-x-4">
          <button
            onClick={fetchOrderDetails}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
          >
            Thử lại
          </button>
          <Link to="/admin/orders" className="text-primary hover:underline">Quay lại danh sách</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center gap-4">
        <Link to="/admin/orders" className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <h1 className="font-semibold text-lg md:text-2xl text-text-light dark:text-text-dark">
          Chi tiết Đơn hàng #{order.idDonHang}
        </h1>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Products List */}
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-xl border bg-surface-light text-card-foreground shadow border-border-light dark:border-border-dark dark:bg-surface-dark p-6">
            <h3 className="text-lg font-bold mb-4">Các sản phẩm</h3>
            <div className="space-y-4">
              {(() => {
                // Determine which data structure to use
                let itemsToDisplay = [];
                let dataSource = '';

                if (order.chiTiet && order.chiTiet.length > 0) {
                  itemsToDisplay = order.chiTiet;
                  dataSource = 'chiTiet';
                } else if (order.chiTietDonHangs && order.chiTietDonHangs.length > 0) {
                  itemsToDisplay = order.chiTietDonHangs;
                  dataSource = 'chiTietDonHangs';
                }

                console.log('Displaying items from:', dataSource, itemsToDisplay);

                return itemsToDisplay.length > 0 ? (
                  itemsToDisplay.map((item, index) => {
                    // Extract product info based on data structure
                    let productInfo = {};
                    let quantity = 0;
                    let price = 0;

                    if (dataSource === 'chiTiet') {
                      // Direct product info in chiTiet
                      productInfo = {
                        tenSanPham: item.tenSanPham,
                        urlHinhAnh: item.urlHinhAnh,
                        thuongHieu: item.tenThuongHieu || item.thuongHieu,
                        dungTichMl: item.dungTichMl,
                        nongDo: item.nongDo
                      };
                      quantity = item.soLuong;
                      price = item.giaTaiThoiDiemMua;
                    } else if (dataSource === 'chiTietDonHangs') {
                      // Get basic info from order item
                      const basicInfo = {
                        tenSanPham: item.tenSanPham,
                        urlHinhAnh: item.urlHinhAnh || item.url_hinh_anh
                      };

                      // Get detailed product info from fetched products
                      const detailedProduct = productDetails[item.sanPhamId];
                      console.log('Product details for ID', item.sanPhamId, ':', detailedProduct);

                      productInfo = {
                        ...basicInfo,
                        thuongHieu: brandDetails[detailedProduct?.id_thuong_hieu] || detailedProduct?.ten_thuong_hieu || 'N/A',
                        dungTichMl: detailedProduct?.dung_tich_ml || detailedProduct?.dungTichMl,
                        nongDo: detailedProduct?.nong_do || detailedProduct?.nongDo
                      };

                      quantity = item.soLuong;
                      price = item.giaTaiThoiDiemMua;
                    }

                    console.log('Item product info:', productInfo);

                    return (
                      <div key={`order-item-${index}`} className="flex justify-between items-center p-4 border border-border-light dark:border-border-dark rounded-lg">
                        <div className="flex items-center gap-4">
                          <img
                            src={productInfo.urlHinhAnh || "https://placehold.co/60x60?text=No+Image"}
                            alt={productInfo.tenSanPham || 'Sản phẩm'}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold text-text-light dark:text-text-dark">
                              {productInfo.tenSanPham || 'Sản phẩm không xác định'}
                            </h4>
                            <p className="text-sm text-text-subtle-light dark:text-text-subtle-dark mt-1">
                              Thương hiệu: {productInfo.thuongHieu || 'N/A'}
                            </p>
                            <p className="text-sm text-text-subtle-light dark:text-text-subtle-dark">
                              Dung tích: {productInfo.dungTichMl || 'N/A'}ml
                            </p>
                            <p className="text-sm text-text-subtle-light dark:text-text-subtle-dark">
                              Nồng độ: {productInfo.nongDo || 'N/A'}
                            </p>
                            <p className="text-sm font-medium text-primary">
                              Số lượng: {quantity || 0}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary text-lg">
                            {((price || 0) * (quantity || 0)).toLocaleString('vi-VN')}₫
                          </p>
                          <p className="text-sm text-text-subtle-light dark:text-text-subtle-dark">
                            Đơn giá: {(price || 0).toLocaleString('vi-VN')}₫
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8">
                    <span className="material-symbols-outlined text-4xl text-gray-300 mb-2 block">inventory_2</span>
                    <p className="text-text-subtle-light dark:text-text-subtle-dark">
                      Không có sản phẩm nào trong đơn hàng này.
                    </p>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>

        {/* Order Info and Actions */}
        <div className="md:col-span-1 flex flex-col gap-6">
          <div className="rounded-xl border bg-surface-light text-card-foreground shadow border-border-light dark:border-border-dark dark:bg-surface-dark p-6">
            <h3 className="text-lg font-bold mb-4">Thông tin khách hàng</h3>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">ID Người dùng:</span> {order.idNguoiDung || 'N/A'}</p>
              <p><span className="font-medium">Tên người nhận:</span> {order.tenNguoiNhan || 'N/A'}</p>
              <p><span className="font-medium">Địa chỉ giao hàng:</span> {order.diaChiGiaoHang || 'N/A'}</p>
            </div>
          </div>

          <div className="rounded-xl border bg-surface-light text-card-foreground shadow border-border-light dark:border-border-dark dark:bg-surface-dark p-6">
            <h3 className="text-lg font-bold mb-4">Thông tin đơn hàng</h3>
            <div className="space-y-2 text-sm">
              <p className="flex justify-between">
                <span>ID Đơn hàng:</span>
                <span className="font-mono">#{order.idDonHang}</span>
              </p>
              <p className="flex justify-between">
                <span>Ngày đặt:</span>
                <span>{order.ngayDatHang ? new Date(order.ngayDatHang).toLocaleDateString('vi-VN') : 'N/A'}</span>
              </p>
              {order.ngayHoanThanh && (
                <p className="flex justify-between">
                  <span>Ngày hoàn thành:</span>
                  <span>{new Date(order.ngayHoanThanh).toLocaleDateString('vi-VN')}</span>
                </p>
              )}
              <p className="flex justify-between">
                <span>Mã vận đơn:</span>
                <span className="font-mono">{order.maVanDon || 'Chưa có'}</span>
              </p>
              <div className="flex justify-between items-center pt-2">
                <span>Trạng thái:</span>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(order.trangThaiVanHanh)}`}>
                  {order.trangThaiVanHanh || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span>Thanh toán:</span>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  order.trangThaiThanhToan === 'Đã thanh toán' ? 'bg-green-100 text-green-800' :
                  order.trangThaiThanhToan === 'Chờ cọc' ? 'bg-orange-100 text-orange-800' :
                  order.trangThaiThanhToan === 'Đã cọc' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {order.trangThaiThanhToan || 'N/A'}
                </span>
              </div>
              <p className="flex justify-between text-base font-bold mt-4 pt-4 border-t border-border-light dark:border-border-dark">
                <span>Tổng tiền:</span>
                <span className="text-primary">{order.tongTien ? order.tongTien.toLocaleString('vi-VN') + '₫' : 'N/A'}</span>
              </p>
              {order.tienDatCoc > 0 && (
                <p className="flex justify-between text-sm">
                  <span>Đặt cọc:</span>
                  <span>{order.tienDatCoc.toLocaleString('vi-VN')}₫</span>
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="rounded-xl border bg-surface-light text-card-foreground shadow border-border-light dark:border-border-dark dark:bg-surface-dark p-6">
            <h3 className="text-lg font-bold mb-4">Thao tác</h3>
            <div className="space-y-3">
              {/* Buttons for "Chờ hàng" orders */}
              {order.trangThaiVanHanh === 'Chờ hàng' && (
                <>
                  <button
                    onClick={() => {
                      setRecipientName(order.tenNguoiNhan || '');
                      setRecipientAddress(order.diaChiGiaoHang || '');
                      setShowUpdateRecipientDialog(true);
                    }}
                    disabled={processing}
                    className="w-full bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-600 transition-colors disabled:opacity-50"
                  >
                    Cập nhật thông tin nhận hàng
                  </button>

                  {order.trangThaiThanhToan === 'Đã cọc' && (
                    <button
                      onClick={() => setShowPaymentCollectedDialog(true)}
                      disabled={processing}
                      className="w-full bg-emerald-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50"
                    >
                      Đã thu đủ tiền còn lại
                    </button>
                  )}
                </>
              )}

              {(order.trangThaiVanHanh === 'Đang chờ' || order.trangThaiVanHanh === 'Chờ hàng') && (
                <button
                  onClick={() => setShowConfirmDialog(true)}
                  disabled={processing}
                  className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                  Xác nhận đơn hàng
                </button>
              )}

              {order.trangThaiVanHanh === 'Đã xác nhận' && (
                <button
                  onClick={() => setShowShipDialog(true)}
                  disabled={processing}
                  className="w-full bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
                >
                  Gửi hàng
                </button>
              )}

              {(order.trangThaiVanHanh === 'Đã xác nhận' || order.trangThaiVanHanh === 'Đang giao hàng') && (
                <button
                  onClick={() => setShowTrackingDialog(true)}
                  disabled={processing}
                  className="w-full bg-purple-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50"
                >
                  Cập nhật vận đơn
                </button>
              )}

              {order.trangThaiVanHanh === 'Đang giao hàng' && (
                <button
                  onClick={handleCompleteOrder}
                  disabled={processing}
                  className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                >
                  Hoàn thành đơn hàng
                </button>
              )}

              {!['Hoàn thành', 'Đã hủy'].includes(order.trangThaiVanHanh) && (
                <button
                  onClick={() => setShowCancelDialog(true)}
                  disabled={processing}
                  className="w-full bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  Hủy đơn hàng
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Order Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4">Xác nhận đơn hàng</h3>
            <p className="mb-4">Bạn có chắc muốn xác nhận đơn hàng #{order.idDonHang}?</p>
            <div className="flex gap-3">
              <button
                onClick={handleConfirmOrder}
                disabled={processing}
                className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {processing ? 'Đang xử lý...' : 'Xác nhận'}
              </button>
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ship Order Dialog */}
      {showShipDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4">Gửi hàng</h3>
            <p className="mb-4">Bạn có chắc muốn chuyển đơn hàng #{order.idDonHang} sang trạng thái đang giao hàng?</p>
            <div className="flex gap-3">
              <button
                onClick={handleShipOrder}
                disabled={processing}
                className="flex-1 bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 disabled:opacity-50"
              >
                {processing ? 'Đang xử lý...' : 'Gửi hàng'}
              </button>
              <button
                onClick={() => setShowShipDialog(false)}
                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Tracking Dialog */}
      {showTrackingDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4">Cập nhật mã vận đơn</h3>
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Nhập mã vận đơn"
              className="w-full px-3 py-2 border border-gray-300 rounded mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={handleUpdateTracking}
                disabled={processing || !trackingNumber.trim()}
                className="flex-1 bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 disabled:opacity-50"
              >
                {processing ? 'Đang xử lý...' : 'Cập nhật'}
              </button>
              <button
                onClick={() => setShowTrackingDialog(false)}
                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Order Dialog */}
      {showCancelDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4">Hủy đơn hàng</h3>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Nhập lý do hủy đơn hàng"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={handleCancelOrder}
                disabled={processing || !cancelReason.trim()}
                className="flex-1 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 disabled:opacity-50"
              >
                {processing ? 'Đang xử lý...' : 'Hủy đơn hàng'}
              </button>
              <button
                onClick={() => setShowCancelDialog(false)}
                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Move to Pending Dialog */}
      {showMoveToPendingDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4">Chuyển sang đang chờ</h3>
            <p className="mb-4">Bạn có chắc muốn chuyển đơn hàng #{order.idDonHang} từ trạng thái "Chờ hàng" sang "Đang chờ" để xử lý?</p>
            <div className="flex gap-3">
              <button
                onClick={handleMoveToPending}
                disabled={processing}
                className="flex-1 bg-cyan-500 text-white py-2 px-4 rounded hover:bg-cyan-600 disabled:opacity-50"
              >
                {processing ? 'Đang xử lý...' : 'Chuyển trạng thái'}
              </button>
              <button
                onClick={() => setShowMoveToPendingDialog(false)}
                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Recipient Dialog */}
      {showUpdateRecipientDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4">Cập nhật thông tin người nhận</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tên người nhận:</label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Nhập tên người nhận"
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Địa chỉ giao hàng:</label>
                <textarea
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  placeholder="Nhập địa chỉ giao hàng"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleUpdateRecipient}
                disabled={processing || !recipientName.trim() || !recipientAddress.trim()}
                className="flex-1 bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600 disabled:opacity-50"
              >
                {processing ? 'Đang xử lý...' : 'Cập nhật'}
              </button>
              <button
                onClick={() => setShowUpdateRecipientDialog(false)}
                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Collected Dialog */}
      {showPaymentCollectedDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4">Xác nhận thu tiền còn lại</h3>
            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-emerald-800 dark:text-emerald-200">Đặt cọc đã thu:</span>
                <span className="font-bold text-emerald-900 dark:text-emerald-100">
                  {order.tienDatCoc ? order.tienDatCoc.toLocaleString('vi-VN') + '₫' : '0₫'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-emerald-800 dark:text-emerald-200">Còn lại cần thu:</span>
                <span className="font-bold text-emerald-900 dark:text-emerald-100">
                  {order.tongTien && order.tienDatCoc ? (order.tongTien - order.tienDatCoc).toLocaleString('vi-VN') + '₫' : '0₫'}
                </span>
              </div>
            </div>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              Bạn có chắc đã thu đủ tiền còn lại của đơn hàng #{order.idDonHang}? Đơn hàng sẽ được chuyển sang trạng thái "Đã thanh toán".
            </p>
            <div className="flex gap-3">
              <button
                onClick={handlePaymentCollected}
                disabled={processing}
                className="flex-1 bg-emerald-500 text-white py-2 px-4 rounded hover:bg-emerald-600 disabled:opacity-50"
              >
                {processing ? 'Đang xử lý...' : 'Xác nhận đã thu'}
              </button>
              <button
                onClick={() => setShowPaymentCollectedDialog(false)}
                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrderDetailPage;
