import { api } from "../../config/connection";
import type { Event } from "../../types/event";

export const fetchEvents = async (search? : string, status? : string) : Promise<Event[]> => {
    const res = await api.get<{events : Event[]}>('/events/public',{
        params : {
            search : search || undefined,
            status : status || undefined
        }
    });
    return res.data.events ?? []
}

export const adminFetchEvents = async (search? : string, status? : string) : Promise<Event[]>=>{
    const res = await api.get<{events : Event[]}>('/events',{
        params: {
            search : search || undefined,
            status : status || undefined
        }
    });
    return res.data.events ?? []
}

export const fetchTrashedEvents = async ( search? : string, status? : string ) : Promise<Event[]>=>{
    const res = await api.get<{events : Event[]}>('/events?filter=trashed',{
        params : {
            search : search || undefined,
            status : status || undefined
        }
    });
    return res.data.events ?? []
}

export const createEvent = async (data : Event) : Promise<Event> =>{
    const res = await api.post('/events', data)
    return res.data.event
}

export const updateEvent = async (id : number, data : Event) : Promise<Event[]>=>{
    const res = await api.patch(`/events/${id}`, data)
    return res.data.event 
}

export const deleteEvent = async (id : number) : Promise<void> => {
    await api.delete(`/events/${id}`)
} 

export const restoreEvent = async (id : number ) : Promise<void> => {
    await api.patch(`/events/${id}/restore`)
}

export const forceDeleteEvent = async (id : number) : Promise<void> => {
    await api.delete(`/events/${id}/force`)
}