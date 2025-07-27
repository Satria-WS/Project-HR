import { useState } from 'react';
import { User } from 'lucide-react';

interface UserAvatarProps {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-12 h-12'
};

const iconSizeClasses = {
  sm: 'w-3 h-3',
  md: 'w-4 h-4', 
  lg: 'w-6 h-6'
};

export function UserAvatar({ 
  src, 
  alt, 
  name, 
  size = 'md', 
  className = '' 
}: UserAvatarProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageError = () => {
    console.warn('Failed to load user avatar:', src);
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const showFallback = !src || imageError || !imageLoaded;

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {src && !imageError && (
        <img
          src={src}
          alt={alt || name || 'User avatar'}
          className={`${sizeClasses[size]} rounded-full object-cover border-2 border-gray-200 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          } transition-opacity duration-200`}
          onError={handleImageError}
          onLoad={handleImageLoad}
          loading="lazy"
        />
      )}
      
      {showFallback && (
        <div className={`
          ${sizeClasses[size]} bg-indigo-100 rounded-full 
          flex items-center justify-center 
          ${imageLoaded && !imageError ? 'absolute inset-0' : ''}
        `}>
          <User className={`${iconSizeClasses[size]} text-indigo-600`} />
        </div>
      )}
    </div>
  );
}
