import { Link } from "react-router-dom";
import { MapPinIcon, MessageSquareIcon } from "lucide-react";

const FriendCard = ({ friend }) => {
  return (
    <div className="bg-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-orange-100 rounded-2xl h-full overflow-hidden">
      <div className="p-6">
        {/* USER INFO */}
        <div className="flex items-center gap-4 mb-4">
          <div className="avatar">
            <div className="w-16 h-16 rounded-full ring-2 ring-orange-400 ring-offset-2 ring-offset-white overflow-hidden">
              <img 
                src={friend.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(friend.fullName || 'User')}&background=f97316`}
                alt={friend.fullName || "User"}
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(friend.fullName || 'User')}&background=f97316`;
                }}
              />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg truncate text-gray-800">
              {friend.fullName}
            </h3>
            {friend.location && (
              <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                <MapPinIcon className='w-4 h-4 text-orange-500' />
                <span className="truncate">{friend.location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Bio if available */}
        {friend.bio && (
          <div className="bg-orange-50 rounded-lg p-3 mb-3 border border-orange-100">
            <p className="text-sm text-gray-700 line-clamp-2">
              {friend.bio}
            </p>
          </div>
        )}

        {/* Message Button */}
        <Link 
          to={`/chat/${friend._id}`} 
          className="btn bg-orange-500 hover:bg-orange-600 text-white border-none w-full mt-auto hover:scale-105 transition-transform"
        >
          <MessageSquareIcon className="w-4 h-4 mr-2" />
          Message
        </Link>
      </div>
    </div>
  );
};

export default FriendCard;