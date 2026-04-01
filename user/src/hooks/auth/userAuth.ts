import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import type { User, Login, Register } from "../../types/user";
import * as userApi from "../../api/auth/userApi";

export const useRegisterUser = () => {
    return useMutation({
        mutationFn: (data: Register) => userApi.registerUser(data),
    });
};

export const useLoginUser = () => {
    return useMutation({
        mutationFn: (data : Login) => userApi.loginUser(data)
    });
};

export const useCurrentUser = () => {
    return useQuery<User>({
        queryKey: ['currentUser'],
        queryFn: () => userApi.fetchCurrentUser(),
        staleTime: 5 * 1000 * 60,
        retry: false
    });
};

export const useLogoutUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => userApi.logoutUser(),
        onSuccess: () => {
            queryClient.removeQueries({queryKey: ['currentUser']});
        }
    })
}