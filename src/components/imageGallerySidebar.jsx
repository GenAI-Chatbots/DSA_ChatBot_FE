import React from 'react';

const ImageGallerySidebar = ({ images, setPreviewImage }) => {
  return (
    <div className="space-y-4">
      {images.map((image, index) => (
        <div 
          key={index} 
          className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
          onClick={() => setPreviewImage(image)}
        >
          <img
            src={image.imageUrl}
            alt={`Preview ${index}`}
            className="w-full h-auto"
          />
          <div className="p-3 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-300">Image {image.imageNo}</span>
              <span className="text-xs px-2 py-1 bg-gray-700 rounded-full text-gray-300">
                Click to expand
              </span>
            </div>
            <p className="text-sm text-gray-400 line-clamp-2">{image.imageDes}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImageGallerySidebar;