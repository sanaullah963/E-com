// 'use client';
// import { useState } from 'react';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { useParams, useRouter } from 'next/navigation';
// import { useForm } from 'react-hook-form';
// import { toast } from 'sonner';
// import Image from 'next/image';
// import { FiArrowLeft, FiPlus, FiTrash2, FiEdit2, FiCheck, FiX } from 'react-icons/fi';
// import apiClient from '../../../../lib/apiClient.js';
// import { useVariants, useCreateVariant, useDeleteVariant, useAdjustVariantStock } from '../../../../hooks/useVariants.js';
// import { formatPrice, getPlaceholderImage } from '../../../../utils/helpers.js';

// export default function AdminProductDetailPage() {
//   const { id } = useParams();
//   const router = useRouter();
//   const qc = useQueryClient();
//   const [showVariantForm, setShowVariantForm] = useState(false);
//   const [attributes, setAttributes] = useState([{ name: '', value: '' }]);

//   const { data: productData, isLoading } = useQuery({
//     queryKey: ['admin-product', id],
//     queryFn: () => apiClient.get(`/products/admin/${id}`),
//     enabled: !!id,
//   });

//   const { data: variantsData } = useVariants(id);
//   const { mutate: createVariant, isPending: creating } = useCreateVariant(id);
//   const { mutate: deleteVariant } = useDeleteVariant(id);
//   const { mutate: adjustStock } = useAdjustVariantStock(id);

//   const { register, handleSubmit, reset } = useForm();
//   const product = productData?.data;
//   const variants = variantsData?.data || [];

//   const addAttribute = () => setAttributes((prev) => [...prev, { name: '', value: '' }]);
//   const removeAttribute = (idx) => setAttributes((prev) => prev.filter((_, i) => i !== idx));
//   const updateAttribute = (idx, field, value) => {
//     setAttributes((prev) => prev.map((a, i) => i === idx ? { ...a, [field]: value } : a));
//   };

//   const onCreateVariant = (formData) => {
//     const fd = new FormData();
//     fd.append('attributes', JSON.stringify(attributes.filter((a) => a.name && a.value)));
//     fd.append('regularPrice', formData.regularPrice);
//     if (formData.salePrice) fd.append('salePrice', formData.salePrice);
//     fd.append('stock', formData.stock);
//     if (formData.sku) fd.append('sku', formData.sku);
//     if (formData.barcode) fd.append('barcode', formData.barcode);

//     createVariant(fd, {
//       onSuccess: () => { reset(); setAttributes([{ name: '', value: '' }]); setShowVariantForm(false); },
//     });
//   };

//   if (isLoading) {
//     return <div className="p-6"><div className="card p-8 animate-pulse bg-surface-100 h-64" /></div>;
//   }

//   if (!product) {
//     return <div className="p-6 text-center"><p className="text-surface-500">Product not found.</p></div>;
//   }

//   return (
//     <div className="p-6">
//       <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm text-surface-500 hover:text-primary-600 mb-5">
//         <FiArrowLeft className="w-4 h-4" /> Back to Products
//       </button>

//       {/* Product Summary */}
//       <div className="card p-5 mb-5">
//         <div className="flex gap-4">
//           <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-surface-50 flex-shrink-0">
//             <Image src={product.thumbnailImage?.url || getPlaceholderImage(product.name)} alt={product.name} fill sizes="80px" className="object-cover" />
//           </div>
//           <div className="flex-1">
//             <h1 className="text-xl font-bold text-surface-900">{product.name}</h1>
//             <p className="text-sm text-surface-500 font-mono mt-0.5">{product.productId} {product.sku && `· SKU: ${product.sku}`}</p>
//             <div className="flex gap-3 mt-2 text-sm">
//               <span className="text-surface-600">{product.category}</span>
//               {product.brand && <span className="text-surface-400">· {product.brand}</span>}
//               <span className="font-bold text-primary-600">{formatPrice(product.salePrice || product.regularPrice)}</span>
//             </div>
//           </div>
//           <div className="flex flex-col gap-2">
//             <button onClick={() => router.push(`/admin/products/${id}/edit`)} className="btn-secondary text-xs gap-1.5">
//               <FiEdit2 className="w-3.5 h-3.5" /> Edit Product
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Variants Section */}
//       <div className="card p-5">
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="font-bold text-surface-900">Variants ({variants.length})</h2>
//           <button onClick={() => setShowVariantForm(!showVariantForm)} className="btn-primary text-xs gap-1.5">
//             <FiPlus className="w-3.5 h-3.5" /> Add Variant
//           </button>
//         </div>

