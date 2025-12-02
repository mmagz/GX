import { useState, useEffect, useCallback, useMemo } from 'react';
import { AnnouncementBar } from '../components/AnnouncementBar';
import { NavBar } from '../components/NavBar';
import { Footer } from '../components/Footer';
import { MasonryProductCard } from '../components/MasonryProductCard';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { Slider } from '../components/ui/slider';
import { Checkbox } from '../components/ui/checkbox';
import { Button } from '../components/ui/button';
import { useAuth } from '@clerk/clerk-react';
import { toast } from 'sonner';
import { PageLoader } from '../components/PageLoader';

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string[];
  category: string;
  subCategory: string;
  sizes: string[];
  variants: Array<{
    colorName: string;
    colorHex: string;
    images: string[];
  }>;
  bestseller: boolean;
  stock: number;
  date: number;
}

interface SearchFilters {
  query: string;
  category: string;
  subCategory: string;
  priceRange: [number, number];
  color: string;
  size: string;
  sort: string;
  inStock: boolean;
  newArrivals: boolean;
}

interface FilterOptions {
  categories: string[];
  subCategories: string[];
  colors: string[];
  sizes: string[];
  priceRange: {
    min: number;
    max: number;
  };
}

interface SearchResponse {
  success: boolean;
  products: Product[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalProducts: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  filters: FilterOptions;
  appliedFilters: SearchFilters;
}

export function SearchPage() {
  const { getToken } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResponse, setSearchResponse] = useState<SearchResponse | null>(null);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    categories: [],
    subCategories: [],
    colors: [],
    sizes: [],
    priceRange: { min: 0, max: 100000 }
  });

  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: 'all',
    subCategory: 'all',
    priceRange: [0, 100000],
    color: 'all',
    size: 'all',
    sort: 'newest',
    inStock: false,
    newArrivals: false
  });

  // Debounced search function
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (searchParams: SearchFilters) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          performSearch(searchParams);
        }, 300);
      };
    })(),
    []
  );

  // Perform search API call
  const performSearch = async (searchParams: SearchFilters) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = await getToken().catch(() => undefined);
      const base = (import.meta as any).env?.VITE_API_URL || 'https://getxoned.onrender.com';

      const queryParams = new URLSearchParams({
        query: searchParams.query,
        category: searchParams.category,
        subCategory: searchParams.subCategory,
        price_min: searchParams.priceRange[0].toString(),
        price_max: searchParams.priceRange[1].toString(),
        color: searchParams.color,
        size: searchParams.size,
        sort: searchParams.sort,
        inStock: searchParams.inStock.toString(),
        page: '1',
        limit: '20'
      });

      const response = await fetch(`${base}/api/search/products?${queryParams}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      });

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data: SearchResponse = await response.json();
      
      if (data.success) {
        setSearchResponse(data);
        setFilterOptions(data.filters);
      } else {
        throw new Error(data.message || 'Search failed');
      }
    } catch (error) {
      console.error('Search error:', error);
      setError(error instanceof Error ? error.message : 'Failed to search products');
      toast.error('Failed to search products', {
        description: 'Please try again later'
      });
    } finally {
      setLoading(false);
    }
  };

  // Update search query and trigger search
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    const newFilters = { ...filters, query: value };
    setFilters(newFilters);
    debouncedSearch(newFilters);
  };

  // Update filters and trigger search
  const updateFilter = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    debouncedSearch(newFilters);
  };

  // Clear all filters
  const clearAllFilters = () => {
    const clearedFilters: SearchFilters = {
      query: '',
      category: 'all',
      subCategory: 'all',
      priceRange: [filterOptions.priceRange.min, filterOptions.priceRange.max],
      color: 'all',
      size: 'all',
      sort: 'newest',
      inStock: false,
      newArrivals: false
    };
    setFilters(clearedFilters);
    setSearchQuery('');
    performSearch(clearedFilters);
  };

  // Load initial data
  useEffect(() => {
    performSearch(filters);
  }, []);

  // Memoized filtered products
  const filteredProducts = useMemo(() => {
    if (!searchResponse?.products) return [];
    return searchResponse.products;
  }, [searchResponse]);

  return (
    <div className="min-h-screen bg-[#f9f7f0]">
      <AnnouncementBar />
      <NavBar />
      
      <main className="pt-20 pb-16">
        {/* Search Header */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-[#262930] mb-4 uppercase-headline">
              SEARCH
            </h1>
            <p className="text-[#666] text-lg">
              Find your perfect piece from our collection
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#666] w-5 h-5" />
              <input
                type="text"
                placeholder="SEARCH FOR PRODUCTS..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-[#262930]/20 rounded-lg bg-white text-[#262930] placeholder-[#666] focus:outline-none focus:border-[#D04007] transition-colors"
              />
            </div>
          </div>

          {/* Filters and Results Header */}
          <div className="flex items-center justify-between mb-8">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 border-[#262930]/20 hover:border-[#D04007] hover:text-[#D04007]"
            >
              <SlidersHorizontal className="w-4 h-4" />
              FILTERS
            </Button>

            <div className="flex items-center gap-4">
              <span className="text-[#666]">
                {loading ? (
                  <span className="text-[#666]">Loading...</span>
                ) : (
                  `${searchResponse?.pagination.totalProducts || 0} RESULTS`
                )}
              </span>
              
              <select
                value={filters.sort}
                onChange={(e) => updateFilter('sort', e.target.value)}
                className="px-3 py-2 border border-[#262930]/20 rounded-lg bg-white text-[#262930] focus:outline-none focus:border-[#D04007]"
              >
                <option value="newest">NEWEST FIRST</option>
                <option value="oldest">OLDEST FIRST</option>
                <option value="price_asc">PRICE: LOW → HIGH</option>
                <option value="price_desc">PRICE: HIGH → LOW</option>
                <option value="name_asc">NAME: A → Z</option>
                <option value="name_desc">NAME: Z → A</option>
                <option value="popular">POPULAR</option>
              </select>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-white rounded-lg border border-[#262930]/10 p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Category Filter */}
                <div>
                  <h3 className="font-semibold text-[#262930] mb-4 uppercase-headline">CATEGORY</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => updateFilter('category', 'all')}
                      className={`w-full text-left px-3 py-2 rounded transition-colors ${
                        filters.category === 'all'
                          ? 'bg-[#D04007] text-white'
                          : 'text-[#666] hover:bg-[#f9f7f0]'
                      }`}
                    >
                      ALL
                    </button>
                    {filterOptions.categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => updateFilter('category', category)}
                        className={`w-full text-left px-3 py-2 rounded transition-colors ${
                          filters.category === category
                            ? 'bg-[#D04007] text-white'
                            : 'text-[#666] hover:bg-[#f9f7f0]'
                        }`}
                      >
                        {category.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div>
                  <h3 className="font-semibold text-[#262930] mb-4 uppercase-headline">PRICE RANGE</h3>
                  <div className="space-y-4">
                    <Slider
                      value={filters.priceRange}
                      onValueChange={(value) => updateFilter('priceRange', value)}
                      max={filterOptions.priceRange.max}
                      min={filterOptions.priceRange.min}
                      step={100}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-[#666]">
                      <span>₹{filters.priceRange[0].toLocaleString()}</span>
                      <span>₹{filters.priceRange[1].toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Availability Filter */}
                <div>
                  <h3 className="font-semibold text-[#262930] mb-4 uppercase-headline">AVAILABILITY</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="inStock"
                        checked={filters.inStock}
                        onCheckedChange={(checked) => updateFilter('inStock', checked)}
                      />
                      <label htmlFor="inStock" className="text-[#666] cursor-pointer">
                        IN STOCK ONLY
                      </label>
                    </div>
                    </div>
                  </div>
                </div>

              {/* Clear Filters Button */}
              <div className="flex justify-end mt-6">
                <Button
                  variant="outline"
                  onClick={clearAllFilters}
                  className="border-[#262930]/20 hover:border-[#D04007] hover:text-[#D04007]"
                  >
                    CLEAR ALL FILTERS
                </Button>
              </div>
            </div>
          )}

          {/* Results */}
          {loading ? (
            <div className="py-20">
              <PageLoader message="SEARCHING PRODUCTS" size="md" />
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div className="text-[#D04007] mb-4">⚠️</div>
              <h3 className="text-xl font-semibold text-[#262930] mb-2">Search Error</h3>
              <p className="text-[#666] mb-6">{error}</p>
              <Button onClick={() => performSearch(filters)}>
                Try Again
              </Button>
              </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-[#666] mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-[#262930] mb-2">No Products Found</h3>
              <p className="text-[#666] mb-6">
                No products match your search criteria. Try adjusting your filters or search terms.
              </p>
              <Button onClick={clearAllFilters}>
                Clear All Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <MasonryProductCard
                  key={product._id}
                  id={product._id}
                  name={product.name}
                  price={product.price}
                  image={product.image?.[0] || ''}
                  category={product.category}
                  isNew={product.bestseller}
                  stock={product.stock}
                  colors={product.variants?.map(v => v.colorHex) || []}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}