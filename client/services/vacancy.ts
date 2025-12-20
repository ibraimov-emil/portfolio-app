import { axiosInstance } from "@/services/axios";
import type { VacanciesCombine, VacancyItem, VacancyCreatePayload, VacancyUpdatePayload } from "@/types/vacancy";

export const getVacancies = async (params?: any): Promise<VacanciesCombine> => {
    const { data } = await axiosInstance.get('/vacancies', { 
        params: {
            ...params,
            populate: {
                photo: true,
                company: {
                    fields: ['name', 'shortDescription'],
                    populate: { photo: true }
                }
            }
        }
    });
    return data;
}

export const getVacancyById = async (id: string): Promise<{ data: VacancyItem }> => {
    const { data } = await axiosInstance.get(`/vacancies/${id}`, {
        params: {
            populate: {
                photo: true,
                company: {
                    populate: { photo: true }
                }
            }
        }
    });
    return data;
}

export const createVacancy = async (payload: VacancyCreatePayload): Promise<{ data: VacancyItem }> => {
    const { data } = await axiosInstance.post('/vacancies', payload);
    return data;
}

export const updateVacancy = async (
    id: string,
    payload: VacancyUpdatePayload
): Promise<{ data: VacancyItem }> => {
    const { data } = await axiosInstance.put(`/vacancies/${id}`, payload);
    return data;
}

export const deleteVacancy = async (id: string): Promise<void> => {
    await axiosInstance.delete(`/vacancies/${id}`);
}

export const uploadVacancyPhoto = async (vacancyId: string, file: File): Promise<void> => {
    const payload = new FormData();
    payload.append('data', JSON.stringify({}));
    payload.append('files.photo', file, file.name);

    await axiosInstance.put(`/vacancies/${vacancyId}`, payload);
};