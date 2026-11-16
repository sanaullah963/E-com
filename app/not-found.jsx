import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="section-container py-24 text-center">
      <div className="text-8xl font-black text-surface-200 mb-4">404</div>
      <h1 className="text-3xl font-bold text-surface-800 mb-3">Page Not Found</h1>
      <p className="text-surface-500 mb-8 max-w-sm mx-auto">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="flex gap-3 justify-center">
        <Link href="/" className="btn-primary text-sm">Go Home</Link>
        <Link href="/products" className="btn-secondary text-sm">Browse Products</Link>
      </div>
    </div>
  );
}
