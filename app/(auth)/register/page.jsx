'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { FiMail, FiLock, FiUser, FiPhone } from 'react-icons/fi';
import { useRegister } from '../../../hooks/useAuth.js';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  phone: z.string().regex(/^(\+880|880|0)?1[3-9]\d{8}$/, 'Invalid BD phone number').optional().or(z.literal('')),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, { message: "Passwords don't match", path: ['confirmPassword'] });

export default function RegisterPage() {
  const { mutate: register, isPending } = useRegister();
  const { register: reg, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">S</span>
            </div>
            <span className="text-2xl font-bold text-primary-600">ShopBD</span>
          </Link>
          <h1 className="text-2xl font-bold text-surface-900">Create account</h1>
          <p className="text-surface-500 text-sm mt-1">Join thousands of shoppers</p>
        </div>

        <div className="card p-6">
          <form onSubmit={handleSubmit((data) => register(data))} className="space-y-4">
            {[
              { name: 'name', label: 'Full Name', icon: FiUser, placeholder: 'Your full name', type: 'text' },
              { name: 'email', label: 'Email', icon: FiMail, placeholder: 'you@example.com', type: 'email' },
              { name: 'phone', label: 'Phone (optional)', icon: FiPhone, placeholder: '01XXXXXXXXX', type: 'tel' },
              { name: 'password', label: 'Password', icon: FiLock, placeholder: 'Min 6 characters', type: 'password' },
              { name: 'confirmPassword', label: 'Confirm Password', icon: FiLock, placeholder: 'Re-enter password', type: 'password' },
            ].map(({ name, label, icon: Icon, placeholder, type }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">{label}</label>
                <div className="relative">
                  <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                  <input {...reg(name)} type={type} className="input pl-9" placeholder={placeholder} />
                </div>
                {errors[name] && <p className="text-xs text-red-500 mt-1">{errors[name].message}</p>}
              </div>
            ))}

            <button type="submit" disabled={isPending} className="btn-primary w-full py-3 text-sm mt-2">
              {isPending ? <span className="flex items-center gap-2 justify-center"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating account...</span> : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-surface-500 mt-5">
            Already have an account?{' '}
            <Link href="/login" className="text-primary-600 font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
