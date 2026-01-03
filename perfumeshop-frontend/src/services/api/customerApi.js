import BaseApi, { API_BASE_URL } from './baseApi.js';

class CustomerApi extends BaseApi {
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

const customerApi = new CustomerApi();
export default customerApi;
