import { useState, useEffect } from 'react';
import { Search, Plus, MoreVertical, Edit, Trash2, Filter, Copy, Eye, Star, StarOff, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { ProductFormModal } from "../components/ProductFormModal";
import { useAdmin, Product } from "../contexts/AdminContext";
import { toast } from "sonner@2.0.3";

export function Products() {
  const { products, capsules, loading, addProduct, updateProduct, deleteProduct } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [capsuleFilter, setCapsuleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (product.capsuleName && product.capsuleName.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCapsule = capsuleFilter === 'all' || product.capsuleId === capsuleFilter;
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    return matchesSearch && matchesCapsule && matchesStatus;
  });

  const handleAddProduct = () => {
    setEditingProduct(undefined);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (productData: Partial<Product>) => {
    if (editingProduct) {
      // Update existing product
      const success = await updateProduct(editingProduct._id, productData);
      if (success) {
        setIsModalOpen(false);
      }
    } else {
      // Add new product
      const success = await addProduct(productData);
      if (success) {
        setIsModalOpen(false);
      }
    }
  };

  const handleDeleteProduct = async () => {
    if (selectedProduct) {
      const success = await deleteProduct(selectedProduct);
      if (success) {
        setDeleteDialogOpen(false);
        setSelectedProduct(null);
      }
    }
  };

  const handleDuplicateProduct = async (product: Product) => {
    const duplicatedProductData = {
      ...product,
      name: `${product.name} (Copy)`,
    };
    await addProduct(duplicatedProductData);
  };

  const handleToggleFeatured = async (product: Product) => {
    await updateProduct(product._id, { isFeatured: !product.isFeatured });
  };

  const handleViewProduct = (product: Product) => {
    // In a real app, this would navigate to product detail page
    toast.info(`Viewing details for ${product.name}`);
  };

  const getStatusBadge = (status: Product['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>;
      case 'draft':
        return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">Draft</Badge>;
      case 'outOfStock':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Out of Stock</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-[#262930]">Products Management</h2>
          <p className="text-sm text-[#404040] mt-1">
            Manage your product catalog and inventory
          </p>
        </div>
        <Button onClick={handleAddProduct} className="bg-[#A00000] hover:bg-[#800000]">
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm bg-[#F5F3F0]">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#404040]" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={capsuleFilter} onValueChange={setCapsuleFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="All Capsules" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Capsules</SelectItem>
                {capsules.map(capsule => (
                  <SelectItem key={capsule._id} value={capsule._id}>
                    {capsule.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="outOfStock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card className="border-0 shadow-sm bg-[#F5F3F0]">
        <CardHeader>
          <CardTitle className="text-[#262930]">
            All Products ({filteredProducts.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          <div className="overflow-x-auto">
            <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Capsule</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading products...
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-[#404040]">
                    No products found
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <ImageWithFallback
                          src={product.image?.[0] || '/placeholder-product.jpg'}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div>
                          <p className="text-sm text-[#262930]">{product.name}</p>
                          <p className="text-xs text-[#404040]">
                            {product.category}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-[#404040]">
                      {product.capsuleName || 'No Capsule'}
                    </TableCell>
                    <TableCell className="text-sm text-[#262930]">
                      ₹{product.price.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-sm text-[#404040]">
                      {product.stock}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(product.status)}
                    </TableCell>
                    <TableCell>
                      {product.isFeatured && (
                        <Badge variant="outline" className="border-[#CC5500] text-[#CC5500]">
                          Featured
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewProduct(product)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditProduct(product)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDuplicateProduct(product)}>
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleFeatured(product)}>
                            {product.isFeatured ? (
                              <>
                                <StarOff className="mr-2 h-4 w-4" />
                                Remove from Featured
                              </>
                            ) : (
                              <>
                                <Star className="mr-2 h-4 w-4" />
                                Add to Featured
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedProduct(product._id);
                              setDeleteDialogOpen(true);
                            }}
                            className="text-[#A00000]"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          </div>
        </CardContent>
      </Card>

      {/* Product Form Modal */}
      <ProductFormModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
        product={editingProduct}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product
              from your catalog.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteProduct}
              className="bg-[#A00000] hover:bg-[#800000]"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
