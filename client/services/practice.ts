import {axiosInstance} from "@/services/axios";
import {PracticesCombine} from "@/types/practice";

export const getPractice = async (skillIds?: string[]): Promise<PracticesCombine> => {
    let url = '/practices?populate[skills]=*&populate[Preview]=*'
    
    if (skillIds && skillIds.length > 0) {
        // Strapi v4 filter syntax: for $in operator with array, need to add each ID separately
        // Format: filters[skills][id][$in][0]=11&filters[skills][id][$in][1]=9&filters[skills][id][$in][2]=7
        skillIds.forEach((id, index) => {
            url += `&filters[skills][id][$in][${index}]=${id}`
        })
    }
    
    const {data} = await axiosInstance.get(url);
    return data
}
