// 'use client';

// import Link from 'next/link';
// import { FiShoppingCart } from 'react-icons/fi';
// import useCartStore from '../../store/cartStore.js';
// import { useEffect, useState } from 'react';

// export default function CartButton() {
//   const getItemCount = useCartStore((state) => state.getItemCount);
  

//   const [itemCount, setItemCount] = useState(0);
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//     setItemCount(getItemCount());
//   }, []);

//   // Cart store change হলে update করুন
//   useEffect(() => {
//     if (mounted) {
//       setItemCount(getItemCount());
//     }
//   });

//   return (
//     <Link
//       href="/cart"
//       className="relative p-2 text-surface-600 hover:text-primary-600 hover:bg-surface-50 rounded-lg transition-colors"
//       aria-label="Shopping cart"
//     >
//       <FiShoppingCart className="w-5 h-5" />
//       {mounted && itemCount > 0 && (
//         <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary-600 text-white text-xs font-bold rounded-full flex items-center justify-center leading-none">
//           {itemCount > 9 ? '9+' : itemCount}
//         </span>
//       )}
//     </Link>
//   );
// }





'use client';
import Link from 'next/link';
import { FiShoppingCart } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import useCartStore from '../../store/cartStore.js';

export default function CartButton() {
  const items = useCartStore((state) => state.items);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Link href="/cart" className="relative p-2 text-surface-600 hover:text-primary-600 hover:bg-surface-50 rounded-lg transition-colors" aria-label="Shopping cart">
      <FiShoppingCart className="w-5 h-5" />
      {mounted && itemCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary-600 text-white text-xs font-bold rounded-full flex items-center justify-center leading-none">
          {itemCount > 9 ? '9+' : itemCount}
        </span>
      )}
    </Link>
  );
}