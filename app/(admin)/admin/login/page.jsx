'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { FiPhone, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { toast } from 'sonner';
import { adminLogin } from '../../../../services/adminAuth.service.js';
import useAdminAuthStore from '../../../../store/adminAuthStore.js';

/**
 * Admin Login — OMS অ্যাডমিন অ্যাকাউন্ট (ফোন + পাসওয়ার্ড)।
 * কাস্টমার লগইন (/login, ইমেইল) থেকে সম্পূর্ণ আলাদা।
 */
export default function AdminLoginPage() {
  const router = useRouter();
  const setSession = useAdminAuthStore((s) => s.setSession);
  const token = useAdminAuthStore((s) => s.token);
  const [showPass, setShowPass] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    if (token) router.replace('/admin/dashboard');
  }, [token, router]);

  const onSubmit = async ({ phone, password }) => {
    setPending(true);
    setError('');
    try {
      const { token: t, user } = await adminLogin(phone.trim(), password);
      setSession(t, user);
      toast.success('লগইন সফল!');
      router.replace('/admin/dashboard');
    } catch (e) {
      setError(e.message || 'লগইন ব্যর্থ হয়েছে');
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">S</span>
            </div>
            <span className="text-2xl font-bold text-primary-600">ShopBD</span>
          </div>
          <h1 className="text-2xl font-bold text-surface-900">Admin Panel</h1>
          <p className="text-surface-500 text-sm mt-1">OMS অ্যাডমিন অ্যাকাউন্ট দিয়ে লগইন করুন</p>
        </div>

        <div className="card p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">ফোন নম্বর</label>
              <div className="relative">
                <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                <input {...register('phone', { required: 'ফোন নম্বর দিন' })} type="tel" inputMode="tel" autoComplete="username" className="input pl-9" placeholder="01XXXXXXXXX" />
              </div>
              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">পাসওয়ার্ড</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                <input {...register('password', { required: 'পাসওয়ার্ড দিন' })} type={showPass ? 'text' : 'password'} autoComplete="current-password" className="input pl-9 pr-9" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600">
                  {showPass ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
            </div>

            {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}

            <button type="submit" disabled={pending} className="btn-primary w-full py-3 text-sm mt-2">
              {pending ? <span className="flex items-center gap-2 justify-center"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in...</span> : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
