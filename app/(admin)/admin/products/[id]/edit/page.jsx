"use client";
// edit product page
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Image from "next/image";
import { FiUpload, FiX, FiArrowLeft, FiTrash2 } from "react-icons/fi";
import apiClient from "@/lib/apiClient.js";
import {
  getCategoriesAdminApi,
  getBrandsAdminApi,
} from "@/services/admin.service.js";
import { getPlaceholderImage } from "@/utils/helpers.js";
import Link from 'next/link';
import { FiPackage } from 'react-icons/fi';

// showVariantForm
const schema = z.object({
  name: z.string().min(2, "নাম কমপক্ষে ২ অক্ষর হতে হবে"),
  category: z.string().min(1, "Category বাছাই করুন"),
  brand: z.string().optional(),
  regularPrice: z.string().min(1, "Regular price দিন"),
  salePrice: z.string().optional(),
  stock: z.string().min(1, "Stock দিন"),
  shortDescription: z.string().max(500).optional(),
  description: z.string().optional(),
  visibilityStatus: z.enum(["visible", "hidden", "disabled"]),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  tags: z.string().optional(),
});

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const qc = useQueryClient();

  const [newImageFiles, setNewImageFiles] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [deletedImageIds, setDeletedImageIds] = useState([]);

  // Fetch product
  const { data: productData, isLoading } = useQuery({
    queryKey: ["admin-product-edit", id],
    queryFn: () => apiClient.get(`/products/admin/${id}`),
    enabled: !!id,
  });

  // Fetch categories & brands
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
  const product = productData?.data;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { visibilityStatus: "visible" },
  });
