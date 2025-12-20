'use client'
import React from 'react'
import {Title} from "@/components/shared/title";
import {useFilters} from "@/hooks/use-filters";
import {getSkills} from "@/services/skill";
import {SkillsCombine} from "@/types/skill";

interface SelectedSkillsSummaryProps {
    skills: SkillsCombine
}

const SelectedSkillsSummary: React.FC<SelectedSkillsSummaryProps> = ({skills}) => {
    const filters = useFilters()

    const selectedSkills = skills.data.filter(skill =>
        filters.selectedSkills.has(skill.id.toString())
    )

    if (selectedSkills.length === 0) {
        return null
    }

    return (
        <section className="mt-16">
            <Title text="Selected Skills Summary" size="xl" className="mb-6 font-semibold"/>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {['advanced', 'medium', 'start'].map(type => {
                    const skillsByType = selectedSkills.filter(skill => skill.type === type)
                    if (skillsByType.length === 0) return null

                    return (
                        <div key={type} className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6">
                            <h3 className="text-lg font-semibold mb-4 capitalize">{type}</h3>
                            <ul className="space-y-2">
                                {skillsByType.map(skill => (
                                    <li key={skill.id} className="flex items-center justify-between">
                                        <span>{skill.name}</span>
                                        <span className="text-sm text-gray-500">
                                            {skill.experience}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}

export default SelectedSkillsSummary

