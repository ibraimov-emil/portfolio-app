import type { Meta, Photo } from "@/types/general";

export interface CompaniesCombine {
    data: CompanyItem[]
    meta: Meta
}

export interface CompanyLocalizations {
    data: Array<{
        id: number;
        attributes: {
            name: string;
            description: string;
            shortDescription: string;
            locale: string;
        };
    }>;
}

export interface CompanyItem {
    id: number
    attributes: {
        name: string;
        createdAt: string;
        updatedAt: string;
        publishedAt: string;
        published?: any;
        description: string;
        shortDescription: string;
        photo: Photo;
        locale?: string;
        localizations?: CompanyLocalizations;
    }
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