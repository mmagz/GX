import { useState } from 'react';
import { Search, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { mockProducts, Product } from "../utils/mockData";
import { toast } from "sonner@2.0.3";

export function Featured() {
  const [products, setProducts] = useState(mockProducts);
  const [searchQuery, setSearchQuery] = useState('');

  const featuredProducts = products.filter(p => p.isFeatured);
  const filteredFeatured = featuredProducts.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.capsuleName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRemoveFromFeatured = (productId: string) => {
    setProducts(products.map(p =>
      p.id === productId ? { ...p, isFeatured: false } : p
    ));
    toast.success('Product removed from featured');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-[#262930] dark:text-white">Featured Items</h2>
        <p className="text-sm text-[#404040] dark:text-gray-400 mt-1">
          Manage featured products displayed on your store
        </p>
      </div>

      {/* Search */}
      <Card className="border-0 shadow-sm bg-white dark:bg-[#1a1a1a]">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#404040] dark:text-gray-400" />
            <Input
              placeholder="Search featured products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Featured Products Grid */}
      <Card className="border-0 shadow-sm bg-white dark:bg-[#1a1a1a]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#262930] dark:text-white">
            <Star className="w-5 h-5 text-[#CC5500]" />
            Featured Products ({filteredFeatured.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredFeatured.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFeatured.map((product) => (
                <div
                  key={product.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative aspect-[4/3]">
                    <ImageWithFallback
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-[#CC5500] text-white p-2 rounded-full">
                      <Star className="w-4 h-4 fill-current" />
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="text-[#262930] dark:text-white mb-1">
                        {product.name}
                      </h3>
                      <p className="text-sm text-[#404040] dark:text-gray-400">
                        {product.capsuleName}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#A00000]">
                        ${product.price.toFixed(2)}
                      </span>
                      <Badge 
                        variant={product.status === 'active' ? 'default' : 'secondary'}
                        className={product.status === 'active' ? 'bg-green-100 text-green-700 hover:bg-green-100' : ''}
                      >
                        {product.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-[#404040] dark:text-gray-400">
                      Stock: {product.stock}
                    </div>
                    <Button
                      variant="outline"
                      className="w-full border-[#A00000] text-[#A00000] hover:bg-[#A00000] hover:text-white"
                      onClick={() => handleRemoveFromFeatured(product.id)}
                    >
                      Remove from Featured
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Star className="w-16 h-16 mx-auto mb-4 text-[#404040] dark:text-gray-400 opacity-50" />
              <p className="text-[#404040] dark:text-gray-400">
                {searchQuery ? 'No featured products match your search' : 'No featured products yet'}
              </p>
              <p className="text-sm text-[#404040] dark:text-gray-400 mt-2">
                Mark products as featured from the Products or Capsules page
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
