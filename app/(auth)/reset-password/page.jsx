'use client';
import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useResetPassword } from '../../../hooks/useAuth.js';

function ResetPasswordForm() {
  const params = useSearchParams();
  const token = params.get('token') || '';
  const [showPass, setShowPass] = useState(false);
  const { mutate, isPending } = useResetPassword();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  if (!token) {
    return (
      <div className="card p-8 max-w-md w-full text-center">
        <h2 className="text-xl font-bold text-surface-900 mb-2">Invalid reset link</h2>
        <p className="text-surface-500 text-sm mb-6">This password reset link is invalid or has expired.</p>
        <Link href="/forgot-password" className="btn-primary text-sm">Request a new link</Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="card p-6">
        <h1 className="text-2xl font-bold text-surface-900 mb-1">Reset Password</h1>
        <p className="text-surface-500 text-sm mb-5">Choose a new password for your account.</p>
        <form onSubmit={handleSubmit((d) => mutate({ token, password: d.password }))} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1.5">New Password</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
              <input
                {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'At least 6 characters' }, maxLength: { value: 72, message: 'At most 72 characters' } })}
                type={showPass ? 'text' : 'password'} className="input pl-9 pr-9" placeholder="••••••••" autoComplete="new-password"
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600">
                {showPass ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1.5">Confirm Password</label>
            <input
              {...register('confirm', { validate: (v) => v === watch('password') || 'Passwords do not match' })}
              type={showPass ? 'text' : 'password'} className="input" placeholder="••••••••" autoComplete="new-password"
            />
            {errors.confirm && <p className="text-xs text-red-500 mt-1">{errors.confirm.message}</p>}
          </div>
          <button type="submit" disabled={isPending} className="btn-primary w-full py-3 text-sm">
            {isPending ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 px-4">
      <Suspense fallback={null}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
