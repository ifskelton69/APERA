import { useQuery } from "@tanstack/react-query";
import { getAuthUser } from "../lib/api";

const useAuthUser = () => {
  const query = useQuery({
    queryKey: ["authUser"],
    queryFn: getAuthUser,
    retry: false, // auth check
    staleTime: 0, // Always refetch when invalidated
    refetchOnWindowFocus: false, // Prevent unnecessary refetches
  });
  return { 
    isLoading: query.isLoading || false, 
    authUser: query.data?.user || null,
    error: query.error || null,
    refetch: query.refetch
  };
};

export default useAuthUser;