//         {/* Variant Form */}
//         {showVariantForm && (
//           <div className="border-2 border-primary-200 bg-primary-50/30 rounded-xl p-4 mb-5">
//             <h3 className="font-semibold text-surface-900 mb-4 text-sm">New Variant</h3>
//             <form onSubmit={handleSubmit(onCreateVariant)} className="space-y-4">
//               {/* Attributes */}
//               <div>
//                 <label className="block text-xs font-semibold text-surface-600 uppercase tracking-wide mb-2">Attributes</label>
//                 {attributes.map((attr, i) => (
//                   <div key={i} className="flex gap-2 mb-2">
//                     <input value={attr.name} onChange={(e) => updateAttribute(i, 'name', e.target.value)} className="input text-sm flex-1" placeholder="Name (e.g. Color)" />
//                     <input value={attr.value} onChange={(e) => updateAttribute(i, 'value', e.target.value)} className="input text-sm flex-1" placeholder="Value (e.g. Red)" />
//                     {attributes.length > 1 && (
//                       <button type="button" onClick={() => removeAttribute(i)} className="w-8 h-10 flex items-center justify-center text-red-400 hover:text-red-600">
//                         <FiX className="w-4 h-4" />
//                       </button>
//                     )}
//                   </div>
//                 ))}
//                 <button type="button" onClick={addAttribute} className="text-xs text-primary-600 hover:underline flex items-center gap-1">
//                   <FiPlus className="w-3 h-3" /> Add attribute
//                 </button>
//               </div>

//               <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
//                 <div>
//                   <label className="block text-xs font-medium text-surface-600 mb-1">Regular Price (৳) *</label>
//                   <input {...register('regularPrice', { required: true })} type="number" min="0" className="input text-sm" placeholder="0" />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-medium text-surface-600 mb-1">Sale Price (৳)</label>
//                   <input {...register('salePrice')} type="number" min="0" className="input text-sm" placeholder="Optional" />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-medium text-surface-600 mb-1">Stock *</label>
//                   <input {...register('stock', { required: true })} type="number" min="0" className="input text-sm" placeholder="0" />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-medium text-surface-600 mb-1">SKU</label>
//                   <input {...register('sku')} className="input text-sm" placeholder="Auto-generated" />
//                 </div>
//               </div>

//               <div className="flex gap-2">
//                 <button type="submit" disabled={creating} className="btn-primary text-xs gap-1.5">
//                   <FiCheck className="w-3.5 h-3.5" /> {creating ? 'Creating...' : 'Create Variant'}
//                 </button>
//                 <button type="button" onClick={() => setShowVariantForm(false)} className="btn-ghost text-xs">Cancel</button>
//               </div>
//             </form>
//           </div>
//         )}

