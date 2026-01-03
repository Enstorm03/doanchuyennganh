import React from 'react';
import { getOrderItemImageUrl, getOrderItemName, getOrderItemQuantity, getOrderItemPrice, getOrderItemId } from '../../../../../utils/checkoutUtils';


const OrderItems = ({ items, isPreOrder }) => {
  return (
    <div className="bg-white dark:bg-content-dark rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold mb-4">Sản phẩm trong đơn hàng</h3>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {items.map((item) => (
          <div key={getOrderItemId(item, isPreOrder)} className="flex items-center gap-4 py-2">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={getOrderItemImageUrl(item, isPreOrder)}
                alt={getOrderItemName(item, isPreOrder)}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-text-light dark:text-text-dark truncate">
                {getOrderItemName(item, isPreOrder)}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Số lượng: {getOrderItemQuantity(item, isPreOrder)}
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold text-primary">
                {(getOrderItemPrice(item, isPreOrder) * getOrderItemQuantity(item, isPreOrder)).toLocaleString('vi-VN')}₫
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderItems;
