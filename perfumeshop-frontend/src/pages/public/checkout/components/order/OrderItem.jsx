import React from 'react';
import { getOrderItemImageUrl, getOrderItemName, getOrderItemQuantity, getOrderItemPrice, getOrderItemId } from '../../../utils/checkoutUtils';

const OrderItem = ({ item, isPreOrder }) => {
  return (
    <div className="flex items-center gap-4 py-2">
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
  );
};

export default OrderItem;
