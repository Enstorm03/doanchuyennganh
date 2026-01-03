import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import useOrders from '../../hooks/useOrders';
import useCancelOrder from '../../hooks/useCancelOrder';
import useReviewOrder from '../../hooks/useReviewOrder';
import useReturnOrder from '../../hooks/useReturnOrder';
import OrdersHeader from './orders/components/OrdersHeader';
import EmptyOrders from './orders/components/EmptyOrders';
import OrderList from './orders/components/order-list/OrderList';
import ReviewModal from './orders/components/modals/ReviewModal';
import ReturnModal from './orders/components/modals/ReturnModal';

const LichSuDonHangPage = () => {
  const { isUser } = useAuth();

  const {
    orders,
    loading,
    error,
    fetchOrders
  } = useOrders();

  // Mock return statuses for now - this might need to be implemented
  const returnStatuses = {};

  const { cancelOrder, cancelLoading } = useCancelOrder();

  const { submitReview, submittingReview } = useReviewOrder();

  const { submitReturn, submittingReturn } = useReturnOrder();

  // Modal states
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewingOrder, setReviewingOrder] = useState(null);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });

  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returningOrder, setReturningOrder] = useState(null);
  const [returnData, setReturnData] = useState({ lyDo: '' });

  // Event handlers
  const handleWriteReview = (order) => {
    setReviewingOrder(order);
    setReviewData({ rating: 5, comment: '' });
    setShowReviewModal(true);
  };

  const handleRequestReturn = (order) => {
    setReturningOrder(order);
    setReturnData({ lyDo: '' });
    setShowReturnModal(true);
  };

  const handleCancelOrder = async (orderId) => {
    await cancelOrder(orderId, fetchOrders);
  };

  const handleReviewSubmit = async () => {
    await submitReview(reviewingOrder, reviewData, () => {
      setShowReviewModal(false);
      setReviewingOrder(null);
      setReviewData({ rating: 5, comment: '' });
    });
  };

  const handleReturnSubmit = async () => {
    await submitReturn(returningOrder, returnData, () => {
      setShowReturnModal(false);
      setReturningOrder(null);
      setReturnData({ lyDo: '' });
    });
  };

  const handleCloseReviewModal = () => {
    setShowReviewModal(false);
    setReviewingOrder(null);
    setReviewData({ rating: 5, comment: '' });
  };

  const handleCloseReturnModal = () => {
    setShowReturnModal(false);
    setReturningOrder(null);
    setReturnData({ lyDo: '' });
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
      <OrdersHeader />

      <div className="space-y-6">
        {orders.length === 0 ? (
          <EmptyOrders />
        ) : (
          <OrderList
            orders={orders}
            returnStatuses={returnStatuses}
            cancelLoading={cancelLoading}
            onCancelOrder={handleCancelOrder}
            onWriteReview={handleWriteReview}
            onRequestReturn={handleRequestReturn}
          />
        )}
      </div>

      <ReviewModal
        show={showReviewModal}
        onClose={handleCloseReviewModal}
        order={reviewingOrder}
        reviewData={reviewData}
        onReviewDataChange={setReviewData}
        onSubmit={handleReviewSubmit}
        submitting={submittingReview}
      />

      <ReturnModal
        show={showReturnModal}
        onClose={handleCloseReturnModal}
        order={returningOrder}
        returnData={returnData}
        onReturnDataChange={setReturnData}
        onSubmit={handleReturnSubmit}
        submitting={submittingReturn}
      />
    </main>
  );
};

export default LichSuDonHangPage;
