import { api } from "../../config/connection";

import type { User } from "../../types/user";

export const fetchAlumni = async (search? : string, course?: number, year?: number) : Promise<User[]> => {
    const res = await api.get<{users : User[]}>('/alumni/users',{
        params : {
            search: search || undefined,
            course: course || undefined,
            year: year || undefined
        }
    });
    return res.data.users ?? [];
}


export const exportAlumniPDF = async (search?: string, course?: number, year?: number) : Promise<Blob> => {
    const res = await api.get('/alumni/users/export-pdf',{
        params: {
            search : search || undefined,
            course : course || undefined,
            year : year || undefined
        },
        responseType: 'blob'
    });
    return res.data;
}