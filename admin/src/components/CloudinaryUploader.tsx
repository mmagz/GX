import { useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface CloudinaryUploaderProps {
  onUploadComplete: (urls: string[]) => void;
  maxFiles?: number;
  existingImages?: string[];
}

export function CloudinaryUploader({ 
  onUploadComplete, 
  maxFiles = 5,
  existingImages = []
}: CloudinaryUploaderProps) {
  const [images, setImages] = useState<string[]>(existingImages);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Simulate upload to Cloudinary
    setUploading(true);
    setUploadProgress(0);

    const newImages: string[] = [];
    let processed = 0;

    Array.from(files).forEach((file, index) => {
      if (images.length + newImages.length >= maxFiles) return;

      const reader = new FileReader();
      reader.onloadend = () => {
        // In real implementation, this would upload to Cloudinary
        // For now, we use the local data URL
        newImages.push(reader.result as string);
        processed++;
        setUploadProgress((processed / files.length) * 100);

        if (processed === files.length) {
          setTimeout(() => {
            const updatedImages = [...images, ...newImages];
            setImages(updatedImages);
            onUploadComplete(updatedImages);
            setUploading(false);
            setUploadProgress(0);
          }, 500);
        }
      };
      reader.readAsDataURL(file);
    });
  }, [images, maxFiles, onUploadComplete]);

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    onUploadComplete(updatedImages);
  };

  const canAddMore = images.length < maxFiles;

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      {canAddMore && (
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-[#A00000] transition-colors">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            id="cloudinary-upload"
            disabled={uploading}
          />
          <label 
            htmlFor="cloudinary-upload" 
            className="cursor-pointer flex flex-col items-center gap-2"
          >
            <div className="w-12 h-12 rounded-full bg-[#EAE7E2] dark:bg-[#262930] flex items-center justify-center">
              <Upload className="w-6 h-6 text-[#A00000]" />
            </div>
            <div>
              <p className="text-sm text-[#262930] dark:text-white">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-[#404040] dark:text-gray-400 mt-1">
                PNG, JPG up to 10MB ({images.length}/{maxFiles} uploaded)
              </p>
            </div>
          </label>
        </div>
      )}

      {/* Upload Progress */}
      {uploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#404040] dark:text-gray-400">Uploading to Cloudinary...</span>
            <span className="text-[#262930] dark:text-white">{Math.round(uploadProgress)}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
              <ImageWithFallback
                src={image}
                alt={`Upload ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  size="icon"
                  variant="destructive"
                  onClick={() => removeImage(index)}
                  className="bg-[#A00000] hover:bg-[#800000]"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              {index === 0 && (
                <div className="absolute top-2 left-2 bg-[#A00000] text-white text-xs px-2 py-1 rounded">
                  Primary
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {images.length === 0 && !uploading && (
        <div className="text-center py-8 text-[#404040] dark:text-gray-400">
          <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No images uploaded yet</p>
        </div>
      )}
    </div>
  );
}
