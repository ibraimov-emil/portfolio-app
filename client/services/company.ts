import { axiosInstance } from "@/services/axios";
import type { CompaniesCombine, CompanyCreatePayload, CompanyItem } from "@/types/company";

export const getCompanies = async (params: any): Promise<CompaniesCombine> => {
    const { data } = await axiosInstance.get('/companies', { 
        params: {
            ...params,
            populate: {
                photo: true,
                localizations: {
                    fields: ['name', 'description', 'shortDescription', 'locale']
                }
            }
        }
    });
    console.log(data)

    return data;
}

export const getCompanyById = async (id: string): Promise<{ data: CompanyItem }> => {
    const { data } = await axiosInstance.get(`/companies/${id}`, {
        params: {
            populate: ['photo', 'localizations']
        }
    });
    console.log('getCompanyById', data)

    return data;
}

export const createCompany = async (payload: CompanyCreatePayload): Promise<{ data: CompanyItem }> => {
    const { data } = await axiosInstance.post('/companies', payload);
    return data;
}

export const updateCompany = async (
    id: string,
    payload: CompanyCreatePayload
): Promise<{ data: CompanyItem }> => {
    const { data } = await axiosInstance.put(`/companies/${id}`, payload);
    return data;
}

export const deleteCompany = async (id: string): Promise<void> => {
    await axiosInstance.delete(`/companies/${id}`);
}

export const uploadCompanyPhoto = async (companyId: string, file: File): Promise<void> => {
    const payload = new FormData();

    payload.append('data', JSON.stringify({}));
    payload.append('files.photo', file, file.name);

    await axiosInstance.put(`/companies/${companyId}`, payload);
};
