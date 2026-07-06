import React, { useState } from 'react';
import { MapPinIcon, MailIcon, CalendarIcon, EditIcon, CameraIcon, UserIcon } from 'lucide-react';
import useAuthUser from '../hooks/useAuthuser';

const Profile = () => {
  const { authUser } = useAuthUser();
  const [isEditing, setIsEditing] = useState(false);

  // Format join date
  const joinDate = authUser?.createdAt 
    ? new Date(authUser.createdAt).toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
      })
    : 'Recently';

  return (
    <div className='min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50'>
      <div className='container mx-auto px-4 py-8 max-w-4xl'>
        
        {/* Profile Header Card */}
        <div className='bg-white rounded-2xl shadow-xl border border-orange-100 overflow-hidden mb-6'>
          {/* Cover Image */}
          <div className='h-32 sm:h-48 bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 relative'>
            <div className='absolute -bottom-16 left-6 sm:left-8'>
              <div className='relative'>
                <div className='w-28 h-28 sm:w-32 sm:h-32 rounded-full ring-4 ring-white overflow-hidden bg-white'>
                  <img 
                    src={
                      authUser?.profilePic ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(authUser?.fullName || 'User')}&background=f97316&size=200`
                    }
                    alt={authUser?.fullName || "User"}
                    className='w-full h-full object-cover'
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(authUser?.fullName || 'User')}&background=f97316`;
                    }}
                  />
                </div>
                <button className='absolute bottom-0 right-0 bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-full shadow-lg transition-colors'>
                  <CameraIcon className='w-4 h-4' />
                </button>
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className='pt-20 sm:pt-24 px-6 sm:px-8 pb-6'>
            <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4'>
              <div className='flex-1'>
                <h1 className='text-2xl sm:text-3xl font-bold text-gray-800 mb-2'>
                  {authUser?.fullName || 'User Name'}
                </h1>
                
                {/* User Stats */}
                <div className='flex items-center gap-6 text-sm text-gray-600 mb-4'>
                  {authUser?.location && (
                    <div className='flex items-center gap-1'>
                      <MapPinIcon className='w-4 h-4 text-orange-500' />
                      <span>{authUser.location}</span>
                    </div>
                  )}
                  <div className='flex items-center gap-1'>
                    <CalendarIcon className='w-4 h-4 text-orange-500' />
                    <span>Joined {joinDate}</span>
                  </div>
                </div>

                {/* Bio */}
                {authUser?.bio && (
                  <p className='text-gray-700 mb-4 max-w-2xl'>
                    {authUser.bio}
                  </p>
                )}
              </div>

              {/* Edit Button */}
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className='btn bg-orange-500 hover:bg-orange-600 text-white border-none shadow-md hover:shadow-lg transition-all'
              >
                <EditIcon className='w-4 h-4 mr-2' />
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Profile Details Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          
          {/* About Card */}
          <div className='bg-white rounded-2xl shadow-lg border border-orange-100 p-6'>
            <h2 className='text-xl font-bold text-gray-800 mb-4 flex items-center gap-2'>
              <UserIcon className='w-5 h-5 text-orange-500' />
              About
            </h2>
            <div className='space-y-3'>
              <div>
                <label className='text-sm font-semibold text-gray-600'>Full Name</label>
                <p className='text-gray-800'>{authUser?.fullName || 'Not specified'}</p>
              </div>
              <div>
                <label className='text-sm font-semibold text-gray-600'>Email</label>
                <p className='text-gray-800'>{authUser?.email || 'Not specified'}</p>
              </div>
              <div>
                <label className='text-sm font-semibold text-gray-600'>Location</label>
                <p className='text-gray-800'>{authUser?.location || 'Not specified'}</p>
              </div>
            </div>
          </div>

          {/* Activity Card */}
          <div className='bg-white rounded-2xl shadow-lg border border-orange-100 p-6'>
            <h2 className='text-xl font-bold text-gray-800 mb-4'>Activity</h2>
            <div className='space-y-4'>
              <div className='flex justify-between items-center p-3 bg-orange-50 rounded-lg'>
                <span className='text-gray-700 font-medium'>Friends</span>
                <span className='text-2xl font-bold text-orange-600'>
                  {authUser?.friends?.length || 0}
                </span>
              </div>
              <div className='flex justify-between items-center p-3 bg-amber-50 rounded-lg'>
                <span className='text-gray-700 font-medium'>Status</span>
                <span className='badge bg-green-500 text-white border-none'>
                  {authUser?.isOnBoarded ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Bio Section */}
        <div className='bg-white rounded-2xl shadow-lg border border-orange-100 p-6 mt-6'>
          <h2 className='text-xl font-bold text-gray-800 mb-4'>Bio</h2>
          {authUser?.bio ? (
            <p className='text-gray-700 leading-relaxed'>
              {authUser.bio}
            </p>
          ) : (
            <p className='text-gray-500 italic'>
              No bio added yet. Click "Edit Profile" to add one!
            </p>
          )}
        </div>

      </div>
    </div>
  );
};

export default Profile;