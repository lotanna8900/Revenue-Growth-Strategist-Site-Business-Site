'use client';

import { login } from './actions';
import { useState } from 'react';
import { Sparkles, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const result = await login(formData);

    if (result?.error) {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-50 p-4">
      <div className="w-full max-w-md animate-slide-up">
        <div className="glass-card p-8 shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-accent-gold to-accent-rose rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-center text-brand-900 mb-2">
            Admin Login
          </h1>
          <p className="text-center text-brand-600 mb-8">
            Welcome back to your dashboard
          </p>

          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-100 p-3 text-sm text-red-700">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            )}

            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-brand-700 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-3 rounded-lg border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-600"
                placeholder="you@example.com"
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-brand-700 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-4 py-3 rounded-lg border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-600"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="btn-primary w-full text-lg"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}