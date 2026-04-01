import { useMutation } from "@tanstack/react-query";
import * as adminApi from '../../api/auth/adminApi';
import type { AdminLogin } from "../../types/admin";

export const useLoginAdmin = () => {
    return useMutation({
        mutationFn: (data : AdminLogin) => adminApi.loginAdmin(data),
    });
};

export const useLogoutAdmin = () => {
    return useMutation({
        mutationFn: () => adminApi.logoutAdmin(),
        onSuccess: () => {
            localStorage.removeItem('token');
        }
    })
}