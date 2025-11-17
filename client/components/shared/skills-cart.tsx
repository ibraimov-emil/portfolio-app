'use client'
import React from 'react'
import {SkillsCombine} from "@/types/skill";
import {useFilters} from "@/hooks/use-filters";
import {Title} from "@/components/shared/title";
import {cn} from "@/lib/utils";
import {X} from "lucide-react";
import {Button} from "@/components/ui/button";

interface Props {
    items?: SkillsCombine
    className?: string
}

const SkillsCart: React.FC<Props> = ({items, className}) => {
    const filters = useFilters()
    
    const selectedSkills = items?.data.filter(skill => 
        filters.selectedSkills.has(skill.id.toString())
    ) || []

    if (selectedSkills.length === 0) {
        return null
    }

    return (
        <div className={cn('w-full bg-gray-100 rounded-xl p-3 dark:prose-invert dark:bg-opacity-0 dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]', className)}>
            <div className={'flex items-center justify-between mb-4'}>
                <Title text={'Selected Skills'} size={'lg'} className={'font-semibold'}/>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                        e.preventDefault();
                        filters.clearSkills();
                    }}
                    className="text-xs"
                    disabled={selectedSkills.length === 0}
                >
                    Clear all
                </Button>
            </div>
            <div className="flex flex-wrap gap-2">
                {selectedSkills.map(skill => (
                    <div
                        key={skill.id}
                        className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                    >
                        <span className="text-sm font-medium">{skill.attributes.name}</span>
                        <button
                            onClick={() => filters.setSelectedSkills(skill.id.toString())}
                            className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full p-0.5 transition-colors"
                            aria-label={`Remove ${skill.attributes.name}`}
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SkillsCart


