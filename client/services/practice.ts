import {axiosInstance} from "@/services/axios";
import {SkillsCombine} from "@/types/skill";

export const getPractice = async (): Promise<SkillsCombine> => {
    const {data} = await axiosInstance.get('/practices?populate=*');
    return data
}
