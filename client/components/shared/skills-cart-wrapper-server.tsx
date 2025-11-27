'use server'
import React from 'react'
import {getSkills} from "@/services/skill";
import SkillsCartWrapper from "@/components/shared/skills-cart-wrapper";
import ErrorHandler from "@/components/shared/ErrorHandler";

const SkillsCartWrapperServer = async () => {
    let skills
    try {
        skills = await getSkills()
    } catch (error) {
        return <ErrorHandler error={error?.toString()}/>
    }
    return <SkillsCartWrapper skills={skills} />
}

export default SkillsCartWrapperServer

