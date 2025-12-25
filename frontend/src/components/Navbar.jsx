import React, { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { BellIcon, LogOutIcon, ShipWheel, Settings, User, ChevronDown } from 'lucide-react';
import useAuthUser from '../hooks/useAuthuser';
import { logout } from '../lib/api';

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const navigate = useNavigate();
  const isChatPage = location.pathname?.startsWith("/chat");

  const queryclient = useQueryClient();
  
    const {mutate:logoutMutaion}=useMutation({
      mutationFn:logout,
      onSuccess:()=>queryclient.invalidateQueries({queryKey:['authUser']})
    })
  
  // Dropdown state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleProfileClick = () => {
    navigate('/profile');
    setIsDropdownOpen(false);
  };

  const handleSettingsClick = () => {
    navigate('/settings');
    setIsDropdownOpen(false);
  };

  return (
    <nav className="bg-base-200/95 backdrop-blur-md border-b border-base-300 sticky top-0 z-30 h-14 sm:h-16 flex items-center shadow-sm">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between w-full">
          
          {/* LOGO - ONLY IN THE CHAT PAGE */}
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

          {/* Right Side Actions */}
          <div className="flex items-center gap-1 sm:gap-2 lg:gap-4 ml-auto">

            {/* User Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <div                 className="flex items-center gap-1 sm:gap-2 p-1.5 sm:p-2 rounded-lg hover:bg-base-300/50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20">
                <div className="avatar online">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 rounded-full ring ring-primary ring-offset-base-100 ring-offset-1">
                    <img 
                      src={authUser?.profilePic || '/default-avatar.png'} 
                      alt="User Avatar" 
                      className="object-cover"
                    />
                  </div>
                </div>
                
                {/* Show name and dropdown arrow on larger screens */}
                <div className="hidden md:flex items-center gap-1">
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-medium text-base-content truncate max-w-20 lg:max-w-24">
                      {authUser?.fullName || 'User'}
                    </span>
                    <span className="text-xs text-success">Online</span>
                  </div>
                </div>
              </div>
                 
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar