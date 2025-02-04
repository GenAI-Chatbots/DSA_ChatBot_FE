import React from 'react';

const FullScreenPreview = ({ image, onClose }) => {
  if (!image) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="max-w-4xl w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-xl">
        <div className="relative">
          <img
            src={image.imageUrl}
            alt="Preview"
            className="w-full h-auto"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute top-2 right-2 bg-gray-800 bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75"
            onClick={onClose}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FullScreenPreview;