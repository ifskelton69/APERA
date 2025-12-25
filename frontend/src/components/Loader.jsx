import React from 'react'
import { LoaderIcon } from 'lucide-react'

const Loader = () => {
  return (
    <div className='min-h-screen flex items-center justify-center bg-base-100'>
      <div className='flex flex-col items-center space-y-4'>
        <LoaderIcon className='animate-spin size-20 text-primary' />
        <p className='text-sm text-purple-500-200'>Loading...</p>
      </div>
    </div>
  )
}

export default Loader