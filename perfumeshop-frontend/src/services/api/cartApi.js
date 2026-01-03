import BaseApi, { API_BASE_URL } from './baseApi.js';

class CartApi extends BaseApi {
  // Lấy giỏ hàng
  async getCart(userId) {
    try {
      const params = new URLSearchParams({ userId });
      const res = await fetch(`${API_BASE_URL}/cart/dto?${params}`);
      if (res.ok) {
        const data = await res.json();
        return { idDonHang: data.idDonHang || null, chiTiet: data.chiTiet || [] };
      }
    } catch { }

    try {
      const params = new URLSearchParams({ userId });
      const data = await fetch(`${API_BASE_URL}/don-hang/gio-hang-dto?${params}`).then(r => r.json());
      return Array.isArray(data) && data.length > 0 ? data[0] : { idDonHang: null, chiTiet: [] };
    } catch {
      return { idDonHang: null, chiTiet: [] };
    }
  }

  // Thêm sản phẩm vào giỏ hàng
  async addCartItem({ userId, sanPhamId, soLuong }) {
    try {
      return await this._fetch(`${API_BASE_URL}/cart/items`, { method: 'POST', body: JSON.stringify({ userId, sanPhamId, soLuong }) });
    } catch (error) {
      console.error('Lỗi thêm sản phẩm vào giỏ hàng:', error);
      throw error;
    }
  }

  // Thêm sản phẩm pre-order vào giỏ hàng
  async addPreOrderToCart(request) {
    try {
      return await this._fetch(`${API_BASE_URL}/cart/items`, {
        method: 'POST',
        body: JSON.stringify({ ...request, isPreOrder: true })
      });
    } catch (error) {
      console.error('Lỗi thêm pre-order vào giỏ hàng:', error);
      throw error;
    }
  }

  // Xóa sản phẩm khỏi giỏ hàng
  async removeCartItem(userId, sanPhamId) {
    try {
      const params = new URLSearchParams({ userId, sanPhamId });
      return await this._fetch(`${API_BASE_URL}/cart/items?${params}`, { method: 'DELETE' });
    } catch (error) {
      console.error('Lỗi xóa sản phẩm:', error);
      throw error;
    }
  }

  // Xóa toàn bộ giỏ hàng
  async clearCart(userId) {
    try {
      const params = new URLSearchParams({ userId });
      return await this._fetch(`${API_BASE_URL}/cart?${params}`, { method: 'DELETE' });
    } catch (error) {
      console.error('Lỗi xóa giỏ hàng:', error);
      throw error;
    }
  }

  // Cập nhật số lượng sản phẩm
  async updateCartItem(userId, sanPhamId, soLuong) {
    try {
      return await this._fetch(`${API_BASE_URL}/cart/items`, {
        method: 'PUT',
        body: JSON.stringify({ userId, sanPhamId, soLuong })
      });
    } catch (error) {
      console.error('Lỗi cập nhật sản phẩm:', error);
      throw error;
    }
  }

  // Thanh toán giỏ hàng
  async checkoutCart(request) {
    try {
      const cartData = await this.getCart(request.userId);
      if (!cartData?.chiTiet?.length) throw new Error('Giỏ hàng trống');

      const orderData = {
        idNguoiDung: request.userId,
        tenNguoiNhan: request.tenNguoiNhan,
        diaChiGiaoHang: request.diaChiGiaoHang,
        soDienThoai: request.soDienThoai || '',
        ghiChu: request.ghiChu || '',
        phuongThucThanhToan: request.phuongThucThanhToan || 'cod',
        items: cartData.chiTiet.map(({ sanPhamId, soLuong, giaTaiThoiDiemMua }) =>
          ({ sanPhamId, soLuong, giaTaiThoiDiemMua }))
      };

      return await this._fetch(`${API_BASE_URL}/dat-hang`, { method: 'POST', body: JSON.stringify(orderData) });
    } catch (error) {
      console.error('Lỗi thanh toán giỏ hàng:', error);
      throw error;
    }
  }
}

const cartApi = new CartApi();
export default cartApi;
