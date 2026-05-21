import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Layout from '@components/layout/Layout';
import ProtectedRoute from '@routes/ProtectedRoute';
import LoadingSpinner from '@components/ui/Spinner/Spinner';
import ErrorBoundary from '@components/common/ErrorBoundary';

// Lazy load pages
const Home = lazy(() => import('@pages/Home/Home'));
const ProductListing = lazy(() => import('@pages/ProductListing/ProductListing'));
const ProductDetail = lazy(() => import('@pages/ProductDetail/ProductDetail'));
const Cart = lazy(() => import('@pages/Cart/Cart'));
const Checkout = lazy(() => import('@pages/Checkout/Checkout'));
const Orders = lazy(() => import('@pages/Orders/Orders'));
const OrderDetail = lazy(() => import('@pages/Orders/OrderDetail'));
const Login = lazy(() => import('@pages/Auth/Login'));
const Register = lazy(() => import('@pages/Auth/Register'));
const ForgotPassword = lazy(() => import('@pages/Auth/ForgotPassword'));
const Account = lazy(() => import('@pages/Account/Account'));
const Wishlist = lazy(() => import('@pages/Wishlist/Wishlist'));
const SearchResults = lazy(() => import('@pages/Search/SearchResults'));
const Deals = lazy(() => import('@pages/Deals/Deals'));
const NotFound = lazy(() => import('@pages/NotFound/NotFound'));
const AdminDashboard = lazy(() => import('@pages/Admin/AdminDashboard')); // ← ADDED

function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <ErrorBoundary>
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <LoadingSpinner size="lg" />
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Public Routes */}
            <Route index element={<Home />} />
            <Route path="products" element={<ProductListing />} />
            <Route path="product/:id" element={<ProductDetail />} />
            <Route path="cart" element={<Cart />} />
            <Route path="search" element={<SearchResults />} />
            <Route path="deals" element={<Deals />} />

            {/* Auth Routes */}
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="forgot-password" element={<ForgotPassword />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="checkout" element={<Checkout />} />
              <Route path="orders" element={<Orders />} />
              <Route path="orders/:id" element={<OrderDetail />} />
              <Route path="account" element={<Account />} />
              <Route path="wishlist" element={<Wishlist />} />
              <Route path="admin" element={<AdminDashboard />} /> {/* ← ADDED */}
            </Route>

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;