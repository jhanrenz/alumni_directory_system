import { api } from "../../config/connection";
import type { Login, Register, AuthResponse, User } from "../../types/user";

const token_key = 'token';

export const setToken = (token : string) => {
    localStorage.setItem(token_key, token)
}

export const getToken = () : string | null => {
    return localStorage.getItem(token_key)
}

export const removeToken = () => {
    localStorage.removeItem(token_key)
}

export const registerUser = async (data : Register) : Promise<AuthResponse> => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value])=>{
        if(value !== null) formData.append(key, value as string | Blob);
    });
    const res = await api.post<AuthResponse>('/register', formData, {
        headers: {
            'Content-Type' : 'multipart/form-data'
        }
    });
    if(res.data.token){
        setToken(res.data.token);
    }
    return res.data;
}

export const loginUser = async (data : Login) : Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/login',data);
    if(res.data.token)
    {
        setToken(res.data.token);
    }
    return res.data;
}


export const fetchCurrentUser = async () : Promise<User> => {
    const res = await api.get<{user : User}>('/user');
    return res.data.user;
}

export const logoutUser = async () : Promise<User> => {
    const res = await api.post('/logout');
    removeToken();
    return res.data;
}