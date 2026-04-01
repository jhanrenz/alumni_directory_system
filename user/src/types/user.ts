export interface User{
    id: number;
    name: string;
    email: string;
    course_id: number;
    year: string;
    verify: string;
    role: 'user' | 'admin';
    image: string | null,
    course?: Course
}

export interface Course{
    id: number;
    name: string
}

export interface Login{
    email: string;
    password: string;
}

export interface Register{
    name: string;
    password: string;
    email: string;
    course_id: number;
    year: string;
    image: File | null
}

export interface AuthResponse{
    token? : string;
    user? : User;
    message?: string
}

export interface PaginationMeta{
    current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}