import {Meta} from "@/types/general";

export interface SkillsCombine {
    data: SkillItem[]
    meta: Meta
}

export interface SkillItem {
    id: number
    attributes: {
        name: string
        experience: string
        type: string
        createdAt: string
        updatedAt: string
        publishedAt: string
        locale: string
    }
}
