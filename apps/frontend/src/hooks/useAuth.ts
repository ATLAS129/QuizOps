import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchCurrentUser, login } from "../api/auth";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: fetchCurrentUser,
    retry: false,
    staleTime: Infinity,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: login,
    onSuccess: (user) => {
      queryClient.setQueryData(["auth", "me"], user);
    },
  });
}

// export function useSignup() {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: login,
//     onSuccess: (user) => {
//       queryClient.setQueryData(["auth", "me"], user);
//     },
//   });
// }
