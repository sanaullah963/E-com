"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FiUpload, FiX, FiPlus } from "react-icons/fi";
import { useCreateProduct } from "@/hooks/useProducts.js";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getCategoriesAdminApi,
  getBrandsAdminApi,
} from "@/services/admin.service.js";
import apiClient from "@/lib/apiClient";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  category: z.string().min(1, "Category is required"),
  brand: z.string().optional(),
  regularPrice: z.string().min(1, "Price is required"),
  salePrice: z.string().optional(),
  stock: z.string().min(1, "Stock is required"),
  shortDescription: z.string().max(500).optional(),
  description: z.string().optional(),
  visibilityStatus: z.enum(["visible", "hidden", "disabled"]),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  tags: z.string().optional(),
  hasVariants: z.boolean().optional(),
});
// useCreateProduct  onSuccess hasVariants
export default function CreateProductPage() {
  const router = useRouter();
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const { data: catsData } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: getCategoriesAdminApi,
  });
  const { data: brandsData } = useQuery({
    queryKey: ["admin-brands"],
    queryFn: getBrandsAdminApi,
  });
  const categories = catsData?.data || [];
  const brands = brandsData?.data || [];

  const { mutate: createProduct, isPending } = useMutation({
  mutationFn: (formData) =>
    apiClient.post('/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  onSuccess: (data) => {
    const productId = data.data._id;
    const hasVariantsChecked = watch('hasVariants');

    if (hasVariantsChecked) {
      // Variant আছে — variant add করার page এ নিয়ে যাও
      toast.success('Product তৈরি হয়েছে! এখন variant যোগ করুন।');
      router.push(`/admin/products/${productId}`);
    } else {
      // Variant নেই — product list এ ফিরে যাও
      toast.success('Product তৈরি হয়েছে!');
      router.push('/admin/products');
    }
  },
  onError: (err) => toast.error(err.message || 'Product তৈরি ব্যর্থ হয়েছে'),
});

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { visibilityStatus: "visible", hasVariants: false },
  });

  const hasVariants = watch("hasVariants");

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (imageFiles.length + files.length > 10) {
      toast.error("Maximum 10 images allowed");
      return;
    }
    setImageFiles((prev) => [...prev, ...files]);
    const newPreviews = files.map((f) => URL.createObjectURL(f));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (idx) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== idx));
    setImagePreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const onSubmit = (formData) => {
    const fd = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== undefined && value !== "") fd.append(key, value);
    });
    imageFiles.forEach((file) => fd.append("images", file));

    // createProduct(fd, {
    //   onSuccess: () => router.push('/admin/products'),
    // });

    createProduct(fd);
  };

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-surface-900">Create Product</h1>
        <button onClick={() => router.back()} className="btn-ghost text-sm">
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Basic Info */}
        <div className="card p-5">
          <h2 className="font-bold text-surface-900 mb-4">Basic Information</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-surface-700 mb-1.5">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                {...register("name")}
                className="input"
                placeholder="Enter product name"
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">
                Category <span className="text-red-500">*</span>
              </label>
              <select {...register("category")} className="input">
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.category.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">
                Brand
              </label>
              <select {...register("brand")} className="input">
                <option value="">Select brand</option>
                {brands.map((b) => (
                  <option key={b._id} value={b.name}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">
                SKU
              </label>
              <input
                {...register("sku")}
                className="input"
                placeholder="AUTO-GENERATED if empty"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">
                Barcode
              </label>
              <input
                {...register("barcode")}
                className="input"
                placeholder="EAN, UPC, etc."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">
                Tags
              </label>
              <input
                {...register("tags")}
                className="input"
                placeholder="tag1, tag2, tag3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">
                Visibility
              </label>
              <select {...register("visibilityStatus")} className="input">
                <option value="visible">Visible</option>
                <option value="hidden">Hidden</option>
                <option value="disabled">
                  Disabled (show but not purchasable)
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="card p-5">
          <h2 className="font-bold text-surface-900 mb-4">Pricing & Stock</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">
                Regular Price (৳) <span className="text-red-500">*</span>
              </label>
              <input
                {...register("regularPrice")}
                type="number"
                min="0"
                className="input"
                placeholder="0"
              />
              {errors.regularPrice && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.regularPrice.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">
                Sale Price (৳)
              </label>
              <input
                {...register("salePrice")}
                type="number"
                min="0"
                className="input"
                placeholder="Optional"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">
                Stock <span className="text-red-500">*</span>
              </label>
              <input
                {...register("stock")}
                type="number"
                min="0"
                className="input"
                placeholder="0"
              />
              {errors.stock && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.stock.message}
                </p>
              )}
            </div>
          </div>

          {/* V5: Variants toggle */}

          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                {...register("hasVariants")}
                type="checkbox"
                id="hasVariants"
                className="w-4 h-4 mt-0.5 rounded border-surface-300 text-primary-600"
              />
              <div>
                <p className="text-sm font-semibold text-surface-800">
                  This product has variants (Color, Size, etc.)
                </p>
                <p className="text-xs text-amber-700 mt-1">
                  ✅ চেক করলে — Product তৈরির পরে সরাসরি Variant যোগ করার page এ
                  নিয়ে যাবে। সেখানে আপনি Color, Size ইত্যাদি আলাদা আলাদা stock
                  ও দাম সহ যোগ করতে পারবেন।
                </p>
              </div>
            </label>
          </div>

          {/* <div className="mt-4 flex items-center gap-3">
            <input
              {...register("hasVariants")}
              type="checkbox"
              id="hasVariants"
              className="w-4 h-4 rounded border-surface-300 text-primary-600"
            />
            <label
              htmlFor="hasVariants"
              className="text-sm font-medium text-surface-700"
            >
              This product has variants (Color, Size, etc.)
            </label>
          </div>
          {hasVariants && (
            <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mt-3">
              After creating the product, go to the product detail page to add
              variants with individual SKU, stock, and images.
            </p>
          )} */}
        </div>

        {/* Description */}
        <div className="card p-5">
          <h2 className="font-bold text-surface-900 mb-4">Description</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">
                Short Description
              </label>
              <textarea
                {...register("shortDescription")}
                className="input min-h-[70px] resize-none"
                placeholder="Brief product description (max 500 chars)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">
                Full Description
              </label>
              <textarea
                {...register("description")}
                className="input min-h-[120px] resize-none"
                placeholder="Detailed product description..."
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="card p-5">
          <h2 className="font-bold text-surface-900 mb-4">Product Images</h2>
          <div className="flex flex-wrap gap-3 mb-3">
            {imagePreviews.map((src, i) => (
              <div
                key={i}
                className="relative w-24 h-24 rounded-lg overflow-hidden border border-surface-200 group"
              >
                <img src={src} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <FiX className="w-3 h-3" />
                </button>
                {i === 0 && (
                  <span className="absolute bottom-1 left-1 text-xs bg-primary-600 text-white px-1.5 rounded">
                    Main
                  </span>
                )}
              </div>
            ))}
            {imageFiles.length < 10 && (
              <label className="w-24 h-24 border-2 border-dashed border-surface-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-colors">
                <FiUpload className="w-5 h-5 text-surface-400 mb-1" />
                <span className="text-xs text-surface-400">Add Image</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
          <p className="text-xs text-surface-400">
            First image will be the main thumbnail. Max 10 images, 5MB each.
          </p>
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isPending}
            className="btn-primary px-8 py-3 text-sm"
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating...
              </span>
            ) : (
              "Create Product"
            )}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="btn-ghost text-sm"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
