export interface Admin{
    id: number;
    name: string;
    email: string;
    role: 'admin';
}

export interface AdminLogin{
    email: string;
    password: string
}

export interface AdminAuthResponse{
    token? : string;
    user? : Admin;
    message? : string
}