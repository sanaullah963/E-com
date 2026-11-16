import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * Cart Store — Version 2
 * Persistent guest cart using localStorage
 * Version 3: Will merge with customer wishlist/saved cart
 */
const useCartStore = create(
  persist(
    (set, get) => ({
      items: [], // { productId, name, slug, thumbnailUrl, regularPrice, salePrice, unitPrice, quantity, stock, category, brand }

      // ==========================================
      // ACTIONS
      // ==========================================

      /**
       * Add item to cart or increment quantity
       */
      addItem: (product, quantity = 1) => {
        const { items } = get();
        const existingIndex = items.findIndex((item) => item.productId === product._id);

        if (existingIndex !== -1) {
          // Item exists — update quantity (respect stock limit)
          const updated = [...items];
          const newQty = updated[existingIndex].quantity + quantity;
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: Math.min(newQty, product.stock),
          };
          set({ items: updated });
        } else {
          // New item
          const unitPrice = product.salePrice !== null && product.salePrice !== undefined
            ? product.salePrice
            : product.regularPrice;

          set({
            items: [
              ...items,
              {
                productId: product._id,
                name: product.name,
                slug: product.slug,
                thumbnailUrl: product.thumbnailImage?.url || '',
                regularPrice: product.regularPrice,
                salePrice: product.salePrice || null,
                unitPrice,
                quantity: Math.min(quantity, product.stock),
                stock: product.stock,
                category: product.category || '',
                brand: product.brand || '',
              },
            ],
          });
        }
      },

      /**
       * Remove item from cart
       */
      removeItem: (productId) => {
        set({ items: get().items.filter((item) => item.productId !== productId) });
      },

      /**
       * Update item quantity
       */
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.productId === productId
              ? { ...item, quantity: Math.min(quantity, item.stock) }
              : item
          ),
        });
      },

      /**
       * Increment quantity by 1
       */
      incrementQuantity: (productId) => {
        const item = get().items.find((i) => i.productId === productId);
        if (item && item.quantity < item.stock) {
          get().updateQuantity(productId, item.quantity + 1);
        }
      },

      /**
       * Decrement quantity by 1
       */
      decrementQuantity: (productId) => {
        const item = get().items.find((i) => i.productId === productId);
        if (item) {
          get().updateQuantity(productId, item.quantity - 1);
        }
      },

      /**
       * Clear entire cart
       */
      clearCart: () => set({ items: [] }),

      // ==========================================
      // COMPUTED (via selectors)
      // ==========================================

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
      },

      getTotal: (deliveryCharge = 0) => {
        return get().getSubtotal() + deliveryCharge;
      },

      isInCart: (productId) => {
        return get().items.some((item) => item.productId === productId);
      },

      getItemQuantity: (productId) => {
        const item = get().items.find((i) => i.productId === productId);
        return item ? item.quantity : 0;
      },
    }),
    {
      name: 'shopbd-cart',
      storage: createJSONStorage(() => localStorage),
      // Only persist items array
      partialize: (state) => ({ items: state.items }),
    }
  )
);

export default useCartStore;
