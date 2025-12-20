import type { Meta } from "@/types/general";

// Strapi v5 flat structure
export interface SkillsCombine {
    data: SkillItem[];
    meta: Meta;
}

export interface SkillItem {
    documentId: string;
    id: number;
    name: string;
    experience: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    locale: string;
}