import { axiosInstance } from "@/services/axios";
import type { CompaniesCombine, CompanyCreatePayload, CompanyItem } from "@/types/company";

export const getCompanies = async (params: any): Promise<CompaniesCombine> => {
    const { data } = await axiosInstance.get('/companies', { params });
    return data;
}

export const getCompanyById = async (id: string): Promise<{ data: CompanyItem }> => {
    const { data } = await axiosInstance.get(`/companies/${id}`, {
        params: {
            populate: 'photo'
        }
    });
    return data;
}

export const createCompany = async (payload: CompanyCreatePayload): Promise<{ data: CompanyItem }> => {
    const { data } = await axiosInstance.post('/companies', payload);
    return data;
}

export const updateCompany = async (
    id: number,
    payload: CompanyCreatePayload
): Promise<{ data: CompanyItem }> => {
    const { data } = await axiosInstance.put(`/companies/${id}`, payload);
    return data;
}

export const deleteCompany = async (id: number): Promise<void> => {
    await axiosInstance.delete(`/companies/${id}`);
}

export const uploadCompanyPhoto = async (companyId: number, file: File): Promise<void> => {
    const payload = new FormData();

    // 1. Обязательно передаём data (даже если пустой объект)
    payload.append('data', JSON.stringify({}));
    // если нужно обновить другие поля компании — пиши сюда:
    // payload.append('data', JSON.stringify({ name: "Новое название", description: "..." }));

    // 2. Файл передаём строго под ключом files.photo
    payload.append('files.photo', file, file.name);
    //                         ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
    //                    вот так — с префиксом "files."

    await axiosInstance.put(`/companies/${companyId}`, payload);
};
