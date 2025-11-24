import type { Meta, Photo } from "@/types/general";

export interface CompaniesCombine {
    data: CompanyItem[]
    meta: Meta
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