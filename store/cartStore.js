import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// কার্ট লাইনের পরিচয় = পণ্য + ভেরিয়েন্ট (একই পণ্যের ভিন্ন ভেরিয়েন্ট আলাদা লাইন)
export const lineKey = (item) => `${item.productId}:${item.variantId || ''}`;
const matches = (item, key) => lineKey(item) === key || (!item.variantId && item.productId === key);

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
        const incomingKey = `${product._id}:${product.variantId || ''}`;
        const existingIndex = items.findIndex((item) => lineKey(item) === incomingKey);

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
          const unitPrice =
            product.salePrice !== null && product.salePrice !== undefined
              ? product.salePrice
              : product.regularPrice;

          set({
            items: [
              ...items,
              {
                productId: product._id,
                variantId: product.variantId || null,
                variantLabel: product.variantLabel || "",
                key: incomingKey,
                name: product.name,
                slug: product.slug,
                thumbnailUrl: product.thumbnailImage?.url || "",
                regularPrice: product.regularPrice,
                salePrice: product.salePrice || null,
                unitPrice,
                quantity: Math.min(quantity, product.stock),
                stock: product.stock,
                category: product.category || "",
                brand: product.brand || "",
              },
            ],
          });
        }
      },

      /**
       * Remove item from cart
       */
      // key = lineKey(item) (পুরোনো কল: শুধু productId দিলে ভেরিয়েন্টহীন লাইন)
      removeItem: (key) => {
        set({
          items: get().items.filter((item) => !matches(item, key)),
        });
      },

      //  Update item quantity

      updateQuantity: (key, quantity) => {
        if (quantity <= 0) {
          get().removeItem(key);
          return;
        }
        set({
          items: get().items.map((item) =>
            matches(item, key)
              ? { ...item, quantity: Math.min(quantity, item.stock) }
              : item,
          ),
        });
      },

      /**
       * Increment quantity by 1
       */
      incrementQuantity: (key) => {
        const item = get().items.find((i) => matches(i, key));
        if (item && item.quantity < item.stock) {
          get().updateQuantity(key, item.quantity + 1);
        }
      },

      /**
       * Decrement quantity by 1
       */
      decrementQuantity: (key) => {
        const item = get().items.find((i) => matches(i, key));
        if (item) {
          get().updateQuantity(key, item.quantity - 1);
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
        return get().items.reduce(
          (sum, item) => sum + item.unitPrice * item.quantity,
          0,
        );
      },

      getTotal: (deliveryCharge = 0) => {
        return get().getSubtotal() + deliveryCharge;
      },

      isInCart: (productId) => {
        return get().items.some((item) => item.productId === productId);
      },

      getItemQuantity: (productId) => {
        // একই পণ্যের সব ভেরিয়েন্ট মিলিয়ে
        return get().items.filter((i) => i.productId === productId).reduce((n, i) => n + i.quantity, 0);
      },

      // buyNow
      buyNow: (product, quantity = 1) => {
        const unitPrice =
          product.salePrice !== null && product.salePrice !== undefined
            ? product.salePrice
            : product.regularPrice;

        set({
          items: [
            {
              productId: product._id,
              variantId: product.variantId || null,
              variantLabel: product.variantLabel || "",
              key: `${product._id}:${product.variantId || ''}`,
              name: product.name,
              slug: product.slug,
              thumbnailUrl: product.thumbnailImage?.url || "",
              regularPrice: product.regularPrice,
              salePrice: product.salePrice || null,
              unitPrice,
              quantity: Math.min(quantity, product.stock),
              stock: product.stock,
              category: product.category || "",
              brand: product.brand || "",
            },
          ],
        });
      },
    }),
    {
      name: "shopbd-cart",
      storage: createJSONStorage(() => localStorage),
      // Only persist items array
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

export default useCartStore;
