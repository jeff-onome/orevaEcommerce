

import React, { useEffect, Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { useAppContext } from './context/AppContext';
import ErrorBoundary from './components/ErrorBoundary';
import Spinner from './components/Spinner';

// Lazy load all pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const ShopPage = lazy(() => import('./pages/ShopPage'));
const OrderHistoryPage = lazy(() => import('./pages/OrderHistoryPage'));
const OrderDetailsPage = lazy(() => import('./pages/OrderDetailsPage'));
const UserProfilePage = lazy(() => import('./pages/UserProfilePage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));
const GenericPage = lazy(() => import('./pages/GenericPage'));


const App: React.FC = () => {
  const { loading, siteContent, profile, session, error } = useAppContext();

  useEffect(() => {
    if (siteContent) {
      const root = document.documentElement;
      root.style.setProperty('--color-primary', siteContent.theme_primary || '#1a237e');
      root.style.setProperty('--color-secondary', siteContent.theme_secondary || '#ffab40');
      root.style.setProperty('--color-accent', siteContent.theme_accent || '#f50057');
      document.title = siteContent.site_name || 'E-Shop Pro';
    }
  }, [siteContent]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center text-center p-4">
        <h1 className="text-2xl font-bold text-accent mb-4">Application Error</h1>
        <p className="text-gray-700 mb-2">There was a problem loading the application.</p>
        <pre className="bg-gray-100 p-4 rounded-md text-left text-sm text-red-700 whitespace-pre-wrap max-w-2xl w-full">
          {error.message}
        </pre>
      </div>
    )
  }

  const isAuthenticated = !!session;
  const isAdmin = profile?.is_admin === true;

  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <ErrorBoundary>
            <Suspense fallback={<div className="flex-grow flex items-center justify-center"><Spinner /></div>}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/login" element={isAuthenticated ? <Navigate to="/profile" /> : <LoginPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/privacy-policy" element={<GenericPage slug="privacy-policy" />} />
                <Route path="/terms-of-service" element={<GenericPage slug="terms-of-service" />} />
                
                {/* Protected Routes */}
                <Route path="/checkout" element={isAuthenticated ? <CheckoutPage /> : <Navigate to="/login" />} />
                <Route path="/orders" element={isAuthenticated ? <OrderHistoryPage /> : <Navigate to="/login" />} />
                <Route path="/orders/:id" element={isAuthenticated ? <OrderDetailsPage /> : <Navigate to="/login" />} />
                <Route path="/profile" element={isAuthenticated ? <UserProfilePage /> : <Navigate to="/login" />} />
                <Route path="/wishlist" element={isAuthenticated ? <WishlistPage /> : <Navigate to="/login" />} />
                
                {/* Admin Route */}
                <Route path="/admin" element={isAdmin ? <AdminPage /> : <Navigate to="/" />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
};

export default App;
