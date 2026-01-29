import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { acceptFriendRequest, getFriendRequests, rejectFriendRequest } from "../lib/api";
import { BellIcon, ClockIcon, MessageSquareIcon, UserCheckIcon, XIcon } from "lucide-react";
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
      queryClient.invalidateQueries({ queryKey: ["recommendedUsers"] }); // Refresh home page
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
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-4xl space-y-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">Notifications</h1>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <>
            {incomingRequests.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <UserCheckIcon className="h-5 w-5 text-primary" />
                  Friend Requests
                  <span className="badge badge-primary ml-2">{incomingRequests.length}</span>
                </h2>

                <div className="space-y-3">
                  {incomingRequests.map((request) => (
                    <div
                      key={request._id}
                      className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="card-body p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="avatar w-14 h-14 rounded-full bg-base-300 overflow-hidden">
                              <img
                                src={request.sender?.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(request.sender?.fullName || 'User')}&background=random`}
                                alt={request.sender?.fullName || "User"}
                                onError={(e) => {
                                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(request.sender?.fullName || 'User')}&background=random`;
                                }}
                              />
                            </div>
                            <div>
                              <h3 className="font-semibold">{request.sender?.fullName || "Unknown User"}</h3>
                              {request.sender?.bio && (
                                <p className="text-sm opacity-70 line-clamp-1">{request.sender.bio}</p>
                              )}
                              {request.sender?.location && (
                                <p className="text-xs opacity-60">{request.sender.location}</p>
                              )}
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => acceptRequestMutation(request._id)}
                              disabled={isAccepting || isRejecting}
                            >
                              {isAccepting ? "Accepting..." : "Accept"}
                            </button>
                            <button
                              className="btn btn-ghost btn-sm"
                              onClick={() => rejectRequestMutation(request._id)}
                              disabled={isAccepting || isRejecting}
                            >
                              <XIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ACCEPTED REQS NOTIFICATIONS */}
            {acceptedRequests.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <BellIcon className="h-5 w-5 text-success" />
                  New Connections
                </h2>

                <div className="space-y-3">
                  {acceptedRequests.map((notification) => (
                    <div key={notification._id} className="card bg-base-200 shadow-sm">
                      <div className="card-body p-4">
                        <div className="flex items-start gap-3">
                          <div className="avatar mt-1 size-12 text-2xl rounded-full overflow-hidden">
                            <img
                                src={friendRequests.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(friendRequests.fullName || 'User')}&background=random`}
                                alt={friendRequests.fullName || "User"}
                                onError={(e) => {
                                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(friendRequests.fullName || 'User')}&background=4F46E5`;
                                }}
                              />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-2xl">{notification.recipient?.fullName || "Someone"}</h3>
                            <p className="text-sm ">
                              {notification.recipient?.fullName || "Someone"} accepted your friend request
                            </p>
                            <p className="text-xs flex items-center opacity-70">
                              <ClockIcon className="h-3 w-3 mr-1" />
                              {new Date(notification.updatedAt || notification.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="badge badge-success">
                            <MessageSquareIcon className="h-3 w-3 mr-1" />
                            New Friend
                          </div>
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