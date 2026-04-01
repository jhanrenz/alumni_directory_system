import { api } from "../../config/connection";
import type { Course } from "../../types/user";

export const fetchCourses = async () : Promise<Course[]> => {
    const res = await api.get<{courses : Course[]}>('/courses/public');
    return res.data.courses ?? [];
}
//pang fetch ng lahat ng course
// export const AdminFetchCourses = async () : Promise<Course[]> => {
//     const res = await api.get<{courses : Course[]}>('/courses');
//     return res.data.courses ?? [];
// }

//pang fetch sa search sa course
export const adminFetchCourses = async (search? : string) : Promise<Course[]>=>{
     const res = await api.get<{courses : Course[]}>('/courses',{
         params: {
             search: search || undefined
         }
     });
     return res.data.courses ?? [];
 }

export const fetchTrashedCourse = async () : Promise<Course[]> => {
    const res = await api.get<{courses : Course[]}>('/courses?filter=trashed')
    return res.data.courses ?? [];
}

export const createCourse = async ( data : Course ) : Promise<Course>=>{
    const res = await api.post('/courses', data)
    return res.data.course
}

export const updateCourse = async ( id : number, data : Course) : Promise<Course>=>{
    const res = await api.patch(`/courses/${id}`, data)
    return res.data.course
}

export const deleteCourse = async ( id : number ) : Promise<void> => {
    await api.delete(`/courses/${id}`)
}

export const restoreCourse = async (id : number ) : Promise<void> => {
    await api.patch(`/courses/${id}/restore`)
}

export const forceDeleteCourse = async (id : number) : Promise<void> => {
    await api.delete(`/courses/${id}/force`)
}