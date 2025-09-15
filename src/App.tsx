
import React, { useEffect, Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsOfServicePage = lazy(() => import('./pages/TermsOfServicePage'));
const UpdatePasswordPage = lazy(() => import('./pages/UpdatePasswordPage'));


const App: React.FC = () => {
  const { loading, siteContent, profile, session } = useAppContext();

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

  const isAuthenticated = !!session;
  const isAdmin = profile?.is_admin === true;

  return (
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
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/terms-of-service" element={<TermsOfServicePage />} />
              <Route path="/update-password" element={<UpdatePasswordPage />} />
              
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
  );
};

export default App;