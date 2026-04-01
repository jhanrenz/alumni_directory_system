import { api } from "../../config/connection";
import { setToken } from "./userApi";
import type { AdminLogin, AdminAuthResponse } from "../../types/admin";

export const loginAdmin = async(data : AdminLogin) : Promise<AdminAuthResponse>=>{
    const res = await api.post<AdminAuthResponse>('/admin/login',data);
    if(res.data.token){
        setToken(res.data.token);
    }
    return res.data;
}

export const logoutAdmin = async () : Promise<{message : string}>=>{
    const res = await api.post('/admin/logout');
    return res.data;
}