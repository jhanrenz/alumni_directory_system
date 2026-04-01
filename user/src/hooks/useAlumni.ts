import { useQuery } from "@tanstack/react-query";
import * as alumniApi from '../api/admin/alumniApi';
import type { User } from "../types/user";

export const useFetchAlumni = ( search? : string, course? : number, year? : number) => {
    return useQuery<User[]>({
        queryKey: ['alumni', search, course, year],
        queryFn: () => alumniApi.fetchAlumni(search, course, year),
        staleTime: 5 * 60 * 1000
    });
};


export const useExportAlumniPDF = ( search? : string, course? : number, year? : number)=>{
    return useQuery<Blob>({
        queryKey: ['alumni-pdf', search, course, year],
        queryFn: () => alumniApi.exportAlumniPDF(search, course, year),
        enabled: false
    });
}