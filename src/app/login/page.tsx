"use client";

import React, { useState, useEffect } from 'react';
import { Lock, Mail, Store } from 'lucide-react';
import { useLogin } from '@/features/auth/hooks';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isValid, setIsValid] = useState(false);

  const mutation = useLogin();
  const router = useRouter();

  // Simple validation logic
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailRegex.test(email);
    const isPasswordValid = password.length >= 6; // Minimal security requirement

    setIsValid(isEmailValid && isPasswordValid);
  }, [email, password]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      console.log("Logging in with:", { email, password });
      // Trigger your auth logic here

      mutation.mutate(
        { email, password },
        {onSuccess: () => {
            router.replace('/dashboard');
        }
    });

      
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
        
        {/* Header / Logo Replacement */}
        <div className="flex flex-col items-center mb-10">
          <div className="bg-black p-3 rounded-xl mb-4">
            <Store className="text-white w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            MobileShop
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Inventory & Sales Management
          </p>
        </div>
        {/* Header / Logo Replacement */}
        <div className="flex flex-col items-center mb-5">
          
          <div className="text-slate-500 text-sm">
            {mutation.isPending && <p>Logging in...</p>}
            {mutation.error && <p className='text-red-600 text-base'>{(mutation.error as Error).message}</p>}
            {mutation.isSuccess && <p className='text-green-600 text-base'>Success!</p>}
          </div>
        </div>



        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1">
              Work Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                placeholder="name@mobileshop.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border outline-0 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border outline-0 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={!isValid}
            className={`w-full py-3 rounded-lg font-semibold text-white transition-all duration-200 
              ${isValid 
                ? 'bg-black hover:bg-slate-800 shadow-lg cursor-pointer' 
                : 'bg-slate-300 cursor-not-allowed'
              }`}
          >
            Sign In
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <a href="#" className="text-xs text-slate-400 hover:text-black transition-colors">
            Forgot password? Contact Administrator
          </a>
        </div>
      </div>
      
      <p className="mt-8 text-slate-400 text-xs">
        © {new Date().getFullYear()} MobileShop Systems Ltd.
      </p>
    </div>
  );
};

export default LoginPage;