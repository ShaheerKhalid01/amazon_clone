import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '@components/layout/Layout';

import AdminProtectedRoute from '@routes/AdminProtectedRoute';

const Home = lazy(() => import('@pages/Home/Home'));
const Login = lazy(() => import('@pages/Auth/Login'));
const Register = lazy(() => import('@pages/Auth/Register'));
const ProductDetail = lazy(() => import('@pages/ProductDetail/ProductDetail'));
const ProductListing = lazy(() => import('@pages/ProductListing/ProductListing'));
const Cart = lazy(() => import('@pages/Cart/Cart'));
const Checkout = lazy(() => import('@pages/Checkout/Checkout'));
const Deals = lazy(() => import('@pages/Deals/Deals'));
const Orders = lazy(() => import('@pages/Orders/Orders'));
const Wishlist = lazy(() => import('@pages/Wishlist/Wishlist'));
const AdminDashboard = lazy(() => import('@pages/Admin/AdminDashboard'));
import Chatbot from '@components/Chatbot/Chatbot';

function App() {
  return (
    <>
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="product/:id" element={<ProductDetail />} />
            <Route path="products" element={<ProductListing />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="deals" element={<Deals />} />
            <Route path="orders" element={<Orders />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route element={<AdminProtectedRoute />}>
              <Route path="admin" element={<AdminDashboard />} />
            </Route>
            <Route path="*" element={<Home />} />
          </Route>
        </Routes>
      </Suspense>

      {/* 👇 NAYA: Chatbot har page par floating rahega */}
      <Chatbot />
    </>
  );
}

export default App;