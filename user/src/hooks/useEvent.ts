import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Event } from "../types/event";
import * as eventApi from '../api/admin/eventApi';

export const useFetchEvents = (search? : string, status? : string) => {
    return useQuery<Event[]>({
        queryKey: ['events', search, status],
        queryFn: () => eventApi.fetchEvents(search, status),
        staleTime: 5 * 60 * 1000
    })
}

export const useAdminFetchEvents = (search? : string, status? : string) => {
    return useQuery<Event[]>({
        queryKey: ['events', search, status],
        queryFn: () => eventApi.adminFetchEvents(search, status),
        staleTime: 5 * 60 * 1000
    })
}

export const useFetchTrashedEvents = (search? : string, status? : string) => {
    return useQuery<Event[]>({
        queryKey: ['events', search, status],
        queryFn: () => eventApi.fetchTrashedEvents(search, status),
        staleTime: 5 * 60 * 1000
    })
}

export const useCreateEvent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data : Event) => eventApi.createEvent(data),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['events']})
        }
    })
}

export const useUpdateEvent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data} : {id : number; data : Event}) =>
         eventApi.updateEvent(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['events']})
        }
    })
}

export const useDeleteEvent = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (id : number) => eventApi.deleteEvent(id),
        onSuccess: ()=> {
            queryClient.invalidateQueries({queryKey: ['events']})
            queryClient.invalidateQueries({queryKey: ['events', 'trashed']})
        }
    })
}

export const useRestoreEvent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id : number) => eventApi.restoreEvent(id),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['events']})
            queryClient.invalidateQueries({queryKey: ['events', 'trashed']})
        }
    })
}

export const useForceDeleteEvent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id : number ) => eventApi.forceDeleteEvent(id),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['events']})
            queryClient.invalidateQueries({queryKey: ['events', 'trashed']})
        }
    })
}