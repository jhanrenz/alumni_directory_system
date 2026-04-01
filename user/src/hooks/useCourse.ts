import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Course } from "../types/course";
import * as courseApi from '../api/admin/courseApi';

export const useFetchCourses = () =>  {
    return useQuery<Course[]>({
        queryKey: ['courses'],
        queryFn: () => courseApi.fetchCourses(),
        staleTime: 5 * 60 * 1000,
    })
}

export const useAdminFetchCourses = (search? :string)=>{
    return useQuery<Course[]>({
        queryKey: ['courses', search],
        queryFn: () => courseApi.adminFetchCourses(search),
        staleTime: 5 * 60 * 1000
    });
}



export const useFetchTrashedCourses = () => {
    return useQuery<Course[]>({
        queryKey: ['courses'],
        queryFn: courseApi.fetchTrashedCourse,
        staleTime: 5 * 60 * 1000
    })
}

export const useCreateCourse = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ( data : Course) => courseApi.createCourse(data),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['courses']})
        }
    })
}

export const useUpdateCourse = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({id, data} : { id : number; data : Course})=>
            courseApi.updateCourse(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['courses']})
            queryClient.invalidateQueries({queryKey: ['courses', 'trashed']})
        }
    })
}

export const useDeleteCourse = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id : number) => courseApi.deleteCourse(id),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['courses']})
            queryClient.invalidateQueries({queryKey: ['courses', 'trashed']})
        }
    })
}

export const useRestoreCourse = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id : number) => courseApi.restoreCourse(id),
        onSuccess: ()=> {
            queryClient.invalidateQueries({queryKey: ['courses']})
            queryClient.invalidateQueries({queryKey: ['courses', 'trashed']})
        }
    })
}

export const useForceDeleteCourse = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id : number) => courseApi.forceDeleteCourse(id),
        onSuccess: ()=> {
            queryClient.invalidateQueries({queryKey: ['courses']})
            queryClient.invalidateQueries({queryKey: ['courses', 'trashed']})
        }
    })
}

