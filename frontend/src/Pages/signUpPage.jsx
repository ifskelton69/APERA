import { useState } from "react";
import { ShipWheelIcon, Eye, EyeOff } from "lucide-react";
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
      toast.success("Account created successfully!");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      // Optionally redirect or handle success
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message || "An error occurred";
      toast.error(errorMessage);
    }
  });

  const [errors, setErrors] = useState("");

  const handleSignup = (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setErrors("");
    
    // Basic validation
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

    // Call the mutation with the signup data
    mutate(signupData);
  };

  return (
    <div
      className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8"
      // data-theme="forest"
    >
      <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
        {/* Left side */}
        <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">
          {/* logo */}
          <div className="mb-4 flex items-center justify-start gap-3">
            <ShipWheelIcon className="w-10 h-10 text-primary" />
            <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary tracking-wider">
              APERA
            </span>
          </div>

          <form onSubmit={handleSignup} className="w-full">
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold">Create an Account</h2>
                <p className="text-sm opacity-70">
                  Join APERA and connect with your friends and family
                </p>
              </div>

              <div className="space-y-3">
                {/* Full Name */}
                <div className="form-control w-full">
                  <label htmlFor="fullName" className="label">
                    <span className="label-text">Full Name</span>
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    placeholder="Full Name"
                    className="input input-bordered w-full"
                    value={signupData.fullName}
                    onChange={(e) =>
                      setSignupData({ ...signupData, fullName: e.target.value })
                    }
                    required
                    disabled={isPending}
                  />
                </div>

                {/* Email */}
                <div className="form-control w-full">
                  <label htmlFor="email" className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Email"
                    className="input input-bordered w-full"
                    value={signupData.email}
                    onChange={(e) =>
                      setSignupData({ ...signupData, email: e.target.value })
                    }
                    required
                    disabled={isPending}
                  />
                </div>

                {/* Password */}
                <div className="form-control w-full">
                  <label htmlFor="password" className="label">
                    <span className="label-text">Password</span>
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      className="input input-bordered w-full pr-12"
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
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs mt-1 opacity-70">
                    Password must be at least 6 characters long.
                  </p>
                </div>

                {/* Error Message */}
                {errors && (
                  <div className="alert alert-error">
                    <span className="text-sm">{errors}</span>
                  </div>
                )}

                {/* Terms and Conditions */}
                <div className="form-control">
                  <label className="label cursor-pointer justify-start gap-2">
                    <input 
                      type="checkbox" 
                      className="checkbox checkbox-sm" 
                      required
                      disabled={isPending}
                    />
                    <span className="text-xs leading-tight">
                      I agree to the{" "}
                      <span className="text-primary hover:underline cursor-pointer">
                        terms of service
                      </span>{" "}
                      and{" "}
                      <span className="text-primary hover:underline cursor-pointer">
                        privacy policy
                      </span>
                    </span>
                  </label>
                </div>

                <button 
                  className="btn btn-primary w-full" 
                  type="submit"
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Signing Up...
                    </>
                  ) : (
                    "Sign Up"
                  )}
                </button>

                <div className="text-center mt-4">
                  <p className="text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary hover:underline">
                      Log In
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
        
        {/* Right side - Image */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
          <div className="max-w-md p-8">
            <div className="relative aspect-square max-w-sm mx-auto">
              <img src="/loginCall.svg" alt="language connection illustration" className="w-full h-full" />
            </div>
            <div className="text-center space-y-3 mt-6">
              <h2 className="text-xl font-semibold">
                Welcome to APERA!
              </h2>
              <p className="mt-6 text-center text-sm opacity-70">
                Connect with friends and family around the world with APERA.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;