//         {/* Variants List */}
//         {variants.length === 0 ? (
//           <p className="text-center text-surface-400 text-sm py-8">No variants yet. Click "Add Variant" to create one.</p>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead className="bg-surface-50">
//                 <tr>
//                   {['Label', 'SKU', 'Price', 'Stock', 'Status', 'Actions'].map((h) => (
//                     <th key={h} className="text-left px-3 py-2 text-xs font-semibold text-surface-500 uppercase tracking-wide">{h}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-surface-50">
//                 {variants.map((variant) => (
//                   <tr key={variant._id} className="hover:bg-surface-50">
//                     <td className="px-3 py-3 font-medium text-surface-800">{variant.label}</td>
//                     <td className="px-3 py-3 font-mono text-xs text-surface-500">{variant.sku}</td>
//                     <td className="px-3 py-3">
//                       <span className="font-bold text-primary-600">{formatPrice(variant.salePrice || variant.regularPrice)}</span>
//                       {variant.salePrice && <span className="text-xs text-surface-400 line-through ml-1">{formatPrice(variant.regularPrice)}</span>}
//                     </td>
//                     <td className="px-3 py-3">
//                       <div className="flex items-center gap-1.5">
//                         <button onClick={() => adjustStock({ variantId: variant._id, adjustment: -1 })} className="w-6 h-6 border rounded flex items-center justify-center text-surface-500 hover:bg-surface-100 text-xs">-</button>
//                         <span className={`font-bold w-8 text-center ${variant.stock === 0 ? 'text-red-600' : variant.stock <= 5 ? 'text-amber-600' : 'text-surface-800'}`}>{variant.stock}</span>
//                         <button onClick={() => adjustStock({ variantId: variant._id, adjustment: 1 })} className="w-6 h-6 border rounded flex items-center justify-center text-surface-500 hover:bg-surface-100 text-xs">+</button>
//                       </div>
//                     </td>
//                     <td className="px-3 py-3">
//                       <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${variant.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
//                         {variant.isActive ? 'Active' : 'Inactive'}
//                       </span>
//                     </td>
//                     <td className="px-3 py-3">
//                       <button
//                         onClick={() => { if (confirm('Delete this variant?')) deleteVariant(variant._id); }}
//                         className="w-7 h-7 border border-surface-200 rounded-lg flex items-center justify-center text-surface-400 hover:text-red-600 hover:border-red-300 transition-colors"
//                       >
//                         <FiTrash2 className="w-3.5 h-3.5" />
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }













// after create product add variant page
'use client';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import Image from 'next/image';
import Link from 'next/link';
import {FiArrowLeft, FiPlus, FiTrash2, FiEdit2,FiCheck, FiX, FiPackage, FiAlertTriangle} from'react-icons/fi';
import apiClient from '@/lib/apiClient.js';
import { useVariants, useCreateVariant, useDeleteVariant, useAdjustVariantStock } from '@/hooks/useVariants.js';
import { formatPrice, getPlaceholderImage } from '@/utils/helpers.js';

