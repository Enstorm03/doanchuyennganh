// Product sorting utilities for category page

export const SORT_OPTIONS = [
  'Mới nhất',
  'Bán chạy nhất',
  'Giá: Tăng dần',
  'Giá: Giảm dần'
];

export const sortProducts = (products, sortBy) => {
  const sorted = [...products];

  switch (sortBy) {
    case 'Giá: Tăng dần':
      return sorted.sort((a, b) => a.gia_ban - b.gia_ban);

    case 'Giá: Giảm dần':
      return sorted.sort((a, b) => b.gia_ban - a.gia_ban);

    case 'Bán chạy nhất':
      // Sort by sales quantity (assuming so_luong_da_ban field exists)
      return sorted.sort((a, b) => (b.so_luong_da_ban || 0) - (a.so_luong_da_ban || 0));

    case 'Mới nhất':
    default:
      // Sort by product ID descending (assuming higher ID = newer product)
      return sorted.sort((a, b) => b.id_san_pham - a.id_san_pham);
  }
};

export const filterAndSortProducts = (products, filters) => {
  let filtered = [...products];

  // Filter by brands
  if (filters.selectedBrands.length > 0) {
    filtered = filtered.filter(product =>
      filters.selectedBrands.includes(product.id_thuong_hieu)
    );
  }

  // Filter by price
  filtered = filtered.filter(product => product.gia_ban <= filters.maxPrice);

  // Filter by concentration
  if (filters.selectedConcentrations.length > 0) {
    const ranges = {
      'Eau de Parfum (EDP 5-15%)': { min: 5, max: 15 },
      'Eau de Toilette (EDT 15-20%)': { min: 15, max: 20 },
      'Extrait de Parfum 20-40%': { min: 20, max: 40 }
    };

    filtered = filtered.filter(product => {
      const nongDo = product.nong_do;
      return filters.selectedConcentrations.some(type => {
        const range = ranges[type];
        return range && nongDo >= range.min && nongDo <= range.max;
      });
    });
  }

  // Sort products
  return sortProducts(filtered, filters.sortBy);
};
