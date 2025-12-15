const API_BASE_URL = 'http://localhost:8080/api';

class ApiService {
  // Hàm helper để thực hiện fetch request với xử lý lỗi
  async _fetch(url, options = {}) {
    const response = await fetch(url, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options
    });
    if (!response.ok) throw new Error(await this._getErrorMessage(response));
    return response.json();
  }

  // Lấy thông báo lỗi từ response
  async _getErrorMessage(response) {
    try {
      const data = await response.json();
      return data.message || data.error || 'Có lỗi xảy ra';
    } catch {
      return await response.text() || `Lỗi HTTP ${response.status}`;
    }
  }

  // Ánh xạ dữ liệu sản phẩm từ backend
  mapProductFields(product) {
    return {
      id_san_pham: product.idSanPham,
      ten_san_pham: product.tenSanPham,
      gia_ban: product.giaBan,
      url_hinh_anh: product.urlHinhAnh,
      id_thuong_hieu: product.thuongHieu?.idThuongHieu || 1,
      id_danh_muc: 1,
      so_luong_ton_kho: product.soLuongTonKho,
      mo_ta: product.moTa,
      dung_tich_ml: product.dungTichMl,
      nong_do: product.nongDo
    };
  }

  // Chuyển đổi mảng sản phẩm thành định dạng frontend
  _mapProducts(data) {
    return (Array.isArray(data) ? data : [data]).map(p => this.mapProductFields(p));
  }

  // Lấy tất cả sản phẩm
  async getAllProducts() {
    try {
      return this._mapProducts(await this._fetch(`${API_BASE_URL}/san-pham`));
    } catch (error) {
      console.error('Lỗi lấy sản phẩm:', error);
      throw error;
    }
  }

  // Lấy sản phẩm theo ID
  async getProductById(id) {
    try {
      return this.mapProductFields(await this._fetch(`${API_BASE_URL}/san-pham/${id}`));
    } catch (error) {
      console.error('Lỗi lấy sản phẩm:', error);
      throw error;
    }
  }

  // Tạo sản phẩm mới
  async createProduct(product) {
    try {
      return await this._fetch(`${API_BASE_URL}/san-pham`, { method: 'POST', body: JSON.stringify(product) });
    } catch (error) {
      console.error('Lỗi tạo sản phẩm:', error);
      throw error;
    }
  }

  // Cập nhật sản phẩm
  async updateProduct(id, productData) {
    try {
      return await this._fetch(`${API_BASE_URL}/san-pham/${id}`, { method: 'PUT', body: JSON.stringify(productData) });
    } catch (error) {
      console.error('Lỗi cập nhật sản phẩm:', error);
      throw error;
    }
  }

  // Xóa sản phẩm
  async deleteProduct(id) {
    try {
      await this._fetch(`${API_BASE_URL}/san-pham/${id}`, { method: 'DELETE' });
    } catch (error) {
      console.error('Lỗi xóa sản phẩm:', error);
      throw error;
    }
  }

  // Lấy danh mục
  async getCategories() {
    try {
      return await this._fetch(`${API_BASE_URL}/catalog/danh-muc`);
    } catch (error) {
      console.error('Lỗi lấy danh mục:', error);
      throw error;
    }
  }

  // Lấy thương hiệu
  async getBrands() {
    try {
      return await this._fetch(`${API_BASE_URL}/catalog/thuong-hieu`);
    } catch (error) {
      console.error('Lỗi lấy thương hiệu:', error);
      throw error;
    }
  }

  // Tìm kiếm sản phẩm
  async searchProducts(kw, danhMucId, thuongHieuId, nongDo, dungTich) {
    try {
      const params = new URLSearchParams();
      if (kw) params.append('kw', kw);
      if (danhMucId) params.append('danhMucId', danhMucId);
      if (thuongHieuId) params.append('thuongHieuId', thuongHieuId);
      if (nongDo) params.append('nongDo', nongDo);
      if (dungTich) params.append('dungTich', dungTich);

      return this._mapProducts(await this._fetch(`${API_BASE_URL}/catalog/san-pham/search?${params.toString()}`));
    } catch (error) {
      console.error('Lỗi tìm kiếm sản phẩm:', error);
      throw error;
    }
  }
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

  // Đăng nhập
  async login(credentials) {
    try {
      return await this._fetch(`${API_BASE_URL}/auth/login`, { method: 'POST', body: JSON.stringify(credentials) });
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
      throw error;
    }
  }

  // Đăng ký khách hàng
  async registerCustomer(customerData) {
    try {
      return await this._fetch(`${API_BASE_URL}/auth/register-customer`, { method: 'POST', body: JSON.stringify(customerData) });
    } catch (error) {
      console.error('Lỗi đăng ký:', error);
      throw error;
    }
  }

  // Đặt hàng
  async placeOrder(orderData) {
    try {
      return await this._fetch(`${API_BASE_URL}/dat-hang`, { method: 'POST', body: JSON.stringify(orderData) });
    } catch (error) {
      console.error('Lỗi đặt hàng:', error);
      throw error;
    }
  }

  // Hủy đơn hàng
  async cancelOrder(orderId, reason) {
    try {
      return await this._fetch(`${API_BASE_URL}/don-hang/${orderId}/huy`, { method: 'POST', body: JSON.stringify({ lyDo: reason }) });
    } catch (error) {
      console.error('Lỗi hủy đơn hàng:', error);
      throw error;
    }
  }

  // Lấy lịch sử đơn hàng
  async getUserOrders(userId) {
    try {
      return await this._fetch(`${API_BASE_URL}/don-hang/lich-su?userId=${userId}`);
    } catch (error) {
      console.error('Lỗi lấy lịch sử đơn hàng:', error);
      throw error;
    }
  }

  // Lấy lịch sử đơn hàng DTO
  async getUserOrdersHistoryDto(userId, trangThai = null) {
    try {
      const url = `${API_BASE_URL}/don-hang/lich-su-dto?userId=${userId}${trangThai ? `&trangThai=${encodeURIComponent(trangThai)}` : ''}`;
      return await this._fetch(url);
    } catch (error) {
      console.error('Lỗi lấy lịch sử đơn hàng:', error);
      throw error;
    }
  }

  // Lấy chi tiết đơn hàng
  async getOrderDetails(orderId) {
    try {
      return await this._fetch(`${API_BASE_URL}/don-hang/${orderId}`);
    } catch (error) {
      console.error('Lỗi lấy chi tiết đơn hàng:', error);
      throw error;
    }
  }

  // Xác nhận đơn hàng (Admin)
  async confirmOrder(orderId, employeeId) {
    try {
      return await this._fetch(`${API_BASE_URL}/don-hang/${orderId}/xac-nhan`, { method: 'POST', body: JSON.stringify({ nhanVienId: employeeId }) });
    } catch (error) {
      console.error('Lỗi xác nhận đơn hàng:', error);
      throw error;
    }
  }

  // Cập nhật vận đơn (Admin)
  async shipOrder(orderId) {
    try {
      return await this._fetch(`${API_BASE_URL}/don-hang/${orderId}/cap-nhat-van-don`, { method: 'POST', body: JSON.stringify({ maVanDon: "" }) });
    } catch (error) {
      console.error('Lỗi cập nhật vận đơn:', error);
      throw error;
    }
  }

  // Cập nhật số vận đơn theo dõi (Admin)
  async updateTracking(orderId, trackingNumber) {
    try {
      return await this._fetch(`${API_BASE_URL}/don-hang/${orderId}/cap-nhat-van-don`, { method: 'POST', body: JSON.stringify({ maVanDon: trackingNumber }) });
    } catch (error) {
      console.error('Lỗi cập nhật theo dõi:', error);
      throw error;
    }
  }

  // Cập nhật thông tin người nhận (Admin)
  async updateOrderRecipient(orderId, recipientData) {
    try {
      return await this._fetch(`${API_BASE_URL}/don-hang/${orderId}/cap-nhat-nguoi-nhan`, { method: 'POST', body: JSON.stringify(recipientData) });
    } catch (error) {
      console.error('Lỗi cập nhật người nhận:', error);
      throw error;
    }
  }

  // Đánh dấu đã thu tiền (Admin)
  async markPaymentCollected(orderId) {
    try {
      return await this._fetch(`${API_BASE_URL}/don-hang/${orderId}/da-thu-tien-con-lai`, { method: 'POST', body: JSON.stringify({}) });
    } catch (error) {
      console.error('Lỗi đánh dấu đã thu tiền:', error);
      throw error;
    }
  }

  // Chuyển sang trạng thái "Đang chờ" (Admin)
  async moveToPending(orderId) {
    try {
      return await this._fetch(`${API_BASE_URL}/don-hang/${orderId}/chuyen-dang-cho`, { method: 'POST', body: JSON.stringify({}) });
    } catch (error) {
      console.error('Lỗi chuyển sang Đang chờ:', error);
      throw error;
    }
  }

  // POS - Bán lẻ (thanh toán đầy đủ)
  async createPosBanLe(employeeId, customerId, tenKhachVangLai, itemsInput) {
    try {
      return await this._fetch(`${API_BASE_URL}/pos/ban-le`, { 
        method: 'POST', 
        body: JSON.stringify({ nhanVienId: employeeId, khachHangId: customerId, tenKhachVangLai, items: itemsInput })
      });
    } catch (error) {
      console.error('Lỗi tạo POS bán lẻ:', error);
      throw error;
    }
  }

  // POS - Đặt hàng (thanh toán cọc)
  async createPosOrder(employeeId, customerId, tenKhachVangLai, itemsInput) {
    try {
      return await this._fetch(`${API_BASE_URL}/pos/order`, { 
        method: 'POST', 
        body: JSON.stringify({ nhanVienId: employeeId, khachHangId: customerId, tenKhachVangLai, items: itemsInput })
      });
    } catch (error) {
      console.error('Lỗi tạo POS đặt hàng:', error);
      throw error;
    }
  }

  // Hoàn thành đơn hàng (Admin)
  async completeOrder(orderId) {
    try {
      return await this._fetch(`${API_BASE_URL}/don-hang/${orderId}/hoan-thanh`, { method: 'POST', body: JSON.stringify({}) });
    } catch (error) {
      console.error('Lỗi hoàn thành đơn hàng:', error);
      throw error;
    }
  }

  // Tìm kiếm đơn hàng theo số vận đơn
  async searchOrdersByTracking(query) {
    try {
      return await this._fetch(`${API_BASE_URL}/don-hang/search-by-tracking?q=${encodeURIComponent(query)}`);
    } catch (error) {
      console.error('Lỗi tìm kiếm theo vận đơn:', error);
      throw error;
    }
  }

  // Tạo đánh giá
  async createReview(reviewData) {
    try {
      return await this._fetch(`${API_BASE_URL}/reviews`, { method: 'POST', body: JSON.stringify(reviewData) });
    } catch (error) {
      console.error('Lỗi tạo đánh giá:', error);
      throw error;
    }
  }

  // Lấy danh sách hoàn trả chờ duyệt
  async getPendingReturns() {
    try {
      return await this._fetch(`${API_BASE_URL}/doi-tra/cho-duyet`);
    } catch (error) {
      console.error('Lỗi lấy hoàn trả chờ duyệt:', error);
      throw error;
    }
  }

  // Tạo yêu cầu hoàn trả
  async createReturn(returnData) {
    try {
      return await this._fetch(`${API_BASE_URL}/doi-tra`, { method: 'POST', body: JSON.stringify(returnData) });
    } catch (error) {
      console.error('Lỗi tạo yêu cầu hoàn trả:', error);
      throw error;
    }
  }

  // Duyệt hoàn trả
  async approveReturn(returnId, employeeId) {
    try {
      return await this._fetch(`${API_BASE_URL}/doi-tra/${returnId}/duyet`, { method: 'POST', body: JSON.stringify({ nhanVienId: employeeId }) });
    } catch (error) {
      console.error('Lỗi duyệt hoàn trả:', error);
      throw error;
    }
  }

  // Từ chối hoàn trả
  async rejectReturn(returnId, employeeId) {
    try {
      return await this._fetch(`${API_BASE_URL}/doi-tra/${returnId}/tu-choi`, { method: 'POST', body: JSON.stringify({ nhanVienId: employeeId }) });
    } catch (error) {
      console.error('Lỗi từ chối hoàn trả:', error);
      throw error;
    }
  }

  // Kiểm tra trạng thái hoàn trả của đơn hàng
  async checkOrderReturnStatus(orderId, userId) {
    try {
      const returns = await this.getPendingReturns();
      return returns.find(r => r.idDonHang === orderId && r.idNguoiDung === userId) || null;
    } catch (error) {
      console.error('Lỗi kiểm tra hoàn trả:', error);
      return null;
    }
  }

  // Lấy danh sách nhân viên
  async getEmployees() {
    try {
      return await this._fetch(`${API_BASE_URL}/admin/nhan-vien`);
    } catch (error) {
      console.error('Lỗi lấy nhân viên:', error);
      throw error;
    }
  }

  // Lấy nhân viên theo ID
  async getEmployee(id) {
    try {
      return await this._fetch(`${API_BASE_URL}/admin/nhan-vien/${id}`);
    } catch (error) {
      console.error('Lỗi lấy nhân viên:', error);
      throw error;
    }
  }

  // Tạo nhân viên
  async createEmployee(employeeData) {
    try {
      return await this._fetch(`${API_BASE_URL}/admin/nhan-vien`, { method: 'POST', body: JSON.stringify(employeeData) });
    } catch (error) {
      console.error('Lỗi tạo nhân viên:', error);
      throw error;
    }
  }

  // Cập nhật vai trò nhân viên
  async updateEmployeeRole(id, roleData) {
    try {
      return await this._fetch(`${API_BASE_URL}/admin/nhan-vien/${id}/role`, { method: 'POST', body: JSON.stringify(roleData) });
    } catch (error) {
      console.error('Lỗi cập nhật vai trò nhân viên:', error);
      throw error;
    }
  }

  // Đặt lại mật khẩu nhân viên
  async resetEmployeePassword(id, passwordData) {
    try {
      await this._fetch(`${API_BASE_URL}/admin/nhan-vien/${id}/reset-password`, { method: 'POST', body: JSON.stringify(passwordData) });
    } catch (error) {
      console.error('Lỗi đặt lại mật khẩu nhân viên:', error);
      throw error;
    }
  }

  // Xóa nhân viên
  async deleteEmployee(id) {
    try {
      await this._fetch(`${API_BASE_URL}/admin/nhan-vien/${id}`, { method: 'DELETE' });
    } catch (error) {
      console.error('Lỗi xóa nhân viên:', error);
      throw error;
    }
  }

  // Lấy danh sách đơn hàng
  async getOrders(statusFilter = null) {
    try {
      const params = statusFilter && statusFilter !== 'All' ? `?trangThai=${encodeURIComponent(statusFilter)}` : '';
      return await this._fetch(`${API_BASE_URL}/don-hang${params}`);
    } catch (error) {
      console.error('Lỗi lấy đơn hàng:', error);
      throw error;
    }
  }

  // Lấy danh sách khách hàng
  async getCustomers() {
    try {
      return await this._fetch(`${API_BASE_URL}/admin/khach-hang`);
    } catch (error) {
      console.error('Lỗi lấy khách hàng:', error);
      throw error;
    }
  }

  // Lấy khách hàng theo ID
  async getCustomer(id) {
    try {
      return await this._fetch(`${API_BASE_URL}/admin/khach-hang/${id}`);
    } catch (error) {
      console.error('Lỗi lấy khách hàng:', error);
      throw error;
    }
  }

  // Tạo khách hàng
  async createCustomer(customerData) {
    try {
      return await this._fetch(`${API_BASE_URL}/admin/khach-hang`, { method: 'POST', body: JSON.stringify(customerData) });
    } catch (error) {
      console.error('Lỗi tạo khách hàng:', error);
      throw error;
    }
  }

  // Cập nhật khách hàng
  async updateCustomer(id, customerData) {
    try {
      return await this._fetch(`${API_BASE_URL}/admin/khach-hang/${id}`, { method: 'PUT', body: JSON.stringify(customerData) });
    } catch (error) {
      console.error('Lỗi cập nhật khách hàng:', error);
      throw error;
    }
  }

  // Đặt lại mật khẩu khách hàng
  async resetCustomerPassword(id, passwordData) {
    try {
      await this._fetch(`${API_BASE_URL}/admin/khach-hang/${id}/reset-password`, { method: 'POST', body: JSON.stringify(passwordData) });
    } catch (error) {
      console.error('Lỗi đặt lại mật khẩu khách hàng:', error);
      throw error;
    }
  }

  // Xóa khách hàng
  async deleteCustomer(id) {
    try {
      await this._fetch(`${API_BASE_URL}/admin/khach-hang/${id}`, { method: 'DELETE' });
    } catch (error) {
      console.error('Lỗi xóa khách hàng:', error);
      throw error;
    }
  }
}

const api = new ApiService();
export default api;