export default function AdminProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const qc = useQueryClient();
  const [showVariantForm, setShowVariantForm] = useState(false);
  const [attributes, setAttributes] = useState([{ name: '', value: '' }]);
  const [editingVariant, setEditingVariant] = useState(null);

  // Product fetch
  const { data: productData, isLoading } = useQuery({
    queryKey: ['admin-product', id],
    queryFn: () => apiClient.get(`/products/admin/${id}`),
    enabled: !!id,
  });

  const { data: variantsData, isLoading: variantsLoading } = useVariants(id);
  const { mutate: createVariant, isPending: creating } = useCreateVariant(id);
  const { mutate: deleteVariant } = useDeleteVariant(id);
  const { mutate: adjustStock } = useAdjustVariantStock(id);

  const { register, handleSubmit, reset, setValue } = useForm();
  const product = productData?.data;
  const variants = variantsData?.data || [];

  // Attribute handlers
  const addAttribute = () =>
    setAttributes((prev) => [...prev, { name: '', value: '' }]);

  const removeAttribute = (idx) =>
    setAttributes((prev) => prev.filter((_, i) => i !== idx));

  const updateAttribute = (idx, field, value) =>
    setAttributes((prev) =>
      prev.map((a, i) => (i === idx ? { ...a, [field]: value } : a))
    );

  // Variant create submit
  const onCreateVariant = (formData) => {
    const validAttrs = attributes.filter((a) => a.name && a.value);
    if (validAttrs.length === 0) {
      toast.error('কমপক্ষে একটা attribute দিন (যেমন: Color - Red)');
      return;
    }

    const fd = new FormData();
    fd.append('attributes', JSON.stringify(validAttrs));
    fd.append('regularPrice', formData.regularPrice);
    if (formData.salePrice) fd.append('salePrice', formData.salePrice);
    fd.append('stock', formData.stock);
    if (formData.sku) fd.append('sku', formData.sku);
    if (formData.barcode) fd.append('barcode', formData.barcode);

    createVariant(fd, {
      onSuccess: () => {
        reset();
        setAttributes([{ name: '', value: '' }]);
        setShowVariantForm(false);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-4 animate-pulse">
        <div className="h-8 bg-surface-200 rounded w-48" />
        <div className="card p-5 h-32 bg-surface-100" />
        <div className="card p-5 h-48 bg-surface-100" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-6 text-center py-20">
        <p className="text-5xl mb-4">😕</p>
        <p className="text-surface-500 mb-4">Product পাওয়া যায়নি</p>
        <button onClick={() => router.back()} className="btn-secondary text-sm">← ফিরে যান</button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl">
      {/* Back */}
      <button
        onClick={() => router.push('/admin/products')}
        className="flex items-center gap-1.5 text-sm text-surface-500 hover:text-primary-600 mb-5 transition-colors"
      >
        <FiArrowLeft className="w-4 h-4" /> Products এ ফিরে যান
      </button>

      {/* Product Summary Card */}
      <div className="card p-5 mb-5">

        <div className="flex gap-4">
          <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-surface-50 flex-shrink-0">
            <Image
              src={product.thumbnailImage?.url || getPlaceholderImage(product.name)}
              alt={product.name}
              fill sizes="80px"
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-surface-900">{product.name}</h1>
            <p className="text-xs text-surface-400 font-mono mt-0.5">
              {product.productId}
              {product.sku && ` · SKU: ${product.sku}`}
            </p>
            <div className="flex flex-wrap gap-3 mt-2 text-sm">
              <span className="text-surface-600">{product.category}</span>
              {product.brand && <span className="text-surface-400">· {product.brand}</span>}
              <span className="font-bold text-primary-600">
                {formatPrice(product.salePrice || product.regularPrice)}
              </span>
              <span className={`font-medium ${product.stock === 0 ? 'text-red-500' : 'text-green-600'}`}>
                Stock: {product.stock}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2 flex-shrink-0">
            <Link
              href={`/admin/products/${id}/edit`}
              className="btn-secondary text-xs gap-1.5"
            >
              <FiEdit2 className="w-3.5 h-3.5" /> Edit Product
            </Link>
          </div>
        </div>
      </div>

      {/* Variants Section */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-bold text-surface-900 text-lg flex items-center gap-2">
              <FiPackage className="w-5 h-5 text-primary-600" />
              Variants ({variants.length})
            </h2>
            <p className="text-xs text-surface-500 mt-0.5">
              Color, Size ইত্যাদি আলাদা করে stock ও দাম manage করুন
            </p>
          </div>
          <button
            onClick={() => {
              setShowVariantForm(!showVariantForm);
              setAttributes([{ name: '', value: '' }]);
              reset();
            }}
            className="btn-primary text-sm gap-1.5"
          >
            <FiPlus className="w-4 h-4" />
            Variant যোগ করুন
          </button>
        </div>

        {/* Variant Create Form */}
        {showVariantForm && (
          <div className="border-2 border-primary-200 bg-primary-50/30 rounded-xl p-5 mb-6">
            <h3 className="font-bold text-surface-900 mb-4">নতুন Variant যোগ করুন</h3>
            <form onSubmit={handleSubmit(onCreateVariant)} className="space-y-4">

              {/* Attributes */}
              <div>
                <label className="block text-sm font-semibold text-surface-700 mb-2">
                  Attributes (Color, Size ইত্যাদি) <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  {attributes.map((attr, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <input
                        value={attr.name}
                        onChange={(e) => updateAttribute(i, 'name', e.target.value)}
                        className="input text-sm flex-1"
                        placeholder="নাম (যেমন: Color, Size)"
                      />
                      <span className="text-surface-400 text-sm">:</span>
                      <input
                        value={attr.value}
                        onChange={(e) => updateAttribute(i, 'value', e.target.value)}
                        className="input text-sm flex-1"
                        placeholder="Value (যেমন: Red, XL)"
                      />
                      {attributes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeAttribute(i)}
                          className="w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-600 flex-shrink-0"
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addAttribute}
                  className="text-xs text-primary-600 hover:underline mt-2 flex items-center gap-1"
                >
                  <FiPlus className="w-3 h-3" /> আরো attribute যোগ করুন
                </button>
                <p className="text-xs text-surface-400 mt-1">
                  উদাহরণ: Color → Red, Size → XL, Material → Cotton
                </p>
              </div>

              {/* Pricing & Stock */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-surface-600 mb-1">
                    Regular Price (৳) <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('regularPrice', { required: true })}
                    type="number" min="0"
                    className="input text-sm"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-surface-600 mb-1">
                    Sale Price (৳)
                  </label>
                  <input
                    {...register('salePrice')}
                    type="number" min="0"
                    className="input text-sm"
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-surface-600 mb-1">
                    Stock <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('stock', { required: true })}
                    type="number" min="0"
                    className="input text-sm"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-surface-600 mb-1">SKU</label>
                  <input
                    {...register('sku')}
                    className="input text-sm"
                    placeholder="Auto-generated"
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={creating}
                  className="btn-primary text-sm gap-1.5"
                >
                  {creating ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      যোগ হচ্ছে...
                    </span>
                  ) : (
                    <><FiCheck className="w-3.5 h-3.5" /> Variant যোগ করুন</>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowVariantForm(false)}
                  className="btn-ghost text-sm gap-1.5"
                >
                  <FiX className="w-3.5 h-3.5" /> বাতিল
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Variants List */}
        {variantsLoading ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-14 bg-surface-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : variants.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-surface-200 rounded-xl">
            <FiPackage className="w-10 h-10 text-surface-300 mx-auto mb-3" />
            <p className="text-surface-500 font-medium mb-1">কোনো Variant নেই</p>
            <p className="text-xs text-surface-400 mb-4">
              উপরের &quot;Variant যোগ করুন&quot; button এ click করুন
            </p>
            <button
              onClick={() => setShowVariantForm(true)}
              className="btn-primary text-sm gap-1.5"
            >
              <FiPlus className="w-4 h-4" /> প্রথম Variant যোগ করুন
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface-50 border-b border-surface-200">
                <tr>
                  {['Variant', 'SKU', 'দাম', 'Stock', 'Status', 'Action'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-50">
                {variants.map((variant) => (
                  <tr key={variant._id} className="hover:bg-surface-50 transition-colors">
                    {/* Label */}
                    <td className="px-4 py-3">
                      <p className="font-semibold text-surface-800">{variant.label}</p>
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {variant.attributes?.map((attr, i) => (
                          <span key={i} className="text-xs bg-surface-100 text-surface-600 px-2 py-0.5 rounded-full">
                            {attr.name}: {attr.value}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* SKU */}
                    <td className="px-4 py-3 font-mono text-xs text-surface-500">
                      {variant.sku || '—'}
                    </td>

                    {/* Price */}
                    <td className="px-4 py-3">
                      <span className="font-bold text-primary-600">
                        {formatPrice(variant.salePrice || variant.regularPrice)}
                      </span>
                      {variant.salePrice && (
                        <span className="text-xs text-surface-400 line-through ml-1">
                          {formatPrice(variant.regularPrice)}
                        </span>
                      )}
                    </td>

                    {/* Stock Control */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => adjustStock({ variantId: variant._id, adjustment: -1 })}
                          disabled={variant.stock === 0}
                          className="w-6 h-6 border border-surface-200 rounded flex items-center justify-center text-surface-600 hover:bg-surface-100 disabled:opacity-30 text-xs font-bold"
                        >
                          −
                        </button>
                        <span className={`font-bold w-8 text-center ${
                          variant.stock === 0
                            ? 'text-red-600'
                            : variant.stock <= 5
                              ? 'text-amber-600'
                              : 'text-surface-800'
                        }`}>
                          {variant.stock}
                        </span>
                        <button
                          onClick={() => adjustStock({ variantId: variant._id, adjustment: 1 })}
                          className="w-6 h-6 border border-surface-200 rounded flex items-center justify-center text-surface-600 hover:bg-surface-100 text-xs font-bold"
                        >
                          +
                        </button>
                        {variant.stock === 0 && (
                          <span className="text-xs text-red-500 ml-1 flex items-center gap-0.5">
                            <FiAlertTriangle className="w-3 h-3" /> Stock নেই
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        variant.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-600'
                      }`}>
                        {variant.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>

                    {/* Delete */}
                    <td className="px-4 py-3">
                      <button
                        onClick={() => {
                          if (confirm(`"${variant.label}" variant মুছে ফেলবেন?`)) {
                            deleteVariant(variant._id);
                          }
                        }}
                        className="w-7 h-7 border border-surface-200 rounded-lg flex items-center justify-center text-surface-400 hover:text-red-600 hover:border-red-300 transition-colors"
                        title="Variant মুছুন"
                      >
                        <FiTrash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}