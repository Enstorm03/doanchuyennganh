import BaseApi, { API_BASE_URL } from './baseApi.js';

class ReturnApi extends BaseApi {
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
}

const returnApi = new ReturnApi();
export default returnApi;
