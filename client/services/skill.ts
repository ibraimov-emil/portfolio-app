import {axiosInstance} from "@/services/axios";
import {SkillItem, SkillsCombine} from "@/types/skill";

export const getSkills = async (): Promise<SkillsCombine> => {
    const {data} = await axiosInstance.get('/skills?populate=*');
    return data
}

export async function getMock(): Promise<any> {
    const data = await fetch('https://jsonplaceholder.typicode.com/users')
        .then(response => response.json())
    return data;
}
