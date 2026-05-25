import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '@components/ui/Button/Button';
import { FaAmazon } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setRegisterError(null);

  if (formData.password !== formData.confirmPassword) {
    setRegisterError('Passwords do not match!');
    return;
  }

  setLoading(true);

  try {
    const response = await fetch('https://amazon-clone-pcrs.onrender.com/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    const result = data?.data || data;

    if (response.ok && result?.accessToken) {
      // ✅ SAVE TOKEN - same as login
      localStorage.setItem('accessToken', result.accessToken);
      localStorage.setItem('refreshToken', result.refreshToken || '');
      localStorage.setItem('user', JSON.stringify(result.user));

      toast.success(`Welcome, ${result.user?.firstName || 'User'}! Registration successful!`);
      
      // ✅ Redirect based on role
      if (result.user?.role === 'ADMIN') {
        window.location.href = '/admin';
      } else {
        window.location.href = '/';
      }
    } else {
      const errorMsg = typeof data?.message === 'string' 
        ? data.message 
        : Array.isArray(data?.message) 
        ? data.message[0] 
        : 'Registration failed';
      setRegisterError(errorMsg);
    }
  } catch (error: any) {
    setRegisterError('Server error. Make sure backend is running.');
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
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Create Account</h1>
          <p className="text-sm text-gray-600 mb-6">
            Already have an account?{' '}
            <Link to="/login" className="text-amazon-blue hover:underline">Sign in</Link>
          </p>

          {registerError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
              {registerError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amazon-orange"
                placeholder="Enter first name" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amazon-orange"
                placeholder="Enter last name" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amazon-orange"
                placeholder="Enter email" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone (optional)</label>
              <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amazon-orange"
                placeholder="Enter phone number" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amazon-orange"
                placeholder="At least 6 characters" required minLength={6} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amazon-orange"
                placeholder="Re-enter password" required />
            </div>

            <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
              Create Your Amazon Account
            </Button>
          </form>

          <p className="text-xs text-gray-500 mt-4 text-center">
            By creating an account, you agree to our Conditions of Use and Privacy Notice.
          </p>
        </div>

        <div className="text-center mt-4">
          <Link to="/login" className="text-sm text-amazon-blue hover:underline">
            ← Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;