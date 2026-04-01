import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_APP_URL;

export const api = axios.create({
    baseURL: BASE_URL,
    headers : {
        'Accept' : 'application/json',
        'Content-Type' : 'application/json'
    },
});

api.interceptors.request.use((config)=>{
    const token = localStorage.getItem('token');
    if(token)
    {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})