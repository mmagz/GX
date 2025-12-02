import { useState } from 'react';
import { Search, Plus, MoreVertical, Edit, Trash2, Eye, Copy, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
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
import { Checkbox } from "../components/ui/checkbox";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { CapsuleFormModal } from "../components/CapsuleFormModal";
import { useAdmin, Capsule } from "../contexts/AdminContext";
import { toast } from "sonner@2.0.3";

export function Capsules() {
  const { capsules, products, loading, addCapsule, updateCapsule, deleteCapsule } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCapsule, setEditingCapsule] = useState<Capsule | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCapsule, setSelectedCapsule] = useState<string | null>(null);
  const [viewCapsuleOpen, setViewCapsuleOpen] = useState(false);
  const [viewingCapsule, setViewingCapsule] = useState<Capsule | null>(null);

  const filteredCapsules = capsules.filter(capsule =>
    capsule.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddCapsule = () => {
    setEditingCapsule(undefined);
    setIsModalOpen(true);
  };

  const handleEditCapsule = (capsule: Capsule) => {
    setEditingCapsule(capsule);
    setIsModalOpen(true);
  };

  const handleSaveCapsule = async (capsuleData: Partial<Capsule>) => {
    if (editingCapsule) {
      const success = await updateCapsule(editingCapsule._id, capsuleData);
      if (success) {
        setIsModalOpen(false);
      }
    } else {
      const success = await addCapsule(capsuleData);
      if (success) {
        setIsModalOpen(false);
      }
    }
  };

  const handleDeleteCapsule = async () => {
    if (selectedCapsule) {
      const success = await deleteCapsule(selectedCapsule);
      if (success) {
        setDeleteDialogOpen(false);
        setSelectedCapsule(null);
      }
    }
  };

  const handleDuplicateCapsule = async (capsule: Capsule) => {
    const duplicatedCapsuleData = {
      ...capsule,
      name: `${capsule.name} (Copy)`,
    };
    await addCapsule(duplicatedCapsuleData);
  };

  const handleViewCapsule = (capsule: Capsule) => {
    setViewingCapsule(capsule);
    setViewCapsuleOpen(true);
  };

  const handleToggleFeatured = async (productId: string) => {
    const product = products.find(p => p._id === productId);
    if (product) {
      await updateProduct(productId, { isFeatured: !product.isFeatured });
    }
  };

  const getCapsuleProducts = (capsuleId: string) => {
    return products.filter(p => p.capsuleId === capsuleId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-[#262930] dark:text-white">Capsules Management</h2>
          <p className="text-sm text-[#404040] dark:text-gray-400 mt-1">
            Manage product collections and capsules
          </p>
        </div>
        <Button onClick={handleAddCapsule} className="bg-[#A00000] hover:bg-[#800000]">
          <Plus className="mr-2 h-4 w-4" />
          Add Capsule
        </Button>
      </div>

      {/* Search */}
      <Card className="border-0 shadow-sm bg-[#F5F3F0]">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#404040] dark:text-gray-400" />
            <Input
              placeholder="Search capsules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Capsules Table */}
      <Card className="border-0 shadow-sm bg-[#F5F3F0]">
        <CardHeader>
          <CardTitle className="text-[#262930] dark:text-white">
            All Capsules ({filteredCapsules.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          <div className="overflow-x-auto">
            <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Capsule</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading capsules...
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredCapsules.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-[#404040] dark:text-gray-400">
                    No capsules found
                  </TableCell>
                </TableRow>
              ) : (
                filteredCapsules.map((capsule) => (
                  <TableRow key={capsule._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <ImageWithFallback
                          src={capsule.bannerUrl || '/placeholder-capsule.jpg'}
                          alt={capsule.name}
                          className="w-16 h-12 object-cover rounded"
                        />
                        <p className="text-sm text-[#262930] dark:text-white">{capsule.name}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-[#404040] dark:text-gray-400 max-w-xs truncate">
                      {capsule.description}
                    </TableCell>
                    <TableCell className="text-sm text-[#262930] dark:text-white">
                      {capsule.productCount || getCapsuleProducts(capsule._id).length} products
                    </TableCell>
                    <TableCell className="text-sm text-[#404040] dark:text-gray-400">
                      {new Date(capsule.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewCapsule(capsule)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Products
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditCapsule(capsule)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDuplicateCapsule(capsule)}>
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedCapsule(capsule._id);
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

      {/* Capsule Form Modal */}
      <CapsuleFormModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCapsule}
        capsule={editingCapsule}
      />

      {/* View Capsule Products Dialog */}
      <Dialog open={viewCapsuleOpen} onOpenChange={setViewCapsuleOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#262930] dark:text-white">
              {viewingCapsule?.name} - Products
            </DialogTitle>
            <DialogDescription>
              Manage products and featured items in this capsule
            </DialogDescription>
          </DialogHeader>
          {viewingCapsule && (
            <div className="space-y-4">
              {getCapsuleProducts(viewingCapsule._id).map((product) => (
                <div
                  key={product._id}
                  className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <ImageWithFallback
                    src={product.image?.[0] || '/placeholder-product.jpg'}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="text-sm text-[#262930] dark:text-white">{product.name}</p>
                    <p className="text-xs text-[#404040] dark:text-gray-400 mt-1">
                      ₹{product.price.toFixed(2)} • Stock: {product.stock}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={`featured-${product._id}`}
                      checked={product.isFeatured}
                      onCheckedChange={() => handleToggleFeatured(product._id)}
                    />
                    <label
                      htmlFor={`featured-${product._id}`}
                      className="text-sm text-[#404040] dark:text-gray-400 cursor-pointer"
                    >
                      Featured
                    </label>
                  </div>
                </div>
              ))}
              {getCapsuleProducts(viewingCapsule.id).length === 0 && (
                <div className="text-center py-8 text-[#404040] dark:text-gray-400">
                  <p>No products in this capsule yet</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Capsule?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the capsule.
              Products in this capsule will not be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteCapsule}
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
