'use server'
import React from 'react'
import {getSkills} from "@/services/skill";
import SkillsCartWrapper from "@/components/shared/skills-cart-wrapper";

const SkillsCartWrapperServer = async () => {
    const skills = await getSkills()
    return <SkillsCartWrapper skills={skills} />
}

export default SkillsCartWrapperServer

