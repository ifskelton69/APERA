import { Link } from "react-router-dom";
import { MapPinIcon, MessageSquareIcon } from "lucide-react";

const FriendCard = ({ friend }) => {
  return (
    <div className="card bg-gradient-to-br from-base-100 to-base-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-base-300/50 h-full">
      <div className="card-body p-6">
        {/* USER INFO */}
        <div className="flex items-center gap-4 mb-4">
          <div className="avatar">
            <div className="w-16 h-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden">
              <img 
                src={friend.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(friend.fullName || 'User')}&background=random`}
                alt={friend.fullName || "User"}
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(friend.fullName || 'User')}&background=4F46E5`;
                }}
              />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg truncate text-base-content">
              {friend.fullName}
            </h3>
            {friend.location && (
              <div className="flex items-center gap-1 text-sm text-base-content/60 mt-1">
                              <MapPinIcon className='size-4 mr-2 text-secondary' />
                <span className="truncate">{friend.location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Bio if available */}
        {friend.bio && (
          <div className="bg-base-200/50 rounded-lg p-3 mb-3 border border-base-300/30">
            <p className="text-sm text-base-content/80 line-clamp-2">
              {friend.bio}
            </p>
          </div>
        )}

        {/* Message Button */}
        <Link 
          to={`/chat/${friend._id}`} 
          className="btn btn-primary w-full mt-auto hover:scale-105 transition-transform"
        >
          <MessageSquareIcon className="w-4 h-4 mr-2" />
          Message
        </Link>
      </div>
    </div>
  );
};

export default FriendCard;