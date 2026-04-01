import { useState, useEffect } from "react";
import { getToken, fetchCurrentUser, removeToken } from "../../api/auth/userApi";
import type { User } from "../../types/user";

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const token = getToken();

    useEffect(()=>{
        const init = async () => {
            if(token){
                try{
                    const currentUser = await fetchCurrentUser();
                    setUser(currentUser);
                }catch(err){
                    console.error('failed to fetch current user: ', err);
                    removeToken();
                    setUser(null);
                }
            }
            setLoading(false);
        };
        init();
    },[token]);

    const logout = () => {
        removeToken();
        setUser(null);
    };

    const isAdmin = user?.role === 'admin';
    const isUser = user?.role === 'user';

    return{
        user, token, loading, logout, setUser, isAdmin, isUser
    }
}