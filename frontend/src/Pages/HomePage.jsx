import { useEffect, useState } from 'react';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { getOutgoingFriendReqs, getRecommendedUsers, getUsersFriends, sendFriendRequest } from '../lib/api';
import { useMutation } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { CheckCircleIcon, MapPinIcon, UserPlusIcon, Users, UsersIcon, Sparkles } from 'lucide-react';
import NoFriendsFound from '../components/NoFriendsFound';
import FriendCard from '../components/FriendCard';

const HomePage = () => {
  const queryClient = useQueryClient();
  const [outgoingRequests, setOutgoingRequests] = useState(new Set());

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ['friends'],
    queryFn: getUsersFriends,
  });

  const { data, isLoading: loadingUsers } = useQuery({
    queryKey: ['users'],
    queryFn: getRecommendedUsers,
  });

  const recommendedUsers = data?.data || [];

  // Fixed: Get loading state for outgoing requests
  const { data: outgoingFriendReqs, isLoading: loadingOutgoingReqs } = useQuery({
    queryKey: ['outgoingFriendReqs'],
    queryFn: getOutgoingFriendReqs,
  });

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onMutate: (variables) => {
      // Optimistically add the user ID to outgoing requests
      setOutgoingRequests(prev => new Set([...prev, variables]));
    },
    onSuccess: (data, variables) => {
      // Keep the user ID in outgoing requests
      setOutgoingRequests(prev => new Set([...prev, variables]));

      // Invalidate queries to get fresh data
      queryClient.invalidateQueries({ queryKey: ['outgoingFriendReqs'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error, variables) => {
      // Remove from outgoing requests if the request failed
      setOutgoingRequests(prev => {
        const newSet = new Set(prev);
        newSet.delete(variables);
        return newSet;
      });
    }
  });

  // Fixed: Initialize outgoing requests properly and handle loading state
  useEffect(() => {
    if (outgoingFriendReqs && Array.isArray(outgoingFriendReqs)) {
      const reqs = new Set();
      outgoingFriendReqs.forEach((req) => {
        if (req.recipient && req.recipient._id) {
          reqs.add(req.recipient._id);
        }
      });
      setOutgoingRequests(reqs);
    }
  }, [outgoingFriendReqs]);

  return (
    <div className='min-h-screen bg-gradient-to-br from-base-100 via-base-100 to-base-200 p-4 sm:p-6 lg:p-8'>
      <div className='container mx-auto space-y-12 max-w-7xl'>
        {/* Header Section with Enhanced Styling */}
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-4'>
          <div className='space-y-2'>
            <h1 className='text-4xl sm:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent animate-pulse'>
              Friends
            </h1>
            <p className='text-base-content/70 text-lg'>Connect and discover amazing people</p>
          </div>
        </div>

        {/* Friends Section */}
        <section className='space-y-6'>
          <div className='flex items-center gap-3'>
            <div className='w-2 h-8 bg-gradient-to-b from-primary to-secondary rounded-full'></div>
            <h2 className='text-2xl sm:text-3xl font-bold'>Your Friends</h2>
            {friends.length > 0 && (
              <div className="badge badge-primary badge-lg ">
                {friends.length}
              </div>
            )}
          </div>

          {loadingFriends ? (
            <div className='flex flex-col items-center justify-center py-16 space-y-4'>
              <div className='loading loading-spinner loading-lg text-primary'></div>
              <p className='text-base-content/60'>Loading your friends...</p>
            </div>
          ) : friends.length === 0 ? (
            <div className='transform hover:scale-105 transition-transform duration-300'>
              <NoFriendsFound />
            </div>
          ) : (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
              {friends.map((friend, index) => (
                <div
                  key={friend._id}
                  className='animate-fade-in-up'
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <FriendCard friend={friend} />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Recommendations Section */}
        <section className='space-y-8'>
          <div className='divider divider-primary opacity-50'></div>

          <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6'>
            <div className='space-y-2'>
              <div className='flex items-center gap-3'>
                <div className='w-2 h-8 bg-gradient-to-b from-secondary to-accent rounded-full ' />
                <h2 className='text-2xl sm:text-3xl font-bold flex items-center gap-2'>
                  People you may know
                </h2>
              </div>
              <p className='text-base-content/60'>Discover new connections in your area</p>
            </div>

            <div className='stats shadow-lg bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20'>
              <div className='stat place-items-center py-2 px-4'>
                <div className='stat-value text-2xl text-primary font-bold'>
                  {recommendedUsers.length}
                </div>
                <div className='stat-desc font-medium'>
                  {recommendedUsers.length <= 1 ? 'user' : 'users'} found
                </div>
              </div>
            </div>
          </div>

          {loadingUsers || loadingOutgoingReqs ? (
            <div className='flex flex-col items-center justify-center py-16 space-y-4'>
              <div className='loading loading-spinner loading-lg text-secondary'></div>
              <p className='text-base-content/60'>Finding people you might know...</p>
            </div>
          ) : recommendedUsers.length === 0 ? (
            <div className='card bg-gradient-to-br from-base-200 to-base-300 shadow-xl border border-base-300 text-center p-12 transform hover:scale-105 transition-all duration-300'>
              <div className='space-y-4'>
                <div className='w-20 h-20 mx-auto bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center'>
                  <Users className='size-10 text-primary' />
                </div>
                <h3 className='font-bold text-xl text-base-content'>No recommendations available</h3>
                <p className='text-base-content/70 max-w-md mx-auto'>
                  Check back later for nearby interested students. We're always finding new connections for you!
                </p>
              </div>
            </div>
          ) : (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
              {recommendedUsers.map((user, index) => {
                const isRequestSent = outgoingRequests.has(user._id);

                return (
                  <div
                    key={user._id}
                    className='card bg-gradient-to-br from-base-100 to-base-200 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-base-300/50 animate-fade-in-up group'
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <div className='card-body p-6 space-y-5'>
                      <div className='flex items-center gap-4'>
                        <div className='relative'>
                          <div className='avatar'>
                            <div className='w-16 h-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2'>
                              <img
                                src={user.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || 'User')}&background=random`}
                                alt={user.fullName || "User"}
                                onError={(e) => {
                                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || 'User')}&background=4F46E5`;
                                }}
                              />
                            </div>
                          </div>
                          <div className='absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-base-100 shadow-sm'></div>
                        </div>
                        <div className='flex-1 min-w-0'>
                          <h3 className='font-bold text-lg text-base-content truncate group-hover:text-primary transition-colors duration-300'>
                            {user.fullName}
                          </h3>
                          {user.location && (
                            <div className='flex items-center text-sm text-base-content/60 mt-1'>
                              <MapPinIcon className='size-4 mr-2 text-secondary' />
                              <span className='truncate'>{user.location}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {user.bio && (
                        <div className='bg-base-200/50 rounded-lg p-3 border border-base-300/30'>
                          <p className='text-sm text-base-content/80 line-clamp-3'>
                            {user.bio}
                          </p>
                        </div>
                      )}

                      <button
                        className={`btn w-full transition-all duration-300 ${isRequestSent
                          ? "btn-success opacity-75 cursor-not-allowed bg-success/20 hover:scale-100"
                          : isPending
                            ? "btn-primary loading"
                            : "btn-primary hover:scale-105"
                          }`}
                        onClick={() => {
                          if (!isRequestSent && !isPending) {
                            sendRequestMutation(user._id);
                          }
                        }}
                        disabled={isRequestSent || isPending}
                      >
                        {isRequestSent ? (
                          <>
                            <CheckCircleIcon className="size-4 mr-2 " />
                            Request Sent
                          </>
                        ) : isPending ? (
                          <>
                            <span className="loading loading-spinner loading-sm mr-2" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <UserPlusIcon className="size-4 mr-2" />
                            Send Friend Request
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;