'use client'
import React from 'react'
import PracticeItems from "@/components/shared/practice-items";
import {getPractice} from "@/services/practice";
import {PracticesCombine} from "@/types/practice";
import {useFilters} from "@/hooks/use-filters";

interface PracticeItemsWrapperClientProps {
    practice: PracticesCombine
}

const PracticeItemsWrapperClient: React.FC<PracticeItemsWrapperClientProps> = ({practice}) => {
    const filters = useFilters()

    // Filter practices based on context, not searchParams
    const skillIdsArray = Array.from(filters.selectedSkills).map(String).filter(Boolean)

    const filteredPractice = React.useMemo(() => {
        if (skillIdsArray.length === 0) {
            return practice
        }

        // Filter on client side for instant updates
        const filtered = practice.data.filter(item => {
            const practiceSkillIds = item.skills?.map(skill => skill.id.toString()) || []
            return skillIdsArray.some(selectedId => practiceSkillIds.includes(selectedId))
        })

        return { ...practice, data: filtered }
    }, [practice, skillIdsArray])

    return <PracticeItems practice={filteredPractice} />
}

export default PracticeItemsWrapperClient

