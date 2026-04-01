import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { User } from "../types/user";
import * as userApi from "../api/admin/userVerificationApi";


export const useFetchUsers = (
  status: 'pending' | 'approved' | 'rejected' | 'all' = 'all',
  page: number = 1,
  search: string = "",
  course = "",
) =>
  useQuery({
    queryKey: ["users", status, page, search, course],
    queryFn: () => userApi.fetchUsersByStatus(status, page, search, course),
    staleTime: 5 * 60 * 1000,
  });
  

export const useFetchTrashedUsers = () =>
  useQuery<User[]>({
    queryKey: ["users", "trashed"],
    queryFn: userApi.fetchTrashedUsers,
    staleTime: 5 * 60 * 1000,
  });

const verifyUserFn = ({ id, verify }: { id: number; verify: 'pending' | 'approved' | 'rejected' }) =>
  userApi.verifyUser(id, verify);

export const useVerifyUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: verifyUserFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["users", "trashed"] });
    },
  });
};

const deleteUserFn = (id: number) => userApi.deleteUser(id);

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUserFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["users", "trashed"] });
    },
  });
};

const restoreUserFn = (id: number) => userApi.restoreUser(id);

export const useRestoreUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: restoreUserFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["users", "trashed"] });
    },
  });
};

// ==============================
// 5️⃣ Force Delete User
// ==============================
const forceDeleteUserFn = (id: number) => userApi.forceDeleteUser(id);

export const useForceDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: forceDeleteUserFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["users", "trashed"] });
    },
  });
};