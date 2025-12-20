import type { Meta, Photo } from "@/types/general";

export interface CompaniesCombine {
    data: CompanyItem[]
    meta: Meta
}

// Strapi v5 flat structure for localizations
export interface CompanyLocalization {
    documentId: string;
    id: number;
    name: string;
    description: string;
    shortDescription: string;
    locale: string;
}

export interface CompanyItem {
    documentId: string;
    id: number;
    name: string;
    published: boolean;
    description: string;
    shortDescription: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    locale: string;
    photo?: Photo[];
    localizations?: CompanyLocalization[];
    vacancies?: string[];
}

// Form data types
export interface CompanyFormData {
    name: string;
    shortDescription: string;
    description: string;
    photo?: File | null;
}

export interface CompanyCreatePayload {
    data: {
        name: string;
        shortDescription: string;
        description: string;
    }
}
