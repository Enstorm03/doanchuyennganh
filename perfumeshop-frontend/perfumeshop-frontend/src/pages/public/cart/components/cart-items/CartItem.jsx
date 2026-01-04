import React from 'react';
import { calculateItemSubtotal } from '../../../../../utils/cartUtils';

const CartItem = ({
  item,
  updatingItem,
  onUpdateQuantity,
  onRemoveItem
}) => {


  return (
    <div className="bg-white dark:bg-content-dark rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center gap-4">
        {/* Product Image */}
        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
          <img
            src={item.urlHinhAnh || "https://placehold.co/80x80?text=No+Image"}
            alt={item.tenSanPham}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-text-light dark:text-text-dark truncate">
            {item.tenSanPham}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Thương hiệu: {item.tenThuongHieu || 'N/A'}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Dung tích: {item.dungTichMl}ml • Nồng độ: {item.nongDo}
          </p>
          <p className="text-lg font-bold text-primary mt-1">
            {item.giaTaiThoiDiemMua.toLocaleString('vi-VN')}₫
          </p>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const newQty = Math.max(0, item.soLuong - 1);
              onUpdateQuantity(item.sanPhamId, newQty);
            }}
            disabled={updatingItem === item.sanPhamId}
            className="w-8 h-8 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            -
          </button>
          <span className="w-12 text-center font-medium">
            {updatingItem === item.sanPhamId ? '...' : item.soLuong}
          </span>
          <button
            onClick={() => {
              const newQty = item.soLuong + 1;
              onUpdateQuantity(item.sanPhamId, newQty);
            }}
            disabled={updatingItem === item.sanPhamId}
            className="w-8 h-8 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            +
          </button>
        </div>

        {/* Subtotal */}
        <div className="text-right">
          <p className="font-bold text-lg text-text-light dark:text-text-dark">
            {calculateItemSubtotal(item).toLocaleString('vi-VN')}₫
          </p>
        </div>

        {/* Remove Button */}
        <button
          onClick={() => onRemoveItem(item.sanPhamId)}
          disabled={updatingItem === item.sanPhamId}
          className="w-8 h-8 flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-sm">delete</span>
        </button>
      </div>
    </div>
  );
};

export default CartItem;