const hasVariantsValue = watch('hasVariants');

  // Form এ product data বসান
  useEffect(() => {
    if (product) {
      reset({
        name: product.name || "",
        category: product.category || "",
        brand: product.brand || "",
        regularPrice: product.regularPrice?.toString() || "",
        salePrice: product.salePrice?.toString() || "",
        stock: product.stock?.toString() || "",
        shortDescription: product.shortDescription || "",
        description: product.description || "",
        visibilityStatus: product.visibilityStatus || "visible",
        sku: product.sku || "",
        barcode: product.barcode || "",
        tags: Array.isArray(product.tags)
          ? product.tags.join(", ")
          : product.tags || "",
      });
      setExistingImages(product.images || []);
    }
  }, [product, reset]);

  // Update mutation
  const { mutate: updateProduct, isPending } = useMutation({
    mutationFn: (formData) =>
      apiClient.put(`/products/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-product-edit", id] });
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success("পণ্য সফলভাবে আপডেট হয়েছে!");
      router.push("/admin/products");
    },
    onError: (err) => toast.error(err.message || "আপডেট ব্যর্থ হয়েছে"),
  });

  // Delete image mutation
  const { mutate: deleteImage } = useMutation({
    mutationFn: (imageId) =>
      apiClient.delete(`/products/${id}/images/${imageId}`),
    onSuccess: (data) => {
      setExistingImages(data.data?.images || []);
      toast.success("ছবি মুছে ফেলা হয়েছে");
      qc.invalidateQueries({ queryKey: ["admin-product-edit", id] });
    },
    onError: (err) => toast.error(err.message || "ছবি মুছতে ব্যর্থ হয়েছে"),
  });

  // নতুন ছবি সিলেক্ট
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const totalImages =
      existingImages.length + newImageFiles.length + files.length;
    if (totalImages > 10) {
      toast.error("সর্বোচ্চ ১০টি ছবি দেওয়া যাবে");
      return;
    }
    setNewImageFiles((prev) => [...prev, ...files]);
    const previews = files.map((f) => URL.createObjectURL(f));
    setNewImagePreviews((prev) => [...prev, ...previews]);
  };

  // নতুন ছবি remove (upload এর আগে)
  const removeNewImage = (idx) => {
    setNewImageFiles((prev) => prev.filter((_, i) => i !== idx));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  // Submit
  const onSubmit = (formData) => {
    const fd = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== undefined && value !== "") fd.append(key, value);
    });
    newImageFiles.forEach((file) => fd.append("images", file));
    updateProduct(fd);
  };

  if (isLoading) {
    return (
      <div className="p-6 animate-pulse space-y-4">
        <div className="h-8 bg-surface-200 rounded w-48" />
        <div className="card p-5 space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-10 bg-surface-100 rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-6 text-center py-20">
        <p className="text-5xl mb-4">😕</p>
        <p className="text-surface-500 mb-4">পণ্য পাওয়া যায়নি</p>
        <button onClick={() => router.back()} className="btn-secondary text-sm">
          ← ফিরে যান
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-sm text-surface-500 hover:text-primary-600 mb-2 transition-colors"
          >
            <FiArrowLeft className="w-4 h-4" /> ফিরে যান
          </button>
          <h1 className="text-2xl font-bold text-surface-900">
            পণ্য এডিট করুন
          </h1>
          <p className="text-xs text-surface-400 font-mono mt-0.5">
            {product.productId}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Basic Info */}
        <div className="card p-5">
          <h2 className="font-bold text-surface-900 mb-4">মূল তথ্য</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-surface-700 mb-1.5">
                পণ্যের নাম <span className="text-red-500">*</span>
              </label>
              <input
                {...register("name")}
                className="input"
                placeholder="পণ্যের নাম লিখুন"
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
                <option value="">Category বাছাই করুন</option>
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
                <option value="">Brand বাছাই করুন</option>
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
                placeholder="SKU কোড"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">
                Barcode
              </label>
              <input
                {...register("barcode")}
                className="input"
                placeholder="Barcode"
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
                <option value="visible">Visible (দেখা যাবে)</option>
                <option value="hidden">Hidden (লুকানো)</option>
                <option value="disabled">
                  Disabled (দেখা যাবে কিন্তু কেনা যাবে না)
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="card p-5">
          <h2 className="font-bold text-surface-900 mb-4">দাম ও স্টক</h2>
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
        </div>


{/* Variant Section */}
<div className="card p-5 border-2 border-dashed border-surface-200">
  <div className="flex items-center justify-between">
    <div>
      <h2 className="font-bold text-surface-900 flex items-center gap-2">
        <FiPackage className="w-5 h-5 text-primary-600" />
        Variants (Color, Size ইত্যাদি)
        {hasVariantsValue && (
          <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-medium">
            চালু আছে
          </span>
        )}
      </h2>
      <p className="text-xs text-surface-500 mt-1">
        পণ্যের আলাদা আলাদা Color, Size বা অন্য ধরনের variation manage করুন
      </p>
    </div>

    {/* Variant আছে কিনা toggle */}
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        {...register('hasVariants')}
        type="checkbox"
        className="w-4 h-4 rounded border-surface-300 text-primary-600"
      />
      <span className="text-sm font-medium text-surface-700">Variant আছে</span>
    </label>
  </div>


  {/* Variant manage করার link */}
  {hasVariantsValue ? (
    <div className="mt-4 flex items-center gap-3">
      <Link
        href={`/admin/products/${id}`}
        className="btn-primary text-sm gap-2"
      >
        <FiPackage className="w-4 h-4" />
        Variant যোগ / এডিট করুন
      </Link>
      <p className="text-xs text-surface-400">
        Variant যোগ করতে, stock বাড়াতে বা মুছতে এখানে ক্লিক করুন
      </p>
    </div>
  ) : (
    <div className="mt-3 p-3 bg-surface-50 rounded-lg">
      <p className="text-xs text-surface-500">
        💡 উপরে চেকবক্সে টিক দিয়ে "পণ্য আপডেট করুন" চাপুন —
        তারপর Variant যোগ করার অপশন দেখাবে।
      </p>
    </div>
  )}
</div>


{/* Variant Section */}


        {/* Description */}
        <div className="card p-5">
          <h2 className="font-bold text-surface-900 mb-4">বিবরণ</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">
                Short Description
              </label>
              <textarea
                {...register("shortDescription")}
                className="input min-h-[70px] resize-none"
                placeholder="সংক্ষিপ্ত বিবরণ (max 500 অক্ষর)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">
                Full Description
              </label>
              <textarea
                {...register("description")}
                className="input min-h-[120px] resize-none"
                placeholder="বিস্তারিত বিবরণ..."
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="card p-5">
          <h2 className="font-bold text-surface-900 mb-4">ছবি</h2>

          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium text-surface-600 mb-2">
                বর্তমান ছবি ({existingImages.length}টি)
              </p>
              <div className="flex flex-wrap gap-3">
                {existingImages.map((img, i) => (
                  <div
                    key={img._id || i}
                    className="relative w-24 h-24 rounded-lg overflow-hidden border border-surface-200 group"
                  >
                    <Image
                      src={img.url || getPlaceholderImage()}
                      alt={img.altText || `Image ${i + 1}`}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                    {i === 0 && (
                      <span className="absolute bottom-1 left-1 text-xs bg-primary-600 text-white px-1.5 rounded">
                        Main
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm("এই ছবি মুছে ফেলবেন?")) {
                          deleteImage(img._id);
                        }
                      }}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FiTrash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Images */}
          <div>
            <p className="text-sm font-medium text-surface-600 mb-2">
              নতুন ছবি যোগ করুন
            </p>
            <div className="flex flex-wrap gap-3">
              {newImagePreviews.map((src, i) => (
                <div
                  key={i}
                  className="relative w-24 h-24 rounded-lg overflow-hidden border border-primary-200 group"
                >
                  <img
                    src={src}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeNewImage(i)}
                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                  >
                    <FiX className="w-3 h-3" />
                  </button>
                </div>
              ))}

              {existingImages.length + newImageFiles.length < 10 && (
                <label className="w-24 h-24 border-2 border-dashed border-surface-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-colors">
                  <FiUpload className="w-5 h-5 text-surface-400 mb-1" />
                  <span className="text-xs text-surface-400">যোগ করুন</span>
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
            <p className="text-xs text-surface-400 mt-2">
              সর্বোচ্চ ১০টি ছবি, প্রতিটি ৫MB এর মধ্যে
            </p>
          </div>
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
                আপডেট হচ্ছে...
              </span>
            ) : (
              "পণ্য আপডেট করুন"
            )}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="btn-ghost text-sm"
          >
            বাতিল করুন
          </button>
        </div>
      </form>


    </div>
  );
}
