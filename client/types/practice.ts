import type { Meta, Photo } from "@/types/general";
import type { SkillItem } from "@/types/skill";

// Strapi v5 flat structure
export interface PracticesCombine {
    data: PracticeItem[];
    meta: Meta;
}

export interface PracticeItem {
    documentId: string;
    id: number;
    title: string;
    description: string;
    componentName?: string;
    link?: string;
    componentLink?: string;
    skills?: SkillItem[];
    Preview?: Photo[];
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    locale: string;
}