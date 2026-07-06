import { Users } from 'lucide-react';

const NoFriendsFound = () => {
  return (
    <div className="bg-white shadow-lg rounded-2xl border border-orange-100 p-12 text-center">
      <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full flex items-center justify-center">
        <Users className="size-10 text-orange-600" />
      </div>
      <h3 className="font-bold text-xl text-gray-800 mb-2">No friends yet</h3>
      <p className="text-gray-600 max-w-md mx-auto">
        Connect with nearby friends and start communicating together! 
      </p>
    </div>
  );
};

export default NoFriendsFound;