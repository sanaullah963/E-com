'use client';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { FiMail, FiArrowLeft } from 'react-icons/fi';
import { useForgotPassword } from '../../../hooks/useAuth.js';

export default function ForgotPasswordPage() {
  const { mutate, isPending, isSuccess } = useForgotPassword();
  const { register, handleSubmit, formState: { errors } } = useForm();

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50 px-4">
        <div className="card p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-4">📧</div>
          <h2 className="text-xl font-bold text-surface-900 mb-2">Check your email</h2>
          <p className="text-surface-500 text-sm mb-6">If this email exists, a password reset link has been sent.</p>
          <Link href="/login" className="btn-primary text-sm">Back to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 px-4">
      <div className="w-full max-w-md">
        <div className="card p-6">
          <Link href="/login" className="inline-flex items-center gap-1.5 text-sm text-surface-500 hover:text-primary-600 mb-5 transition-colors">
            <FiArrowLeft className="w-4 h-4" /> Back to Login
          </Link>
          <h1 className="text-2xl font-bold text-surface-900 mb-1">Forgot Password</h1>
          <p className="text-surface-500 text-sm mb-5">Enter your email to receive a reset link.</p>
          <form onSubmit={handleSubmit((d) => mutate(d.email))} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                <input {...register('email', { required: 'Email is required' })} type="email" className="input pl-9" placeholder="you@example.com" />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
            </div>
            <button type="submit" disabled={isPending} className="btn-primary w-full py-3 text-sm">
              {isPending ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
