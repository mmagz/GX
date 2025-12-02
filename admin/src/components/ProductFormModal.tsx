import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Switch } from "./ui/switch";
import { CloudinaryUploader } from "./CloudinaryUploader";
import { useAdmin, Product } from "../contexts/AdminContext";
import { toast } from "sonner@2.0.3";

interface ProductFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (product: Partial<Product>) => void;
  product?: Product;
}

export function ProductFormModal({ open, onClose, onSave, product }: ProductFormModalProps) {
  const { capsules } = useAdmin();
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    capsuleId: '',
    capsuleName: '',
    image: [],
    stock: 0,
    category: 'general',
    size: [],
    color: [],
    status: 'draft',
    isFeatured: false
  });

  useEffect(() => {
    if (product) {
      setFormData(product);
    } else {
      setFormData({
        name: '',
        description: '',
        price: 0,
        capsuleId: '',
        capsuleName: '',
        image: [],
        stock: 0,
        category: 'general',
        size: [],
        color: [],
        status: 'draft',
        isFeatured: false
      });
    }
  }, [product, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.capsuleId || !formData.price) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.image && formData.image.length === 0) {
      toast.error('Please upload at least one product image');
      return;
    }

    onSave(formData);
    onClose();
  };

  const handleCapsuleChange = (capsuleId: string) => {
    const capsule = capsules.find(c => c._id === capsuleId);
    setFormData({
      ...formData,
      capsuleId,
      capsuleName: capsule?.name || ''
    });
  };

  const handleCategoryChange = (value: string) => {
    setFormData({ ...formData, category: value });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#262930] dark:text-white">
            {product ? 'Edit Product' : 'Add New Product'}
          </DialogTitle>
          <DialogDescription>
            {product ? 'Update product details and images' : 'Create a new product for your store'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Product Name <span className="text-[#A00000]">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Classic Wool Coat"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the product..."
              rows={3}
            />
          </div>

          {/* Price and Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">
                Price ($) <span className="text-[#A00000]">*</span>
              </Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                placeholder="0.00"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Stock Quantity</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                placeholder="0"
              />
            </div>
          </div>

          {/* Capsule Selection */}
          <div className="space-y-2">
            <Label htmlFor="capsule">
              Capsule <span className="text-[#A00000]">*</span>
            </Label>
            <Select value={formData.capsuleId} onValueChange={handleCapsuleChange} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a capsule" />
              </SelectTrigger>
              <SelectContent>
                {capsules.map((capsule) => (
                  <SelectItem key={capsule._id} value={capsule._id}>
                    {capsule.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={handleCategoryChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="clothing">Clothing</SelectItem>
                <SelectItem value="accessories">Accessories</SelectItem>
                <SelectItem value="shoes">Shoes</SelectItem>
                <SelectItem value="bags">Bags</SelectItem>
                <SelectItem value="jewelry">Jewelry</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status and Featured */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value: 'active' | 'draft' | 'outOfStock') => 
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="outOfStock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between space-x-2 pt-8">
              <Label htmlFor="featured">Featured Product</Label>
              <Switch
                id="featured"
                checked={formData.isFeatured}
                onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked })}
              />
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label>
              Product Images <span className="text-[#A00000]">*</span>
            </Label>
            <CloudinaryUploader
              onUploadComplete={(urls) => setFormData({ ...formData, image: urls })}
              existingImages={formData.image}
              maxFiles={5}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[#A00000] hover:bg-[#800000]">
              {product ? 'Update Product' : 'Create Product'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
