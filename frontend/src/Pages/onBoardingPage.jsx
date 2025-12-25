import { useState, useRef } from 'react'
import useAuthUser from '../hooks/useAuthuser';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast, { LoaderIcon } from 'react-hot-toast';
import { CameraIcon, MapPinIcon, ShipWheelIcon, ImageIcon, X } from 'lucide-react';
import { completeOnBoarding } from '../lib/api';

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
      // Force refetch the auth user data
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
      // Also manually refetch to ensure immediate update
      // refetch(); // Uncomment if you have refetch available
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPEG, PNG, WebP)');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setIsImageUploading(true);

    // Create preview
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
    <div className='min-h-screen flex bg-base-100 justify-center items-center p-4'>
      <div className='card bg-base-200 w-full max-w-3xl shadow-xl'>
        <div className='card-body p-6 sm:p-8'>
          <h1 className='text-2xl sm:text-3xl font-bold text-center mb-6'> Complete your profile</h1>
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='flex flex-col items-center justify-center space-y-4'>

              {/* Image upload section */}
              <div className='relative group'>
                <div className='size-32 overflow-hidden rounded-full bg-base-300 border-4 border-base-300 hover:border-primary transition-colors duration-200'>
                  {isImageUploading ? (
                    <div className='flex items-center justify-center h-full'>
                      <LoaderIcon className='size-8 text-primary animate-spin'/>
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
                      className='flex items-center justify-center h-full cursor-pointer hover:bg-base-200 transition-colors duration-200'
                      onClick={handleImageClick}
                    >
                      <CameraIcon className='size-12 text-base-content opacity-50'/>
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
                    className='absolute -top-2 -right-2 btn btn-circle btn-sm btn-error shadow-lg hover:btn-error-focus'
                  >
                    <X className='size-4' />
                  </button>
                )}
              </div>

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
                <span className='label-text font-medium'> Full Name</span>
               </label>
               <input 
                type="text"
                name='fullName'
                value={formstate.fullName}
                onChange={(e) => setFormstate({...formstate, fullName: e.target.value})}
                placeholder='Enter your full name'
                className='input input-bordered w-full focus:input-primary'
                required
                />
            </div>

            {/* bio */}
            <div className='form-control'>
               <label className='label'> 
                <span className='label-text font-medium'> Bio</span>
                <span className='label-text-alt text-base-content opacity-60'>
                  {formstate.bio.length}/150
                </span>
                </label>
                <textarea
                name='bio'
                onChange={(e) => setFormstate({...formstate, bio: e.target.value})}
                value={formstate.bio}
                placeholder='Tell us about yourself...'
                className='textarea textarea-bordered h-24 focus:textarea-primary resize-none'
                rows={3}
                maxLength={150}
                />
            </div>

            {/* location */}
            <div className='form-control'>
               <label className='label'>
                <span className='label-text font-medium'> Location</span>
                </label>
                <div className='relative'>
                  <MapPinIcon className='absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-70'/>
                <input 
                type="text"
                onChange={(e) => setFormstate({...formstate, location: e.target.value})}
                value={formstate.location}
                className='input input-bordered w-full pl-10 focus:input-primary'
                placeholder='City, Country'
                />
                </div>
            </div>
            
            {/* submit button */}
            <button 
              type='submit'
              className={`btn btn-primary w-full text-white`}
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