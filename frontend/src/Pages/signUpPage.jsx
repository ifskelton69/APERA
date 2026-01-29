import { useState } from "react";
import { ShipWheelIcon, Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { signup } from "../lib/api.js";

const SignUpPage = () => {
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: signup,
    onSuccess: (data) => {
      toast.success("Account created successfully! 🎉", {
        style: {
          background: 'linear-gradient(135deg, #10b981, #059669)',
          color: 'white',
        },
      });
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message || "An error occurred";
      toast.error(errorMessage, {
        style: {
          background: 'linear-gradient(135deg, #ef4444, #dc2626)',
          color: 'white',
        },
      });
    }
  });

  const [errors, setErrors] = useState("");

  const handleSignup = (e) => {
    e.preventDefault();
    setErrors("");

    if (!signupData.fullName.trim()) {
      setErrors("Full name is required");
      return;
    }

    if (!signupData.email.trim()) {
      setErrors("Email is required");
      return;
    }

    if (signupData.password.length < 6) {
      setErrors("Password must be at least 6 characters long");
      return;
    }

    mutate(signupData);
  };

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
        <div className="w-full max-w-5xl mx-auto">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            <div className="flex flex-col lg:flex-row">
              {/* SIGNUP FORM SECTION */}
              <div className="w-full lg:w-1/2 p-6 sm:p-8">
                {/* LOGO */}
                <div className="mb-6 flex items-center justify-center lg:justify-start gap-3">
                  <div className="relative">
                    <ShipWheelIcon className="size-8 text-blue-600 animate-spin-slow" />
                  </div>
                  <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 tracking-wider">
                    APERA
                  </span>
                </div>

                <form onSubmit={handleSignup} className="space-y-5">
                  {/* Header */}
                  <div className="text-center lg:text-left space-y-1">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600">
                      Create Account
                    </h1>
                    <p className="text-base text-gray-600">
                      Join APERA and start your journey today
                    </p>
                  </div>

                  {/* Form Fields */}
                  <div className="space-y-4">
                    {/* Full Name Field */}
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 size-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                        <input
                          type="text"
                          placeholder="Enter your full name"
                          className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 placeholder-gray-400"
                          value={signupData.fullName}
                          onChange={(e) =>
                            setSignupData({ ...signupData, fullName: e.target.value })
                          }
                          required
                          disabled={isPending}
                        />
                      </div>
                    </div>

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
                          className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 placeholder-gray-400"
                          value={signupData.email}
                          onChange={(e) =>
                            setSignupData({ ...signupData, email: e.target.value })
                          }
                          required
                          disabled={isPending}
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
                          placeholder="Create a strong password"
                          className="w-full pl-12 pr-14 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 placeholder-gray-400"
                          value={signupData.password}
                          onChange={(e) =>
                            setSignupData({ ...signupData, password: e.target.value })
                          }
                          required
                          minLength={6}
                          disabled={isPending}
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

                    {/* Error Message */}
                    {errors && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl">
                        <span className="text-sm font-medium">{errors}</span>
                      </div>
                    )}

                    {/* Terms and Conditions */}
                    <div className="flex items-start gap-3 pt-1">
                      <input
                        type="checkbox"
                        id="terms"
                        className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        required
                        disabled={isPending}
                      />
                      <label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed cursor-pointer">
                        I agree to the{" "}
                        <span className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors">
                          terms of service
                        </span>{" "}
                        and{" "}
                        <span className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors">
                          privacy policy
                        </span>
                      </label>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                      disabled={isPending}
                    >
                      {isPending ? (
                        <div className="flex items-center justify-center gap-3">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Creating your account...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-3">
                          <ShipWheelIcon className="size-5" />
                          <span>Sign Up</span>
                        </div>
                      )}
                    </button>

                    {/* Login Link */}
                    <div className="text-center pt-4 border-t border-gray-200">
                      <p className="text-gray-600">
                        Already have an account?{" "}
                        <Link
                          to="/login"
                          className="text-blue-600 hover:text-blue-800 font-semibold hover:underline transition-colors"
                        >
                          Log In
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

                <div className="relative z-10 max-w-md p-6 text-center">
                  <div className="relative aspect-square max-w-xs mx-auto mb-6">
                    <img
                      src="/loginCall.svg"
                      alt="Welcome illustration"
                      className="relative w-full h-full object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600">
                      Welcome to APERA
                    </h2>
                    <p className="text-base text-gray-600 leading-relaxed">
                      Connect with friends and family around the world. Your journey to meaningful connections starts here.
                    </p>

                    {/* Feature Points */}
                    <div className="flex justify-center space-x-6 pt-3">
                      <div className="text-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-white font-bold text-base">✨</span>
                        </div>
                        <p className="text-xs font-medium text-gray-600">Easy to Use</p>
                      </div>
                      <div className="text-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-white font-bold text-base">🔒</span>
                        </div>
                        <p className="text-xs font-medium text-gray-600">Secure</p>
                      </div>
                      <div className="text-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-white font-bold text-base">⚡</span>
                        </div>
                        <p className="text-xs font-medium text-gray-600">Fast</p>
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
  );
};

export default SignUpPage;