import React, { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { BellIcon, LogOutIcon, ShipWheel, Settings, User, ChevronDown } from 'lucide-react';
import { logout } from '../lib/api';
import useAuthUser from '../hooks/useAuthuser';
import toast from 'react-hot-toast'; //

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const navigate = useNavigate();
  const isChatPage = location.pathname?.startsWith("/chat");
  const queryclient = useQueryClient();

  const { mutate: logoutMutation } = useMutation({
    mutationFn: logout,
    onSuccess: () => queryclient.invalidateQueries({ queryKey: ['authUser'] })
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-30 h-16 flex items-center bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border-b border-white/10 shadow-lg">
      <div className="w-full px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between">

          {/* LOGO */}
          {isChatPage || (
            <div className="flex-shrink-0 pl-2 sm:pl-4 lg:pl-6">
              <Link to="/" className="flex items-center gap-1.5 sm:gap-2.5 hover:scale-105 transition-transform duration-200">
                <ShipWheel className="size-6 sm:size-7 lg:size-8 text-primary animate-pulse" />
                <span className="text-lg sm:text-xl lg:text-2xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider drop-shadow-sm">
                  APERA
                </span>
              </Link>
            </div>
          )}

          {/* Right Side */}
          <div className="flex items-center gap-3 ml-auto">

            {/* Notification Bell */}
            <button
              onClick={() => navigate('/notification')}
              className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              <BellIcon className="size-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full ring-2 ring-slate-900" />
            </button>

            <div className="w-px h-6 bg-white/10" />

            {/* User Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-white/10 transition-all duration-200 group"
              >
                <div className="relative">
                  <img
                    src={
                      authUser?.profilePic ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(authUser?.fullName || 'User')}&background=3b82f6&color=fff`
                    }
                    alt={authUser?.fullName || "User"}
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(authUser?.fullName || 'User')}&background=3b82f6&color=fff`;
                    }}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/50 group-hover:ring-blue-400 transition-all duration-200"
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-slate-900" />
                </div>

                <div className="hidden md:flex flex-col text-left">
                  <span className="text-sm font-semibold text-white truncate max-w-[100px]">
                    {authUser?.fullName || 'User'}
                  </span>
                  <span className="text-xs text-emerald-400 font-medium">● Online</span>
                </div>

                <ChevronDown className={`hidden md:block w-4 h-4 text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 py-2 overflow-hidden">
                  <div className="px-4 py-3 border-b border-white/10 mb-1">
                    <p className="text-sm font-semibold text-white truncate">{authUser?.fullName}</p>
                    <p className="text-xs text-slate-400 truncate">{authUser?.email}</p>
                  </div>

                  <button
                    onClick={() => { navigate('/profile'); setIsDropdownOpen(false); }}
                    className="w-full px-4 py-2.5 text-left hover:bg-white/10 flex items-center gap-3 transition-colors text-slate-300 hover:text-white group"
                  >
                    <div className="p-1 rounded-lg bg-blue-500/20 group-hover:bg-blue-500/30 transition-colors">
                      <User className="w-3.5 h-3.5 text-blue-400" />
                    </div>
                    <span className="text-sm font-medium">Profile</span>
                  </button>

                  <button
                    onClick={() => { navigate('/settings'); setIsDropdownOpen(false); }}
                    className="w-full px-4 py-2.5 text-left hover:bg-white/10 flex items-center gap-3 transition-colors text-slate-300 hover:text-white group"
                  >
                    <div className="p-1 rounded-lg bg-purple-500/20 group-hover:bg-purple-500/30 transition-colors">
                      <Settings className="w-3.5 h-3.5 text-purple-400" />
                    </div>
                    <span className="text-sm font-medium">Settings</span>
                  </button>

                  <div className="my-2 border-t border-white/10" />

                  <button
                    onClick={() => logoutMutation()}
                    className="w-full px-4 py-2.5 text-left hover:bg-red-500/10 flex items-center gap-3 transition-colors text-slate-300 hover:text-red-400 group"
                  >
                    <div className="p-1 rounded-lg bg-red-500/20 group-hover:bg-red-500/30 transition-colors">
                      <LogOutIcon className="w-3.5 h-3.5 text-red-400" />
                    </div>
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;