const API_BASE_URL = 'http://localhost:8080/api';

class ApiService {
  // Helper function to map backend fields to frontend expected fields
  mapProductFields(product) {
    return {
      id_san_pham: product.idSanPham,  // Backend uses "idSanPham"
      ten_san_pham: product.tenSanPham,
      gia_ban: product.giaBan,
      url_hinh_anh: product.urlHinhAnh,
      id_thuong_hieu: product.thuongHieu?.idThuongHieu || 1,  // Use actual brand ID from backend
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

  async updateProduct(id, productData) {
    try {
      const response = await fetch(`${API_BASE_URL}/san-pham/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });
      if (!response.ok) {
        throw new Error('Failed to update product');
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating product:', error);
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

  async getCategories() {
    try {
      const response = await fetch(`${API_BASE_URL}/catalog/danh-muc`);
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  async getBrands() {
    try {
      const response = await fetch(`${API_BASE_URL}/catalog/thuong-hieu`);
      if (!response.ok) {
        throw new Error('Failed to fetch brands');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching brands:', error);
      throw error;
    }
  }

  async searchProducts(kw, danhMucId, thuongHieuId, nongDo, dungTich) {
    try {
      const params = new URLSearchParams();
      if (kw) params.append('kw', kw);
      if (danhMucId) params.append('danhMucId', danhMucId);
      if (thuongHieuId) params.append('thuongHieuId', thuongHieuId);
      if (nongDo) params.append('nongDo', nongDo);
      if (dungTich) params.append('dungTich', dungTich);

      const response = await fetch(`${API_BASE_URL}/catalog/san-pham/search?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to search products');
      }
      const rawProducts = await response.json();
      const productsArray = Array.isArray(rawProducts) ? rawProducts : [rawProducts];
      const mappedProducts = productsArray.map(product => this.mapProductFields(product));
      return mappedProducts;
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  }
  async getCart(userId) {
    try {
      // Try the new CartController endpoint first
      const params = new URLSearchParams({ userId });
      const res = await fetch(`${API_BASE_URL}/cart/dto?${params}`);
      if (res.ok) {
        const cartData = await res.json();
        return {
          idDonHang: cartData.idDonHang || null,
          chiTiet: cartData.chiTiet || []
        };
      }
    } catch (error) {
      console.log('CartController not available, trying fallback...');
    }

    // Fallback to existing DonHangController endpoint
    try {
      const fallbackParams = new URLSearchParams({ userId });
      const fallbackRes = await fetch(`${API_BASE_URL}/don-hang/gio-hang-dto?${fallbackParams}`);
      if (fallbackRes.ok) {
        const fallbackData = await fallbackRes.json();
        return Array.isArray(fallbackData) && fallbackData.length > 0
          ? fallbackData[0]
          : { idDonHang: null, chiTiet: [] };
      }
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError);
    }

    // Return empty cart if all attempts fail
    return { idDonHang: null, chiTiet: [] };
  }


  async addCartItem({ userId, sanPhamId, soLuong }) {
    try {
      const requestData = {
        userId,
        sanPhamId,
        soLuong
      };

      const response = await fetch(`${API_BASE_URL}/cart/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error('Failed to add item to cart');
      }

      return await response.json();
    } catch (error) {
      console.error('Error adding item to cart:', error);
      throw error;
    }
  }

  async addPreOrderToCart(request) {
    try {
      // Add pre-order item to cart - use the same endpoint as regular cart items
      // but mark it as pre-order
      const response = await fetch(`${API_BASE_URL}/cart/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: request.userId,
          sanPhamId: request.sanPhamId,
          soLuong: request.soLuong,
          isPreOrder: true
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to add pre-order to cart');
      }
      return await response.json();
    } catch (error) {
      console.error('Error adding pre-order to cart:', error);
      throw error;
    }
  }



  async removeCartItem(userId, sanPhamId) {
    const params = new URLSearchParams({ userId, sanPhamId });
    const res = await fetch(`${API_BASE_URL}/cart/items?${params}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Không thể xóa sản phẩm khỏi giỏ hàng');
    return res.json();
  }

  async clearCart(userId) {
    const params = new URLSearchParams({ userId });
    const res = await fetch(`${API_BASE_URL}/cart?${params}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Không thể xóa giỏ hàng');
    return res.json();
  }

  async updateCartItem(userId, sanPhamId, soLuong) {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/items`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          sanPhamId,
          soLuong
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('PUT failed:', response.status, errorText);
        throw new Error(`Failed to update cart item: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  }

  async checkoutCart(request) {
    try {
      console.log('Checkout request:', request);

      // Get current cart items to include in the order
      const cartData = await this.getCart(request.userId);
      console.log('Cart data received:', cartData);
      console.log('Cart data type:', typeof cartData);
      console.log('Cart data keys:', cartData ? Object.keys(cartData) : 'null/undefined');

      if (!cartData) {
        throw new Error('Không thể tải dữ liệu giỏ hàng');
      }

      if (!cartData.chiTiet) {
        console.log('cartData.chiTiet is undefined, available properties:', Object.keys(cartData));
        throw new Error('Giỏ hàng không có dữ liệu chi tiết');
      }

      if (!Array.isArray(cartData.chiTiet)) {
        console.log('cartData.chiTiet is not an array:', cartData.chiTiet);
        throw new Error('Dữ liệu chi tiết giỏ hàng không hợp lệ');
      }

      if (cartData.chiTiet.length === 0) {
        throw new Error('Giỏ hàng trống - không có sản phẩm nào để thanh toán');
      }

      console.log('Cart items:', cartData.chiTiet);
      console.log('First cart item:', cartData.chiTiet[0]);
      console.log('First cart item keys:', cartData.chiTiet[0] ? Object.keys(cartData.chiTiet[0]) : 'No items');
      console.log('First cart item idSanPham:', cartData.chiTiet[0]?.idSanPham);
      console.log('First cart item soLuong:', cartData.chiTiet[0]?.soLuong);
      console.log('First cart item giaTaiThoiDiemMua:', cartData.chiTiet[0]?.giaTaiThoiDiemMua);

      // Prepare order data with items
      const orderData = {
        idNguoiDung: request.userId,
        tenNguoiNhan: request.tenNguoiNhan,
        diaChiGiaoHang: request.diaChiGiaoHang,
        soDienThoai: request.soDienThoai || '',
        ghiChu: request.ghiChu || '',
        phuongThucThanhToan: request.phuongThucThanhToan || 'cod',
        items: cartData.chiTiet.map(item => ({
          sanPhamId: item.sanPhamId,  // ✅ Correct field name
          soLuong: item.soLuong,
          giaTaiThoiDiemMua: item.giaTaiThoiDiemMua
        }))
      };

      console.log('Order data to send:', orderData);

      const response = await fetch(`${API_BASE_URL}/dat-hang`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        let errorMessage = 'Failed to checkout cart';
        try {
          const errorData = await response.json();
          console.log('Error response data:', errorData);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          // If can't parse JSON, use default message
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('Checkout result:', result);
      return result;
    } catch (error) {
      console.error('Error checking out cart:', error);
      throw error;
    }
  }

  // Authentication API
  async login(credentials) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        // Try to get error message from response
        let errorMessage = 'Đăng nhập thất bại';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || 'Đăng nhập thất bại';
        } catch (e) {
          // If can't parse JSON, use default message
        }
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }

  async registerCustomer(customerData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register-customer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerData),
      });

      if (!response.ok) {
        // Try to get error message from response
        let errorMessage = 'Đăng ký thất bại';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || 'Đăng ký thất bại';
        } catch (e) {
          // If can't parse JSON, use default message
        }
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error('Error registering customer:', error);
      throw error;
    }
  }

  // Order APIs
  async placeOrder(orderData) {
    try {
      const response = await fetch(`${API_BASE_URL}/dat-hang`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        // Try to get error message from response
        let errorMessage = 'Đặt hàng thất bại';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || 'Đặt hàng thất bại';
        } catch (e) {
          // If can't parse JSON, use default message
        }
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error('Error placing order:', error);
      throw error;
    }
  }

  async cancelOrder(orderId, reason) {
    try {
      const response = await fetch(`${API_BASE_URL}/don-hang/${orderId}/huy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lyDo: reason }),
      });

      if (!response.ok) {
        // Try to get error message from response
        let errorMessage = 'Hủy đơn hàng thất bại';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || 'Hủy đơn hàng thất bại';
        } catch (e) {
          // If can't parse JSON, use default message
        }
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error('Error canceling order:', error);
      throw error;
    }
  }

  // Get user order history
  async getUserOrders(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/don-hang/lich-su?userId=${userId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch user orders');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user orders:', error);
      throw error;
    }
  }

  // Get user order history DTO
  async getUserOrdersHistoryDto(userId, trangThai = null) {
    try {
      let url = `${API_BASE_URL}/don-hang/lich-su-dto?userId=${userId}`;
      if (trangThai) {
        url += `&trangThai=${encodeURIComponent(trangThai)}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to fetch user orders history');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user orders history:', error);
      throw error;
    }
  }

  // Get order details
  async getOrderDetails(orderId) {
    try {
      const response = await fetch(`${API_BASE_URL}/don-hang/${orderId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch order details');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching order details:', error);
      throw error;
    }
  }

  // Confirm order (Admin)
  async confirmOrder(orderId, employeeId) {
    try {
      const response = await fetch(`${API_BASE_URL}/don-hang/${orderId}/xac-nhan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nhanVienId: employeeId }),
      });

      if (!response.ok) {
        throw new Error('Failed to confirm order');
      }

      return await response.json();
    } catch (error) {
      console.error('Error confirming order:', error);
      throw error;
    }
  }

  // Ship order (Admin) - Change status to "Đang giao hàng"
  async shipOrder(orderId) {
    try {
      console.log('Shipping order:', orderId);

      const response = await fetch(`${API_BASE_URL}/don-hang/${orderId}/cap-nhat-van-don`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ maVanDon: "" }), // Send empty string instead of null
      });

      console.log('Ship order response status:', response.status);

      if (!response.ok) {
        let errorText = '';
        try {
          errorText = await response.text();
          console.log('Ship order error response:', errorText);
        } catch (e) {
          console.log('Could not read error response');
        }
        throw new Error(`Failed to ship order (${response.status}): ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error shipping order:', error);
      throw error;
    }
  }

  // Update tracking number (Admin) - Update existing tracking number
  async updateTracking(orderId, trackingNumber) {
    try {
      console.log('Updating tracking for order:', orderId, 'with tracking:', trackingNumber);

      const response = await fetch(`${API_BASE_URL}/don-hang/${orderId}/cap-nhat-van-don`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ maVanDon: trackingNumber }),
      });

      console.log('Update tracking response status:', response.status);

      if (!response.ok) {
        let errorText = '';
        try {
          errorText = await response.text();
          console.log('Update tracking error response:', errorText);
        } catch (e) {
          console.log('Could not read error response');
        }
        throw new Error(`Failed to update tracking (${response.status}): ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating tracking:', error);
      throw error;
    }
  }

  // Update order recipient info (Admin) - For "Chờ hàng" orders
  async updateOrderRecipient(orderId, recipientData) {
    try {
      console.log('Updating recipient info for order:', orderId, recipientData);

      const response = await fetch(`${API_BASE_URL}/don-hang/${orderId}/cap-nhat-nguoi-nhan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipientData),
      });

      console.log('Update recipient response status:', response.status);

      if (!response.ok) {
        let errorText = '';
        try {
          errorText = await response.text();
          console.log('Update recipient error response:', errorText);
        } catch (e) {
          console.log('Could not read error response');
        }
        throw new Error(`Failed to update recipient info (${response.status}): ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating recipient info:', error);
      throw error;
    }
  }

  // Mark remaining payment as collected (Admin) - For "Chờ hàng" orders
  async markPaymentCollected(orderId) {
    try {
      console.log('Marking payment as collected for order:', orderId);

      const response = await fetch(`${API_BASE_URL}/don-hang/${orderId}/da-thu-tien-con-lai`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      console.log('Mark payment collected response status:', response.status);

      if (!response.ok) {
        let errorText = '';
        try {
          errorText = await response.text();
          console.log('Mark payment collected error response:', errorText);
        } catch (e) {
          console.log('Could not read error response');
        }
        throw new Error(`Failed to mark payment collected (${response.status}): ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error marking payment collected:', error);
      throw error;
    }
  }

  // Move order from "Chờ hàng" to "Đang chờ" (Admin)
  async moveToPending(orderId) {
    try {
      const response = await fetch(`${API_BASE_URL}/don-hang/${orderId}/chuyen-dang-cho`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error('Failed to move order to pending');
      }

      return await response.json();
    } catch (error) {
      console.error('Error moving order to pending:', error);
      throw error;
    }
  }

  // POS APIs
  // Create POS sale order (full payment)
  async createPosBanLe(employeeId, customerId, tenKhachVangLai, itemsInput) {
    try {
      const requestData = {
        nhanVienId: employeeId,
        khachHangId: customerId,
        tenKhachVangLai: tenKhachVangLai,
        items: itemsInput
      };

      console.log('Creating POS sale:', requestData);
      console.log('Request URL:', `${API_BASE_URL}/pos/ban-le`);

      const response = await fetch(`${API_BASE_URL}/pos/ban-le`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        let errorText = '';
        try {
          errorText = await response.text();
          console.log('Error response text:', errorText);
        } catch (e) {
          console.log('Could not read error response');
        }
        throw new Error(`Failed to create POS sale (${response.status}): ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating POS sale:', error);
      throw error;
    }
  }

  // Create POS deposit order (partial payment)
  async createPosOrder(employeeId, customerId, tenKhachVangLai, itemsInput) {
    try {
      const requestData = {
        nhanVienId: employeeId,
        khachHangId: customerId,
        tenKhachVangLai: tenKhachVangLai,
        items: itemsInput
      };

      console.log('Creating POS deposit order:', requestData);

      const response = await fetch(`${API_BASE_URL}/pos/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error('Failed to create POS deposit order');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating POS deposit order:', error);
      throw error;
    }
  }

  // Complete order (Admin)
  async completeOrder(orderId) {
    try {
      const response = await fetch(`${API_BASE_URL}/don-hang/${orderId}/hoan-thanh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error('Failed to complete order');
      }

      return await response.json();
    } catch (error) {
      console.error('Error completing order:', error);
      throw error;
    }
  }

  // Search orders by tracking number
  async searchOrdersByTracking(query) {
    try {
      const response = await fetch(`${API_BASE_URL}/don-hang/search-by-tracking?q=${encodeURIComponent(query)}`);

      if (!response.ok) {
        throw new Error('Failed to search orders by tracking');
      }

      return await response.json();
    } catch (error) {
      console.error('Error searching orders by tracking:', error);
      throw error;
    }
  }

  // Reviews
  async createReview(reviewData) {
    try {
      const response = await fetch(`${API_BASE_URL}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) {
        throw new Error('Failed to create review');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  }

  // Returns/Refunds
  async getPendingReturns() {
    try {
      const response = await fetch(`${API_BASE_URL}/doi-tra/cho-duyet`);

      if (!response.ok) {
        throw new Error('Failed to fetch pending returns');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching pending returns:', error);
      throw error;
    }
  }

  async createReturn(returnData) {
    try {
      const response = await fetch(`${API_BASE_URL}/doi-tra`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(returnData),
      });

      if (!response.ok) {
        throw new Error('Failed to create return request');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating return request:', error);
      throw error;
    }
  }

  async approveReturn(returnId, employeeId) {
    try {
      const response = await fetch(`${API_BASE_URL}/doi-tra/${returnId}/duyet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nhanVienId: employeeId }),
      });

      if (!response.ok) {
        throw new Error('Failed to approve return');
      }

      return await response.json();
    } catch (error) {
      console.error('Error approving return:', error);
      throw error;
    }
  }

  async rejectReturn(returnId, employeeId) {
    try {
      const response = await fetch(`${API_BASE_URL}/doi-tra/${returnId}/tu-choi`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nhanVienId: employeeId }),
      });

      if (!response.ok) {
        throw new Error('Failed to reject return');
      }

      return await response.json();
    } catch (error) {
      console.error('Error rejecting return:', error);
      throw error;
    }
  }

  async checkOrderReturnStatus(orderId, userId) {
    try {
      // This could be a new endpoint or we can check against pending returns
      const pendingReturns = await this.getPendingReturns();

      // Check if this order already has a return request from this user
      const existingReturn = pendingReturns.find(returnItem =>
        returnItem.idDonHang === orderId && returnItem.idNguoiDung === userId
      );

      return existingReturn ? existingReturn : null;
    } catch (error) {
      console.error('Error checking order return status:', error);
      // Return null on error (assume no return request)
      return null;
    }
  }

  // Admin APIs - Employees
  async getEmployees() {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/nhan-vien`);
      if (!response.ok) {
        throw new Error('Failed to fetch employees');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw error;
    }
  }

  async getEmployee(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/nhan-vien/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch employee');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching employee:', error);
      throw error;
    }
  }

  async createEmployee(employeeData) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/nhan-vien`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeData),
      });
      if (!response.ok) {
        throw new Error('Failed to create employee');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating employee:', error);
      throw error;
    }
  }

  async updateEmployeeRole(id, roleData) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/nhan-vien/${id}/role`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(roleData),
      });
      if (!response.ok) {
        throw new Error('Failed to update employee role');
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating employee role:', error);
      throw error;
    }
  }

  async resetEmployeePassword(id, passwordData) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/nhan-vien/${id}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(passwordData),
      });
      if (!response.ok) {
        throw new Error('Failed to reset employee password');
      }
    } catch (error) {
      console.error('Error resetting employee password:', error);
      throw error;
    }
  }

  async deleteEmployee(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/nhan-vien/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete employee');
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
      throw error;
    }
  }

  // Admin APIs - Orders
  async getOrders(statusFilter = null) {
    try {
      const params = statusFilter && statusFilter !== 'All' ? `?trangThai=${encodeURIComponent(statusFilter)}` : '';
      console.log('Fetching orders with URL:', `${API_BASE_URL}/don-hang${params}`);

      const response = await fetch(`${API_BASE_URL}/don-hang${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch orders: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Orders data received:', data);
      return data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }



  // Admin APIs - Customers
  async getCustomers() {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/khach-hang`);
      if (!response.ok) {
        throw new Error('Failed to fetch customers');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  }

  async getCustomer(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/khach-hang/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch customer');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching customer:', error);
      throw error;
    }
  }

  async createCustomer(customerData) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/khach-hang`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerData),
      });
      if (!response.ok) {
        throw new Error('Failed to create customer');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  }

  async updateCustomer(id, customerData) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/khach-hang/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerData),
      });
      if (!response.ok) {
        throw new Error('Failed to update customer');
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating customer:', error);
      throw error;
    }
  }

  async resetCustomerPassword(id, passwordData) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/khach-hang/${id}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(passwordData),
      });
      if (!response.ok) {
        throw new Error('Failed to reset customer password');
      }
    } catch (error) {
      console.error('Error resetting customer password:', error);
      throw error;
    }
  }

  async deleteCustomer(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/khach-hang/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete customer');
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
      throw error;
    }
  }
}

export default new ApiService();
