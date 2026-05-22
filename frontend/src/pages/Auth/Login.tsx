import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '@components/ui/Button/Button';
import { FaAmazon } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const responseData = await response.json();
      const result = responseData?.data || responseData;

      if (result?.accessToken) {
        localStorage.setItem('accessToken', result.accessToken);
        localStorage.setItem('refreshToken', result.refreshToken || '');
        localStorage.setItem('user', JSON.stringify(result.user));

        toast.success(`Welcome, ${result.user?.firstName || 'User'}!`);

        if (result.user?.role === 'ADMIN') {
          window.location.href = '/admin';
        } else {
          window.location.href = '/';
        }
      } else {
        setLoginError(responseData?.message || 'Login failed - No token received');
      }
    } catch (error: any) {
      setLoginError(error?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <FaAmazon className="text-4xl text-amazon-orange" />
            <span className="text-3xl font-bold text-amazon-navy">amazon</span>
          </Link>
        </div>
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Sign In</h1>
          {loginError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">{loginError}</div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amazon-orange" placeholder="Enter your email" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amazon-orange" placeholder="Enter your password" required />
            </div>
            <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>Sign In</Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">New to Amazon? <Link to="/register" className="text-amazon-blue hover:underline">Create your account</Link></p>
          </div>
          <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs text-gray-500">
            <p className="font-semibold mb-1">Test Credentials:</p>
            <p>Email: admin@amazonclone.com</p>
            <p>Password: Admin@123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;