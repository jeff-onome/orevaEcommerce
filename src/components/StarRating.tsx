
import React from 'react';

interface StarRatingProps {
  rating: number;
  reviewCount?: number;
  size?: 'sm' | 'md' | 'lg';
}

const StarRating: React.FC<StarRatingProps> = ({ rating, reviewCount, size = 'md' }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  const StarIcon: React.FC<{ variant: 'full' | 'half' | 'empty' }> = ({ variant }) => {
    const className = `${sizeClasses[size]} ${variant === 'empty' ? 'text-gray-300' : 'text-yellow-400'}`;
    const path = 
      variant === 'full' ? "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" :
      variant === 'half' ? "M10 15.27L16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0l-2.81 6.63L0 7.24l5.46 4.73L3.82 19l6.18-3.73z" : // Simple half star for illustration
      "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z";
    
    if (variant === 'half') {
      return (
         <div className="relative">
            <svg className={`${sizeClasses[size]} text-gray-300`} fill="currentColor" viewBox="0 0 20 20"><path d={path} /></svg>
            <div className="absolute top-0 left-0 overflow-hidden w-1/2">
               <svg className={`${sizeClasses[size]} text-yellow-400`} fill="currentColor" viewBox="0 0 20 20"><path d={path} /></svg>
            </div>
         </div>
      )
    }

    return (
        <svg className={className} fill="currentColor" viewBox="0 0 20 20"><path d={path} /></svg>
    )
  }

  return (
    <div className="flex items-center space-x-1">
      <div className="flex">
        {[...Array(fullStars)].map((_, i) => <StarIcon key={`full-${i}`} variant="full" />)}
        {halfStar && <StarIcon key="half" variant="half" />}
        {[...Array(emptyStars)].map((_, i) => <StarIcon key={`empty-${i}`} variant="empty" />)}
      </div>
      {reviewCount !== undefined && reviewCount > 0 && (
        <span className="text-gray-500 text-sm">
          ({reviewCount})
        </span>
      )}
    </div>
  );
};

export default StarRating;
