import React from 'react';

// Utility function to extract YouTube ID from URL
export const extractYoutubeId = (url) => {
  if (!url) return '';
  
  // Handle various YouTube URL formats
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([^&?#\s]+)/);
  
  if (match && match[1]) {
    return match[1];
  } else {
    // Fallback for other formats
    const fallbackMatch = url.match(/[?&]v=([^&?#\s]+)/);
    return fallbackMatch && fallbackMatch[1] ? fallbackMatch[1] : '';
  }
};

// Component to display YouTube thumbnail with proper styling
const YouTubeThumbnail = ({ 
  url, 
  alt = "YouTube Thumbnail",
  size = "default", // default, medium, high, standard
  className = "",
  aspectRatio = true // maintains 16:9 aspect ratio
}) => {
  const youtubeId = extractYoutubeId(url);
  
  if (!youtubeId) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${aspectRatio ? "pb-[56.25%] relative" : "h-32"} ${className}`}>
        <span className="text-gray-500 text-sm">No thumbnail available</span>
      </div>
    );
  }
  
  // Map size to YouTube thumbnail quality
  const qualityMap = {
    default: "default.jpg", // 120x90
    medium: "mqdefault.jpg", // 320x180
    high: "hqdefault.jpg", // 480x360
    standard: "sddefault.jpg" // 640x480
  };
  
  const quality = qualityMap[size] || qualityMap.default;
  const thumbnailUrl = `https://img.youtube.com/vi/${youtubeId}/${quality}`;
  
  if (aspectRatio) {
    return (
      <div className={`relative pb-[56.25%] h-0 overflow-hidden ${className}`}>
        <img 
          src={thumbnailUrl} 
          alt={alt}
          className="absolute top-0 left-0 w-full h-full object-cover" 
        />
      </div>
    );
  }
  
  return (
    <img 
      src={thumbnailUrl} 
      alt={alt}
      className={className} 
    />
  );
};

export default YouTubeThumbnail;