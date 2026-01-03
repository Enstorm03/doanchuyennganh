import BaseApi, { API_BASE_URL } from './baseApi.js';

class EmployeeApi extends BaseApi {
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
}

const employeeApi = new EmployeeApi();
export default employeeApi;
