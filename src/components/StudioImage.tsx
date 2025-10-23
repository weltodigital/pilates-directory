'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import { ImageIcon } from 'lucide-react';

interface StudioImageProps {
  src?: string | null;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fallbackClassName?: string;
  priority?: boolean;
  // Additional props for backwards compatibility
  studioName?: string;
  containerClassName?: string;
  size?: 'small' | 'medium' | 'large';
}

export default function StudioImage({
  src,
  alt,
  width = 400,
  height = 300,
  className = '',
  fallbackClassName = '',
  priority = false,
  studioName,
  containerClassName,
  size = 'medium'
}: StudioImageProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Process image source to use cached images without API costs
  let processedSrc = src;

  if (src) {
    try {
      // Handle JSON format images (some are stored as JSON strings)
      if (src.startsWith('{') && src.includes('googleusercontent')) {
        const imageData = JSON.parse(src);
        processedSrc = imageData.url;
      }

      // For Google Photos API URLs, remove the API key to prevent charges
      // The photo_reference URLs should still work without the key for already-fetched images
      if (processedSrc?.includes('googleapis.com/maps/api/place/photo')) {
        processedSrc = processedSrc.replace(/&key=[^&]+/, '');
      }
    } catch (error) {
      console.warn('Error processing image URL:', error);
      console.log('Original src:', src);
      processedSrc = src;
    }
  }

  // Handle size-based dimensions
  const sizeConfig = {
    small: { width: 200, height: 150 },
    medium: { width: 400, height: 300 },
    large: { width: 600, height: 450 }
  };

  const dimensions = sizeConfig[size] || { width, height };
  const containerClass = containerClassName || className;

  // If no src or error, show fallback
  if (!processedSrc || imageError) {
    return (
      <div
        className={`bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center ${containerClass}`}
        style={{ width: '100%', height: '100%' }}
      >
        <div className="text-center">
          <ImageIcon className="h-12 w-12 text-purple-400 mx-auto mb-2" />
          <p className="text-purple-600 text-sm font-medium">Pilates Studio</p>
          <p className="text-purple-500 text-xs">{studioName || alt}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${containerClass}`} style={{ width: '100%', height: '100%' }}>
      {isLoading && (
        <div
          className={`absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center ${className}`}
        >
          <ImageIcon className="h-8 w-8 text-gray-400" />
        </div>
      )}

      <Image
        src={processedSrc}
        alt={alt}
        fill
        className={`object-cover ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}
        priority={priority}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setImageError(true);
          setIsLoading(false);
        }}
        // Disable external image optimization to avoid additional API calls
        unoptimized={true}
      />
    </div>
  );
}