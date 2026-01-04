import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

const LichSuDonHangPage = () => {
  const navigate = useNavigate();
  const { user, isUser } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelLoading, setCancelLoading] = useState(null);
  const [returnStatuses, setReturnStatuses] = useState({}); // Track return status for each order

  // Review functionality
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewingOrder, setReviewingOrder] = useState(null);
  const [reviewData, setReviewData] = useState({
    rating: 5,
    comment: ''
  });
  const [submittingReview, setSubmittingReview] = useState(false);

  // Return functionality
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returningOrder, setReturningOrder] = useState(null);
  const [returnData, setReturnData] = useState({
    lyDo: ''
  });
  const [submittingReturn, setSubmittingReturn] = useState(false);

  // Check authentication
  useEffect(() => {
    if (!isUser()) {
      navigate('/login', { state: { message: 'Vui lòng đăng nhập để xem lịch sử đơn hàng.' } });
      return;
    }
  }, [isUser, navigate]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch user orders
  useEffect(() => {
    if (isUser() && user) {
      fetchOrders();
    }
  }, [user, isUser]); // eslint-disable-line react-hooks/exhaustive-deps

  // Check return status for eligible orders
  useEffect(() => {
    if (orders.length > 0 && user) {
      checkReturnStatuses();
    }
  }, [orders, user]); // eslint-disable-line react-hooks/exhaustive-deps

  const checkReturnStatuses = async () => {
    const statuses = {};

    for (const order of orders) {
      if (order.trangThaiVanHanh === 'Hoàn thành') {
        try {
          const existingReturn = await api.checkOrderReturnStatus(order.idDonHang, user.id_nguoi_dung);
          statuses[order.idDonHang] = existingReturn !== null; // true if has return request
        } catch (error) {
          console.error(`Error checking return status for order ${order.idDonHang}:`, error);
          statuses[order.idDonHang] = false; // Default to no return request on error
        }
      } else {
        statuses[order.idDonHang] = false; // Not eligible for return
      }
    }

    setReturnStatuses(statuses);
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const ordersData = await api.getUserOrdersHistoryDto(user.id_nguoi_dung);
      console.log('Order history data:', ordersData);
      setOrders(ordersData || []);
    } catch (err) {
      setError('Không thể tải lịch sử đơn hàng');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Giỏ hàng': return 'bg-gray-100 text-gray-800';
      case 'Đang chờ': return 'bg-blue-100 text-blue-800';
      case 'Đã xác nhận': return 'bg-green-100 text-green-800';
      case 'Đang giao hàng': return 'bg-purple-100 text-purple-800';
      case 'Hoàn thành': return 'bg-emerald-100 text-emerald-800';
      case 'Chờ hàng': return 'bg-orange-100 text-orange-800';
      case 'Đã hủy': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Check if order can be cancelled
  const canCancelOrder = (order) => {
    const cancellableStatuses = ['Đang chờ', 'Đã xác nhận', 'Chờ hàng'];
    return cancellableStatuses.includes(order.trangThaiVanHanh);
  };

  // Handle cancel order
  const handleCancelOrder = async (orderId) => {
    const reason = prompt('Vui lòng nhập lý do hủy đơn hàng:');
    if (!reason || reason.trim() === '') {
      alert('Vui lòng nhập lý do hủy đơn hàng');
      return;
    }

    // Additional confirmation for pre-orders (backend tự động xử lý hoàn cọc)
    const order = orders.find(o => o.idDonHang === orderId);
    if (order && order.trangThaiVanHanh === 'Chờ hàng') {
      const confirm = window.confirm(
        'Đây là đơn hàng đặt trước. Việc hủy đơn sẽ được xử lý theo quy định. Bạn có chắc chắn muốn hủy?'
      );
      if (!confirm) return;
    }

    try {
      setCancelLoading(orderId);
      await api.cancelOrder(orderId, reason);
      alert('Đơn hàng đã được hủy thành công');
      // Refresh orders
      await fetchOrders();
    } catch (error) {
      alert('Hủy đơn hàng thất bại: ' + (error.message || 'Vui lòng thử lại'));
      console.error('Error canceling order:', error);
    } finally {
      setCancelLoading(null);
    }
  };

  // Review functionality
  const canWriteReview = (order) => {
    return order.trangThaiVanHanh === 'Hoàn thành';
  };

  const openReviewModal = (order) => {
    setReviewingOrder(order);
    setReviewData({ rating: 5, comment: '' });
    setShowReviewModal(true);
  };

  // Return functionality
  const openReturnModal = (order) => {
    setReturningOrder(order);
    setReturnData({ lyDo: '' });
    setShowReturnModal(true);
  };

  const handleReturnSubmit = async () => {
    if (!returnData.lyDo.trim()) {
      alert('Vui lòng nhập lý do đổi trả');
      return;
    }

    try {
      setSubmittingReturn(true);

      const returnPayload = {
        idDonHang: returningOrder.idDonHang,
        idNguoiDung: user.id_nguoi_dung,
        lyDo: returnData.lyDo.trim()
      };

      console.log('Submitting return request:', returnPayload);
      await api.createReturn(returnPayload);

      alert('Yêu cầu đổi trả đã được gửi thành công! Chúng tôi sẽ xem xét và liên hệ với bạn trong thời gian sớm nhất.');

      setShowReturnModal(false);
      setReturningOrder(null);
      setReturnData({ lyDo: '' });

    } catch (error) {
      console.error('Error submitting return request:', error);
      alert('Không thể gửi yêu cầu đổi trả: ' + error.message);
    } finally {
      setSubmittingReturn(false);
    }
  };

  const handleReviewSubmit = async () => {
    if (!reviewData.comment.trim()) {
      alert('Vui lòng nhập nội dung đánh giá');
      return;
    }

    if (!reviewingOrder || !reviewingOrder.chiTiet || reviewingOrder.chiTiet.length === 0) {
      alert('Không có sản phẩm nào để đánh giá');
      return;
    }

    try {
      setSubmittingReview(true);

      // Submit review for each product in the completed order
      const reviewPromises = reviewingOrder.chiTiet.map(async (item) => {
        const reviewPayload = {
          idNguoiDung: user.id_nguoi_dung,     // Customer ID
          idSanPham: item.sanPhamId,           // Product ID
          idDonHang: reviewingOrder.idDonHang, // Order ID (for reference)
          diemDanhGia: reviewData.rating,      // Rating (1-5) - backend expects "diemDanhGia"
          binhLuan: reviewData.comment         // Comment - backend expects "binhLuan"
        };

        console.log('Submitting review for product:', item.sanPhamId, reviewPayload);
        return api.createReview(reviewPayload);
      });

      // Wait for all reviews to be submitted
      await Promise.all(reviewPromises);

      alert(`Đánh giá đã được gửi thành công!\nSố sao: ${reviewData.rating}\nNội dung: ${reviewData.comment}`);

      setShowReviewModal(false);
      setReviewingOrder(null);
      setReviewData({ rating: 5, comment: '' });

    } catch (error) {
      console.error('Error submitting reviews:', error);
      alert('Không thể gửi đánh giá: ' + error.message);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (!isUser()) {
    return (
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="text-center">
          <p className="text-text-secondary-light dark:text-text-secondary-dark">Đang chuyển hướng...</p>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Đang tải lịch sử đơn hàng...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={fetchOrders}
            className="bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 text-sm">
          <Link className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary transition-colors" to="/">Trang chủ</Link>
          <span className="text-text-secondary-light dark:text-text-secondary-dark">/</span>
          <span className="font-medium text-text-primary-light dark:text-text-primary-dark">Lịch sử đơn hàng</span>
        </div>
      </div>

      {/* Page Heading */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black tracking-[-0.033em]">Lịch sử đơn hàng</h1>
        <p className="text-text-secondary-light dark:text-text-secondary-dark mt-2">
          Theo dõi và quản lý các đơn hàng của bạn
        </p>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-8 max-w-md mx-auto">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-bold mb-2">Chưa có đơn hàng nào</h3>
              <p className="text-text-secondary-light dark:text-text-secondary-dark mb-6">
                Bạn chưa đặt đơn hàng nào. Hãy bắt đầu mua sắm!
              </p>
              <Link
                to="/products"
                className="bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Mua sắm ngay
              </Link>
            </div>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.idDonHang} className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 shadow-sm">
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold">
                    Đơn hàng #{order.idDonHang}
                  </h3>
                  <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark space-y-1">
                    <p>Ngày đặt: {order.ngayDatHang ? new Date(order.ngayDatHang).toLocaleDateString('vi-VN') : 'Chưa xác định'}</p>
                    {order.ngayHoanThanh && (
                      <p>Ngày hoàn thành: {new Date(order.ngayHoanThanh).toLocaleDateString('vi-VN')}</p>
                    )}
                    {order.maVanDon && (
                      <p>Mã vận đơn: {order.maVanDon}</p>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-0">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(order.trangThaiVanHanh)}`}>
                    {order.trangThaiVanHanh}
                  </span>
                  {canWriteReview(order) && (
                    <button
                      onClick={() => openReviewModal(order)}
                      className="px-4 py-2 bg-yellow-500 text-white text-sm rounded-lg hover:bg-yellow-600 transition-colors"
                    >
                      Viết đánh giá
                    </button>
                  )}
                  {order.trangThaiVanHanh === 'Hoàn thành' &&
                   order.ngayDatHang &&
                   Math.ceil(Math.abs(new Date() - new Date(order.ngayDatHang)) / (1000 * 60 * 60 * 24)) <= 7 &&
                   !returnStatuses[order.idDonHang] && (
                    <button
                      onClick={() => openReturnModal(order)}
                      className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Yêu cầu đổi trả
                    </button>
                  )}
                  {canCancelOrder(order) && (
                    <button
                      onClick={() => handleCancelOrder(order.idDonHang)}
                      disabled={cancelLoading === order.idDonHang}
                      className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors disabled:bg-gray-400"
                    >
                      {cancelLoading === order.idDonHang ? 'Đang hủy...' : 'Hủy đơn'}
                    </button>
                  )}
                </div>
              </div>

              {/* Cancellation Reason */}
              {order.trangThaiVanHanh === 'Đã hủy' && order.lyDoHuy && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4">
                  <p className="text-sm text-red-800 dark:text-red-200">
                    <strong>Lý do hủy:</strong> {order.lyDoHuy}
                  </p>
                </div>
              )}

              {/* Order Items */}
              <div className="border-t border-border-light dark:border-border-dark pt-4">
                <div className="space-y-3">
                  {order.chiTiet?.map((item, idx) => {
                    // Debug logging for item structure
                    console.log('Order item:', item);

                    // Handle image URL - support both relative and absolute URLs
                    const imageUrl = item.urlHinhAnh;
                    const fullImageUrl = imageUrl
                      ? (imageUrl.startsWith('http') ? imageUrl : `http://localhost:8080${imageUrl}`)
                      : "https://placehold.co/60x60?text=No+Image";

                    const price = Number(item.giaTaiThoiDiemMua || 0);
                    const qty = Number(item.soLuong || 0);

                    return (
                      <div key={`${order.idDonHang}-${idx}-${item.sanPhamId ?? 'x'}`} className="flex items-center gap-4">
                        <img
                          src={fullImageUrl}
                          alt={item.tenSanPham || 'Sản phẩm'}
                          className="w-12 h-12 object-cover rounded"
                          onError={(e) => {
                            console.log('Image failed to load:', e.target.src);
                            e.target.src = "https://placehold.co/60x60?text=No+Image";
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">
                            {item.tenSanPham || '(Sản phẩm đã không còn)'}
                          </p>
                          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                            Số lượng: {qty}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{(price * qty).toLocaleString('vi-VN')}₫</p>
                          <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                            {price.toLocaleString('vi-VN')}₫/cái
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Order Footer */}
                <div className="mt-4 pt-4 border-t border-border-light dark:border-border-dark">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                      <p>Giao đến: {order.tenNguoiNhan}</p>
                      <p>Địa chỉ: {order.diaChiGiaoHang}</p>
                      <p>SĐT: {order.soDienThoai}</p>
                    </div>
                    <div className="text-right mt-2 sm:mt-0">
                      <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                        Phương thức: {order.phuongThucThanhToan}
                      </p>
                      {order.tienDatCoc > 0 && (
                        <p className="text-sm text-orange-600">
                          Đã cọc: {order.tienDatCoc.toLocaleString('vi-VN')}₫
                        </p>
                      )}
                      <p className="text-lg font-bold text-primary">
                        Tổng: {order.tongTien?.toLocaleString('vi-VN')}₫
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Review Modal */}
      {showReviewModal && reviewingOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-content-dark rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-bold mb-4">Đánh giá đơn hàng #{reviewingOrder.idDonHang}</h3>

              {/* Rating Stars */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Đánh giá:</label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setReviewData(prev => ({ ...prev, rating: star }))}
                      className={`w-8 h-8 ${
                        star <= reviewData.rating
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    >
                      <span className="material-symbols-outlined text-2xl">star</span>
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    {reviewData.rating}/5 sao
                  </span>
                </div>
              </div>

              {/* Comment */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Nội dung đánh giá:</label>
                <textarea
                  value={reviewData.comment}
                  onChange={(e) => setReviewData(prev => ({ ...prev, comment: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-background-dark"
                  placeholder="Chia sẻ trải nghiệm của bạn với đơn hàng này..."
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowReviewModal(false);
                    setReviewingOrder(null);
                    setReviewData({ rating: 5, comment: '' });
                  }}
                  className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                >
                  Hủy
                </button>
                <button
                  onClick={handleReviewSubmit}
                  disabled={submittingReview || !reviewData.comment.trim()}
                  className="flex-1 bg-primary text-white py-2 px-4 rounded hover:bg-primary/90 disabled:opacity-50"
                >
                  {submittingReview ? 'Đang gửi...' : 'Gửi đánh giá'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Return Modal */}
      {showReturnModal && returningOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-content-dark rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-bold mb-4">Yêu cầu đổi trả đơn hàng #{returningOrder.idDonHang}</h3>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Chính sách đổi trả:</strong> Chỉ nhận đổi trả trong vòng 7 ngày kể từ ngày đặt hàng cho đơn hàng đã hoàn thành.
                </p>
              </div>

              {/* Return Reason */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Lý do đổi trả:</label>
                <textarea
                  value={returnData.lyDo}
                  onChange={(e) => setReturnData(prev => ({ ...prev, lyDo: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-background-dark"
                  placeholder="Vui lòng mô tả chi tiết lý do bạn muốn đổi trả..."
                />
              </div>

              {/* Order Info */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 mb-6">
                <h4 className="text-sm font-medium mb-2">Thông tin đơn hàng:</h4>
                <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                  <p><strong>Tổng tiền:</strong> {returningOrder.tongTien?.toLocaleString('vi-VN')}₫</p>
                  <p><strong>Ngày đặt:</strong> {returningOrder.ngayDatHang ? new Date(returningOrder.ngayDatHang).toLocaleDateString('vi-VN') : 'N/A'}</p>
                  <p><strong>Sản phẩm:</strong> {returningOrder.chiTiet?.length || 0} sản phẩm</p>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowReturnModal(false);
                    setReturningOrder(null);
                    setReturnData({ lyDo: '' });
                  }}
                  className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                >
                  Hủy
                </button>
                <button
                  onClick={handleReturnSubmit}
                  disabled={submittingReturn || !returnData.lyDo.trim()}
                  className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  {submittingReturn ? 'Đang gửi...' : 'Gửi yêu cầu'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default LichSuDonHangPage;
