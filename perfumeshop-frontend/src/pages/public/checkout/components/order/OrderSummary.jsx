import React from 'react';
import { Link } from 'react-router-dom';
import { calculateCartTotal, calculatePreOrderTotal, calculateDepositAmount, calculateRemainingAmount, formatCurrency } from '../../../../../utils/checkoutCalculations';

const OrderSummary = ({
  items,
  isPreOrder,
  preOrderData,
  paymentMethod,
  processing,
  onSubmitOrder
}) => {
  const totalAmount = isPreOrder
    ? calculatePreOrderTotal(items)
    : calculateCartTotal({ chiTiet: items });

  const depositAmount = isPreOrder ? calculateDepositAmount(totalAmount) : 0;
  const remainingAmount = isPreOrder ? calculateRemainingAmount(totalAmount, depositAmount) : 0;
  const finalAmount = isPreOrder ? depositAmount : totalAmount;

  const backLink = isPreOrder
    ? `/product/${preOrderData?.items[0]?.id_san_pham}`
    : "/cart";

  return (
    <div className="bg-white dark:bg-content-dark rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold mb-4">Tóm tắt đơn hàng</h3>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span>Tạm tính ({items.length} sản phẩm):</span>
          <span className="font-medium">{formatCurrency(totalAmount)}</span>
        </div>
        <div className="flex justify-between">
          <span>Phí vận chuyển:</span>
          <span className="font-medium text-green-600">Miễn phí</span>
        </div>
        {isPreOrder && (
          <div className="flex justify-between">
            <span>Đặt cọc (50%):</span>
            <span className="font-medium text-orange-600">-{formatCurrency(depositAmount)}</span>
          </div>
        )}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
          <div className="flex justify-between text-xl font-bold">
            <span>{isPreOrder ? 'Cần thanh toán:' : 'Tổng cộng:'}</span>
            <span className="text-primary">
              {formatCurrency(finalAmount)}
            </span>
          </div>
          {isPreOrder && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Còn lại: {formatCurrency(remainingAmount)} (thanh toán khi nhận hàng)
            </p>
          )}
        </div>
      </div>

      <button
        onClick={onSubmitOrder}
        disabled={processing}
        className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary/90 transition-colors mt-6 disabled:opacity-50"
      >
        {processing ? 'Đang xử lý...' : (isPreOrder ? 'Đặt cọc ngay' : 'Đặt hàng ngay')}
      </button>

      <div className="mt-4 text-center">
        <Link to={backLink} className="text-primary hover:underline text-sm">
          {isPreOrder ? 'Quay lại sản phẩm' : 'Quay lại giỏ hàng'}
        </Link>
      </div>
    </div>
  );
};

export default OrderSummary;
