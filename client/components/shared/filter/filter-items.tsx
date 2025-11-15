'use server'
import React from 'react'
import {getSkills} from "@/services/skill";
import CheckboxFilterGroup from "@/components/shared/filter/checkbox-filter-group";
import ErrorHandler from "@/components/shared/ErrorHandler";


const FilterItems = async () => {
    let skills
    try {
        skills = await getSkills()
    } catch (error) {
        return <ErrorHandler error={error?.toString()}/>
    }

    return (
        <>
            {/*{skills?.data?.map(item => item.attributes.name)}*/}
            <CheckboxFilterGroup items={skills}/>
        </>
    )
}
export default FilterItems
