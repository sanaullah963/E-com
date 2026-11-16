'use client';
import { useState } from 'react';
import { FiStar } from 'react-icons/fi';

export default function StarRating({
  rating = 0,
  maxStars = 5,
  size = 'md',
  interactive = false,
  onChange,
  showCount = false,
  count = 0,
}) {
  const [hovered, setHovered] = useState(0);

  const sizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const iconSize = sizes[size] || sizes.md;

  return (
    <div className="inline-flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxStars }).map((_, i) => {
          const starValue = i + 1;
          const isFilled = interactive
            ? starValue <= (hovered || rating)
            : starValue <= Math.round(rating);

          return (
            <button
              key={i}
              type="button"
              onClick={() => interactive && onChange?.(starValue)}
              onMouseEnter={() => interactive && setHovered(starValue)}
              onMouseLeave={() => interactive && setHovered(0)}
              className={interactive
                ? 'cursor-pointer hover:scale-110 transition-transform'
                : 'cursor-default pointer-events-none'
              }
            >
              <FiStar
                className={`${iconSize} transition-colors ${
                  isFilled
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'fill-surface-200 text-surface-300'
                }`}
              />
            </button>
          );
        })}
      </div>

      {showCount && (
        <span className="text-sm text-surface-500 ml-1">
          {typeof rating === 'number' ? rating.toFixed(1) : rating}
          {count > 0 && <span className="ml-1">({count})</span>}
        </span>
      )}
    </div>
  );
}