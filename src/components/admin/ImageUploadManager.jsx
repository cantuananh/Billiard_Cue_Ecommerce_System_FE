import { useState, useRef } from 'react';

const ImageUploadManager = ({ images, onChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const fileInputRef = useRef(null);

  // Handle file selection
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    handleFiles(files);
  };

  // Handle drag & drop files
  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const files = Array.from(event.dataTransfer.files);
    handleFiles(files.filter(file => file.type.startsWith('image/')));
  };

  // Process files and add to images array
  const handleFiles = (files) => {
    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`File ${file.name} quá lớn. Kích thước tối đa là 5MB.`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    const newImages = [];
    let loadedCount = 0;

    validFiles.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImage = {
          id: Date.now() + Math.random() + index,
          file: file,
          url: e.target.result,
          isPrimary: false // Will be set later
        };
        newImages.push(newImage);
        loadedCount++;

        // When all files are loaded, update the images array
        if (loadedCount === validFiles.length) {
          const updatedImages = [...images, ...newImages];
          
          // Set first image as primary if no existing images
          if (images.length === 0 && updatedImages.length > 0) {
            updatedImages[0].isPrimary = true;
          }
          
          onChange(updatedImages);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Handle drag start for reordering
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  // Handle drag over for reordering
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  // Handle drop for reordering
  const handleReorderDrop = (e, dropIndex) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    const newImages = [...images];
    const draggedItem = newImages[draggedIndex];
    
    // Remove dragged item
    newImages.splice(draggedIndex, 1);
    
    // Insert at new position
    newImages.splice(dropIndex, 0, draggedItem);
    
    // Auto-set first image as primary
    const updatedImages = newImages.map((img, index) => ({
      ...img,
      isPrimary: index === 0
    }));
    
    onChange(updatedImages);
    setDraggedIndex(null);
  };

  // Set primary image
  const setPrimaryImage = (index) => {
    const newImages = [...images];
    const targetImage = newImages[index];
    
    // Move the selected image to first position
    newImages.splice(index, 1);
    newImages.unshift(targetImage);
    
    // Set first image as primary
    const updatedImages = newImages.map((img, i) => ({
      ...img,
      isPrimary: i === 0
    }));
    
    onChange(updatedImages);
  };

  // Remove image
  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    
    // Auto-set first image as primary
    const updatedImages = newImages.map((img, i) => ({
      ...img,
      isPrimary: i === 0
    }));
    
    onChange(updatedImages);
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Hình ảnh sản phẩm
      </label>
      
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
          isDragging
            ? 'border-indigo-500 bg-indigo-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDragging(false);
        }}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <div className="space-y-1">
          <svg className="mx-auto h-8 w-8 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="text-sm text-gray-600">
            <span className="font-medium text-indigo-600">Nhấp để chọn ảnh</span> hoặc kéo thả
          </div>
          <p className="text-xs text-gray-500">
            Chọn nhiều ảnh cùng lúc (PNG, JPG, GIF max 5MB)
          </p>
        </div>
      </div>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Ảnh đầu tiên sẽ là ảnh đại diện.</span> Kéo thả để sắp xếp lại thứ tự hoặc nhấn ⭐ để chuyển ảnh lên đầu.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div
                key={image.id}
                className={`relative group border-2 rounded-lg overflow-hidden cursor-move ${
                  image.isPrimary
                    ? 'border-indigo-500 ring-2 ring-indigo-200'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleReorderDrop(e, index)}
              >
                <div className="aspect-square">
                  <img
                    src={image.url}
                    alt={`Product ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Primary Badge */}
                {image.isPrimary && (
                  <div className="absolute top-2 left-2 bg-indigo-600 text-white text-xs px-2 py-1 rounded">
                    Ảnh đại diện
                  </div>
                )}
                
                {/* Action Buttons */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity space-x-1">
                  {!image.isPrimary && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPrimaryImage(index);
                      }}
                      className="bg-blue-600 text-white p-1 rounded text-xs hover:bg-blue-700 flex items-center"
                      title="Chuyển lên đầu làm ảnh đại diện"
                    >
                      ⭐
                    </button>
                  )}
                  
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(index);
                    }}
                    className="bg-red-600 text-white p-1 rounded text-xs hover:bg-red-700 flex items-center"
                    title="Xóa ảnh"
                  >
                    ×
                  </button>
                </div>
                
                {/* Drag Handle */}
                <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-gray-800 bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                    ⋮⋮ Kéo để sắp xếp
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploadManager;