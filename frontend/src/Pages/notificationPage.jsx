import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { acceptFriendRequest, getFriendRequests, rejectFriendRequest } from "../lib/api";
import { BellIcon, ClockIcon, MessageSquareIcon, UserCheckIcon, XIcon, CheckIcon } from "lucide-react";
import NoNotificationsFound from "../components/NoNotificationsFound.jsx";
import toast from "react-hot-toast";

const NotificationsPage = () => {
  const queryClient = useQueryClient();

  const { data: friendRequests, isLoading } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
  });

  const { mutate: acceptRequestMutation, isPending: isAccepting } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      toast.success("Friend request accepted!");
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["recommendedUsers"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to accept request");
    }
  });

  const { mutate: rejectRequestMutation, isPending: isRejecting } = useMutation({
    mutationFn: rejectFriendRequest,
    onSuccess: () => {
      toast.success("Friend request rejected");
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to reject request");
    }
  });

  const incomingRequests = friendRequests?.incomingReqs || [];
  const acceptedRequests = friendRequests?.acceptedReqs || [];

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-3xl space-y-8">

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-blue-100 border border-blue-200">
            <BellIcon className="size-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Notifications</h1>
            <p className="text-sm text-gray-500">Stay updated with your connections</p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-10 h-10 border-2 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
            <p className="text-gray-500 text-sm">Loading notifications...</p>
          </div>
        ) : (
          <>
            {/* Incoming Friend Requests */}
            {incomingRequests.length > 0 && (
              <section className="space-y-3">
                <div className="flex items-center gap-2 mb-4">
                  <UserCheckIcon className="h-5 w-5 text-purple-600" />
                  <h2 className="text-lg font-semibold text-gray-800">Friend Requests</h2>
                  <span className="ml-1 px-2 py-0.5 text-xs font-bold bg-purple-100 text-purple-700 border border-purple-200 rounded-full">
                    {incomingRequests.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {incomingRequests.map((request) => (
                    <div
                      key={request._id}
                      className="bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={request.sender?.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(request.sender?.fullName || 'User')}&background=3b82f6&color=fff`}
                            alt={request.sender?.fullName || "User"}
                            onError={(e) => {
                              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(request.sender?.fullName || 'User')}&background=3b82f6&color=fff`;
                            }}
                            className="w-12 h-12 rounded-full object-cover ring-2 ring-purple-200"
                          />
                          <div>
                            <h3 className="font-semibold text-gray-800">{request.sender?.fullName || "Unknown User"}</h3>
                            {request.sender?.bio && (
                              <p className="text-sm text-gray-500 line-clamp-1">{request.sender.bio}</p>
                            )}
                            {request.sender?.location && (
                              <p className="text-xs text-gray-400">{request.sender.location}</p>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2 flex-shrink-0">
                          <button
                            onClick={() => acceptRequestMutation(request._id)}
                            disabled={isAccepting || isRejecting}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-colors duration-200"
                          >
                            <CheckIcon className="w-3.5 h-3.5" />
                            {isAccepting ? "..." : "Accept"}
                          </button>
                          <button
                            onClick={() => rejectRequestMutation(request._id)}
                            disabled={isAccepting || isRejecting}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-red-100 hover:text-red-500 disabled:opacity-50 text-gray-500 text-sm font-medium rounded-xl transition-colors duration-200"
                          >
                            <XIcon className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Accepted Requests / New Connections */}
            {acceptedRequests.length > 0 && (
              <section className="space-y-3">
                <div className="flex items-center gap-2 mb-4">
                  <BellIcon className="h-5 w-5 text-emerald-600" />
                  <h2 className="text-lg font-semibold text-gray-800">New Connections</h2>
                  <span className="ml-1 px-2 py-0.5 text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-full">
                    {acceptedRequests.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {acceptedRequests.map((notification) => (
                    <div
                      key={notification._id}
                      className="bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={notification.recipient?.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(notification.recipient?.fullName || 'User')}&background=10b981&color=fff`}
                          alt={notification.recipient?.fullName || "User"}
                          onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(notification.recipient?.fullName || 'User')}&background=10b981&color=fff`;
                          }}
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-200 flex-shrink-0"
                        />

                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-800 truncate">
                            {notification.recipient?.fullName || "Someone"}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Accepted your friend request 🎉
                          </p>
                          <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                            <ClockIcon className="h-3 w-3" />
                            {new Date(notification.updatedAt || notification.createdAt).toLocaleDateString()}
                          </p>
                        </div>

                        <div className="flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100 border border-emerald-200 text-emerald-700 text-xs font-medium rounded-full">
                          <MessageSquareIcon className="h-3 w-3" />
                          New Friend
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {incomingRequests.length === 0 && acceptedRequests.length === 0 && (
              <NoNotificationsFound />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;