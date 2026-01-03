import React from 'react';
import { useSearchParams } from 'react-router-dom';
import useCategoryMetadata from '../../hooks/useCategoryMetadata';
import useCategoryProducts from '../../hooks/useCategoryProducts';
import useCategoryFilters from '../../hooks/useCategoryFilters';
import CategoryBreadcrumb from './category/components/CategoryBreadcrumb';
import CategoryHeader from './category/components/CategoryHeader';
import FilterSidebar from './category/components/filters/FilterSidebar';
import SortBar from './category/components/SortBar';
import ProductGrid from './category/components/ProductGrid';
import ProductGridSkeleton from './category/components/ProductGridSkeleton';
import EmptyProductState from './category/components/EmptyProductState';
import { getCategoryTitle } from '../../utils/categoryHelpers';

const CategoryPage = () => {
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('category');
  const brandId = searchParams.get('brand');
  const searchQuery = searchParams.get('search');

  const { categories, brands } = useCategoryMetadata();
  const { products, loading: productsLoading, error: productsError } = useCategoryProducts(categoryId, brandId, searchQuery);
  const {
    filters,
    filteredProducts,
    handleBrandChange,
    handleConcentrationChange,
    handlePriceChange,
    clearFilters,
    setSortBy,
    sortOptions
  } = useCategoryFilters(products);

  const categoryTitle = getCategoryTitle(categoryId, brandId, searchQuery, categories, brands);

  return (
    <main className="container mx-auto px-4 py-8 min-h-screen bg-background-light dark:bg-background-dark">
      <CategoryBreadcrumb categoryTitle="Sản phẩm" />

      <CategoryHeader title={categoryTitle} />

      <div className="flex flex-col lg:flex-row gap-8">
        <FilterSidebar
          brands={brands}
          filters={filters}
          onBrandChange={handleBrandChange}
          onConcentrationChange={handleConcentrationChange}
          onPriceChange={handlePriceChange}
          onClearFilters={clearFilters}
        />

        <div className="w-full lg:w-3/4 xl:w-4/5">
          <SortBar
            productCount={filteredProducts.length}
            sortBy={filters.sortBy}
            onSortChange={setSortBy}
            sortOptions={sortOptions}
            loading={productsLoading}
            error={productsError}
          />

          {productsLoading && <ProductGridSkeleton />}

          {productsError && (
            <div className="text-center py-12">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md mx-auto">
                <p className="text-red-800 dark:text-red-200 font-medium mb-2">Lỗi tải sản phẩm</p>
                <p className="text-red-600 dark:text-red-300 text-sm">{productsError}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                >
                  Thử lại
                </button>
              </div>
            </div>
          )}

          {!productsLoading && !productsError && (
            filteredProducts.length === 0 ? (
              <EmptyProductState />
            ) : (
              <ProductGrid products={filteredProducts} />
            )
          )}

          {/* Pagination placeholder */}
          <nav aria-label="Pagination" className="flex justify-center mt-12">
            <ul className="inline-flex items-center -space-x-px text-sm">
              <li><button className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"><span className="material-symbols-outlined text-base">chevron_left</span></button></li>
              <li><button className="px-3 h-8 text-white bg-primary border border-primary">1</button></li>
              <li><button className="px-3 h-8 text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400">2</button></li>
              <li><button className="px-3 h-8 text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400">3</button></li>
              <li><button className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"><span className="material-symbols-outlined text-base">chevron_right</span></button></li>
            </ul>
          </nav>
        </div>
      </div>
    </main>
  );
};

export default CategoryPage;
