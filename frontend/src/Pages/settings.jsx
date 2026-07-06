import React, { useState } from 'react';
import { Shield, Bell, Lock, Eye, Globe, Palette, User, Mail, Phone } from 'lucide-react';
import useAuthUser from '../hooks/useAuthuser';

const Settings = () => {
  const { authUser } = useAuthUser();
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [privateProfile, setPrivateProfile] = useState(false);

  const ChangePass = () => {
    navigate('/profile');
    setIsDropdownOpen(false);
  };
  return (
    <div className='min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50'>
      <div className='container mx-auto px-4 py-8 max-w-4xl'>
        
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl sm:text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-2'>
            Settings
          </h1>
          <p className='text-gray-600'>Manage your account settings and preferences</p>
        </div>

        {/* Account Settings */}
        <div className='bg-white rounded-2xl shadow-lg border border-orange-100 p-6 mb-6'>
          <h2 className='text-xl font-bold text-gray-800 mb-4 flex items-center gap-2'>
            <User className='w-5 h-5 text-orange-500' />
            Account Information
          </h2>
          <div className='space-y-4'>
            <div className='flex items-center justify-between p-4 bg-orange-50 rounded-lg'>
              <div className='flex items-center gap-3'>
                <Mail className='w-5 h-5 text-orange-500' />
                <div>
                  <p className='text-sm font-semibold text-gray-700'>Email</p>
                  <p className='text-gray-600'>{authUser?.email || 'Not set'}</p>
                </div>
              </div>
              <button 
                className='btn btn-sm bg-orange-500 hover:bg-orange-600 text-white border-none'
                onClick={ChangePass}
              >
                Change
              </button>
            </div>

            <div className='flex items-center justify-between p-4 bg-amber-50 rounded-lg'>
              <div className='flex items-center gap-3'>
                <Lock className='w-5 h-5 text-amber-500' />
                <div>
                  <p className='text-sm font-semibold text-gray-700'>Password</p>
                  <p className='text-gray-600'>••••••••</p>
                </div>
              </div>
              <button className='btn btn-sm bg-orange-500 hover:bg-orange-600 text-white border-none'>
                Change
              </button>
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className='bg-white rounded-2xl shadow-lg border border-orange-100 p-6 mb-6'>
          <h2 className='text-xl font-bold text-gray-800 mb-4 flex items-center gap-2'>
            <Shield className='w-5 h-5 text-orange-500' />
            Privacy & Security
          </h2>
          <div className='space-y-4'>
            <div className='flex items-center justify-between p-4 hover:bg-orange-50 rounded-lg transition-colors'>
              <div className='flex items-center gap-3'>
                <Eye className='w-5 h-5 text-orange-500' />
                <div>
                  <p className='font-semibold text-gray-700'>Private Profile</p>
                  <p className='text-sm text-gray-600'>Only friends can see your profile</p>
                </div>
              </div>
              <input 
                type="checkbox" 
                className="toggle toggle-success"
                checked={privateProfile}
                onChange={(e) => setPrivateProfile(e.target.checked)}
              />
            </div>

            <div className='flex items-center justify-between p-4 hover:bg-orange-50 rounded-lg transition-colors'>
              <div className='flex items-center gap-3'>
                <Globe className='w-5 h-5 text-orange-500' />
                <div>
                  <p className='font-semibold text-gray-700'>Show Online Status</p>
                  <p className='text-sm text-gray-600'>Let others know when you're online</p>
                </div>
              </div>
              <input 
                type="checkbox" 
                className="toggle toggle-success"
                defaultChecked
              />
            </div>
          </div>
        </div>

        {/* Notifications Settings */}
        <div className='bg-white rounded-2xl shadow-lg border border-orange-100 p-6 mb-6'>
          <h2 className='text-xl font-bold text-gray-800 mb-4 flex items-center gap-2'>
            <Bell className='w-5 h-5 text-orange-500' />
            Notifications
          </h2>
          <div className='space-y-4'>
            <div className='flex items-center justify-between p-4 hover:bg-orange-50 rounded-lg transition-colors'>
              <div className='flex items-center gap-3'>
                <Bell className='w-5 h-5 text-orange-500' />
                <div>
                  <p className='font-semibold text-gray-700'>Push Notifications</p>
                  <p className='text-sm text-gray-600'>Receive notifications on this device</p>
                </div>
              </div>
              <input 
                type="checkbox" 
                className="toggle toggle-success"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
              />
            </div>

            <div className='flex items-center justify-between p-4 hover:bg-orange-50 rounded-lg transition-colors'>
              <div className='flex items-center gap-3'>
                <Mail className='w-5 h-5 text-orange-500' />
                <div>
                  <p className='font-semibold text-gray-700'>Email Notifications</p>
                  <p className='text-sm text-gray-600'>Receive updates via email</p>
                </div>
              </div>
              <input 
                type="checkbox" 
                className="toggle toggle-success"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
              />
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className='bg-white rounded-2xl shadow-lg border border-orange-100 p-6 mb-6'>
          <h2 className='text-xl font-bold text-gray-800 mb-4 flex items-center gap-2'>
            <Palette className='w-5 h-5 text-orange-500' />
            Appearance
          </h2>
          <div className='space-y-4'>
            <div className='p-4 hover:bg-orange-50 rounded-lg transition-colors'>
              <p className='font-semibold text-gray-700 mb-2'>Theme</p>
              <div className='flex gap-3'>
                <button className='flex-1 p-3 border-2 border-orange-500 bg-orange-50 rounded-lg font-medium text-orange-600'>
                  Light
                </button>
                <button className='flex-1 p-3 border-2 border-gray-300 rounded-lg font-medium text-gray-600 hover:border-orange-500 transition-colors'>
                  Dark
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className='bg-white rounded-2xl shadow-lg border border-red-200 p-6'>
          <h2 className='text-xl font-bold text-red-600 mb-4'>Danger Zone</h2>
          <div className='space-y-3'>
            <button className='btn btn-outline border-red-500 text-red-600 hover:bg-red-50 hover:border-red-600 w-full'>
              Deactivate Account
            </button>
            <button className='btn bg-red-500 hover:bg-red-600 text-white border-none w-full'>
              Delete Account
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Settings;