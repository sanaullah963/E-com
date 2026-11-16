import { Inter } from 'next/font/google';
import QueryProvider from '../providers/QueryProvider.jsx';
import ToastProvider from '../providers/ToastProvider.jsx';
import Header from '../components/layout/Header.jsx';
import Footer from '../components/layout/Footer.jsx';
import '../styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata = {
  title: {
    default: 'ShopBD — Bangladesh\'s Premier Online Store',
    template: '%s | ShopBD',
  },
  description: 'Shop quality products online with fast delivery across Bangladesh. Secure payments, easy returns.',
  keywords: ['online shopping', 'bangladesh', 'ecommerce', 'dhaka', 'buy online'],
  authors: [{ name: 'ShopBD' }],
  creator: 'ShopBD',
  openGraph: {
    type: 'website',
    locale: 'en_BD',
    url: 'https://shopbd.com',
    siteName: 'ShopBD',
    title: 'ShopBD — Bangladesh\'s Premier Online Store',
    description: 'Quality products with fast delivery across Bangladesh',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn" className={inter.variable}>
      <body className="min-h-screen flex flex-col bg-surface-50" cz-shortcut-listen="true">
        <QueryProvider>
          <ToastProvider />
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}
