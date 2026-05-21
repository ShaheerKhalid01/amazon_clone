import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authService } from '@services/auth.service';
import Button from '@components/ui/Button/Button';
import Input from '@components/ui/Input/Input';
import { FaAmazon, FaCheckCircle } from 'react-icons/fa';

/**
 * Forgot Password Schema
 */
const forgotPasswordSchema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

/**
 * Forgot Password Page Component
 */
const ForgotPassword: React.FC = () => {
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  /**
   * Handle forgot password form submission
   */
  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setError(null);
      await authService.forgotPassword(data.email);
      setIsEmailSent(true);
    } catch (error: any) {
      setError(error.message || 'Failed to send reset email. Please try again.');
    }
  };

  /**
   * Success state after email is sent
   */
  if (isEmailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2">
              <FaAmazon className="text-4xl text-amazon-orange" />
              <span className="text-3xl font-bold text-amazon-navy">amazon</span>
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-semibold text-gray-900 mb-4">
              Check Your Email
            </h1>
            <p className="text-gray-600 mb-6">
              We've sent a password reset link to your email address. 
              Please check your inbox and follow the instructions.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Didn't receive the email? Check your spam folder or{' '}
              <button
                onClick={() => setIsEmailSent(false)}
                className="text-amazon-blue hover:underline"
              >
                try again
              </button>
            </p>
            <Link to="/login">
              <Button variant="primary" fullWidth>
                Return to Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Amazon Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <FaAmazon className="text-4xl text-amazon-orange" />
            <span className="text-3xl font-bold text-amazon-navy">amazon</span>
          </Link>
        </div>

        {/* Forgot Password Form */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Password Assistance
          </h1>
          <p className="text-sm text-gray-600 mb-6">
            Enter the email address associated with your account and we'll send you
            a link to reset your password.
          </p>

          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 animate-fade-in">
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              error={errors.email?.message}
              {...register('email')}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={isSubmitting}
            >
              Continue
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Remember your password?{' '}
              <Link to="/login" className="text-amazon-blue hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <div className="flex justify-center gap-4 text-xs text-gray-500">
            <Link to="/privacy" className="hover:text-amazon-blue hover:underline">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-amazon-blue hover:underline">
              Terms of Use
            </Link>
            <Link to="/help" className="hover:text-amazon-blue hover:underline">
              Help Center
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
