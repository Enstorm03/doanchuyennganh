// Checkout utility functions

export const validatePhoneNumber = (phone) => {
  // Basic Vietnamese phone number validation
  const phoneRegex = /^[0-9]{10,11}$/;
  return phoneRegex.test(phone);
};

export const validateShippingForm = (shippingInfo) => {
  if (!shippingInfo.tenNguoiNhan?.trim()) {
    alert('Vui lòng nhập tên người nhận');
    return false;
  }

  if (!shippingInfo.diaChiGiaoHang?.trim()) {
    alert('Vui lòng nhập địa chỉ giao hàng');
    return false;
  }

  if (!shippingInfo.soDienThoai?.trim()) {
    alert('Vui lòng nhập số điện thoại');
    return false;
  }

  if (!validatePhoneNumber(shippingInfo.soDienThoai.trim())) {
    alert('Số điện thoại không hợp lệ');
    return false;
  }

  return true;
};

export const getOrderItemImageUrl = (item, isPreOrder) => {
  const imageUrl = isPreOrder ? item.url_hinh_anh : item.urlHinhAnh;
  return imageUrl || "https://placehold.co/64x64?text=No+Image";
};

export const getOrderItemName = (item, isPreOrder) => {
  return isPreOrder ? item.ten_san_pham : item.tenSanPham;
};

export const getOrderItemQuantity = (item, isPreOrder) => {
  return isPreOrder ? item.quantity : item.soLuong;
};

export const getOrderItemPrice = (item, isPreOrder) => {
  return isPreOrder ? item.gia_ban : item.giaTaiThoiDiemMua;
};

export const getOrderItemId = (item, isPreOrder) => {
  return isPreOrder ? item.id_san_pham : item.idSanPham;
};

export const PAYMENT_METHODS = {
  COD: 'cod',
  ONLINE: 'online',
  CARD: 'card'
};

export const PAYMENT_METHOD_LABELS = {
  [PAYMENT_METHODS.COD]: '💵 Thanh toán khi nhận hàng (COD)',
  [PAYMENT_METHODS.ONLINE]: '📱 Ví điện tử/ZaloPay/MoMo',
  [PAYMENT_METHODS.CARD]: '💳 Thẻ tín dụng/ghi nợ'
};

export const PAYMENT_METHOD_DESCRIPTIONS = {
  [PAYMENT_METHODS.COD]: 'Thanh toán bằng tiền mặt khi nhận hàng',
  [PAYMENT_METHODS.ONLINE]: 'Thanh toán online an toàn',
  [PAYMENT_METHODS.CARD]: 'Thanh toán bằng thẻ'
};
