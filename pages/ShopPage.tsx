
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import Spinner from '../components/Spinner';

const PRODUCTS_PER_PAGE = 12;

const ShopPage: React.FC = () => {
  const { products } = useAppContext();
  const [searchParams, setSearchParams] = useSearchParams();

  // FIX: Using a Set and a loop to be explicit about types and avoid inference issues with array methods.
  const categorySet = new Set<string>();
  products.forEach(product => {
    product.categories?.forEach(category => {
      categorySet.add(category);
    });
  });
  const categories: string[] = ['All', ...Array.from(categorySet).sort()];
  
  // FIX: Added type assertion to correct the inferred type from `unknown` to `string | null`.
  const selectedCategory = (searchParams.get('category') as string | null) || 'All';
  // FIX: Explicitly setting the type for useState to string to resolve a potential type inference issue causing an error on the input's value prop.
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredProducts, setFilteredProducts] = useState(products);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500); // 500ms delay

    return () => {
      clearTimeout(timer);
    };
  }, [searchQuery]);

  // Filter products when category or debounced query changes
  useEffect(() => {
    setIsSearching(true);

    // Simulate fetch delay
    const searchTimer = setTimeout(() => {
      const results = products
        .filter(product => {
          return selectedCategory === 'All' || product.categories?.includes(selectedCategory);
        })
        .filter(product => {
          const query = debouncedQuery.toLowerCase();
          return (
            product.name.toLowerCase().includes(query) ||
            (product.description || '').toLowerCase().includes(query)
          );
        });

      setFilteredProducts(results);
      setCurrentPage(1); // Reset to page 1 on new search/filter
      setIsSearching(false);
    }, 300); // 300ms artificial delay to show spinner

    return () => {
        clearTimeout(searchTimer);
    }
  }, [debouncedQuery, selectedCategory, products]);

  const handleCategoryChange = (category: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (category === 'All') {
        newParams.delete('category');
    } else {
        newParams.set('category', category);
    }
    setSearchParams(newParams);
  };
  
  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);

  const PaginationControls = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-center items-center space-x-2 mt-16">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
          <button
            key={pageNumber}
            onClick={() => setCurrentPage(pageNumber)}
            className={`px-4 py-2 border rounded-md text-sm font-medium ${
              currentPage === pageNumber
                ? 'bg-primary text-white border-primary'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {pageNumber}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-4">Shop Our Collection</h1>
      <p className="text-lg text-gray-600 text-center mb-10">Browse through our curated collection of high-quality products.</p>

      <div className="max-w-3xl mx-auto space-y-8 mb-16">
        {/* Search Input */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            value={searchQuery}
            // FIX: Explicitly type the event to prevent TS from inferring it as `any` or `unknown`.
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            placeholder="Search for products..."
            className="w-full py-3 pl-12 pr-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
          />
        </div>

        {/* Category Filters */}
        <div className="flex justify-center flex-wrap gap-3">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-6 py-2 rounded-full font-semibold transition-colors duration-300 ${
                selectedCategory === category
                  ? 'bg-primary text-onPrimary shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      
      {isSearching ? (
        <div className="pt-16">
            <Spinner />
        </div>
      ) : currentProducts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-24 pt-16">
            {currentProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <PaginationControls />
        </>
      ) : (
        <div className="text-center py-16">
            <h3 className="text-2xl font-semibold text-gray-700">No Products Found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
};

export default ShopPage;
