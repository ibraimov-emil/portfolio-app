import {Meta} from "@/types/general";

export interface PracticesCombine {
    data: PracticeItem[]
    meta: Meta
}

export interface PracticeItem {
    id: number
    attributes: {
        title: string
        description: string
        componentName?: string
        link?: string
        componentLink?: string
        skills?: {
            data: Array<{
                id: number
                attributes: {
                    name: string
                    experience: string
                    type: string
                }
            }>
        }
        Preview?: {
            data: Array<{
                id: number
                attributes: {
                    url: string
                    name: string
                    mime: string
                }
            }>
        }
        createdAt: string
        updatedAt: string
        publishedAt: string
    }
}


