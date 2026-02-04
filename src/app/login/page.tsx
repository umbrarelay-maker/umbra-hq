'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'reset'>('login');
  const [resetSent, setResetSent] = useState(false);
  const router = useRouter();
  const { signIn, resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (mode === 'reset') {
        const { error } = await resetPassword(email);
        if (error) {
          setError(error.message);
        } else {
          setResetSent(true);
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          setError(error.message);
        } else {
          router.push('/');
          router.refresh();
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-pink-400 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-semibold text-lg">U</span>
            </div>
            <span className="text-xl font-semibold text-white">Umbra HQ</span>
          </div>
          <p className="text-zinc-500 text-sm">
            {mode === 'login' ? 'Sign in to continue' : 'Reset your password'}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-lg p-6 backdrop-blur-sm">
          {resetSent ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Check your email</h3>
              <p className="text-zinc-400 text-sm mb-6">
                We sent a password reset link to <span className="text-white">{email}</span>
              </p>
              <button
                onClick={() => {
                  setMode('login');
                  setResetSent(false);
                  setEmail('');
                }}
                className="text-sky-400 hover:text-sky-300 text-sm font-medium transition-colors"
              >
                Back to sign in
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 bg-zinc-800/50 border border-zinc-700 rounded text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors"
                  placeholder="joe@example.com"
                />
              </div>

              {mode === 'login' && (
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 bg-zinc-800/50 border border-zinc-700 rounded text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors"
                    placeholder="••••••••"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-sky-500 hover:bg-sky-600 text-white font-medium rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    {mode === 'login' ? 'Signing in...' : 'Sending...'}
                  </span>
                ) : (
                  mode === 'login' ? 'Sign in' : 'Send reset link'
                )}
              </button>

              <div className="text-center">
                {mode === 'login' ? (
                  <button
                    type="button"
                    onClick={() => setMode('reset')}
                    className="text-sky-400 hover:text-sky-300 text-sm font-medium transition-colors"
                  >
                    Forgot your password?
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="text-sky-400 hover:text-sky-300 text-sm font-medium transition-colors"
                  >
                    Back to sign in
                  </button>
                )}
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-zinc-500 text-sm mt-6">
          Collaboration dashboard for Joe & Umbra
        </p>
      </div>
    </div>
  );
}
