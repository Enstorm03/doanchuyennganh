import React from 'react';
import OrderCard from './OrderCard';

const OrderList = ({
  orders,
  returnStatuses,
  cancelLoading,
  onCancelOrder,
  onWriteReview,
  onRequestReturn
}) => (
  <div className="space-y-6">
    {orders.map((order) => (
      <OrderCard
        key={order.idDonHang}
        order={order}
        returnStatuses={returnStatuses}
        cancelLoading={cancelLoading}
        onCancelOrder={onCancelOrder}
        onWriteReview={onWriteReview}
        onRequestReturn={onRequestReturn}
      />
    ))}
  </div>
);

export default OrderList;
