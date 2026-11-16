'use client';
import { useState, useEffect } from 'react';
import { formatPrice } from '../../utils/helpers.js';

/**
 * VariantSelector — V5
 * Attribute-based variant selection (Color, Size, etc.)
 * Updates selected variant and propagates to parent
 */
export default function VariantSelector({ variants = [], onVariantChange }) {
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [selectedVariant, setSelectedVariant] = useState(null);

  // Collect all unique attribute names and values
  const attributeMap = {};
  variants.forEach((v) => {
    v.attributes?.forEach((attr) => {
      if (!attributeMap[attr.name]) attributeMap[attr.name] = new Set();
      attributeMap[attr.name].add(attr.value);
    });
  });

  // Find matching variant from selected attributes
  useEffect(() => {
    if (Object.keys(selectedAttributes).length === 0) return;

    const matched = variants.find((v) => {
      return v.attributes?.every(
        (attr) => selectedAttributes[attr.name] === attr.value
      );
    });

    setSelectedVariant(matched || null);
    onVariantChange?.(matched || null);
  }, [selectedAttributes, variants]);

  const handleSelect = (attrName, value) => {
    setSelectedAttributes((prev) => {
      const next = { ...prev, [attrName]: value };
      // If same value clicked, deselect
      if (prev[attrName] === value) {
        delete next[attrName];
      }
      return next;
    });
  };

  // Check if a specific attr value is available
  const isValueAvailable = (attrName, value) => {
    const testAttrs = { ...selectedAttributes, [attrName]: value };
    return variants.some((v) =>
      Object.entries(testAttrs).every(([name, val]) =>
        v.attributes?.some((a) => a.name === name && a.value === val)
      ) && v.stock > 0 && v.isActive
    );
  };

  if (variants.length === 0) return null;

  return (
    <div className="space-y-4">
      {Object.entries(attributeMap).map(([attrName, values]) => (
        <div key={attrName}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-semibold text-surface-700">{attrName}:</span>
            {selectedAttributes[attrName] && (
              <span className="text-sm text-primary-600 font-medium">{selectedAttributes[attrName]}</span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {[...values].map((value) => {
              const isSelected = selectedAttributes[attrName] === value;
              const isAvailable = isValueAvailable(attrName, value);

              return (
                <button
                  key={value}
                  onClick={() => handleSelect(attrName, value)}
                  disabled={!isAvailable}
                  className={`
                    min-w-[44px] h-10 px-3 rounded-lg border-2 text-sm font-medium
                    transition-all duration-150 relative
                    ${isSelected
                      ? 'border-primary-600 bg-primary-50 text-primary-700'
                      : isAvailable
                        ? 'border-surface-200 text-surface-700 hover:border-surface-300'
                        : 'border-surface-100 text-surface-300 cursor-not-allowed bg-surface-50'
                    }
                  `}
                >
                  {value}
                  {/* Strikethrough for unavailable */}
                  {!isAvailable && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="absolute w-full h-px bg-surface-300 rotate-[30deg]" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Selected variant info */}
      {selectedVariant && (
        <div className="bg-surface-50 rounded-xl p-3 border border-surface-200">
          <div className="flex items-center justify-between text-sm">
            <div>
              <span className="text-surface-500">Selected: </span>
              <span className="font-semibold text-surface-800">{selectedVariant.label}</span>
              {selectedVariant.sku && (
                <span className="ml-2 text-xs text-surface-400 font-mono">SKU: {selectedVariant.sku}</span>
              )}
            </div>
            <div className="text-right">
              <span className="font-bold text-primary-600">{formatPrice(selectedVariant.effectivePrice || selectedVariant.regularPrice)}</span>
              <span className="text-xs text-surface-400 ml-2">
                {selectedVariant.stock > 0 ? `${selectedVariant.stock} left` : 'Out of stock'}
              </span>
            </div>
          </div>
        </div>
      )}

      {Object.keys(selectedAttributes).length > 0 && !selectedVariant && (
        <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          This combination is not available. Please try another selection.
        </p>
      )}
    </div>
  );
}
