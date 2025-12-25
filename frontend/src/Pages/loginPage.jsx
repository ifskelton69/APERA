import React, { useState } from 'react'
import { login } from '../lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Eye, EyeOff, ShipWheelIcon, Mail, Lock, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: loginMutation, isPending } = useMutation({  
    mutationFn: login,
    onSuccess: () => {
      toast.success("Welcome back! 🎉", {
        style: {
          background: 'linear-gradient(135deg, #10b981, #059669)',
          color: 'white',
        },
      });
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Something went wrong", {
        style: {
          background: 'linear-gradient(135deg, #ef4444, #dc2626)',
          color: 'white',
        },
      });
    }
  });

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation(loginData);
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-tr from-green-400/20 to-blue-400/20 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 left-1/3 w-32 h-32 rounded-full bg-gradient-to-r from-purple-400/10 to-pink-400/10 blur-2xl animate-bounce delay-500"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-6xl mx-auto">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            <div className="flex flex-col lg:flex-row">
              {/* LOGIN FORM SECTION */}
              <div className="w-full lg:w-1/2 p-8 sm:p-12">
                {/* LOGO */}
                <div className="mb-8 flex items-center justify-center lg:justify-start gap-3">
                  <div className="relative">
                    <ShipWheelIcon className="size-10 text-blue-600 animate-spin-slow" />
                    <div className="absolute inset-0 size-10 bg-blue-600/20 rounded-full animate-ping"></div>
                  </div>
                  <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 tracking-wider">
                    APERA
                  </span>
                  <Sparkles className="size-6 text-yellow-500 animate-pulse" />
                </div>

                <form onSubmit={handleLogin} className="space-y-8">
                  {/* Header */}
                  <div className="text-center lg:text-left space-y-2">
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600">
                      Welcome Back
                    </h1>
                    <p className="text-lg text-gray-600">
                      Ready to continue your amazing journey?
                    </p>
                  </div>

                  {/* Form Fields */}
                  <div className="space-y-6">
                    {/* Email Field */}
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 size-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                        <input
                          type="email"
                          placeholder="Enter your email"
                          className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 placeholder-gray-400"
                          value={loginData.email}
                          onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    {/* Password Field */}
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 size-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="w-full pl-12 pr-14 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 placeholder-gray-400"
                          value={loginData.password}
                          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                          onClick={() => setShowPassword(!showPassword)}
                          tabIndex={-1}
                        >
                          {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                        </button>
                      </div>
                    </div>

                    {/* Forgot Password Link */}
                    <div className="text-right">
                      <Link 
                        to="/forgot-password" 
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors"
                      >
                        Forgot password?
                      </Link>
                    </div>

                    {/* Submit Button */}
                    <button 
                      type="submit" 
                      className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                      disabled={isPending}
                    >
                      {isPending ? (
                        <div className="flex items-center justify-center gap-3">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Signing you in...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-3">
                          <ShipWheelIcon className="size-5" />
                          <span>Sign In</span>
                        </div>
                      )}
                    </button>

                    {/* Sign Up Link */}
                    <div className="text-center pt-4 border-t border-gray-200">
                      <p className="text-gray-600">
                        New to APERA?{" "}
                        <Link 
                          to="/signup" 
                          className="text-blue-600 hover:text-blue-800 font-semibold hover:underline transition-colors"
                        >
                          Create your account
                        </Link>
                      </p>
                    </div>
                  </div>
                </form>
              </div>

              {/* ILLUSTRATION SECTION */}
              <div className="hidden lg:flex w-full lg:w-1/2 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-indigo-600/10 items-center justify-center relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3e%3cg fill='none' fill-rule='evenodd'%3e%3cg fill='%239C92AC' fill-opacity='0.1'%3e%3ccircle cx='30' cy='30' r='4'/%3e%3c/g%3e%3c/g%3e%3c/svg%3e")`,
                  }}></div>
                </div>
                
                <div className="relative z-10 max-w-md p-8 text-center">
                  <div className="relative aspect-square max-w-sm mx-auto mb-8">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
                    <img 
                      src="/loginCall.svg" 
                      alt="Welcome illustration" 
                      className="relative w-full h-full object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-300" 
                    />
                  </div>
                  
                  <div className="space-y-6">
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600">
                      Join Our Community
                    </h2>
                    <p className="text-lg text-gray-600 leading-relaxed">
                      Connect with friends and family around the world. Your journey to meaningful connections starts here.
                    </p>
                    
                    {/* Feature Points */}
                    <div className="flex justify-center space-x-8 pt-4">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-white font-bold text-lg">🌟</span>
                        </div>
                        <p className="text-xs font-medium text-gray-600">Premium Experience</p>
                      </div>
                      <div className="text-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-white font-bold text-lg">🔒</span>
                        </div>
                        <p className="text-xs font-medium text-gray-600">Secure & Private</p>
                      </div>
                      <div className="text-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-white font-bold text-lg">🚀</span>
                        </div>
                        <p className="text-xs font-medium text-gray-600">Lightning Fast</p>
                      </div>
                    </div>
                    
                    {/* Animated Dots */}
                    <div className="flex justify-center space-x-2 pt-6">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse"></div>
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse delay-75"></div>
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-500 to-blue-500 animate-pulse delay-150"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  )
}

export default LoginPage