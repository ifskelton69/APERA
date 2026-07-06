import { useState, useRef } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast, { LoaderIcon } from 'react-hot-toast';
import { CameraIcon, MapPinIcon, ShipWheelIcon, ImageIcon, X } from 'lucide-react';
import { completeOnBoarding } from '../lib/api';
import useAuthUser from '../hooks/useAuthuser';

const OnBoardingPage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);

  const [formstate, setFormstate] = useState({
    fullName: authUser?.fullName || '',
    bio: authUser?.bio || '',
    location: authUser?.location || '',
    profilePic: authUser?.profilePic || '',
  });

  const [imagePreview, setImagePreview] = useState(authUser?.profilePic || '');
  const [isImageUploading, setIsImageUploading] = useState(false);
  
  const { mutate: onBoardingMutation, isPending } = useMutation({
    mutationFn: completeOnBoarding,
    onSuccess: () => {
      toast.success("Profile completed successfully");
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPEG, PNG, WebP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setIsImageUploading(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageDataUrl = event.target.result;
      setImagePreview(imageDataUrl);
      setFormstate(prev => ({ ...prev, profilePic: imageDataUrl }));
      setIsImageUploading(false);
    };
    reader.onerror = () => {
      toast.error('Error reading file');
      setIsImageUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setImagePreview('');
    setFormstate(prev => ({ ...prev, profilePic: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onBoardingMutation(formstate);
  }
  
  return (
    <div className='min-h-screen flex bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 justify-center items-center p-4'>
      <div className='w-full max-w-3xl bg-white shadow-2xl rounded-2xl border border-orange-100'>
        <div className='p-6 sm:p-8'>
          <div className='text-center mb-8'>
            <h1 className='text-3xl sm:text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-2'>
              Complete your profile
            </h1>
            <p className='text-gray-600'>Let's set up your account</p>
          </div>

          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='flex flex-col items-center justify-center space-y-4'>

              {/* Image upload section */}
              <div className='relative group'>
                <div className='size-32 overflow-hidden rounded-full bg-orange-50 border-4 border-orange-200 hover:border-orange-400 transition-colors duration-200'>
                  {isImageUploading ? (
                    <div className='flex items-center justify-center h-full'>
                      <LoaderIcon className='size-8 text-orange-500 animate-spin'/>
                    </div>
                  ) : imagePreview ? (
                    <img 
                      src={imagePreview} 
                      alt='profile pic' 
                      className='w-full h-full object-cover cursor-pointer'
                      onClick={handleImageClick}
                    />
                  ) : (
                    <div 
                      className='flex items-center justify-center h-full cursor-pointer hover:bg-orange-100 transition-colors duration-200'
                      onClick={handleImageClick}
                    >
                      <CameraIcon className='size-12 text-orange-400 opacity-70'/>
                    </div>
                  )}
                </div>

                {/* Upload button overlay */}
                {imagePreview && (
                  <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer' onClick={handleImageClick}>
                    <CameraIcon className='size-8 text-white'/>
                  </div>
                )}

                {/* Remove image button */}
                {imagePreview && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className='absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-colors'
                  >
                    <X className='size-4' />
                  </button>
                )}
              </div>

              <p className='text-sm text-gray-500'>Click to upload your profile picture</p>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleImageChange}
                className='hidden'
                disabled={isImageUploading}
              />
            </div>

            {/* fullName */}
            <div className='form-control'>
               <label className='label'> 
                <span className='text-sm font-semibold text-gray-700'>Full Name *</span>
               </label>
               <input 
                type="text"
                name='fullName'
                value={formstate.fullName}
                onChange={(e) => setFormstate({...formstate, fullName: e.target.value})}
                placeholder='Enter your full name'
                className='input input-bordered w-full bg-white border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all'
                required
                />
            </div>

            {/* bio */}
            <div className='form-control'>
               <label className='label'> 
                <span className='text-sm font-semibold text-gray-700'>Bio</span>
                <span className='text-xs text-gray-500'>
                  {formstate.bio.length}/150
                </span>
                </label>
                <textarea
                name='bio'
                onChange={(e) => setFormstate({...formstate, bio: e.target.value})}
                value={formstate.bio}
                placeholder='Tell us about yourself...'
                className='textarea textarea-bordered h-24 bg-white border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 resize-none transition-all'
                rows={3}
                maxLength={150}
                />
            </div>

            {/* location */}
            <div className='form-control'>
               <label className='label'>
                <span className='text-sm font-semibold text-gray-700'>Location</span>
                </label>
                <div className='relative'>
                  <MapPinIcon className='absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-orange-500'/>
                <input 
                type="text"
                onChange={(e) => setFormstate({...formstate, location: e.target.value})}
                value={formstate.location}
                className='input input-bordered w-full pl-10 bg-white border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all'
                placeholder='City, Country'
                />
                </div>
            </div>
            
            {/* submit button */}
            <button 
              type='submit'
              className='btn bg-orange-500 hover:bg-orange-600 border-none text-white w-full shadow-lg hover:shadow-xl transition-all hover:scale-105'
              disabled={isPending || isImageUploading || !formstate.fullName.trim()} 
            >
              {isPending ? (
                <>
                  <LoaderIcon className='size-5 mr-2 animate-spin'/>  
                  Processing...
                </>
              ) : (
                <>
                  <ShipWheelIcon className='size-5 mr-2'/>  
                  Complete Profile
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default OnBoardingPage