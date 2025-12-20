import type { Photo, Meta } from "@/types/general";
import type { CompanyItem } from "@/types/company";

// Strapi v5 response structure
export interface VacanciesCombine {
    data: VacancyItem[];
    meta: Meta;
}

export interface VacancyItem {
    documentId: string;
    id: number;
    title: string;
    description: string;
    salaryMin: number;
    salaryMax: number;
    location: string;
    workFormat: string;
    employmentType: string;
    experienceLevel: string;
    isActive: boolean;
    hot: boolean;
    contacts: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    locale: string;
    company?: CompanyItem;
    photo?: Photo;
}

// Form data types
export interface VacancyFormData {
    title: string;
    description: string;
    salaryMin: number;
    salaryMax: number;
    location: string;
    workFormat: string;
    employmentType: string;
    experienceLevel: string;
    isActive: boolean;
    hot: boolean;
    contacts: string;
    company?: string; // documentId of company
    photo?: File | null;
}

// API payload types
export interface VacancyCreatePayload {
    data: {
        title: string;
        description: string;
        salaryMin: number;
        salaryMax: number;
        location: string;
        workFormat: string;
        employmentType: string;
        experienceLevel: string;
        isActive?: boolean;
        hot?: boolean;
        contacts: string;
        company?: string; // documentId
    };
}

export interface VacancyUpdatePayload {
    data: Partial<{
        title: string;
        description: string;
        salaryMin: number;
        salaryMax: number;
        location: string;
        workFormat: string;
        employmentType: string;
        experienceLevel: string;
        isActive: boolean;
        hot: boolean;
        contacts: string;
        company: string; // documentId
    }>;
}