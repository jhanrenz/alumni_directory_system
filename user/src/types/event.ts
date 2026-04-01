export interface Event{
    id: number;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    created_at?: string,
    status?: string
}


export interface User{
    id: number;
    name: string;
    email: string
}