import { useState, useEffect } from 'react';
import { filterAndSortProducts, SORT_OPTIONS } from '../utils/productSort';
import { getDefaultFilters } from '../utils/categoryHelpers';

const useCategoryFilters = (products) => {
  const [filters, setFilters] = useState(getDefaultFilters());
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Apply filters and sorting when products or filters change
  useEffect(() => {
    const result = filterAndSortProducts(products, filters);
    setFilteredProducts(result);
  }, [products, filters]);

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleBrandChange = (brandId, checked) => {
    const newSelectedBrands = checked
      ? [...filters.selectedBrands, brandId]
      : filters.selectedBrands.filter(id => id !== brandId);

    updateFilters({ selectedBrands: newSelectedBrands });
  };

  const handleConcentrationChange = (type, checked) => {
    const newSelectedConcentrations = checked
      ? [...filters.selectedConcentrations, type]
      : filters.selectedConcentrations.filter(t => t !== type);

    updateFilters({ selectedConcentrations: newSelectedConcentrations });
  };

  const handlePriceChange = (priceRange) => {
    updateFilters({ maxPrice: priceRange });
  };

  const applyFilters = () => {
    // This function is kept for compatibility but filters are applied automatically
  };

  const clearFilters = () => {
    setFilters(getDefaultFilters());
  };

  const setSortBy = (sortBy) => {
    updateFilters({ sortBy });
  };

  return {
    filters,
    filteredProducts,
    handleBrandChange,
    handleConcentrationChange,
    handlePriceChange,
    applyFilters,
    clearFilters,
    setSortBy,
    sortOptions: SORT_OPTIONS
  };
};

export default useCategoryFilters;


