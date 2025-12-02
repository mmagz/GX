import { useState, useEffect } from 'react';
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
import { CloudinaryUploader } from "./CloudinaryUploader";
import { Capsule } from "../utils/mockData";
import { toast } from "sonner@2.0.3";

interface CapsuleFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (capsule: Partial<Capsule>) => void;
  capsule?: Capsule;
}

export function CapsuleFormModal({ open, onClose, onSave, capsule }: CapsuleFormModalProps) {
  const [formData, setFormData] = useState<Partial<Capsule>>({
    name: '',
    description: '',
    coverImage: ''
  });

  useEffect(() => {
    if (capsule) {
      setFormData(capsule);
    } else {
      setFormData({
        name: '',
        description: '',
        coverImage: ''
      });
    }
  }, [capsule, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast.error('Please enter a capsule name');
      return;
    }

    if (!formData.coverImage) {
      toast.error('Please upload a cover image');
      return;
    }

    onSave(formData);
    onClose();
  };

  const handleImageUpload = (urls: string[]) => {
    if (urls.length > 0) {
      setFormData({ ...formData, coverImage: urls[0] });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-[#262930] dark:text-white">
            {capsule ? 'Edit Capsule' : 'Add New Capsule'}
          </DialogTitle>
          <DialogDescription>
            {capsule ? 'Update capsule details' : 'Create a new product collection'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Capsule Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Capsule Name <span className="text-[#A00000]">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Winter Capsule"
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
              placeholder="Describe the capsule collection..."
              rows={3}
            />
          </div>

          {/* Cover Image Upload */}
          <div className="space-y-2">
            <Label>
              Cover Image <span className="text-[#A00000]">*</span>
            </Label>
            <CloudinaryUploader
              onUploadComplete={handleImageUpload}
              existingImages={formData.coverImage ? [formData.coverImage] : []}
              maxFiles={1}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[#A00000] hover:bg-[#800000]">
              {capsule ? 'Update Capsule' : 'Create Capsule'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
