'use client';

import React from 'react';

interface StudioImageProps {
  src: string | { url: string; type?: string; attribution?: string; };
  alt: string;
  studioName: string;
  className?: string;
  containerClassName?: string;
  size?: 'small' | 'medium' | 'large';
}

export default function StudioImage({
  src,
  alt,
  studioName,
  className = '',
  containerClassName = '',
  size = 'medium'
}: StudioImageProps) {
  // Extract URL from src (handle both string and object formats)
  const imageUrl = typeof src === 'string' ? src : src?.url || '';
  const imageAttribution = typeof src === 'object' ? src.attribution : undefined;
  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.style.display = 'none';
    const parent = target.parentElement;
    if (parent) {
      const iconSize = size === 'large' ? 'w-16 h-16' : size === 'small' ? 'w-8 h-8' : 'w-12 h-12';
      const textSize = size === 'large' ? 'text-lg' : size === 'small' ? 'text-xs' : 'text-sm';

      parent.innerHTML = `
        <div class="w-full h-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center p-4">
          <div class="text-center text-purple-600 max-w-full">
            <svg class="${iconSize} mx-auto mb-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
            </svg>
            <p class="${textSize} font-medium leading-tight break-words">${studioName}</p>
            ${size === 'large' ? '<p class="text-sm opacity-75 mt-1">Studio Image</p>' : ''}
          </div>
        </div>
      `;
    }
  };

  // If no src provided, show placeholder immediately
  if (!imageUrl || imageUrl.trim() === '') {
    const iconSize = size === 'large' ? 'w-16 h-16' : size === 'small' ? 'w-8 h-8' : 'w-12 h-12';
    const textSize = size === 'large' ? 'text-lg' : size === 'small' ? 'text-xs' : 'text-sm';

    return (
      <div className={`relative bg-gray-100 overflow-hidden ${containerClassName}`}>
        <div className="w-full h-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center p-4">
          <div className="text-center text-purple-600 max-w-full">
            <svg className={`${iconSize} mx-auto mb-2 flex-shrink-0`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
            <p className={`${textSize} font-medium leading-tight break-words`}>{studioName}</p>
            {size === 'large' && <p className="text-sm opacity-75 mt-1">Studio Image</p>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative bg-gray-100 overflow-hidden ${containerClassName}`}>
      <img
        src={imageUrl || undefined}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-200 hover:opacity-90 ${className}`}
        style={{
          minWidth: '100%',
          minHeight: '100%',
          imageRendering: 'crisp-edges'
        }}
        onError={handleError}
        loading="lazy"
      />
      {imageAttribution && (
        <div className="absolute bottom-1 right-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
          {imageAttribution}
        </div>
      )}
    </div>
  );
}