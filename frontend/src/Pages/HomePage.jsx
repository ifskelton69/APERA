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

  const { data: outgoingFriendReqs, isLoading: loadingOutgoingReqs } = useQuery({
    queryKey: ['outgoingFriendReqs'],
    queryFn: getOutgoingFriendReqs,
  });

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onMutate: (variables) => {
      setOutgoingRequests(prev => new Set([...prev, variables]));
    },
    onSuccess: (data, variables) => {
      setOutgoingRequests(prev => new Set([...prev, variables]));
      queryClient.invalidateQueries({ queryKey: ['outgoingFriendReqs'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error, variables) => {
      setOutgoingRequests(prev => {
        const newSet = new Set(prev);
        newSet.delete(variables);
        return newSet;
      });
    }
  });

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
    <div className='min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-4 sm:p-6 lg:p-8'>
      <div className='container mx-auto space-y-12 max-w-7xl'>
        {/* Header Section */}
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-4'>
          <div className='space-y-2'>
            <h1 className='text-4xl sm:text-5xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent'>
              Friends
            </h1>
            <p className='text-gray-600 text-lg'>Connect and discover amazing people</p>
          </div>
        </div>

        {/* Friends Section */}
        <section className='space-y-6'>
          <div className='flex items-center gap-3'>
            <div className='w-2 h-8 bg-gradient-to-b from-orange-500 to-amber-500 rounded-full'></div>
            <h2 className='text-2xl sm:text-3xl font-bold text-gray-800'>Your Friends</h2>
            {friends.length > 0 && (
              <div className="badge bg-orange-500 text-white border-none badge-lg">
                {friends.length}
              </div>
            )}
          </div>

          {loadingFriends ? (
            <div className='flex flex-col items-center justify-center py-16 space-y-4'>
              <div className='loading loading-spinner loading-lg text-orange-500'></div>
              <p className='text-gray-600'>Loading your friends...</p>
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
          <div className='divider'></div>

          <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6'>
            <div className='space-y-2'>
              <div className='flex items-center gap-3'>
                <div className='w-2 h-8 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full' />
                <h2 className='text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-2'>
                  People you may know
                </h2>
              </div>
              <p className='text-gray-600'>Discover new connections in your area</p>
            </div>

            <div className='bg-white shadow-lg rounded-2xl border border-orange-100 p-4'>
              <div className='text-center'>
                <div className='text-3xl font-bold text-orange-600'>
                  {recommendedUsers.length}
                </div>
                <div className='text-sm text-gray-600 font-medium'>
                  {recommendedUsers.length <= 1 ? 'user' : 'users'} found
                </div>
              </div>
            </div>
          </div>

          {loadingUsers || loadingOutgoingReqs ? (
            <div className='flex flex-col items-center justify-center py-16 space-y-4'>
              <div className='loading loading-spinner loading-lg text-orange-500'></div>
              <p className='text-gray-600'>Finding people you might know...</p>
            </div>
          ) : recommendedUsers.length === 0 ? (
            <div className='bg-white shadow-xl rounded-2xl border border-orange-100 text-center p-12 transform hover:scale-105 transition-all duration-300'>
              <div className='space-y-4'>
                <div className='w-20 h-20 mx-auto bg-gradient-to-br from-orange-100 to-amber-100 rounded-full flex items-center justify-center'>
                  <Users className='size-10 text-orange-600' />
                </div>
                <h3 className='font-bold text-xl text-gray-800'>No recommendations available</h3>
                <p className='text-gray-600 max-w-md mx-auto'>
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
                    className='bg-white shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-orange-100 rounded-2xl animate-fade-in-up group overflow-hidden'
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <div className='p-6 space-y-5'>
                      <div className='flex items-center gap-4'>
                        <div className='relative'>
                          <div className='avatar'>
                            <div className='w-16 h-16 rounded-full ring-2 ring-orange-400 ring-offset-2 ring-offset-white'>
                              <img
                                src={user.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || 'User')}&background=f97316`}
                                alt={user.fullName || "User"}
                                onError={(e) => {
                                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || 'User')}&background=f97316`;
                                }}
                              />
                            </div>
                          </div>
                          <div className='absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white shadow-sm'></div>
                        </div>
                        <div className='flex-1 min-w-0'>
                          <h3 className='font-bold text-lg text-gray-800 truncate group-hover:text-orange-600 transition-colors duration-300'>
                            {user.fullName}
                          </h3>
                          {user.location && (
                            <div className='flex items-center text-sm text-gray-600 mt-1'>
                              <MapPinIcon className='size-4 mr-1 text-orange-500' />
                              <span className='truncate'>{user.location}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {user.bio && (
                        <div className='bg-orange-50 rounded-lg p-3 border border-orange-100'>
                          <p className='text-sm text-gray-700 line-clamp-3'>
                            {user.bio}
                          </p>
                        </div>
                      )}

                      <button
                        className={`btn w-full transition-all duration-300 border-none ${
                          isRequestSent
                            ? "bg-green-500 hover:bg-green-600 text-white opacity-75 cursor-not-allowed"
                            : isPending
                            ? "bg-orange-500 text-white loading"
                            : "bg-orange-500 hover:bg-orange-600 text-white hover:scale-105"
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
                            <CheckCircleIcon className="size-4 mr-2" />
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