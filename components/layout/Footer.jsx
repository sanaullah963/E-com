import Link from 'next/link';
import { FiFacebook, FiInstagram, FiTwitter } from 'react-icons/fi';
import { APP_NAME } from '../../constants/index.js';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface-900 text-surface-300 mt-auto">
      <div className="section-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white capitalize font-bold text-sm">{APP_NAME[0]}</span>
              </div>
              <span className="text-white text-xl font-bold">{APP_NAME}</span>
            </div>
            <p className="text-sm leading-relaxed text-surface-400 max-w-xs">
              Bangladesh's premier online shopping destination. Quality products, fast delivery, secure payments.
            </p>
            <div className="flex gap-3 mt-4">
              {[FiFacebook, FiInstagram, FiTwitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 bg-surface-800 rounded-lg flex items-center justify-center text-surface-400 hover:text-white hover:bg-primary-600 transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Shop</h3>
            <ul className="space-y-2.5">
              {[
                { href: '/products', label: 'All Products' },
                { href: '/products?sortBy=createdAt&sortOrder=desc', label: 'New Arrivals' },
                { href: '/products?inStock=true', label: 'In Stock' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-surface-400 hover:text-primary-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Info</h3>
            <ul className="space-y-2.5">
              {[
                { href: '/about', label: 'About Us' },
                { href: '/contact', label: 'Contact' },
                { href: '/privacy-policy', label: 'Privacy Policy' },
                { href: '/terms-of-service', label: 'Terms of Service' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-surface-400 hover:text-primary-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-surface-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-surface-500">
            <span>© {currentYear} </span>
            <Link href="http://intisar-sanaullah.vercel.app/" target="_blank" className="text-blue-400 hover:text-primary-400 transition-colors">{APP_NAME}</Link>
            <span>. All rights reserved. Made in Bangladesh 🇧🇩</span>
            
            
          </p>
          <p className="text-xs text-surface-600">
            Version 9.0.0 — Foundation Release
          </p>
        </div>
      </div>
    </footer>
  );
}
