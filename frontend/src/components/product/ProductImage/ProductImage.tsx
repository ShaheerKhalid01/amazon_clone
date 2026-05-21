import React, { useState } from 'react';

interface ProductImagesProps {
  images: Array<{
    id: string;
    url: string;
    thumbnailUrl: string;
    altText: string;
    isPrimary: boolean;
  }>;
}

/**
 * Product Image Gallery Component
 */
const ProductImages: React.FC<ProductImagesProps> = ({ images = [] }) => {
  const [selectedImage, setSelectedImage] = useState(
    images.find(img => img.isPrimary) || images[0]
  );
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
        <span className="text-gray-400">No Image Available</span>
      </div>
    );
  }

  return (
    <div>
      {/* Main Image */}
      <div
        className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4 relative cursor-zoom-in"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <img
          src={selectedImage?.url}
          alt={selectedImage?.altText || 'Product image'}
          className="w-full h-full object-cover"
        />
        
        {/* Zoom Overlay */}
        {isZoomed && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `url(${selectedImage?.url})`,
              backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
              backgroundSize: '200%',
              backgroundRepeat: 'no-repeat',
            }}
          />
        )}
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image) => (
            <button
              key={image.id}
              onClick={() => setSelectedImage(image)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all
                ${selectedImage?.id === image.id 
                  ? 'border-amazon-orange shadow-md' 
                  : 'border-transparent hover:border-gray-300'
                }`}
            >
              <img
                src={image.thumbnailUrl || image.url}
                alt={image.altText}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImages;
