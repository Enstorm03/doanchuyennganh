import BaseApi, { API_BASE_URL } from './baseApi.js';

class ProductApi extends BaseApi {
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
}

const productApi = new ProductApi();
export default productApi;
