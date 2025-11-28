const API_BASE_URL = 'http://localhost:8080/api';

class ApiService {
  // Helper function to map backend fields to frontend expected fields
  mapProductFields(product) {
    return {
      id_san_pham: product.idSanPham,  // Backend uses "idSanPham"
      ten_san_pham: product.tenSanPham,
      gia_ban: product.giaBan,
      url_hinh_anh: product.urlHinhAnh,
      id_thuong_hieu: 1,  // Default brand ID since backend doesn't provide
      id_danh_muc: 1,     // Default category ID since backend doesn't provide
      so_luong_ton_kho: product.soLuongTonKho,
      mo_ta: product.moTa,
      dung_tich_ml: product.dungTichMl,
      nong_do: product.nongDo
    };
  }

  async getAllProducts() {
    try {
      const response = await fetch(`${API_BASE_URL}/san-pham`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const rawProducts = await response.json();
      console.log('Raw products data from backend:', rawProducts);
      // Handle both array and single object responses
      const productsArray = Array.isArray(rawProducts) ? rawProducts : [rawProducts];
      const mappedProducts = productsArray.map(product => this.mapProductFields(product));
      console.log('Mapped products data:', mappedProducts);
      return mappedProducts;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  async getProductById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/san-pham/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }
      const rawProduct = await response.json();
      console.log('Raw product data from backend:', rawProduct);
      const mappedProduct = this.mapProductFields(rawProduct);
      console.log('Mapped product data:', mappedProduct);
      return mappedProduct;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }

  async createProduct(product) {
    try {
      const response = await fetch(`${API_BASE_URL}/san-pham`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });
      if (!response.ok) {
        throw new Error('Failed to create product');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  async deleteProduct(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/san-pham/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }
}

export default new ApiService();
