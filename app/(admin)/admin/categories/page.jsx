'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck } from 'react-icons/fi';
import {
  getCategoriesAdminApi, createCategoryApi,
  updateCategoryApi, deleteCategoryApi,
} from '@/services/admin.service.js';

export default function AdminCategoriesPage() {
  const [editing, setEditing] = useState(null); // category object or null
  const [showForm, setShowForm] = useState(false);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: getCategoriesAdminApi,
  });

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  const { mutate: create, isPending: creating } = useMutation({
    mutationFn: createCategoryApi,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-categories'] }); toast.success('Category created!'); reset(); setShowForm(false); },
    onError: (err) => toast.error(err.message),
  });

  const { mutate: update, isPending: updating } = useMutation({
    mutationFn: ({ id, data }) => updateCategoryApi(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-categories'] }); toast.success('Category updated!'); setEditing(null); },
    onError: (err) => toast.error(err.message),
  });

  const { mutate: deleteCategory } = useMutation({
    mutationFn: deleteCategoryApi,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-categories'] }); toast.success('Category deleted.'); },
    onError: (err) => toast.error(err.message),
  });

  const categories = data?.data || [];

  const startEdit = (cat) => {
    setEditing(cat);
    setValue('name', cat.name);
    setValue('description', cat.description);
  };

  const onSubmit = (formData) => {
    if (editing) {
      update({ id: editing._id, data: formData });
    } else {
      create(formData);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-surface-900">Categories</h1>
        <button onClick={() => { setShowForm(!showForm); setEditing(null); reset(); }} className="btn-primary text-sm gap-1.5">
          <FiPlus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {/* Form */}
      {(showForm || editing) && (
        <div className="card p-5 mb-6 border-2 border-primary-200 bg-primary-50/30">
          <h2 className="font-bold text-surface-900 mb-4">{editing ? 'Edit Category' : 'New Category'}</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Name <span className="text-red-500">*</span></label>
              <input {...register('name', { required: 'Name is required' })} className="input" placeholder="e.g. Electronics" />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Description</label>
              <input {...register('description')} className="input" placeholder="Short description" />
            </div>
            <div className="sm:col-span-2 flex gap-3">
              <button type="submit" disabled={creating || updating} className="btn-primary text-sm gap-1.5">
                <FiCheck className="w-4 h-4" /> {editing ? 'Update' : 'Create'} Category
              </button>
              <button type="button" onClick={() => { setEditing(null); setShowForm(false); reset(); }} className="btn-ghost text-sm gap-1.5">
                <FiX className="w-4 h-4" /> Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface-50 border-b border-surface-100">
            <tr>
              {['Name', 'Slug', 'Description', 'Status', 'Actions'].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-50">
            {isLoading ? (
              [...Array(3)].map((_, i) => <tr key={i}><td colSpan={5} className="px-4 py-3"><div className="h-4 bg-surface-100 rounded animate-pulse" /></td></tr>)
            ) : categories.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-10 text-surface-400">No categories yet</td></tr>
            ) : categories.map((cat) => (
              <tr key={cat._id} className="hover:bg-surface-50">
                <td className="px-4 py-3 font-semibold text-surface-800">{cat.name}</td>
                <td className="px-4 py-3 font-mono text-xs text-surface-500">{cat.slug}</td>
                <td className="px-4 py-3 text-surface-600 text-xs">{cat.description || '—'}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cat.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {cat.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(cat)} className="w-7 h-7 border border-surface-200 rounded-lg flex items-center justify-center text-surface-500 hover:text-primary-600 hover:border-primary-300 transition-colors">
                      <FiEdit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => { if (confirm(`Delete "${cat.name}"?`)) deleteCategory(cat._id); }}
                      className="w-7 h-7 border border-surface-200 rounded-lg flex items-center justify-center text-surface-500 hover:text-red-600 hover:border-red-300 transition-colors"
                    >
                      <FiTrash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
