import {axiosInstance} from "@/services/axios";
import {PracticesCombine} from "@/types/practice";

export const getPractice = async (skillIds?: string[]): Promise<PracticesCombine> => {
    const params: any = {
        populate: {
            skills: true,
            Preview: true
        }
    };

    if (skillIds && skillIds.length > 0) {
        params.filters = {
            skills: {
                id: {
                    $in: skillIds
                }
            }
        };
    }

    const {data} = await axiosInstance.get('/practices', { params });

    return data;
}
