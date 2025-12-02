import './styles/globals.css';
import { useState, useEffect } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AuthProvider } from './components/AuthContext';
import { WishlistProvider } from './components/WishlistContext';
import { CartProvider } from './components/CartContext';
import { AddressProvider } from './components/AddressContext';
import { OrderProvider } from './components/OrderContext';
import { NavigationProvider } from './components/NavigationLoader';
import { Toaster } from './components/ui/sonner';
import { ScrollToTop } from './components/ScrollToTop';
import { useKeyboardShortcuts } from './components/KeyboardShortcuts';
import { HomePage } from './pages/HomePage';
import { CapsulePage } from './pages/CapsulePage';
import { SearchPage } from './pages/SearchPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { AccountPage } from './pages/AccountPage';
import { AboutPage } from './pages/AboutPage';
import { VaultPage } from './pages/VaultPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  useKeyboardShortcuts();

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash === 'capsule') setCurrentPage('capsule');
      else if (hash === 'vault') setCurrentPage('vault');
      else if (hash === 'about') setCurrentPage('about');
      else if (hash === 'search') setCurrentPage('search');
      else if (hash === 'account' || hash.startsWith('account/')) setCurrentPage('account');
      else if (hash === 'cart') setCurrentPage('cart');
      else if (hash === 'checkout') setCurrentPage('checkout');
      else if (hash.startsWith('product/')) setCurrentPage('product');
      else setCurrentPage('home');
    };

    // Set initial page based on hash
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <ErrorBoundary>
      <NavigationProvider>
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <AddressProvider>
                <OrderProvider>
                {currentPage === 'home' && <HomePage />}
                {currentPage === 'capsule' && <CapsulePage />}
                {currentPage === 'search' && <SearchPage />}
                {currentPage === 'product' && <ProductDetailPage />}
                {currentPage === 'account' && <AccountPage />}
                {currentPage === 'about' && <AboutPage />}
                {currentPage === 'vault' && <VaultPage />}
                {currentPage === 'cart' && <CartPage />}
                {currentPage === 'checkout' && <CheckoutPage />}
                <ScrollToTop currentPage={currentPage} />
                <Toaster />
                </OrderProvider>
              </AddressProvider>
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </NavigationProvider>
    </ErrorBoundary>
  );
}