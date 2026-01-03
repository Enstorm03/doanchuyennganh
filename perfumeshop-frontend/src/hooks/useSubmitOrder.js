import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { validateShippingForm } from '../utils/checkoutUtils';

const useSubmitOrder = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);

  const submitOrder = async (checkoutData, shippingInfo, paymentMethod) => {
    if (!validateShippingForm(shippingInfo)) return;

    try {
      setProcessing(true);

      let result;

      if (checkoutData.isPreOrder) {
        // Handle pre-order
        const preOrderPayload = {
          idNguoiDung: user.id_nguoi_dung,
          tenNguoiNhan: shippingInfo.tenNguoiNhan.trim(),
          diaChiGiaoHang: shippingInfo.diaChiGiaoHang.trim(),
          soDienThoai: shippingInfo.soDienThoai.trim(),
          ghiChu: checkoutData.preOrderData.ghiChu || shippingInfo.ghiChu.trim(),
          phuongThucThanhToan: paymentMethod,
          items: checkoutData.preOrderData.items.map(item => ({
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

  return {
    submitOrder,
    processing
  };
};

export default useSubmitOrder;


