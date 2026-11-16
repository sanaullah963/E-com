

'use client';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { FiSearch, FiMenu, FiX, FiUser, FiPackage, FiLogOut, FiChevronDown } from 'react-icons/fi';
import CartButton from '../ui/CartButton.jsx';
import { APP_NAME } from '../../constants/index.js';
import useAuthStore from '../../store/authStore.js';
import useAdminAuthStore from '../../store/adminAuthStore.js';
import { useLogout } from '../../hooks/useAuth.js';

function UserMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const { user, isAuthenticated } = useAuthStore();
  const { mutate: logout } = useLogout();
  const adminToken = useAdminAuthStore((s) => s.token);

  // Outside click close
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (!isAuthenticated || !user) {
    return (
      <Link href="/login" className="hidden sm:flex items-center gap-1.5 btn-secondary text-xs py-1.5">
        <FiUser className="w-4 h-4" /> Sign In
      </Link>
    );
  }

  // অ্যাডমিন লিংক: আলাদা OMS অ্যাডমিন সেশন থাকলে (কাস্টমারের role নেই)
  const isAdmin = !!adminToken;
  const firstName = user.name?.split(' ')[0] || 'Account';

  return (
    <div className="relative hidden sm:block" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-surface-200 hover:bg-surface-50 transition-colors text-sm font-medium text-surface-700"
      >
        <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">{user.name?.[0]?.toUpperCase()}</span>
        </div>
        <span className="max-w-[80px] truncate">{firstName}</span>
        <FiChevronDown className={`w-3.5 h-3.5 text-surface-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-48 bg-white rounded-xl shadow-lg border border-surface-100 py-1.5 z-50 animate-fade-in">
          <div className="px-3 py-2 border-b border-surface-100 mb-1">
            <p className="text-xs font-semibold text-surface-800 truncate">{user.name}</p>
            <p className="text-xs text-surface-400 truncate">{user.email}</p>
          </div>

          {isAdmin && (
            <Link href="/admin/dashboard" onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-purple-600 hover:bg-purple-50 transition-colors font-medium">
              <FiUser className="w-4 h-4" /> Admin Panel
            </Link>
          )}

          <Link href="/dashboard" onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-surface-700 hover:bg-surface-50 transition-colors">
            <FiUser className="w-4 h-4" /> আমার প্রোফাইল
          </Link>

          <Link href="/orders" onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-surface-700 hover:bg-surface-50 transition-colors">
            <FiPackage className="w-4 h-4" /> আমার অর্ডার
          </Link>

          <div className="border-t border-surface-100 mt-1 pt-1">
            <button
              onClick={() => { logout(); setOpen(false); }}
              className="flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors w-full text-left"
            >
              <FiLogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useAuthStore();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    { href: '/order-tracking', label: 'Track Order' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-surface-100 shadow-sm">
      <div className="section-container">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white capitalize font-bold text-sm">{APP_NAME[0]}</span>
            </div>
            <span className="text-xl font-bold tracking-tight">{APP_NAME}</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm font-medium text-surface-600 hover:text-primary-600 transition-colors">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/products" className="p-2 text-surface-600 hover:text-primary-600 hover:bg-surface-50 rounded-lg transition-colors">
              <FiSearch className="w-5 h-5" />
            </Link>
            <CartButton />
            <UserMenu />
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-surface-600 hover:text-primary-600 hover:bg-surface-50 rounded-lg transition-colors">
              {mobileMenuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-surface-100 py-3 animate-slide-up">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}
                  className="px-3 py-2 text-sm font-medium text-surface-700 hover:text-primary-600 hover:bg-surface-50 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}>
                  {link.label}
                </Link>
              ))}
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard" className="px-3 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg" onClick={() => setMobileMenuOpen(false)}>My Account</Link>
                  <Link href="/orders" className="px-3 py-2 text-sm font-medium text-surface-600 hover:bg-surface-50 rounded-lg" onClick={() => setMobileMenuOpen(false)}>My Orders</Link>
                </>
              ) : (
                <Link href="/login" className="px-3 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}