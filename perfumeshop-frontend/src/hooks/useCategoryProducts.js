import { useState, useEffect } from 'react';
import api from '../services/api';

const useCategoryProducts = (categoryId, brandId, searchQuery) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        let fetchedProducts;
        if (searchQuery) {
          fetchedProducts = await api.searchProducts(searchQuery);
        } else if (brandId) {
          fetchedProducts = await api.searchProducts('', '', brandId);
        } else if (categoryId) {
          fetchedProducts = await api.searchProducts('', categoryId);
        } else {
          fetchedProducts = await api.getAllProducts();
        }
        setProducts(fetchedProducts);
      } catch (err) {
        setError('Không thể tải sản phẩm. Vui lòng thử lại sau.');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId, brandId, searchQuery]);

  return {
    products,
    loading,
    error
  };
};

export default useCategoryProducts;
