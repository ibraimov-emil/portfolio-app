'use client'
import React from 'react'
import {SkillsCombine} from "@/types/skill";
import SkillsCart from "@/components/shared/skills-cart";

interface SkillsCartWrapperProps {
    skills: SkillsCombine
}

const SkillsCartWrapper: React.FC<SkillsCartWrapperProps> = ({skills}) => {
    return <SkillsCart items={skills} />
}

export default SkillsCartWrapper
