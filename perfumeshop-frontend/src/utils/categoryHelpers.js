// Category helpers for category page

export const getCategoryName = (id, categories) => {
  const category = categories.find(cat => cat.idDanhMuc === parseInt(id));
  return category ? category.tenDanhMuc : "Tất cả sản phẩm";
};

export const getBrandName = (id, brands) => {
  const brand = brands.find(b => b.idThuongHieu === parseInt(id));
  return brand ? brand.tenThuongHieu : "Tất cả thương hiệu";
};

export const getCategoryTitle = (categoryId, brandId, searchQuery, categories, brands) => {
  if (searchQuery) return `Kết quả tìm kiếm: "${searchQuery}"`;
  if (brandId) return getBrandName(brandId, brands);
  if (categoryId) return getCategoryName(categoryId, categories);
  return "Tất cả sản phẩm";
};

export const getConcentrationTypes = () => [
  'Eau de Parfum (EDP 5-15%)',
  'Eau de Toilette (EDT 15-20%)',
  'Extrait de Parfum 20-40%'
];

export const getConcentrationRanges = () => ({
  'Eau de Parfum (EDP 5-15%)': { min: 5, max: 15 },
  'Eau de Toilette (EDT 15-20%)': { min: 15, max: 20 },
  'Extrait de Parfum 20-40%': { min: 20, max: 40 }
});

export const filterByConcentration = (products, selectedConcentrations) => {
  if (selectedConcentrations.length === 0) return products;

  const ranges = getConcentrationRanges();

  return products.filter(product => {
    const nongDo = product.nong_do;
    return selectedConcentrations.some(type => {
      const range = ranges[type];
      return range && nongDo >= range.min && nongDo <= range.max;
    });
  });
};

export const getDefaultFilters = () => ({
  selectedBrands: [],
  selectedConcentrations: [],
  maxPrice: 10000000,
  sortBy: 'Mới nhất'
});
